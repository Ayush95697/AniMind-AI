/**
 * Voice System for AniMind
 * 
 * Browser-based Text-to-Speech using Web Speech API
 * Character-specific voice lines and tuning parameters
 * 
 * LEGAL NOTE: This uses browser synthesis with parameter tuning only.
 * Do not attempt to clone or distribute real actor voices.
 * For commercial TTS (ElevenLabs), use server-side calls with secure API keys.
 */

// Character voice lines - keep short (max 3 seconds)
export const VOICE_LINES = {
    goku: "Let's go! Time to train!",
    vegeta: "Tch. Let's see what you've got.",
    itachi: "Speak. I am listening."
};

// Character-specific voice tuning
const VOICE_TUNING = {
    goku: {
        pitch: 1.2,      // Higher, upbeat
        rate: 1.05,      // Slightly faster
        voicePreference: ['Google US English', 'Microsoft David', 'Alex']
    },
    vegeta: {
        pitch: 0.95,     // Deeper, harsher
        rate: 0.95,      // Slightly slower, more deliberate
        voicePreference: ['Google UK English Male', 'Microsoft Mark', 'Daniel']
    },
    itachi: {
        pitch: 0.85,     // Deep, calm
        rate: 0.9,       // Slower, measured
        voicePreference: ['Google US English', 'Microsoft David', 'Bruce']
    }
};

/**
 * Get available voices from browser
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export const getAvailableVoices = () => {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis?.getVoices() || [];

        if (voices.length > 0) {
            resolve(voices);
        } else {
            // Voices might not be loaded yet
            window.speechSynthesis.onvoiceschanged = () => {
                resolve(window.speechSynthesis.getVoices());
            };
        }
    });
};

/**
 * Select best voice for character from available voices
 * @param {string} characterId 
 * @param {SpeechSynthesisVoice[]} voices 
 * @returns {SpeechSynthesisVoice|null}
 */
const selectVoice = (characterId, voices) => {
    const tuning = VOICE_TUNING[characterId];
    if (!tuning) return null;

    // Try to find preferred voices
    for (const pref of tuning.voicePreference) {
        const voice = voices.find(v => v.name.includes(pref));
        if (voice) return voice;
    }

    // Fallback: English voice
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
};

/**
 * Play voice line using browser TTS
 * @param {string} characterId - Character identifier (goku, vegeta, itachi)
 * @param {Object} options - Playback options
 * @param {boolean} options.enabled - Whether voice is enabled
 * @param {number} options.volume - Volume level (0.0 - 1.0)
 * @returns {Promise<boolean>} - True if played, false if skipped/failed
 */
export const playBrowserVoice = async (characterId, { enabled = true, volume = 1.0 } = {}) => {
    // Check if enabled and supported
    if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) {
        return false;
    }

    const voiceLine = VOICE_LINES[characterId];
    const tuning = VOICE_TUNING[characterId];

    if (!voiceLine || !tuning) {
        console.warn(`No voice line or tuning found for character: ${characterId}`);
        return false;
    }

    try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Get available voices
        const voices = await getAvailableVoices();
        const selectedVoice = selectVoice(characterId, voices);

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(voiceLine);
        utterance.pitch = tuning.pitch;
        utterance.rate = tuning.rate;
        utterance.volume = Math.max(0, Math.min(1, volume)); // Clamp 0-1

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Return promise that resolves when speech ends
        return new Promise((resolve) => {
            utterance.onend = () => resolve(true);
            utterance.onerror = (error) => {
                console.error('Speech synthesis error:', error);
                resolve(false);
            };

            window.speechSynthesis.speak(utterance);
        });
    } catch (error) {
        console.error('Error playing voice:', error);
        return false;
    }
};

/**
 * Stop any ongoing voice playback
 */
export const stopVoice = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};

/**
 * Check if browser supports Web Speech API
 * @returns {boolean}
 */
export const isVoiceSupported = () => {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// ============================================================================
// OPTIONAL: Server-side TTS Integration (ElevenLabs, Google Cloud TTS, etc.)
// ============================================================================
//
// If you want to use higher-quality server-side TTS:
//
// 1. Create a backend endpoint: POST /api/tts
//    - Request: { character: 'goku', line: 'select' }
//    - Response: audio/mpeg stream or audio file URL
//
// 2. Implement caching on server to avoid repeated API calls:
//    - Cache key: `${characterId}_${lineId}`
//    - Store audio files in /cache directory
//
// 3. Example function (uncomment and modify as needed):

/*
export const playServerVoice = async (characterId, { enabled = true, volume = 1.0 } = {}) => {
    if (!enabled) return false;

    try {
        const response = await fetch(`/api/tts?character=${characterId}&line=select`);

        if (!response.ok) {
            throw new Error('Failed to fetch TTS audio');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        const audio = new Audio(audioUrl);
        audio.volume = volume;

        return new Promise((resolve) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve(true);
            };
            audio.onerror = () => {
                URL.revokeObjectURL(audioUrl);
                resolve(false);
            };
            audio.play();
        });
    } catch (error) {
        console.error('Server TTS error:', error);
        return false;
    }
};
*/

// 4. Security notes for server TTS:
//    - Store API keys in environment variables (never commit to git)
//    - Implement rate limiting to prevent abuse
//    - Consider cost implications of TTS API usage
//    - Notify users that audio is fetched from third-party service
