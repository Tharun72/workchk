from fastapi import APIRouter
from app.utils.data_loader import load_csv

router = APIRouter(
    prefix="/tracks",
    tags=["Tracks"]
)

@router.get("/")
def get_tracks():
    data = load_csv("tracks.csv")
    return {
        "count": len(data),
        "data": data
    }
