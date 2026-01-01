from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "msg": "Upload successful"}

@router.get("/search/{board_number}")
async def search_board(board_number: str):
    # Mock database search
    known_boards = {
        "820-00165": {"model": "MacBook Air A1466", "files": ["820-00165.pdf", "820-00165.brd"]},
        "NM-A311": {"model": "Lenovo G50-45", "files": ["NM-A311.pdf", "NM-A311.brd"]},
        "LA-9641P": {"model": "Dell Latitude E6440", "files": ["LA-9641P.pdf", "LA-9641P.brd"]}
    }
    
    if board_number in known_boards:
        return {
            "found": True,
            "data": known_boards[board_number]
        }
    return {"found": False, "msg": "Board number not found in local repository."}
