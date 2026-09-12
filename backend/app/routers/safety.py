import json
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Union

router = APIRouter(prefix="/api/v1/safety", tags=["Safety"])

MATRIX_FILE = os.path.join(os.path.dirname(__file__), "..", "food_safety_matrix.json")

def load_matrix():
    if os.path.exists(MATRIX_FILE):
        with open(MATRIX_FILE, "r") as f:
            return json.load(f)
    return {}

class SafetyCheckRequest(BaseModel):
    meal: str
    conditions: Union[List[str], str]

# Common conversational greetings to catch before evaluating as food
GREETINGS = {"hi", "hii", "hello", "hey", "hola", "good morning", "good evening", "what can you do"}

@router.post("/evaluate")
async def evaluate_safety(request: SafetyCheckRequest):
    meal = request.meal.strip().lower()
    conditions = request.conditions if isinstance(request.conditions, list) else [request.conditions]

    # Handle standard chat greetings directly
    if meal in GREETINGS:
        cond_str = ", ".join(conditions) if conditions else "None"
        reply = (
            f"Hello! 👋 I'm your Clinical AI Assistant. Your active profile is currently set to: [{cond_str}]. "
            "You can type any food, ingredient, or meal (e.g., 'Grapefruit', 'Soy Sauce', 'Eggs') and I'll evaluate its clinical safety for you!"
        )
        return {"status": "CHAT", "reply": reply}

    # Evaluate food safety matrix for actual items
    matrix = load_matrix()
    warnings = []
    status = "SAFE"

    for item_key, item_data in matrix.get("foods", {}).items():
        if item_key.lower() in meal or meal in item_key.lower():
            for cond in conditions:
                cond_clean = cond.lower()
                if cond_clean in item_data.get("risk_conditions", {}):
                    risk = item_data["risk_conditions"][cond_clean]
                    status = risk.get("level", "WARNING")
                    warnings.append(f"• [{cond.upper()}]: {risk.get('reason', 'Exercise caution.')}")

    if warnings:
        reply = f"⚠️ Clinical Warning for '{request.meal.title()}':\n" + "\n".join(warnings)
    else:
        reply = f"✅ '{request.meal.title()}' is evaluated as SAFE for your active profile [{', '.join(conditions)}]. No elevated clinical risks found."

    return {"status": status, "reply": reply}