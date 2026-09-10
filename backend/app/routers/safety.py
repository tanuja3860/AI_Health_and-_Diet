from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter(prefix="/api/v1/safety", tags=["Clinical Safety"])

class MealCheckRequest(BaseModel):
    meal: str
    condition: str

@router.post("/evaluate")
async def evaluate_meal(request: MealCheckRequest):
    try:
        # Locate the matrix file in the root workspace directory
        matrix_path = os.path.join(os.path.dirname(__file__), "../../../food_safety_matrix.json")
        
        if not os.path.exists(matrix_path):
            # Fallback to root path
            matrix_path = "food_safety_matrix.json"

        if os.path.exists(matrix_path):
            with open(matrix_path, "r") as f:
                matrix = json.load(f)
        else:
            matrix = {}

        meal_key = request.meal.lower()
        condition_key = request.condition.lower()

        # Check safety level against matrix
        safety_data = matrix.get(meal_key, {}).get(condition_key, {
            "status": "Safe",
            "warning": "No explicit clinical risk found for this condition."
        })

        return {
            "meal": request.meal,
            "condition": request.condition,
            "evaluation": safety_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")