from fastapi import APIRouter, HTTPException
from backend.models.evaluation_result import EvaluationRequest, EvaluationResult
from backend.services.evaluation_service import evaluation_service

router = APIRouter(prefix="/api/evaluate", tags=["evaluation"])


@router.post("/", response_model=EvaluationResult)
async def evaluate_conversation(request: EvaluationRequest):
    """
    Evaluate a student's conversation with the virtual patient.

    Args:
        request: EvaluationRequest containing session_id, case_id, and messages

    Returns:
        EvaluationResult with scores and feedback
    """
    try:
        result = evaluation_service.evaluate_conversation(
            session_id=request.session_id,
            case_id=request.case_id,
            messages=request.messages,
        )

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
