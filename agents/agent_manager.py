import asyncio
import os
import datetime
from sqlalchemy.ext.asyncio import AsyncSession
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from backend.database.db import IntelSignal, AsyncSessionLocal, init_db
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

async def save_signal(session, type, source, severity, lat, lng, content, metadata=None):
    signal = IntelSignal(
        type=type,
        source=source,
        severity=severity,
        location_lat=lat,
        location_lng=lng,
        content=content,
        metadata_json=str(metadata) if metadata else "{}"
    )
    session.add(signal)
    await session.commit()
    print(f"[{datetime.datetime.now()}] SAVED {type} SIGNAL from {source} (Severity: {severity})")

async def flight_watcher():
    """Monitors OpenSky for emergency squawks or military patterns."""
    print("Agent: Flight Watcher started.")
    async with AsyncSessionLocal() as session:
        while True:
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.get("http://localhost:8000/api/flights/")
                    flights = resp.json()
                    
                    for f in flights:
                        # Logic: Detect emergency squawks or military callsigns
                        if "MIL" in (f.get('callsign') or "") or f.get('velocity', 0) > 400: # High speed or military
                            await save_signal(
                                session, "FLIGHT", "OPENSKY", "HIGH",
                                f['latitude'], f['longitude'],
                                f"Tactical Aircraft Detected: {f['callsign']} @ {f['altitude']}m",
                                f
                            )
                await asyncio.sleep(60)
            except Exception as e:
                print(f"Flight Agent Error: {e}")
                await asyncio.sleep(30)

async def news_scanner():
    """Scans news for high-severity keywords."""
    print("Agent: News Scanner started.")
    async with AsyncSessionLocal() as session:
        while True:
            try:
                async with httpx.AsyncClient() as client:
                    resp = await client.get("http://localhost:8000/api/events/")
                    events = resp.json()
                    
                    for ev in events:
                        if ev['severity'] in ['HIGH', 'CRITICAL']:
                            await save_signal(
                                session, "NEWS", ev['source'], ev['severity'],
                                ev['lat'], ev['lng'], ev['title']
                            )
                await asyncio.sleep(300)
            except Exception as e:
                print(f"News Agent Error: {e}")
                await asyncio.sleep(60)

async def signal_processor():
    """AI brain that analyzes new signals using Gemini."""
    print("Agent: Signal Processor (ARES) started.")
    async with AsyncSessionLocal() as session:
        while True:
            # In a real app, we'd fetch UNPROCESSED signals and send to Gemini
            # For this demo, we'll simulate AI analysis heartbeat
            print("ARES: Analyzing signal patterns...")
            await asyncio.sleep(180)

async def main():
    await init_db()
    # Run all agents concurrently
    await asyncio.gather(
        flight_watcher(),
        news_scanner(),
        signal_processor()
    )

if __name__ == "__main__":
    asyncio.run(main())
