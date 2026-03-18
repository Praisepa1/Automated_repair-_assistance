from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
import time
import requests
from app.database import get_db
from app.models import BoardSchema

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class CloudStorageMock:
    @staticmethod
    def upload_to_cloud(filename: str, local_path: str):
        # Simulate network latency and cloud upload (e.g., AWS S3)
        time.sleep(1)
        return f"s3://antigravity-repair-bucket/{filename}"
        
    @staticmethod
    def sync_database():
        # Simulate syncing cloud
        time.sleep(2)
        return True

cloud_db = CloudStorageMock()

ALLOWED_EXTENSIONS = {".pdf", ".brd", ".cad", ".zip", ".rar"}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Must be one of {ALLOWED_EXTENSIONS}")
        
    local_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(local_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Cloud sync
    cloud_url = cloud_db.upload_to_cloud(file.filename, local_path)
    
    return {
        "filename": file.filename, 
        "msg": "File saved locally and synced to cloud",
        "local_path": local_path,
        "cloud_url": cloud_url
    }

@router.get("/download/{board_number}")
async def download_board_schema(board_number: str, db: Session = Depends(get_db)):
    board = db.query(BoardSchema).filter(BoardSchema.board_number == board_number).first()
    if board:
        return {"found": True, "msg": "Loaded from local database", "data": {"model": board.model_name, "files": [board.schematic_path, board.boardview_path]}}
    
    # Scrape web logic
    try:
        # We simulate scraping Badcaps/Vinafix using a mock Search engine
        # In a real scenario, this would use BeautifulSoup & rotating proxies to fetch PDF URLs
        print(f"Scraping web for {board_number}...")
        time.sleep(1.5) # Simulate scraping delay
        
        # Simulated successful find
        found_pdf = f"https://mock-schematics-repo.com/download/{board_number}.pdf"
        found_brd = f"https://mock-schematics-repo.com/download/{board_number}.brd"
        
        # Save placeholder files locally as scraped
        pdf_local = os.path.join(UPLOAD_DIR, f"{board_number}.pdf")
        brd_local = os.path.join(UPLOAD_DIR, f"{board_number}.brd")
        with open(pdf_local, "w") as f: f.write("MOCK PDF DATA")
        with open(brd_local, "w") as f: f.write("MOCK BRD DATA")
        
        # Save to DB
        new_board = BoardSchema(
            board_number=board_number,
            model_name=f"Unknown Model {board_number}",
            schematic_path=pdf_local,
            boardview_path=brd_local
        )
        db.add(new_board)
        db.commit()
        db.refresh(new_board)
        
        return {
            "found": True, 
            "msg": "Scraped from the web and synced to local DB", 
            "data": {
                "model": new_board.model_name, 
                "files": [pdf_local, brd_local]
            }
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Web scraping failed: {str(e)}")

@router.post("/sync")
async def sync_schematics():
    """Manage and synchronize schematic PDF database with the cloud."""
    success = cloud_db.sync_database()
    return {"msg": "Synchronized local schematics with cloud database successfully", "status": "success"}
