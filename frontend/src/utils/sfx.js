/**
 * Sound Effects System for AniMind
 * 
 * HTML5 audio-based sound effects for character selection
 * Replaces TTS voice system with anime-style audio cues
 */

// Character sound effect file mappings
export const SOUND_EFFECTS = {
    goku: '/audio/goku.mp3',      // Ki aura rising / power-up whoosh
    vegeta: '/audio/vegeta.mp3',  // Scouter beep / energy charge
    itachi: '/audio/itachi.mp3'   // Sharingan activation (low hum + spin)
};

// Audio instances cache for preloading
const audioCache = {};

/**
 * Preload audio files for instant playback
 */
export const preloadSounds = () => {
    Object.entries(SOUND_EFFECTS).forEach(([character, path]) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audioCache[character] = audio;
    });
};

/**
 * Play sound effect for character selection
 * @param {string} characterId - Character identifier (goku, vegeta, itachi)
 * @param {Object} options - Playback options
 * @param {boolean} options.enabled - Whether sound is enabled
 * @param {number} options.volume - Volume level (0.0 - 1.0)
 * @returns {Promise<boolean>} - True if played, false if skipped/failed
 */
export const playSFX = async (characterId, { enabled = true, volume = 1.0 } = {}) => {
    // Check if enabled
    if (!enabled) {
        return false;
    }

    const soundPath = SOUND_EFFECTS[characterId];

    if (!soundPath) {
        console.warn(`No sound effect found for character: ${characterId}`);
        return false;
    }

    try {
        // Use cached audio or create new instance
        let audio = audioCache[characterId];

        if (!audio) {
            audio = new Audio(soundPath);
            audioCache[characterId] = audio;
        }

        // Reset to beginning if already playing
        audio.currentTime = 0;
        audio.volume = Math.max(0, Math.min(1, volume)); // Clamp 0-1

        // Play and return promise
        await audio.play();
        return true;
    } catch (error) {
        // Handle autoplay restrictions or file not found
        console.error('Error playing sound effect:', error);
        return false;
    }
};

/**
 * Stop any currently playing sound effects
 */
export const stopSFX = () => {
    Object.values(audioCache).forEach(audio => {
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
};

/**
 * Check if browser supports HTML5 audio
 * @returns {boolean}
 */
export const isSoundSupported = () => {
    return typeof Audio !== 'undefined';
};

/**
 * Set volume for all cached audio instances
 * @param {number} volume - Volume level (0.0 - 1.0)
 */
export const setGlobalVolume = (volume) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    Object.values(audioCache).forEach(audio => {
        if (audio) {
            audio.volume = clampedVolume;
        }
    });
};

// Preload sounds when module loads (non-blocking)
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Delay preload slightly to not block initial page load
        setTimeout(preloadSounds, 500);
    });
}
