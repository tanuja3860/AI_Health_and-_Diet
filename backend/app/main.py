from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
from app.core.config import settings
from app.ai.recommendation_engine import RecommendationEngine
from app.ai.assistant import AIAssistant

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

class ProfileSchema(BaseModel):
    age: int
    height_cm: float
    weight_kg: float
    activity_level: float = 1.375
    goal: str = "maintenance"

class ChatSchema(BaseModel):
    message: str
    current_plan: Dict[str, Any] = {}

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "AI_Health_and-_Diet Engine Operational"
    }

@app.post("/api/v1/recommendations/calculate-macros")
def calculate_macros(profile: ProfileSchema):
    engine = RecommendationEngine(profile.model_dump())
    return engine.calculate_macros()

@app.post("/api/v1/assistant/chat")
def chat_with_assistant(payload: ChatSchema):
    response = AIAssistant.process_query(payload.message, payload.current_plan)
    return {"reply": response}