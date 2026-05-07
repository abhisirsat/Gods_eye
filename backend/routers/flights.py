from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv
import asyncio

load_dotenv()

router = APIRouter()

OPENSKY_URL = "https://opensky-network.org/api/states/all"
USERNAME = os.getenv("OPENSKY_USERNAME")
PASSWORD = os.getenv("OPENSKY_PASSWORD")

# Cache to avoid hitting rate limits
cache = {"data": None, "timestamp": 0}
CACHE_TTL = 15  # seconds

@router.get("/")
async def get_flights():
    import time
    now = time.time()
    
    if cache["data"] and (now - cache["timestamp"] < CACHE_TTL):
        return cache["data"]

    async def fetch_opensky():
        auth = (USERNAME, PASSWORD) if USERNAME and PASSWORD else None
        # Increased timeout for large global payload (10k+ flights)
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(OPENSKY_URL, auth=auth, timeout=12.0)
                if response.status_code == 200:
                    data = response.json()
                    states = data.get("states", [])
                    print(f"OpenSky: Fetched {len(states)} flights.")
                    return {
                        s[0].lower(): {
                            "icao24": s[0].lower(),
                            "callsign": s[1].strip() if s[1] else "UNKNOWN",
                            "origin_country": s[2],
                            "longitude": s[5],
                            "latitude": s[6],
                            "altitude": s[7] if s[7] else 0,
                            "velocity": s[9] if s[9] else 0,
                            "heading": s[10] if s[10] else 0,
                            "source": "OpenSky"
                        } for s in states if s[5] and s[6]
                    }
                else:
                    print(f"OpenSky Error: HTTP {response.status_code}")
            except Exception as e:
                print(f"OpenSky Exception: {e}")
            return {}

    async def fetch_adsblol_region(lat, lon, name, dist=250):
        # Using specific 250nm radius hubs (validated endpoint)
        url = f"https://api.adsb.lol/v2/lat/{lat}/lon/{lon}/dist/{dist}"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, timeout=8.0)
                if response.status_code == 200:
                    data = response.json()
                    ac = data.get("ac", [])
                    print(f"ADSB.lol ({name}): Fetched {len(ac)} flights.")
                    return {
                        a.get("hex").lower(): {
                            "icao24": a.get("hex").lower(),
                            "callsign": (a.get("flight") or "UNKNOWN").strip(),
                            "registration": (a.get("r") or "UNKNOWN").strip(),
                            "type": (a.get("t") or "UNKNOWN").strip(),
                            "origin_country": "UNKNOWN",
                            "longitude": a.get("lon"),
                            "latitude": a.get("lat"),
                            "altitude": a.get("alt_baro", 0) if isinstance(a.get("alt_baro"), (int, float)) else 0,
                            "velocity": a.get("gs", 0),
                            "heading": a.get("track", 0),
                            "source": "ADSB.lol"
                        } for a in ac if a.get("lat") and a.get("lon")
                    }
                else:
                    print(f"ADSB.lol ({name}) Error: HTTP {response.status_code}")
            except Exception as e: 
                print(f"ADSB.lol ({name}) Exception: {e}")
            return {}

    # Run fetches concurrently: OpenSky + Key Global Hubs
    results = await asyncio.gather(
        fetch_opensky(),
        fetch_adsblol_region(40.7, -74.0, "NYC"),     # US East Coast
        fetch_adsblol_region(51.5, -0.1, "London"),   # Europe
        fetch_adsblol_region(35.6, 139.7, "Tokyo"),   # Asia
        fetch_adsblol_region(25.2, 55.3, "Dubai"),    # Middle East
        fetch_adsblol_region(-33.8, 151.2, "Sydney")  # Oceania
    )
    
    # Merge results (Deduplication)
    all_flights = {}
    for source_data in results:
        for icao, flight in source_data.items():
            if icao not in all_flights:
                all_flights[icao] = flight
            else:
                # Merge logic: if existing flight has "UNKNOWN" callsign but new one doesn't, update
                if all_flights[icao]["callsign"] == "UNKNOWN" and flight["callsign"] != "UNKNOWN":
                    all_flights[icao]["callsign"] = flight["callsign"]
                
                # Merge metadata
                if all_flights[icao].get("registration") == "UNKNOWN" and flight.get("registration") != "UNKNOWN":
                    all_flights[icao]["registration"] = flight["registration"]
                if all_flights[icao].get("type") == "UNKNOWN" and flight.get("type") != "UNKNOWN":
                    all_flights[icao]["type"] = flight["type"]

                # Keep merging other fields if they are zero/missing
                if not all_flights[icao]["altitude"] and flight["altitude"]:
                    all_flights[icao]["altitude"] = flight["altitude"]

    final_list = list(all_flights.values())
    import random
    random.shuffle(final_list)
    # Return 1500 for better global density
    final_list = final_list[:1500] 

    print(f"GOD'S EYE: Airspace Synchronized. Total Active Targets: {len(final_list)}")
    cache["data"] = final_list
    cache["timestamp"] = now
    return final_list
