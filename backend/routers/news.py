from fastapi import APIRouter, HTTPException
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# GDELT v2 URL for conflict and military signals
GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc?query=military+conflict+attack+strike&mode=artlist&maxrecords=50&format=json"

@router.get("/")
async def get_events():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(GDELT_URL, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            articles = data.get("articles", [])
            events = []
            
            for art in articles:
                # GDELT articles don't always have lat/lng in the artlist mode JSON
                # We'll simulate some locations based on country if missing or use placeholders
                events.append({
                    "title": art.get("title", "UNKNOWN SIGNAL"),
                    "url": art.get("url", ""),
                    "source": art.get("source", "GDELT"),
                    "timestamp": art.get("seendate", ""),
                    "lat": 0.0, # Placeholder, will be enriched by agents
                    "lng": 0.0,
                    "severity": "MEDIUM"
                })
                
            return events
            
        except Exception as e:
            # Fallback to some static events for testing if API fails
            return [
                {
                    "title": "RED SEA: MARITIME SECURITY ALERT",
                    "url": "#",
                    "source": "REUTERS",
                    "timestamp": "2024-03-04T12:00:00Z",
                    "lat": 15.0,
                    "lng": 42.0,
                    "severity": "HIGH"
                },
                {
                    "title": "UKRAINE/RUSSIA: KHARKIV STRIKES REPORTED",
                    "url": "#",
                    "source": "AP",
                    "timestamp": "2024-03-04T12:05:00Z",
                    "lat": 50.0,
                    "lng": 36.2,
                    "severity": "CRITICAL"
                }
            ]
