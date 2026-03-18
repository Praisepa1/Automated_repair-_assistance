from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class BoardSchema(Base):
    __tablename__ = "board_schemas"

    id = Column(Integer, primary_key=True, index=True)
    board_number = Column(String, unique=True, index=True)
    model_name = Column(String, index=True)
    schematic_path = Column(String)
    boardview_path = Column(String)
