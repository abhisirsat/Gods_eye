from fastapi import APIRouter
import httpx
from datetime import datetime, timezone

router = APIRouter()

_cable_cache = {"data": None, "fetched_at": None}

@router.get("/undersea-cables")
async def get_undersea_cables():
    global _cable_cache
    now = datetime.now(timezone.utc).timestamp()
    
    if _cable_cache["data"] and _cable_cache["fetched_at"]:
        # Cache for 24 hours (86400 seconds)
        if now - _cable_cache["fetched_at"] < 86400:
            return _cable_cache["data"]
            
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            # Primary Source
            resp = await client.get("https://raw.githubusercontent.com/telegeography/www.submarinecablemap.com/master/web/public/api/v3/cable/cable-geo.json")
            if resp.status_code != 200:
                # Fallback Source
                resp = await client.get("https://www.submarinecablemap.com/api/v3/cable/cable-geo.json")
                if resp.status_code != 200:
                    return {"error": "Failed to fetch cables", "features": []}
            
            data = resp.json()
            _cable_cache["data"] = data
            _cable_cache["fetched_at"] = now
            return data
    except Exception as e:
        print(f"[INFRASTRUCTURE] Error fetching cables: {e}")
        return {"error": str(e), "features": []}

@router.get("/internet-outages")
async def get_ooni_outages():
    # OONI API for censorship/outages
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get("https://api.ooni.io/api/v1/measurements/?limit=30&anomaly=true")
            if resp.status_code != 200:
                return {"error": "OONI API Failed", "outages": []}
            
            data = resp.json()
            outages = []
            
            results = data.get("results", [])
            high_risk_countries = ["IR", "CN", "RU", "KP", "BY"]
            
            for m in results:
                cc = m.get("probe_cc", "UNKNOWN")
                severity = "HIGH" if cc in high_risk_countries else "MEDIUM"
                outages.append({
                    "country": cc,
                    "type": "CENSORSHIP",
                    "severity": severity,
                    "source": "OONI",
                    "timestamp": m.get("measurement_start_time")
                })
            
            return {"outages": outages}
    except Exception as e:
        print(f"[INFRASTRUCTURE] Error fetching OONI: {e}")
        return {"error": str(e), "outages": []}

@router.get("/datacenters")
async def get_datacenters():
    nodes = [
      # AWS
      {"name":"AWS us-east-1",     "lat":39.04,"lon":-77.49,"provider":"AWS",  "tier":1},
      {"name":"AWS eu-west-1",     "lat":53.33,"lon":-6.25, "provider":"AWS",  "tier":1},
      {"name":"AWS ap-east-1",     "lat":22.28,"lon":114.16,"provider":"AWS",  "tier":1},
      {"name":"AWS ap-south-1",    "lat":19.08,"lon":72.88, "provider":"AWS",  "tier":1},
      # Google Cloud
      {"name":"GCP us-central1",   "lat":41.26,"lon":-95.86,"provider":"GCP",  "tier":1},
      {"name":"GCP europe-west4",  "lat":51.99,"lon":4.66,  "provider":"GCP",  "tier":1},
      {"name":"GCP asia-east1",    "lat":24.05,"lon":120.55,"provider":"GCP",  "tier":1},
      # Azure
      {"name":"Azure East US",     "lat":37.33,"lon":-79.47,"provider":"AZURE","tier":1},
      {"name":"Azure West Europe", "lat":52.36,"lon":4.90,  "provider":"AZURE","tier":1},
      # Internet Exchange Points (IXPs) - critical global chokepoints
      {"name":"DE-CIX Frankfurt",  "lat":50.11,"lon":8.68,  "provider":"IXP",  "tier":0},
      {"name":"AMS-IX Amsterdam",  "lat":52.37,"lon":4.90,  "provider":"IXP",  "tier":0},
      {"name":"LINX London",       "lat":51.51,"lon":-0.13, "provider":"IXP",  "tier":0},
      {"name":"JPNAP Tokyo",       "lat":35.69,"lon":139.69,"provider":"IXP",  "tier":0},
      {"name":"SGIX Singapore",    "lat":1.35, "lon":103.82,"provider":"IXP",  "tier":0},
      {"name":"Equinix Mumbai",    "lat":19.08,"lon":72.88, "provider":"IXP",  "tier":0},
    ]
    return {"nodes": nodes, "total": len(nodes)}
