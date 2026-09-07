from typing import Dict, Any, List

class RecommendationEngine:
    def __init__(self, profile: Dict[str, Any]):
        self.profile = profile

    def calculate_macros(self) -> Dict[str, float]:
        weight = self.profile.get("weight_kg", 70)
        height = self.profile.get("height_cm", 170)
        age = self.profile.get("age", 25)
        
        # Basal Metabolic Rate (BMR)
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
        tdee = bmr * self.profile.get("activity_level", 1.375)
        
        goal = self.profile.get("goal", "maintenance")
        if goal == "weight_loss":
            tdee -= 500
        elif goal == "muscle_gain":
            tdee += 300

        return {
            "calories": round(tdee, 2),
            "protein_g": round((tdee * 0.3) / 4, 2),
            "carbs_g": round((tdee * 0.4) / 4, 2),
            "fats_g": round((tdee * 0.3) / 9, 2)
        }