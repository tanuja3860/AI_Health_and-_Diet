from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, List
from app.core.config import settings
from app.ai.recommendation_engine import RecommendationEngine
from app.ai.assistant import AIAssistant
from app.rules.clinical_matrix import GlobalClinicalEngine

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

class MultiConditionCheckSchema(BaseModel):
    title: str
    carbs_g: float = 0.0
    protein_g: float = 0.0
    sodium_mg: float = 0.0
    ingredients: List[Dict[str, str]] = []
    user_conditions: List[str]  # e.g. ["pregnancy", "diabetes", "hypertension"]

@app.get("/")
def root():
    return {"status": "online", "system": "Universal Clinical Safety AI Engine Operational"}

@app.post("/api/v1/safety/evaluate-multi-condition")
def evaluate_multi_condition(payload: MultiConditionCheckSchema):
    recipe = payload.model_dump()
    conditions = payload.user_conditions
    return GlobalClinicalEngine.evaluate_meal_safety(recipe, conditions)