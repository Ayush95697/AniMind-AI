/**
 * API client for AniMind chatbot backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Send a message to the chatbot
 * @param {string} sessionId - Unique session identifier
 * @param {string} character - Character name (goku, vegeta, itachi)
 * @param {string} userMessage - User's message
 * @returns {Promise<Object>} Bot response
 */
export async function sendMessage(sessionId, character, userMessage) {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId,
                character: character.toLowerCase(),
                user_message: userMessage,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}
