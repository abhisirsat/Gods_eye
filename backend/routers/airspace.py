from fastapi import APIRouter
import httpx
import os
import random
from datetime import datetime
from typing import List, Dict

router = APIRouter()

OPENAIP_KEY = os.getenv("OPENAIP_API_KEY", "")

# Static Conflict Zones
CONFLICT_ZONES = [
  {
    "id": "CZ_UA",
    "name": "UKRAINE AIRSPACE CLOSED",
    "type": "CONFLICT",
    "country": "UA",
    "severity": "CRITICAL",
    "active_since": "2022-02-24",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[22,44],[40,44],[40,52],[22,52],[22,44]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "id": "CZ_IL",
    "name": "GAZA / ISRAEL RESTRICTED",
    "type": "CONFLICT",
    "country": "IL",
    "severity": "CRITICAL",
    "active_since": "2023-10-07",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[34.2,31.2],[34.6,31.2],[34.6,31.6],[34.2,31.6],[34.2,31.2]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "id": "CZ_KP",
    "name": "NORTH KOREA ADIZ",
    "type": "PROHIBITED",
    "country": "KP",
    "severity": "HIGH",
    "active_since": "1953-07-27",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[124,37],[132,37],[132,43],[124,43],[124,37]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "id": "CZ_MM",
    "name": "MYANMAR RESTRICTED",
    "type": "RESTRICTED",
    "country": "MM",
    "severity": "HIGH",
    "active_since": "2021-02-01",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[92,10],[102,10],[102,28],[92,28],[92,10]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
  {
    "id": "CZ_SD",
    "name": "SUDAN CONFLICT ZONE",
    "type": "CONFLICT",
    "country": "SD",
    "severity": "HIGH",
    "active_since": "2023-04-15",
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[24,10],[38,10],[38,22],[24,22],[24,10]]]
    },
    "lower_alt_ft": 0,
    "upper_alt_ft": 60000,
  },
]

@router.get("/notams")
async def get_notams():
    """Fetches real-time NOTAMs from FAA API"""
    try:
        url = "https://notamapi.faa.gov/notamapi/v1/notams?pageSize=50&sortBy=effectiveStartDate&sortOrder=Desc"
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url)
            data = response.json()
            
            notams = []
            for item in data.get("items", []):
                text = item.get("properties", {}).get("text", "")
                severity = "LOW"
                if any(x in text for x in ["R-", "P-", "TFR", "MILITARY"]):
                    severity = "HIGH"
                elif any(x in text for x in ["DRONE", "UAS"]):
                    severity = "MEDIUM"
                
                notams.append({
                    "id": item.get("properties", {}).get("notamNumber", "0/0000"),
                    "type": "RESTRICTED" if severity == "HIGH" else "CAUTION",
                    "location": item.get("properties", {}).get("locationDesignator", "UNKNOWN"),
                    "text": text,
                    "start": item.get("properties", {}).get("effectiveStartDate"),
                    "end": item.get("properties", {}).get("expirationDate"),
                    "severity": severity,
                    "source": "FAA"
                })
            return {"notams": notams, "total": len(notams)}
    except Exception as e:
        print(f"[AIRSPACE] FAA NOTAM Error: {e}")
        return {"notams": [], "total": 0, "error": str(e)}

@router.get("/conflict-zones")
async def get_conflict_zones():
    """Returns static list of critical conflict airspaces"""
    return {"zones": CONFLICT_ZONES, "total": len(CONFLICT_ZONES)}

@router.get("/openaip")
async def get_openaip_airspace(lat: float = 0, lon: float = 0, dist: int = 500):
    """Fetches real-world airspace polygons from OpenAIP (if key exists)"""
    if not OPENAIP_KEY:
        return {"features": [], "message": "OPENAIP_API_KEY missing"}
    
    return {"features": [], "message": "OpenAIP integration pending specific endpoint spec"}
