from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from pathlib import Path
from typing import Dict, Any


def load_patient_prompt_template() -> str:
    """Load patient prompt template from file."""
    prompt_path = Path(__file__).parent.parent / "prompts" / "patient_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


def create_patient_chain(
    llm, memory: ConversationBufferMemory, case_data: Dict[str, Any]
):
    """
    Create a LangChain ConversationChain for patient simulation.

    Args:
        llm: Language model instance
        memory: Conversation memory
        case_data: Dictionary containing patient case information

    Returns:
        ConversationChain configured for patient simulation
    """
    # Load and format the patient prompt
    base_prompt = load_patient_prompt_template()

    # Format the prompt with case data
    formatted_system_prompt = base_prompt.format(
        patient_name=case_data.get("patient_name", "Unknown"),
        age=case_data.get("age", "Unknown"),
        gender=case_data.get("gender", "Unknown"),
        chief_complaint=case_data.get("chief_complaint", ""),
        condition=case_data.get("condition", ""),
        background=case_data.get("background", ""),
        symptoms=case_data.get("symptoms", ""),
        medical_history=case_data.get("medical_history", ""),
    )

    # Create the prompt template
    prompt = PromptTemplate(
        input_variables=["chat_history", "input"],
        template=formatted_system_prompt
        + "\n\nConversation History:\n{chat_history}\n\nStudent: {input}\nPatient:",
    )

    # Create and return the conversation chain
    chain = ConversationChain(llm=llm, memory=memory, prompt=prompt, verbose=False)

    return chain
