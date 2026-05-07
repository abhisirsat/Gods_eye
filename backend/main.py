import sys
from pathlib import Path

# Add project root to path for backend package resolution
sys.path.append(str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import flights, ships, satellites, news, jamming, history, surveillance, ew_enhanced, infrastructure, cyber_attacks, airspace, satellites_advanced
from backend.database.db import init_db
import asyncio

app = FastAPI(title="God's Eye Intelligence System API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all data routers
app.include_router(flights.router, prefix="/api/flights", tags=["flights"])
app.include_router(ships.router, prefix="/api/ships", tags=["ships"])
app.include_router(satellites.router, prefix="/api/satellites", tags=["satellites"])
app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(jamming.router, prefix="/api/jamming", tags=["jamming"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(surveillance.router, prefix="/api/surveillance", tags=["surveillance"])
app.include_router(ew_enhanced.router, prefix="/api/ew", tags=["ew"])
app.include_router(infrastructure.router, prefix="/api/infra", tags=["infrastructure"])
app.include_router(cyber_attacks.router, prefix="/api/cyber", tags=["cyber"])
app.include_router(airspace.router, prefix="/api/airspace", tags=["airspace"])
app.include_router(satellites_advanced.router, prefix="/api/satellites/advanced", tags=["satellites_advanced"])

@app.on_event("startup")
async def startup_event():
    # Initialize database
    await init_db()
    print("Database Initialized")

@app.get("/")
async def root():
    return {
        "status": "OPERATIONAL",
        "system": "GODS_EYE_CORE_v1.0.4",
        "message": "Intelligence system ready for input."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
