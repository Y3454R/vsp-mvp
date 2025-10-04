from fastapi import APIRouter, HTTPException
from backend.services.case_loader import case_loader
from backend.models.case import Case
from typing import List

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.get("/", response_model=List[Case])
async def get_all_cases():
    """Get all available medical cases."""
    try:
        cases = case_loader.get_all_cases_list()
        return cases
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{case_id}", response_model=Case)
async def get_case(case_id: str):
    """Get a specific case by ID."""
    case = case_loader.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return case


@router.post("/reload")
async def reload_cases():
    """Reload cases from disk (useful for development)."""
    try:
        case_loader.reload_cases()
        return {"message": "Cases reloaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
