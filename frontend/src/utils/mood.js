/**
 * Mood Detection for AniMind Character Animations
 * 
 * Client-side mood classifier using rule-based keyword matching
 * Maps user messages to mood categories for avatar animations
 */

// Mood categories
export const MOODS = {
    EXCITED: 'excited',
    POSITIVE: 'positive',
    NEUTRAL: 'neutral',
    NEGATIVE: 'negative',
    ANGRY: 'angry',
    SAD: 'sad'
};

// Keyword mappings for each mood
const MOOD_KEYWORDS = {
    excited: [
        'awesome', 'amazing', 'yes', 'yeah', 'yay', 'wow', 'fantastic',
        'incredible', 'great', 'excellent', 'let\'s go', 'hype', 'train',
        'pumped', 'excited', 'love it', 'perfect', 'brilliant'
    ],
    angry: [
        'stupid', 'fool', 'idiot', 'hate', 'trash', 'terrible',
        'awful', 'useless', 'pathetic', 'annoying', 'angry', 'mad',
        'furious', 'rage', 'damn', 'hell', 'crap'
    ],
    sad: [
        'sad', 'depressed', 'alone', 'lonely', 'lost', 'hurt',
        'broken', 'crying', 'tears', 'miss', 'sorry', 'regret',
        'hopeless', 'empty', 'down', 'unhappy'
    ],
    positive: [
        'good', 'nice', 'thanks', 'thank you', 'appreciate', 'cool',
        'helpful', 'useful', 'interesting', 'glad', 'happy', 'pleased'
    ],
    negative: [
        'bad', 'wrong', 'problem', 'issue', 'difficult', 'hard',
        'can\'t', 'won\'t', 'don\'t like', 'dislike', 'confusing'
    ]
};

/**
 * Detect mood from text using rule-based approach
 * @param {string} text - User message text
 * @returns {string} - Mood category (excited, positive, neutral, negative, angry, sad)
 */
export const detectMood = (text) => {
    if (!text || typeof text !== 'string') {
        return MOODS.NEUTRAL;
    }

    const lowerText = text.toLowerCase();
    const hasExclamation = (text.match(/!/g) || []).length >= 1;
    const hasMultipleExclamation = (text.match(/!/g) || []).length >= 2;
    const hasQuestionMark = text.includes('?');

    // Count matches for each mood
    const moodScores = {
        excited: 0,
        angry: 0,
        sad: 0,
        positive: 0,
        negative: 0
    };

    // Score based on keyword matches
    for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
        for (const keyword of keywords) {
            if (lowerText.includes(keyword)) {
                moodScores[mood] += 1;
            }
        }
    }

    // Boost excited score if exclamation marks + positive words
    if (hasExclamation && (moodScores.excited > 0 || moodScores.positive > 0)) {
        moodScores.excited += hasMultipleExclamation ? 2 : 1;
    }

    // Boost angry score if exclamation marks + negative/angry words
    if (hasExclamation && (moodScores.angry > 0 || moodScores.negative > 0)) {
        moodScores.angry += 1;
    }

    // Penalize excitement if it's a question
    if (hasQuestionMark && moodScores.excited > 0) {
        moodScores.excited -= 1;
    }

    // Find mood with highest score
    const maxScore = Math.max(...Object.values(moodScores));

    if (maxScore === 0) {
        return MOODS.NEUTRAL;
    }

    // Priority order when scores are equal: excited > angry > sad > positive > negative
    const priority = ['excited', 'angry', 'sad', 'positive', 'negative'];

    for (const mood of priority) {
        if (moodScores[mood] === maxScore) {
            return MOODS[mood.toUpperCase()];
        }
    }

    return MOODS.NEUTRAL;
};

/**
 * Get a human-readable description of the mood
 * @param {string} mood - Mood category
 * @returns {string} - Description
 */
export const getMoodDescription = (mood) => {
    const descriptions = {
        [MOODS.EXCITED]: 'Excited & Energetic',
        [MOODS.POSITIVE]: 'Positive & Happy',
        [MOODS.NEUTRAL]: 'Calm & Neutral',
        [MOODS.NEGATIVE]: 'Negative & Concerned',
        [MOODS.ANGRY]: 'Angry & Frustrated',
        [MOODS.SAD]: 'Sad & Melancholic'
    };

    return descriptions[mood] || 'Neutral';
};

// ============================================================================
// OPTIONAL: Server-side LLM-based Mood Detection
// ============================================================================
//
// For more accurate mood detection, you can optionally call a backend endpoint
// that uses an LLM to analyze sentiment and emotional tone.
//
// Example implementation (uncomment and modify as needed):

/*
export const detectMoodAsync = async (text, fallbackToLocal = true) => {
    try {
        const response = await fetch('/api/mood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Mood detection API failed');
        }

        const data = await response.json();
        // Expected response: { mood: 'excited', confidence: 0.85 }

        return data.mood || MOODS.NEUTRAL;
    } catch (error) {
        console.error('Server mood detection error:', error);

        // Fallback to local detection
        if (fallbackToLocal) {
            return detectMood(text);
        }

        return MOODS.NEUTRAL;
    }
};
*/

// Backend endpoint example (Python/FastAPI):
//
// @app.post("/api/mood")
// async def detect_mood(request: MoodRequest):
//     """Use LLM to detect mood from text"""
//     prompt = f"Classify the emotional tone of this message into one of: excited, positive, neutral, negative, angry, sad.\n\nMessage: {request.text}\n\nMood:"
//
//     response = await llm.generate(prompt)  # Your LLM call
//     mood = response.strip().lower()
//
//     # Validate and return
//     valid_moods = ['excited', 'positive', 'neutral', 'negative', 'angry', 'sad']
//     if mood not in valid_moods:
//         mood = 'neutral'
//
//     return {"mood": mood, "confidence": 0.9}
