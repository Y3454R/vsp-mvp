from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from pathlib import Path
from typing import Dict, Any, List
import json


def load_evaluation_prompt_template() -> str:
    """Load evaluation prompt template from file."""
    prompt_path = Path(__file__).parent.parent / "prompts" / "evaluation_prompt.txt"
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


def format_transcript(messages: List[Dict[str, str]]) -> str:
    """Format chat messages into a readable transcript."""
    transcript = ""
    for msg in messages:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")

        if role == "user":
            transcript += f"Student: {content}\n\n"
        elif role == "assistant":
            transcript += f"Patient: {content}\n\n"

    return transcript


def create_evaluation_chain(
    llm, case_data: Dict[str, Any], messages: List[Dict[str, str]]
):
    """
    Create a LangChain LLMChain for evaluating student performance.

    Args:
        llm: Language model instance
        case_data: Dictionary containing patient case information
        messages: List of chat messages

    Returns:
        Evaluation results as a dictionary
    """
    # Load the evaluation prompt
    base_prompt = load_evaluation_prompt_template()

    # Create case summary
    case_summary = f"""
Patient: {case_data.get('patient_name', 'Unknown')}, {case_data.get('age', 'Unknown')} year old {case_data.get('gender', 'Unknown')}
Condition: {case_data.get('condition', 'Unknown')}
Chief Complaint: {case_data.get('chief_complaint', 'Unknown')}
Key Symptoms: {case_data.get('symptoms', 'Unknown')}
    """.strip()

    # Format the transcript
    transcript = format_transcript(messages)

    # Create the prompt
    prompt = PromptTemplate(
        input_variables=["case_summary", "transcript"], template=base_prompt
    )

    # Create the chain
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)

    # Run evaluation
    result = chain.run(case_summary=case_summary, transcript=transcript)

    # Parse the JSON result
    try:
        # Try to extract JSON from the result
        result = result.strip()
        if result.startswith("```json"):
            result = result[7:]
        if result.endswith("```"):
            result = result[:-3]
        result = result.strip()

        evaluation = json.loads(result)
        return evaluation
    except json.JSONDecodeError as e:
        # If parsing fails, return a default structure
        return {
            "error": "Failed to parse evaluation",
            "raw_result": result,
            "overall_score": 0,
        }
