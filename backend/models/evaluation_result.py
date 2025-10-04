from pydantic import BaseModel
from typing import List, Optional


class EvaluationRequest(BaseModel):
    """Model for evaluation request."""

    session_id: str
    case_id: str
    messages: List[dict]


class EvaluationScore(BaseModel):
    """Model for evaluation scores."""

    rapport_building: float
    active_listening_empathy: float
    psychiatric_history: float
    risk_assessment: float
    biopsychosocial_assessment: float
    communication_skills: float
    cultural_sensitivity: float
    interview_structure: float
    overall_score: float


class ConversationMetrics(BaseModel):
    """Non-scoring metrics for conversation analysis."""

    information_density: float
    emotional_tendency: float
    response_length: float
    turn_number: int


class EvaluationResult(BaseModel):
    """Model for complete evaluation result."""

    session_id: str
    case_id: str
    scores: EvaluationScore
    strengths: List[str]
    areas_for_improvement: List[str]
    feedback: str
    metrics: Optional[ConversationMetrics] = None
    error: Optional[str] = None
