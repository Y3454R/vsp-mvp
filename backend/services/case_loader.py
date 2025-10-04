import json
from pathlib import Path
from typing import Dict, List, Optional
from backend.models.case import Case


class CaseLoader:
    """Service for loading and managing medical cases."""

    def __init__(self):
        self.cases_dir = Path(__file__).parent.parent / "data" / "cases"
        self._cases_cache: Optional[Dict[str, Case]] = None

    def load_all_cases(self) -> Dict[str, Case]:
        """Load all cases from the data directory."""
        if self._cases_cache is not None:
            return self._cases_cache

        cases = {}

        if not self.cases_dir.exists():
            return cases

        for case_file in self.cases_dir.glob("*.json"):
            try:
                with open(case_file, "r", encoding="utf-8") as f:
                    case_data = json.load(f)
                    case = Case(**case_data)
                    cases[case.id] = case
            except Exception as e:
                print(f"Error loading case {case_file}: {e}")

        self._cases_cache = cases
        return cases

    def get_case(self, case_id: str) -> Optional[Case]:
        """Get a specific case by ID."""
        cases = self.load_all_cases()
        return cases.get(case_id)

    def get_all_cases_list(self) -> List[Case]:
        """Get all cases as a list."""
        cases = self.load_all_cases()
        return list(cases.values())

    def reload_cases(self) -> None:
        """Force reload of cases from disk."""
        self._cases_cache = None
        self.load_all_cases()


# Global case loader instance
case_loader = CaseLoader()
