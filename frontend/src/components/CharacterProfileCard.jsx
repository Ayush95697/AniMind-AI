import React from 'react';

function CharacterProfileCard({ character }) {
    if (!character) return null;

    return (
        <div className="character-profile-card">
            <div className="profile-card-header">
                <span className="profile-label">Character Profile</span>
            </div>

            <div className="profile-avatar-container">
                <img
                    src={character.image}
                    alt={character.name}
                    className="profile-avatar"
                />
            </div>

            <div className="profile-info">
                <h3 className="profile-name">{character.name}</h3>
                <p className="profile-title">{character.title}</p>

                <div className="profile-details">
                    <div className="profile-section">
                        <h4>Tone</h4>
                        <p>{character.tone}</p>
                    </div>

                    <div className="profile-section">
                        <h4>Best For</h4>
                        <ul className="profile-strengths">
                            {character.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                        </ul>
                    </div>

                    {character.quote && (
                        <div className="profile-quote">
                            <span className="quote-icon">"</span>
                            <p>{character.quote}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CharacterProfileCard;
