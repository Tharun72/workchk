from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import customers
from app.routers import interactions
from app.routers import zones
from app.routers import tracks
from app.routers import frames

app = FastAPI(
    title="DecaLens API",
    description="Backend API for DecaLens Retail Analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(interactions.router)
app.include_router(zones.router)
app.include_router(tracks.router)
app.include_router(frames.router)
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "DecaLens backend is running"
    }
