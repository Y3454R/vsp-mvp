from langchain.memory import ConversationBufferMemory
from typing import Dict


class ConversationMemoryManager:
    """Manages conversation memory for different sessions."""

    def __init__(self):
        self._sessions: Dict[str, ConversationBufferMemory] = {}

    def get_memory(self, session_id: str) -> ConversationBufferMemory:
        """Get or create memory for a session."""
        if session_id not in self._sessions:
            self._sessions[session_id] = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                input_key="input",
                output_key="output",
            )
        return self._sessions[session_id]

    def clear_memory(self, session_id: str) -> None:
        """Clear memory for a session."""
        if session_id in self._sessions:
            self._sessions[session_id].clear()

    def delete_session(self, session_id: str) -> None:
        """Delete a session completely."""
        if session_id in self._sessions:
            del self._sessions[session_id]

    def get_chat_history(self, session_id: str) -> list:
        """Get chat history for a session."""
        if session_id in self._sessions:
            memory = self._sessions[session_id]
            return memory.chat_memory.messages
        return []


# Global memory manager instance
memory_manager = ConversationMemoryManager()
