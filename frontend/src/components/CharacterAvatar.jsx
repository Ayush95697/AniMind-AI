import React from 'react';
import { getAnimationClass } from '../constants/moodMap';
import { characters } from '../data/characters';

/**
 * Character Avatar Component with Dynamic Mood Animations
 * 
 * @param {string} characterId - Character identifier (goku, vegeta, itachi)
 * @param {string} mood - Current mood (excited, positive, neutral, negative, angry, sad)
 * @param {boolean} isSpeaking - Whether character is currently speaking
 * @param {string} size - Avatar size (small, medium, large)
 */
function CharacterAvatar({
    characterId,
    mood = 'neutral',
    isSpeaking = false,
    size = 'medium'
}) {
    const character = characters.find(c => c.id === characterId);

    if (!character) {
        return null;
    }

    const animationClass = getAnimationClass(characterId, mood);

    const classes = [
        'avatar',
        `avatar--${characterId}`,
        `avatar--${size}`,
        `avatar--mood-${mood}`,
        animationClass,
        isSpeaking ? 'avatar--speaking' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            <div className="avatar-wrapper">
                <img
                    src={character.image}
                    alt={`${character.name} avatar`}
                    className="avatar-image"
                />

                {/* Mood overlay effects */}
                <div className="avatar-mood-overlay" />

                {/* Speaking indicator */}
                {isSpeaking && (
                    <div className="avatar-speaking-indicator">
                        <span className="speaking-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CharacterAvatar;
