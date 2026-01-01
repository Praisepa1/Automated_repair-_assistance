from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict
from app.engine.graph_builder import GraphBuilder
from app.engine.diagnostic_logic import DiagnosticLogic

router = APIRouter()

# In-memory storage for demonstration (should be DB or persistent session)
active_graph = GraphBuilder()
diagnostic_engine = DiagnosticLogic(active_graph)

class DiagnosticRequest(BaseModel):
    symptom: str
    net: Optional[str] = "VIN"
    board_number: Optional[str] = None

@router.post("/analyze")
async def analyze_symptom(request: DiagnosticRequest):
    try:
        result = diagnostic_engine.get_repair_solution(request.symptom, {"net": request.net})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status():
    return {
        "status": "online",
        "nodes": active_graph.graph.number_of_nodes(),
        "edges": active_graph.graph.number_of_edges()
    }
