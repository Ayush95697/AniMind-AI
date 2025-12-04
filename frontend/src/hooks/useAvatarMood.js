import { useState, useEffect, useCallback } from 'react';
import { MOODS } from '../utils/mood';

/**
 * Hook to manage avatar mood state with auto-reset
 * @param {number} resetTimeout - Time in ms before resetting to neutral (default: 5000ms)
 * @returns {Object} - { mood, setMood, resetMood }
 */
function useAvatarMood(resetTimeout = 5000) {
    const [mood, setMoodState] = useState(MOODS.NEUTRAL);
    const [timeoutId, setTimeoutId] = useState(null);

    // Clear timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    // Set mood with auto-reset
    const setMood = useCallback((newMood) => {
        // Clear existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new mood
        setMoodState(newMood);

        // Set new timeout to reset to neutral
        if (newMood !== MOODS.NEUTRAL) {
            const id = setTimeout(() => {
                setMoodState(MOODS.NEUTRAL);
                setTimeoutId(null);
            }, resetTimeout);

            setTimeoutId(id);
        }
    }, [timeoutId, resetTimeout]);

    // Manual reset to neutral
    const resetMood = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setMoodState(MOODS.NEUTRAL);
    }, [timeoutId]);

    return {
        mood,
        setMood,
        resetMood
    };
}

export default useAvatarMood;
