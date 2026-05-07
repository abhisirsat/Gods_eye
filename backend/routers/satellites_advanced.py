from fastapi import APIRouter, HTTPException
import httpx
import os
import time
from backend.routers.satellites import MILITARY_SATELLITES, N2YO_API_KEY, N2YO_BASE_URL

router = APIRouter()

pass_cache = {}
orbit_cache = {}

@router.get("/passes")
async def get_satellite_passes(norad_id: int, lat: float, lng: float, alt: float = 0.0, days: int = 2):
    """Fetch visual or radio passes for a given satellite and observer location."""
    if not N2YO_API_KEY:
        raise HTTPException(status_code=400, detail="N2YO_API_KEY missing")
        
    cache_key = f"{norad_id}_{lat}_{lng}_{days}"
    if cache_key in pass_cache and time.time() - pass_cache[cache_key]["timestamp"] < 3600:
        return pass_cache[cache_key]["data"]

    # Try visual passes first, it's more relevant for optical arrays
    url = f"{N2YO_BASE_URL}/visualpasses/{norad_id}/{lat}/{lng}/{alt}/{days}/10/&apiKey={N2YO_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10.0)
            data = resp.json()
            
            # N2YO returns info dictionary and passes array
            if "error" in data or not data.get("passes"):
                print(f"[SATELLITE] No visual passes for {norad_id}, trying radio passes...")
                # Fallback to radio passes (works daytime and anytime)
                url = f"{N2YO_BASE_URL}/radiopasses/{norad_id}/{lat}/{lng}/{alt}/{days}/10/&apiKey={N2YO_API_KEY}"
                resp = await client.get(url, timeout=10.0)
                data = resp.json()
                
            pass_cache[cache_key] = {"data": data, "timestamp": time.time()}
            return data
    except Exception as e:
        print(f"[SATELLITE] Pass fetching failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orbit")
async def get_satellite_orbit(norad_id: int):
    """Fetch an extended orbital trajectory (TLE) for ground tracking."""
    if not N2YO_API_KEY:
        raise HTTPException(status_code=400, detail="N2YO_API_KEY missing")
        
    if norad_id in orbit_cache and time.time() - orbit_cache[norad_id]["timestamp"] < 3600:
        return orbit_cache[norad_id]["data"]

    url = f"{N2YO_BASE_URL}/tle/{norad_id}/&apiKey={N2YO_API_KEY}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, timeout=10.0)
            data = resp.json()
            orbit_cache[norad_id] = {"data": data, "timestamp": time.time()}
            return data
    except Exception as e:
        print(f"[SATELLITE] Orbit fetch failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/priority")
async def get_priority_satellites():
    """Returns the list of high priority satellites for the UI Panel."""
    # List of high-value targets for the UI to display
    targets = [
        {"id": 39232, "name": "USA 245 (KH-11)", "type": "OPTICAL_RECON", "country": "USA", "color": "#00ff88"},
        {"id": 43005, "name": "YAOGAN 30", "type": "RECON", "country": "CHN", "color": "#ffaa00"},
        {"id": 44443, "name": "COSMOS 2542", "type": "INSPECTOR", "country": "RUS", "color": "#ff004c"},
        {"id": 45846, "name": "OFEK 16", "type": "RECON", "country": "ISR", "color": "#8800ff"},
        {"id": 25544, "name": "ISS (ZARYA)", "type": "STATION", "country": "INTL", "color": "#00f2ff"},
    ]
    return {"satellites": targets}
