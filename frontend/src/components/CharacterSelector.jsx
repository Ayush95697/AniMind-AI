import React, { useState, useEffect } from 'react';
import CharacterProfileCard from './CharacterProfileCard';
import DeveloperInfo from './DeveloperInfo';
import VoiceToggle from './VoiceToggle';
import { characters } from '../data/characters';
import { playBrowserVoice, VOICE_LINES } from '../utils/voice';
import '../styles/animations.css';

function CharacterSelector({
    selectedCharacter,
    onSelectCharacter,
    voiceEnabled,
    voiceVolume,
    onVoiceChange,
    onVolumeChange
}) {
    const [showCards, setShowCards] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [voiceCaption, setVoiceCaption] = useState(null);

    // Trigger entry animation on mount
    useEffect(() => {
        const timer = setTimeout(() => setShowCards(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Show voice caption toast
    const showVoiceCaption = (text) => {
        setVoiceCaption(text);
        setTimeout(() => {
            setVoiceCaption(null);
        }, 3000);
    };

    // Play voice and show caption when character is selected
    const playCharacterVoice = async (characterId) => {
        if (voiceEnabled) {
            const voiceLine = VOICE_LINES[characterId];
            if (voiceLine) {
                showVoiceCaption(voiceLine);
                await playBrowserVoice(characterId, { enabled: voiceEnabled, volume: voiceVolume });
            }
        }
    };

    const handleCardClick = (characterId) => {
        if (isSelecting || selectedCharacter) return;

        setIsSelecting(true);
        setSelectedCard(characterId);

        // Play voice immediately on click
        playCharacterVoice(characterId);

        // Wait for exit animation before notifying parent
        setTimeout(() => {
            onSelectCharacter(characterId);
            setIsSelecting(false);
        }, 600);
    };

    // If character is already selected, show minimal selector with profile card
    if (selectedCharacter) {
        const currentCharacter = characters.find(c => c.id === selectedCharacter);

        return (
            <div className="character-selector minimal">
                <div className="sidebar-top">
                    {/* Voice Toggle Control */}
                    <VoiceToggle
                        onVoiceChange={onVoiceChange}
                        onVolumeChange={onVolumeChange}
                    />

                    <div className="selected-character-header">
                        <img
                            src={currentCharacter?.image}
                            alt={selectedCharacter}
                            className="selected-avatar"
                        />
                        <h3>{currentCharacter?.name}</h3>
                    </div>

                    <div className="other-characters">
                        {characters.filter(c => c.id !== selectedCharacter).map((character) => (
                            <div
                                key={character.id}
                                className="mini-character-card"
                                onClick={() => {
                                    setIsSelecting(true);
                                    playCharacterVoice(character.id);
                                    setTimeout(() => {
                                        onSelectCharacter(character.id);
                                        setIsSelecting(false);
                                    }, 400);
                                }}
                            >
                                <img src={character.image} alt={character.name} />
                                <span>{character.name}</span>
                            </div>
                        ))}
                    </div>

                    <CharacterProfileCard character={currentCharacter} />
                </div>

                <DeveloperInfo />

                {/* Voice Caption Toast */}
                {voiceCaption && (
                    <div className="voice-caption">{voiceCaption}</div>
                )}
            </div>
        );
    }

    // Initial card selection view
    return (
        <div className="character-selector fullscreen">
            <h1 className="selector-title">Choose Your Character</h1>
            <div className="character-cards-grid">
                {characters.map((character, index) => (
                    <div
                        key={character.id}
                        className={`character-card card-hover enter-animation stagger-${index + 1} ${selectedCard === character.id ? 'exit-animation' : ''
                            } ${showCards ? 'visible' : ''}`}
                        onClick={() => handleCardClick(character.id)}
                        style={{ opacity: showCards ? 1 : 0 }}
                    >
                        <div className="card-image">
                            <img src={character.image} alt={character.name} />
                        </div>
                        <div className="card-content">
                            <h2>{character.name}</h2>
                            <p>{character.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CharacterSelector;
