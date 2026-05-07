from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database.db import IntelSignal, AsyncSessionLocal
import datetime

router = APIRouter(prefix="/api/history", tags=["history"])

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/")
async def get_history(
    start: str = Query(..., description="ISO Format Start Time"),
    end: str = Query(..., description="ISO Format End Time"),
    db: AsyncSession = Depends(get_db)
):
    try:
        start_dt = datetime.datetime.fromisoformat(start.replace('Z', '+00:00'))
        end_dt = datetime.datetime.fromisoformat(end.replace('Z', '+00:00'))
        
        result = await db.execute(
            select(IntelSignal).where(
                IntelSignal.timestamp >= start_dt,
                IntelSignal.timestamp <= end_dt
            ).order_by(IntelSignal.timestamp.asc())
        )
        signals = result.scalars().all()
        
        return [
            {
                "id": s.id,
                "type": s.type,
                "severity": s.severity,
                "lat": s.location_lat,
                "lng": s.location_lng,
                "content": s.content,
                "timestamp": s.timestamp.isoformat()
            } for s in signals
        ]
        
    except Exception as e:
        return {"error": str(e)}
