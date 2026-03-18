from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from app.engine.graph_builder import GraphBuilder
from app.engine.diagnostic_logic import DiagnosticLogic
from app.tasks.diagnostics import analyze_board_file
from celery.result import AsyncResult
from app.celery_config import celery_app
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import BoardSchema

router = APIRouter()

active_graph = GraphBuilder()
diagnostic_engine = DiagnosticLogic(active_graph)

class DiagnosticRequest(BaseModel):
    symptom: str
    net: Optional[str] = "VIN"
    board_number: Optional[str] = None

class TaskRequest(BaseModel):
    filename: str

@router.post("/analyze")
async def analyze_symptom(request: DiagnosticRequest):
    try:
        result = diagnostic_engine.get_repair_solution(request.symptom, {"net": request.net})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze_async")
async def analyze_board_async(request: TaskRequest):
    task = analyze_board_file.delay(request.filename)
    return {"task_id": task.id, "status": "Task submitted"}

@router.get("/task/{task_id}")
async def get_task_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    response = {"task_id": task_id, "status": task_result.status}
    if task_result.state == 'PENDING':
        response['message'] = 'Task is waiting in queue...'
    elif task_result.state == 'PROGRESS':
        response['message'] = task_result.info.get('message', '') if task_result.info else ''
    elif task_result.state == 'SUCCESS':
        response['result'] = task_result.result
    elif task_result.state == 'FAILURE':
        response['error'] = str(task_result.info)
    return response

@router.get("/boardview/{board_number}")
async def get_boardview(board_number: str, db: Session = Depends(get_db)):
    board = db.query(BoardSchema).filter(BoardSchema.board_number == board_number).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found in DB")
    
    # Mock generating boardview components from a parsed .brd file
    comps = [
        {"id": "1", "name": f"CPU_{board_number}", "x": 0, "y": 0, "width": 100, "height": 100, "type": "IC", "net": "VCORE"},
        {"id": "2", "name": "PQ1", "x": -150, "y": 50, "width": 30, "height": 30, "type": "MOSFET", "net": "VIN"},
        {"id": "3", "name": "PR1", "x": -100, "y": -50, "width": 15, "height": 25, "type": "RESISTOR", "net": "VIN"},
        {"id": "4", "name": "PC1", "x": 150, "y": 0, "width": 20, "height": 30, "type": "CAPACITOR", "net": "GND"},
    ]
    return {"board": board_number, "components": comps, "trace_problem": "VIN to GND short suspected near PC1."}

@router.get("/status")
async def get_status():
    return {
        "status": "online",
        "nodes": active_graph.graph.number_of_nodes(),
        "edges": active_graph.graph.number_of_edges()
    }
