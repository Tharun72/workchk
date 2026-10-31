from fastapi import APIRouter
from app.utils.data_loader import load_csv

router = APIRouter(
    prefix="/interactions",
    tags=["Interactions"]
)

@router.get("/")
def get_interactions():
    data = load_csv("interactions.csv")
    return {
        "count": len(data),
        "data": data
    }
