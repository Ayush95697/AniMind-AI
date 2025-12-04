/**
 * Mood to Animation Mapping
 * 
 * Maps character + mood combinations to CSS animation classes
 */

export const MOOD_ANIMATIONS = {
    goku: {
        excited: 'goku-powerup',
        positive: 'goku-happy',
        neutral: 'goku-idle',
        negative: 'goku-concerned',
        angry: 'goku-intense',
        sad: 'goku-quiet'
    },
    vegeta: {
        excited: 'vegeta-pride',
        positive: 'vegeta-smirk',
        neutral: 'vegeta-idle',
        negative: 'vegeta-disdain',
        angry: 'vegeta-rage',
        sad: 'vegeta-stern'
    },
    itachi: {
        excited: 'itachi-determined',
        positive: 'itachi-calm',
        neutral: 'itachi-idle',
        negative: 'itachi-concern',
        angry: 'itachi-sharingan',
        sad: 'itachi-sorrow'
    }
};

/**
 * Get animation class for character and mood
 * @param {string} characterId - Character identifier
 * @param {string} mood - Mood category
 * @returns {string} - CSS animation class name
 */
export const getAnimationClass = (characterId, mood) => {
    const characterMoods = MOOD_ANIMATIONS[characterId];

    if (!characterMoods) {
        return 'avatar-idle';
    }

    return characterMoods[mood] || characterMoods.neutral;
};
