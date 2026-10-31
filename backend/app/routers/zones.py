from fastapi import APIRouter
from app.utils.data_loader import load_csv

router = APIRouter(
    prefix="/zones",
    tags=["Zones"]
)

@router.get("/")
def get_zone_visits():
    data = load_csv("zone_visits.csv")
    return {
        "count": len(data),
        "data": data
    }
