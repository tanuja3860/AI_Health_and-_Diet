from typing import Dict, Any

class AIAssistant:
    @staticmethod
    def process_query(user_message: str, current_plan: Dict[str, Any]) -> str:
        message_lower = user_message.lower()

        if "swap" in message_lower or "replace" in message_lower:
            return "I can help replace that item. Would you prefer a low-carb alternative or a quicker recipe?"
        elif "calorie" in message_lower or "macro" in message_lower:
            return "Your current daily plan matches your target macros. Let me know if you want to adjust your goals."
        else:
            return f"I received your request: '{user_message}'. How else can I adjust your diet plan today?"