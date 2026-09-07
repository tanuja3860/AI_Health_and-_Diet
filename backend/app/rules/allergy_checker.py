from typing import List, Dict, Any

class SafetyEngine:
    @staticmethod
    def is_recipe_safe(recipe: Dict[str, Any], user_allergens: List[str]) -> bool:
        normalized_allergens = {a.lower().strip() for a in user_allergens}
        ingredients = recipe.get("ingredients", [])

        for ing in ingredients:
            ing_allergens = [a.lower() for a in ing.get("allergens", [])]
            if any(allergen in normalized_allergens for allergen in ing_allergens):
                return False
        return True