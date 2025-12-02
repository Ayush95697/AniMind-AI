import React from 'react';

const characters = [
    {
        id: 'goku',
        name: 'Goku',
        description: 'The Saiyan warrior with boundless energy and fighting spirit',
        emoji: '🥋',
    },
    {
        id: 'vegeta',
        name: 'Vegeta',
        description: 'The prideful Saiyan prince with unmatched power',
        emoji: '👑',
    },
    {
        id: 'itachi',
        name: 'Itachi',
        description: 'The prodigy ninja with calm wisdom and sharingan',
        emoji: '🌙',
    },
];

function CharacterSelector({ selectedCharacter, onSelectCharacter }) {
    return (
        <div className="character-selector">
            <h2>Choose Your Character</h2>
            {characters.map((character) => (
                <div
                    key={character.id}
                    className={`character-card ${selectedCharacter === character.id ? 'active' : ''}`}
                    onClick={() => onSelectCharacter(character.id)}
                >
                    <div className="character-avatar">{character.emoji}</div>
                    <div className="character-name">{character.name}</div>
                    <div className="character-description">{character.description}</div>
                </div>
            ))}
        </div>
    );
}

export default CharacterSelector;
