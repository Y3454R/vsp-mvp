from pydantic import BaseModel
from typing import Optional


class Case(BaseModel):
    """Model for a medical case."""

    id: str
    patient_name: str
    age: int
    gender: str
    chief_complaint: str
    condition: str
    background: str
    symptoms: str
    medical_history: str
    difficulty_level: str = "medium"
    expected_questions: Optional[list] = None
