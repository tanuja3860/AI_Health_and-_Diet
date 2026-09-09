import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Import the authentication router
from app.routers import auth

app = FastAPI(title="Clinical AI Health API")

# Enable CORS for Next.js Web and React Native Mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication Routes
app.include_router(auth.router)

# Path pointing directly to root data/allergens/ directory
DATASET_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "data", "allergens", "food_safety_matrix.json")
)

def load_safety_dataset():
    if os.path.exists(DATASET_PATH):
        try:
            with open(DATASET_PATH, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []

# Pydantic Schemas
class Ingredient(BaseModel):
    name: str

class MealEvaluationRequest(BaseModel):
    title: str
    carbs_g: float
    protein_g: float
    sodium_mg: float
    user_conditions: List[str]
    ingredients: List[Ingredient]

# Endpoints
@app.get("/")
def health_check():
    dataset_loaded = os.path.exists(DATASET_PATH)
    return {
        "status": "online",
        "dataset_active": dataset_loaded,
        "message": "Clinical AI Health Safety Engine Ready"
    }

@app.get("/api/v1/conditions")
def get_clinical_conditions():
    """Returns supported clinical conditions for mobile & web profile setup."""
    return [
        {"id": "hypertension", "label": "Hypertension"},
        {"id": "type_2_diabetes", "label": "Type 2 Diabetes"},
        {"id": "celiac", "label": "Celiac Disease"},
        {"id": "kidney_disease", "label": "Chronic Kidney Disease"},
        {"id": "coronary_artery", "label": "Coronary Artery Disease"},
        {"id": "gout", "label": "Gout"},
        {"id": "ibs", "label": "Irritable Bowel Syndrome (IBS)"},
        {"id": "lactose_intolerance", "label": "Lactose Intolerance"},
        {"id": "peanut_allergy", "label": "Peanut Allergy"},
        {"id": "hyperlipidemia", "label": "Hyperlipidemia"}
    ]

@app.post("/api/v1/evaluate-safety")
def evaluate_meal_safety(request: MealEvaluationRequest):
    dataset = load_safety_dataset()
    warnings = []
    status = "SAFE"

    # Evaluate ingredients against clinical dataset
    for item in request.ingredients:
        ing_name = item.name.lower()
        for record in dataset:
            if record.get("ingredient", "").lower() in ing_name:
                for cond in request.user_conditions:
                    if cond in record.get("forbidden_conditions", []):
                        risk = record.get("risk_level", "MODERATE")
                        if risk in ["CRITICAL", "HIGH"]:
                            status = "HAZARDOUS"
                        elif status != "HAZARDOUS":
                            status = "WARNING"

                        warnings.append({
                            "ingredient": item.name,
                            "condition": cond,
                            "risk_level": risk,
                            "clinical_note": record.get("clinical_note", "Risk identified for user condition.")
                        })

    # Nutritional macro constraints
    if "hypertension" in request.user_conditions and request.sodium_mg > 400:
        if status != "HAZARDOUS":
            status = "WARNING"
        warnings.append({
            "ingredient": "Sodium Content",
            "condition": "hypertension",
            "risk_level": "HIGH",
            "clinical_note": "Sodium content exceeds safe single-meal ceiling (400mg) for hypertensive profiles."
        })

    return {
        "status": status,
        "warnings_count": len(warnings),
        "warnings": warnings
    }