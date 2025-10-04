from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    """Model for a single chat message."""

    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    """Model for chat request."""

    session_id: str
    case_id: str
    message: str
    messages: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    """Model for chat response."""

    session_id: str
    response: str
    case_id: str
