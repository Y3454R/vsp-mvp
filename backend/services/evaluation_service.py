from backend.core.llm_client import get_llm_client
from ai.chains.evaluation_chain import create_evaluation_chain
from backend.services.case_loader import case_loader
from backend.services.metrics_service import metrics_service
from backend.models.evaluation_result import (
    EvaluationScore,
    EvaluationResult,
    ConversationMetrics,
)
from typing import List, Dict


class EvaluationService:
    """Service for evaluating student performance."""

    def __init__(self):
        self.llm = get_llm_client()

    def evaluate_conversation(
        self, session_id: str, case_id: str, messages: List[Dict[str, str]]
    ) -> EvaluationResult:
        """
        Evaluate a student's conversation with the virtual patient.

        Args:
            session_id: Unique session identifier
            case_id: Case identifier
            messages: List of chat messages

        Returns:
            EvaluationResult with scores and feedback
        """
        try:
            # Get case data
            case = case_loader.get_case(case_id)
            if not case:
                raise ValueError(f"Case {case_id} not found")

            # Run evaluation
            evaluation_data = create_evaluation_chain(
                llm=self.llm, case_data=case.model_dump(), messages=messages
            )

            # Check for errors
            if "error" in evaluation_data:
                return EvaluationResult(
                    session_id=session_id,
                    case_id=case_id,
                    scores=EvaluationScore(
                        rapport_building=0,
                        active_listening_empathy=0,
                        psychiatric_history=0,
                        risk_assessment=0,
                        biopsychosocial_assessment=0,
                        communication_skills=0,
                        cultural_sensitivity=0,
                        interview_structure=0,
                        overall_score=0,
                    ),
                    strengths=[],
                    areas_for_improvement=[],
                    feedback="Error evaluating conversation",
                    error=evaluation_data.get("error"),
                )

            # Create evaluation scores
            scores = EvaluationScore(
                rapport_building=evaluation_data.get("rapport_building", 0),
                active_listening_empathy=evaluation_data.get(
                    "active_listening_empathy", 0
                ),
                psychiatric_history=evaluation_data.get("psychiatric_history", 0),
                risk_assessment=evaluation_data.get("risk_assessment", 0),
                biopsychosocial_assessment=evaluation_data.get(
                    "biopsychosocial_assessment", 0
                ),
                communication_skills=evaluation_data.get("communication_skills", 0),
                cultural_sensitivity=evaluation_data.get("cultural_sensitivity", 0),
                interview_structure=evaluation_data.get("interview_structure", 0),
                overall_score=evaluation_data.get("overall_score", 0),
            )

            # Calculate non-scoring metrics
            conversation_metrics = metrics_service.calculate_all_metrics(messages)
            metrics = ConversationMetrics(
                information_density=conversation_metrics["information_density"],
                emotional_tendency=conversation_metrics["emotional_tendency"],
                response_length=conversation_metrics["response_length"],
                turn_number=conversation_metrics["turn_number"],
            )

            # Create result
            result = EvaluationResult(
                session_id=session_id,
                case_id=case_id,
                scores=scores,
                strengths=evaluation_data.get("strengths", []),
                areas_for_improvement=evaluation_data.get("areas_for_improvement", []),
                feedback=evaluation_data.get("feedback", ""),
                metrics=metrics,
            )

            return result

        except Exception as e:
            # Return error result
            return EvaluationResult(
                session_id=session_id,
                case_id=case_id,
                scores=EvaluationScore(
                    rapport_building=0,
                    active_listening_empathy=0,
                    psychiatric_history=0,
                    risk_assessment=0,
                    biopsychosocial_assessment=0,
                    communication_skills=0,
                    cultural_sensitivity=0,
                    interview_structure=0,
                    overall_score=0,
                ),
                strengths=[],
                areas_for_improvement=[],
                feedback="",
                error=str(e),
            )


# Global evaluation service instance
evaluation_service = EvaluationService()
