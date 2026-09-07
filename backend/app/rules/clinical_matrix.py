from typing import Dict, Any, List

class GlobalClinicalEngine:
    # Master medical restriction database
    CONDITION_RULES = {
        "pregnancy": {
            "forbidden_ingredients": ["raw fish", "sushi", "unpasteurized milk", "soft cheese", "swordfish", "king mackerel", "raw egg"],
            "max_carbs": None,
            "max_sodium_mg": None
        },
        "diabetes": {
            "forbidden_ingredients": ["refined sugar", "high fructose corn syrup"],
            "max_carbs": 45.0,  # Per meal carb cap
            "min_protein": 15.0  # Protein buffer for blood sugar control
        },
        "hypertension": {
            "forbidden_ingredients": ["cured meat", "soy sauce", "canned soup"],
            "max_sodium_mg": 500.0  # Low sodium target per meal
        },
        "kidney_disease": {
            "forbidden_ingredients": ["banana", "spinach", "processed cheese", "nuts"], # High potassium/phosphorus limits
            "max_protein": 25.0,  # Protein cap for kidney strain
            "max_sodium_mg": 400.0
        },
        "celiac": {
            "forbidden_ingredients": ["wheat", "barley", "rye", "bread", "pasta"],
            "max_carbs": None
        }
    }

    @classmethod
    def evaluate_meal_safety(cls, recipe: Dict[str, Any], user_conditions: List[str]) -> Dict[str, Any]:
        title = recipe.get("title", "").lower()
        ingredients = [i.get("name", "").lower() for i in recipe.get("ingredients", [])]
        carbs = recipe.get("carbs_g", 0)
        protein = recipe.get("protein_g", 0)
        sodium = recipe.get("sodium_mg", 0)

        violations = []

        for cond in user_conditions:
            cond_key = cond.lower().strip()
            rule = cls.CONDITION_RULES.get(cond_key)
            if not rule:
                continue

            # Check ingredient restrictions
            for forbidden in rule.get("forbidden_ingredients", []):
                if forbidden in title or any(forbidden in ing for ing in ingredients):
                    violations.append(f"[{cond.title()}] Contains restricted ingredient: {forbidden}")

            # Check macro/micro limits
            if rule.get("max_carbs") and carbs > rule["max_carbs"]:
                violations.append(f"[{cond.title()}] Exceeds maximum carbs ({rule['max_carbs']}g per meal)")

            if rule.get("min_protein") and protein < rule["min_protein"]:
                violations.append(f"[{cond.title()}] Below required minimum protein ({rule['min_protein']}g)")

            if rule.get("max_protein") and protein > rule["max_protein"]:
                violations.append(f"[{cond.title()}] Exceeds protein limit ({rule['max_protein']}g)")

            if rule.get("max_sodium_mg") and sodium > rule["max_sodium_mg"]:
                violations.append(f"[{cond.title()}] Exceeds sodium limit ({rule['max_sodium_mg']}mg)")

        if violations:
            return {"safe": False, "violations": violations}

        return {"safe": True, "message": "Meal passes all active personal clinical constraints"}