from fastapi import APIRouter
import random

router = APIRouter()

@router.get("/")
async def get_jamming():
    # GPSJam.org data is typically visualized via maps. 
    # We simulate intense jamming zones in specific geopolitical areas.
    zones = [
        {"name": "UKRAINE_L_SHORE", "lat": 46.5, "lng": 32.7, "radius": 200, "intensity": 0.9},
        {"name": "SYRIA_LEBANON", "lat": 34.0, "lng": 36.0, "radius": 150, "intensity": 0.8},
        {"name": "BALTIC_SEA", "lat": 54.5, "lng": 19.5, "radius": 250, "intensity": 0.75},
        {"name": "SOUTH_CHINA_SEA", "lat": 12.0, "lng": 114.0, "radius": 300, "intensity": 0.65}
    ]
    
    # Add some randomness to intensity and size for real-time feel
    for zone in zones:
        zone["intensity"] *= random.uniform(0.9, 1.1)
        zone["radius"] *= random.uniform(0.95, 1.05)
        
    return zones
