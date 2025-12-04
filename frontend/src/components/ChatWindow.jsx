import React, { useEffect, useRef } from 'react';
import CharacterAvatar from './CharacterAvatar';
import useAvatarMood from '../hooks/useAvatarMood';
import { detectMood } from '../utils/mood';
import '../styles/animations.css';

function ChatWindow({ messages, isLoading, selectedCharacter, animationsEnabled = true }) {
    const messagesEndRef = useRef(null);
    const { mood, setMood } = useAvatarMood(5000); // Reset to neutral after 5s

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Detect mood from last user message
    useEffect(() => {
        if (messages.length > 0 && animationsEnabled) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'user') {
                const detectedMood = detectMood(lastMessage.content);
                setMood(detectedMood);
            }
        }
    }, [messages, animationsEnabled, setMood]);

    // Generate particles
    const renderParticles = () => {
        return Array.from({ length: 15 }).map((_, i) => (
            <div
                key={i}
                className={`particle ${i % 3 === 0 ? 'large' : ''}`}
                style={{
                    left: `${Math.random() * 100}%`,
                    '--float-x': `${(Math.random() - 0.5) * 200}px`,
                    '--float-y': `${-700 - Math.random() * 200}px`,
                    animationDelay: `${Math.random() * 5}s`
                }}
            />
        ));
    };

    return (
        <div className="chat-container">
            {/* Floating particles container */}
            <div className="particles-container">
                {renderParticles()}
            </div>

            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Character Avatar with Mood Animation */}
                    {animationsEnabled && (
                        <CharacterAvatar
                            characterId={selectedCharacter}
                            mood={mood}
                            isSpeaking={isLoading}
                            size="medium"
                        />
                    )}
                    <h1>AniMind Chat</h1>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="message bot">
                        <div className="message-bubble">
                            Hello! I am {selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)}.
                            How can I help you today?
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <div className="message-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message bot">
                        <div className="message-bubble">
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

export default ChatWindow;
