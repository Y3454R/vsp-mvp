from langchain_openai import ChatOpenAI
from backend.core.config import get_settings


def get_llm_client():
    """Initialize and return OpenAI LLM client."""
    settings = get_settings()

    return ChatOpenAI(
        model=settings.openai_model,
        temperature=settings.openai_temperature,
        api_key=settings.openai_api_key,
    )
