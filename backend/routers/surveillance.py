from fastapi import APIRouter, Query
import random
from typing import Optional, List

router = APIRouter()

# Simulated API Key (In a real app, this would be in .env)
WINDY_API_KEY = "SURVEILLANCE_BONE_KEY_88"

@router.get("/hotspots")
async def get_hotspots():
    """
    Returns high-intensity tactical hotspots with live intelligence context.
    """
    hotspots = [
        {
            "id": "HS_RED_SEA",
            "name": "Red Sea / Bab el-Mandeb",
            "lat": 12.8,
            "lng": 43.3,
            "severity": "CRITICAL",
            "activity": "Asymmetric maritime threats detected. Escort missions active.",
            "intelligence": "Multiple radar-skimming signatures detected at 0400Z. Satelliterecon shows increased small-craft activity near Hodeidah."
        },
        {
            "id": "HS_TAIWAN",
            "name": "Taiwan Strait - Kinmen Sector",
            "lat": 24.4,
            "lng": 118.3,
            "severity": "HIGH",
            "activity": "Coast Guard standoff reported. Sortie frequency +40% (24h).",
            "intelligence": "Radio intercepts suggest coordinated denial-of-service tests on civilian relay nodes."
        }
    ]
    return hotspots

@router.get("/webcams")
async def get_webcams(
    west: Optional[float] = Query(None),
    south: Optional[float] = Query(None),
    east: Optional[float] = Query(None),
    north: Optional[float] = Query(None)
):
    """
    Advanced OSINT Surveillance Aggregator.
    Utilizes verified, high-uptime YouTube live streams for real-time tactical intelligence.
    """
    webcams = [
        {
            "id": "SIGINT_TOKYO_01",
            "name": "Tokyo - Shibuya Scramble Crossing",
            "lat": 35.6595,
            "lng": 139.7005,
            "category": "URBAN_RECON",
            "source": "OSINT_YOUTUBE",
            # Fresh verified ID: dfVK7ld38Ys
            "url": "https://www.youtube.com/embed/dfVK7ld38Ys?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0",
            "stream_type": "EMBED",
            "status": "ONLINE",
            "featured": True
        },
        {
            "id": "RECON_NYC_01",
            "name": "New York - Times Square Live",
            "lat": 40.7580,
            "lng": -73.9855,
            "category": "TACTICAL_VANTAGE",
            "source": "OSINT_YOUTUBE",
            # Fresh verified ID: rnXIjl_Rzy4
            "url": "https://www.youtube.com/embed/rnXIjl_Rzy4?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0",
            "stream_type": "EMBED",
            "status": "ONLINE",
            "featured": True
        },
        {
            "id": "INTEL_UA_01",
            "name": "Kyiv - Tactical Aggregator",
            "lat": 50.4501,
            "lng": 30.5234,
            "category": "FRONTLINE_MONITOR",
            "source": "OSINT_YOUTUBE",
            # Fresh verified ID: e2gC37ILQmk
            "url": "https://www.youtube.com/embed/e2gC37ILQmk?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0",
            "stream_type": "EMBED",
            "status": "ONLINE",
            "featured": True
        },
        {
            "id": "MARITIME_VENICE_01",
            "name": "Venice - Rialto Bridge Monitor",
            "lat": 45.4380,
            "lng": 12.3359,
            "category": "MARITIME",
            "source": "OSINT_YOUTUBE",
            # Fresh verified ID: K_Vg94nBiaY
            "url": "https://www.youtube.com/embed/K_Vg94nBiaY?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0",
            "stream_type": "EMBED",
            "status": "ONLINE",
            "featured": True
        }
    ]

    # Filter by bounding box if provided
    if all(v is not None for v in [west, south, east, north]):
        filtered = []
        for cam in webcams:
            if west <= cam["lng"] <= east and south <= cam["lat"] <= north:
                filtered.append(cam)
        
        # Add simulated "dynamic" tactical nodes if area is sparse
        if len(filtered) < 2:
            for i in range(2):
                lat = random.uniform(south, north)
                lng = random.uniform(west, east)
                filtered.append({
                    "id": f"DYN_INTEL_{random.randint(1000, 9999)}",
                    "name": f"Mobile Intel Unit {random.randint(10, 99)}",
                    "lat": lat,
                    "lng": lng,
                    "category": "MOBILE_RECON",
                    "source": "OSINT_SIGNAL",
                    "url": "https://www.youtube.com/embed/live_stream?channel=UC8p1vwuiE7LPZ6Z9Gr3616A&autoplay=1&mute=1&controls=0",
                    "stream_type": "EMBED",
                    "status": "ONLINE"
                })
        return filtered

    return webcams

@router.get("/events")
async def get_events():
    """
    Returns live global events with specialized tactical tagging.
    """
    events = [
        {"id": "EV_UA_INTEL", "type": "conflict", "lat": 49.37, "lng": 31.17, "title": "Kyiv Perimeter Signal Spike", "source": "SIGINT_SAT", "severity": "HIGH", "desc": "Electronic Warfare interference detected (GPS Spoofing) in northern sectors."},
        {"id": "EV_PACIFIC_RECON", "type": "maritime", "lat": 1.3, "lng": 103.8, "title": "Malacca Strait Congestion", "source": "AIS_OSINT", "severity": "MODERATE", "desc": "Unexpected vessel clustering at western approach nodes."}
    ]
    return events

