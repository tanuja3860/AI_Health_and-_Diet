const BASE_URL = 'http://localhost:8000/api/v1';

export async function sendChatMessage(message: string, userConditions: string[] = []) {
  try {
    const response = await fetch(`${BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_conditions: userConditions,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      reply: "I'm having trouble connecting to the clinical safety backend right now.",
      safety_warnings: [],
    };
  }
}