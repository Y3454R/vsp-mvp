from backend.core.llm_client import get_llm_client
from ai.chains.patient_chain import create_patient_chain
from ai.memory.conversation_memory import memory_manager
from backend.services.case_loader import case_loader
from typing import Optional


class ChatService:
    """Service for handling chat interactions with virtual patient."""

    def __init__(self):
        self.llm = get_llm_client()
        self._active_chains = {}

    def get_or_create_chain(self, session_id: str, case_id: str):
        """Get or create a conversation chain for a session."""
        chain_key = f"{session_id}_{case_id}"

        if chain_key not in self._active_chains:
            # Get case data
            case = case_loader.get_case(case_id)
            if not case:
                raise ValueError(f"Case {case_id} not found")

            # Get or create memory
            memory = memory_manager.get_memory(session_id)

            # Create patient chain
            chain = create_patient_chain(
                llm=self.llm, memory=memory, case_data=case.model_dump()
            )

            self._active_chains[chain_key] = chain

        return self._active_chains[chain_key]

    def send_message(self, session_id: str, case_id: str, message: str) -> str:
        """
        Send a message to the virtual patient and get a response.

        Args:
            session_id: Unique session identifier
            case_id: Case identifier
            message: User's message

        Returns:
            Patient's response
        """
        try:
            chain = self.get_or_create_chain(session_id, case_id)
            response = chain.predict(input=message)
            return response
        except Exception as e:
            raise Exception(f"Error in chat service: {str(e)}")

    def end_session(self, session_id: str, case_id: str) -> None:
        """End a chat session and clean up resources."""
        chain_key = f"{session_id}_{case_id}"

        if chain_key in self._active_chains:
            del self._active_chains[chain_key]

        memory_manager.delete_session(session_id)

    def get_chat_history(self, session_id: str) -> list:
        """Get chat history for a session."""
        return memory_manager.get_chat_history(session_id)


# Global chat service instance
chat_service = ChatService()
