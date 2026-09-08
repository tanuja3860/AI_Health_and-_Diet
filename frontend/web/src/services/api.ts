const API_BASE_URL = "http://127.0.0.1:8000";

export interface MealCheckPayload {
  title: string;
  carbs_g: number;
  protein_g: number;
  sodium_mg: number;
  ingredients: { name: string }[];
  user_conditions: string[];
}

export async function evaluateMealSafety(payload: MealCheckPayload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/safety/evaluate-multi-condition`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}