"""
Service for calculating non-scoring metrics based on CureFun paper methodology.
These metrics provide additional context for evaluation but don't affect the score.
"""

from typing import List, Dict
import re


class MetricsService:
    """Service for calculating conversation metrics."""

    def __init__(self):
        # Common medical/psychiatric terms for information density
        self.medical_terms = {
            "symptoms",
            "depression",
            "anxiety",
            "mood",
            "sleep",
            "appetite",
            "suicidal",
            "therapy",
            "medication",
            "diagnosis",
            "treatment",
            "psychiatric",
            "mental",
            "stress",
            "trauma",
            "bipolar",
            "panic",
            "obsessive",
            "compulsive",
            "psychotic",
            "hallucination",
            "delusion",
            "mania",
            "substance",
            "alcohol",
            "drug",
            "withdrawal",
            "ptsd",
        }

    def calculate_information_density(self, messages: List[Dict[str, str]]) -> float:
        """
        Calculate information density based on medical entity presence.

        Args:
            messages: List of conversation messages

        Returns:
            Information density score (0-1)
        """
        total_words = 0
        medical_entity_count = 0

        for msg in messages:
            if msg.get("role") == "user":  # Only count student messages
                content = msg.get("content", "").lower()
                words = re.findall(r"\b\w+\b", content)
                total_words += len(words)

                # Count medical terms
                for word in words:
                    if word in self.medical_terms:
                        medical_entity_count += 1

        if total_words == 0:
            return 0.0

        return round(medical_entity_count / total_words, 3)

    def calculate_emotional_tendency(self, messages: List[Dict[str, str]]) -> float:
        """
        Calculate emotional tendency/friendliness of student's communication.
        Simplified version - in production, use sentiment analysis model.

        Args:
            messages: List of conversation messages

        Returns:
            Emotional tendency score (-1 to 1, where 1 is most friendly)
        """
        positive_words = {
            "thank",
            "understand",
            "help",
            "support",
            "appreciate",
            "sorry",
            "concerned",
            "care",
            "comfort",
            "safe",
            "better",
            "hope",
        }

        negative_words = {
            "wrong",
            "bad",
            "fault",
            "blame",
            "stupid",
            "waste",
            "annoying",
            "bother",
            "problem",
            "difficult",
            "harsh",
        }

        positive_count = 0
        negative_count = 0

        for msg in messages:
            if msg.get("role") == "user":
                content = msg.get("content", "").lower()
                words = set(re.findall(r"\b\w+\b", content))

                positive_count += len(words & positive_words)
                negative_count += len(words & negative_words)

        total = positive_count + negative_count
        if total == 0:
            return 0.0

        # Normalize to -1 to 1 scale
        score = (positive_count - negative_count) / total
        return round(score, 3)

    def calculate_response_length(self, messages: List[Dict[str, str]]) -> float:
        """
        Calculate average response length for student messages.

        Args:
            messages: List of conversation messages

        Returns:
            Average token count (approximated by word count)
        """
        student_messages = [msg for msg in messages if msg.get("role") == "user"]

        if not student_messages:
            return 0.0

        total_length = sum(
            len(msg.get("content", "").split()) for msg in student_messages
        )

        return round(total_length / len(student_messages), 2)

    def calculate_turn_number(self, messages: List[Dict[str, str]]) -> int:
        """
        Calculate total number of conversational turns.

        Args:
            messages: List of conversation messages

        Returns:
            Total turn count
        """
        return len(messages)

    def calculate_all_metrics(self, messages: List[Dict[str, str]]) -> Dict[str, float]:
        """
        Calculate all non-scoring metrics for a conversation.

        Args:
            messages: List of conversation messages

        Returns:
            Dictionary of metric names and values
        """
        return {
            "information_density": self.calculate_information_density(messages),
            "emotional_tendency": self.calculate_emotional_tendency(messages),
            "response_length": self.calculate_response_length(messages),
            "turn_number": self.calculate_turn_number(messages),
        }


# Global metrics service instance
metrics_service = MetricsService()
