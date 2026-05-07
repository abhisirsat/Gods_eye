from fastapi import APIRouter
import httpx
from datetime import datetime, timedelta, timezone

router = APIRouter()

# Static list of SIGINT nodes
SIGINT_NODES = [
    {"name": "GCHQ Bude",        "lat": 50.90, "lon": -4.54,  "country": "UK",     "type": "SIGINT"},
    {"name": "NSA Fort Meade",   "lat": 39.11, "lon": -76.77, "country": "USA",    "type": "NSA-HQ"},
    {"name": "Pine Gap",         "lat": -23.80,"lon": 133.74, "country": "AUS",    "type": "SIGINT"},
    {"name": "Menwith Hill",     "lat": 54.00, "lon": -1.69,  "country": "UK/USA", "type": "ECHELON"},
    {"name": "Duga (Chernobyl)", "lat": 51.31, "lon": 30.07,  "country": "UKR",    "type": "OTH-RADAR"},
    {"name": "Diego Garcia",     "lat": -7.31, "lon": 72.41,  "country": "USA/UK", "type": "SIGINT"},
    {"name": "Troodos SIGINT",   "lat": 34.92, "lon": 32.87,  "country": "UK",     "type": "SIGINT"},
    {"name": "Lourdes Base",     "lat": 22.89, "lon": -82.16, "country": "RUS",    "type": "SIGINT"},
    {"name": "Yakutsk EW Node",  "lat": 62.03, "lon": 129.73, "country": "RUS",    "type": "EW-NODE"},
    {"name": "Misawa AB",        "lat": 40.70, "lon": 141.37, "country": "USA/JP", "type": "SIGINT"},
]

# Simplified mapping for common hotspots/outage targets (ISO -> [Lat, Lon, Name])
COUNTRY_CAPITALS = {
    "IR": [35.6892, 51.3890, "Iran"],
    "SD": [15.5007, 32.5599, "Sudan"],
    "MM": [19.7633, 96.0785, "Myanmar"],
    "UA": [50.4501, 30.5234, "Ukraine"],
    "RU": [55.7558, 37.6173, "Russia"],
    "CN": [39.9042, 116.4074, "China"],
    "KP": [39.0392, 125.7625, "North Korea"],
    "SY": [33.5138, 36.2765, "Syria"],
    "AF": [34.5553, 69.1725, "Afghanistan"],
    "PK": [33.6844, 73.0479, "Pakistan"],
    "ET": [9.0300, 38.7400, "Ethiopia"],
    "IN": [28.6139, 77.2090, "India"],
}

@router.get("/jamming-zones")
async def get_jamming_zones():
    """Fetches GPS Jamming severity zones globally."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get("https://gpsjam.org/json")
            if resp.status_code != 200:
                return {"error": f"GPSJam API returned {resp.status_code}", "zones": [], "total": 0}
            
            data = resp.json()
            zones = []
            
            for cell in data:
                level = cell.get("level", 0)
                if level > 0:
                    severity = min(level, 3) 
                    
                    if severity == 1:
                        severity_label = "LOW"
                        color = "#ffff00"
                        radius_km = 120
                    elif severity == 2:
                        severity_label = "MEDIUM"
                        color = "#ff8800"
                        radius_km = 160
                    else:
                        severity_label = "HIGH"
                        color = "#ff0000"
                        radius_km = 200

                    zones.append({
                        "lat": cell.get("lat"),
                        "lon": cell.get("lon"),
                        "severity": severity,
                        "severity_label": severity_label,
                        "color": color,
                        "radius_km": radius_km,
                        "timestamp": datetime.utcnow().isoformat()
                    })

            return {"zones": zones, "total": len(zones)}
    except Exception as e:
        print(f"[EW_ENHANCED] Error fetching jamming zones: {e}")
        return {"error": str(e), "zones": [], "total": 0}

@router.get("/spoofing-detections")
async def get_spoofing_detections():
    """Cross-references current flights for altitude and velocity anomalies indicating spoofing."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            # Internal call to the local flights endpoint
            resp = await client.get("http://localhost:8000/api/flights/")
            if resp.status_code != 200:
                return {"error": "Failed to retrieve local flights", "anomalies": [], "total": 0}
            
            flights = resp.json()
            anomalies = []

            for f in flights:
                try:
                    alt_m = float(f.get("altitude") or 0)
                    vel_mps = float(f.get("velocity") or 0)
                    
                    anomaly_type = None
                    if alt_m > 15240:  # > 50,000 ft
                        anomaly_type = "ALTITUDE_SPOOF"
                    elif vel_mps > 450:  # > ~870 knots (extremely unusual)
                        anomaly_type = "VELOCITY_SPOOF"

                    if anomaly_type:
                        anomalies.append({
                            "icao": f.get("icao24", "UNKNOWN").upper(),
                            "callsign": f.get("callsign", "UNKNOWN").strip(),
                            "lat": f.get("latitude"),
                            "lon": f.get("longitude"),
                            "anomaly_type": anomaly_type,
                            "confidence": "HIGH",
                            "altitude_m": alt_m,
                            "velocity_mps": vel_mps
                        })
                except (ValueError, TypeError):
                    continue
            
            return {"anomalies": anomalies, "total": len(anomalies)}
    except Exception as e:
        print(f"[EW_ENHANCED] Error analyzing spoofing: {e}")
        return {"error": str(e), "anomalies": [], "total": 0}

@router.get("/sigint-nodes")
async def get_sigint_nodes():
    """Returns static hardcoded list of prominent SIGINT nodes."""
    return {"nodes": SIGINT_NODES, "total": len(SIGINT_NODES)}

@router.get("/internet-outages")
async def get_internet_outages():
    """Fetches real-time internet outages from Cloudflare Radar."""
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            now = datetime.now(timezone.utc)
            start = now - timedelta(hours=12)
            
            params = {
                "limit": 50,
                "dateStart": start.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "dateEnd": now.strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            
            resp = await client.get(
                "https://api.cloudflare.com/client/v4/radar/annotations/outages",
                params=params
            )
            
            if resp.status_code != 200:
                print(f"[EW_ENHANCED] CF Error {resp.status_code}: {resp.text}")
                return {"error": f"Cloudflare API returned {resp.status_code}", "outages": [], "total": 0}
            
            data = resp.json()
            outages = []
            
            annotations = data.get("result", {}).get("annotations", [])
            for event in annotations:
                locations = event.get("locations", [])
                for iso in locations:
                    if iso in COUNTRY_CAPITALS:
                        coords = COUNTRY_CAPITALS[iso]
                        outages.append({
                            "country": coords[2],
                            "iso": iso,
                            "lat": coords[0],
                            "lon": coords[1],
                            "type": event.get("scope", "NATIONAL"),
                            "cause": event.get("description", "INTERNET BLACKOUT DETECTED"),
                            "severity": "HIGH",
                            "color": "#bf00ff", # Outage Purple
                            "timestamp": event.get("startDate")
                        })

            return {"outages": outages, "total": len(outages)}
    except Exception as e:
        print(f"[EW_ENHANCED] Error fetching internet outages: {e}")
        return {"error": str(e), "outages": [], "total": 0}
