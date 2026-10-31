from fastapi import APIRouter
from app.utils.data_loader import load_csv

router = APIRouter(
    prefix="/frames",
    tags=["Frames"]
)

@router.get("/")
def get_frames():
    data = load_csv("frame_metrics.csv")
    return {
        "count": len(data),
        "data": data
    }
