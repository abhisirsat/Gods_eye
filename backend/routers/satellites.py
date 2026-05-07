from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

N2YO_API_KEY = os.getenv("N2YO_API_KEY")
N2YO_BASE_URL = "https://api.n2yo.com/rest/v1/satellite"

# Global cache to prevent rate issues
satellite_cache = {
    "data": [],
    "last_fetch": 0
}

# Curated database of high-value reconnaissance and military satellites
MILITARY_SATELLITES = {
    25544: {"name": "ISS (ZARYA)", "type": "STATION", "country": "INTL", "color": "#00f2ff"},
    39232: {"name": "USA 245 (KH-11)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    37890: {"name": "USA 224 (KH-11)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    43941: {"name": "USA 290 (NROL-71)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    47240: {"name": "USA 311 (NROL-44)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    52259: {"name": "USA 327 (NROL-85)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    48244: {"name": "USA 314 (NROL-82)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    42689: {"name": "USA 276 (NROL-76)", "type": "RECON", "country": "USA", "color": "#00ff88"},
    44443: {"name": "COSMOS 2542", "type": "INSPECTOR", "country": "RUS", "color": "#ff004c"},
    44444: {"name": "COSMOS 2543", "type": "INSPECTOR", "country": "RUS", "color": "#ff004c"},
    48873: {"name": "COSMOS 2550", "type": "MISSILE_WARNING", "country": "RUS", "color": "#ff004c"},
    53347: {"name": "COSMOS 2558", "type": "INSPECTOR", "country": "RUS", "color": "#ff004c"},
    42721: {"name": "LOTOS S1", "type": "SIGINT", "country": "RUS", "color": "#ff004c"},
    43005: {"name": "YAOGAN 30", "type": "RECON", "country": "CHN", "color": "#ffaa00"},
    48624: {"name": "YAOGAN 34", "type": "RECON", "country": "CHN", "color": "#ffaa00"},
    49400: {"name": "YAOGAN 35", "type": "SIGINT", "country": "CHN", "color": "#ffaa00"},
    51046: {"name": "YAOGAN 35B", "type": "SIGINT", "country": "CHN", "color": "#ffaa00"},
    47302: {"name": "YAOGAN 33", "type": "RECON", "country": "CHN", "color": "#ffaa00"},
    43111: {"name": "CARTOSAT-2F", "type": "SURVEILLANCE", "country": "IND", "color": "#00ffa2"},
    42767: {"name": "CARTOSAT-2E", "type": "SURVEILLANCE", "country": "IND", "color": "#00ffa2"},
    48247: {"name": "MICROSAT-R", "type": "EXPERIMENTAL", "country": "IND", "color": "#ff00dd"},
    43845: {"name": "CSO-1", "type": "OPTICAL_RECON", "country": "FRA", "color": "#0066ff"},
    45846: {"name": "OFEK 16", "type": "RECON", "country": "ISR", "color": "#8800ff"},
    56150: {"name": "OFEK 13", "type": "RECON", "country": "ISR", "color": "#8800ff"},
    45224: {"name": "IGS-OPTICAL 7", "type": "SURVEILLANCE", "country": "JPN", "color": "#00ff00"},
}

@router.get("/")
async def get_satellites(lat: float = 0.0, lng: float = 0.0, alt: float = 0.0):
    global satellite_cache
    import time
    import random
    
    current_time = int(time.time())

    # 1. Extensive Fallback/Simulation Data (Always available as a base)
    fallback_fleet = []
    for i, base in enumerate([
        {"id": 25544, "name": "ISS (ZARYA)", "lat": 12.5, "lng": 45.2, "type": "STATION", "country": "INTL", "color": "#00f2ff"},
        {"id": 39232, "name": "USA 245 (KH-11)", "lat": 44.5, "lng": -120.2, "type": "RECON", "country": "USA", "color": "#00ff88"},
        {"id": 44443, "name": "COSMOS 2542", "lat": 45.1, "lng": -125.4, "type": "INSPECTOR", "country": "RUS", "color": "#ff004c"},
        {"id": 43005, "name": "YAOGAN 30", "lat": 22.3, "lng": 114.1, "type": "RECON", "country": "CHN", "color": "#ffaa00"}
    ]):
        base["trajectory"] = [
            {"lat": base["lat"] + (j*0.01), "lng": base["lng"] + (j*0.02), "alt": 400, "timestamp": current_time + j}
            for j in range(0, 300, 10)
        ]
        base["alt"] = 400
        fallback_fleet.append(base)

    # 2. Check Cache (Ensure it has data AND trajectories aren't empty)
    if satellite_cache["data"] and (time.time() - satellite_cache["last_fetch"] < 300):
        if len(satellite_cache["data"]) > 0 and satellite_cache["data"][0].get("trajectory"):
            return satellite_cache["data"]
        
    satellite_cache["data"] = [] # Force clear if we reach here

    # 3. Attempt API if key is present
    if N2YO_API_KEY:
        sat_positions = []
        try:
            async with httpx.AsyncClient() as client:
                for norad_id, meta in MILITARY_SATELLITES.items():
                    url = f"{N2YO_BASE_URL}/positions/{norad_id}/{lat}/{lng}/{alt}/300/&apiKey={N2YO_API_KEY}"
                    response = await client.get(url, timeout=10.0)
                    data = response.json()
                    
                    if "error" in data:
                        continue

                    positions = data.get("positions", [])
                    if not positions:
                        continue
                    
                    first_pos = positions[0]
                    trajectory = [
                        {
                            "lat": p.get("satlatitude", 0.0),
                            "lng": p.get("satlongitude", 0.0),
                            "alt": p.get("sataltitude", 0.0),
                            "timestamp": p.get("timestamp", 0)
                        } for p in positions
                    ]
                    
                    sat_positions.append({
                        "id": norad_id,
                        "name": meta.get("name", data.get("info", {}).get("satname")),
                        "lat": first_pos.get("satlatitude", 0.0),
                        "lng": first_pos.get("satlongitude", 0.0),
                        "alt": first_pos.get("sataltitude", 0.0),
                        "trajectory": trajectory,
                        "type": meta.get("type", "UNKNOWN"),
                        "country": meta.get("country", "UNKNOWN"),
                        "color": meta.get("color", "#00f2ff")
                    })
            
            if len(sat_positions) > 5: # Only cache if we got a reasonable fleet
                satellite_cache["data"] = sat_positions
                satellite_cache["last_fetch"] = time.time()
                return sat_positions
                
        except Exception as e:
            print(f"Satellite API Failure: {e}")

    # 4. Final Fallback (Simulated Fleet)
    return fallback_fleet
