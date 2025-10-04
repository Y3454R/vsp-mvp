from fastapi import APIRouter, HTTPException
from backend.models.chat_history import ChatRequest, ChatResponse
from backend.services.chat_service import chat_service

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message to the virtual patient and get a response.

    Args:
        request: ChatRequest containing session_id, case_id, and message

    Returns:
        ChatResponse with the patient's reply
    """
    try:
        response = chat_service.send_message(
            session_id=request.session_id,
            case_id=request.case_id,
            message=request.message,
        )

        return ChatResponse(
            session_id=request.session_id, response=response, case_id=request.case_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/end-session")
async def end_session(session_id: str, case_id: str):
    """
    End a chat session and clean up resources.

    Args:
        session_id: Session identifier
        case_id: Case identifier

    Returns:
        Success message
    """
    try:
        chat_service.end_session(session_id, case_id)
        return {"message": "Session ended successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """
    Get chat history for a session.

    Args:
        session_id: Session identifier

    Returns:
        List of chat messages
    """
    try:
        history = chat_service.get_chat_history(session_id)
        return {"session_id": session_id, "messages": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
