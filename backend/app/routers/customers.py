from fastapi import APIRouter
from app.utils.data_loader import load_csv

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/")
def get_customers():
    data = load_csv("customerjourneyreport.csv")
    return {
        "count": len(data),
        "data": data
    }
