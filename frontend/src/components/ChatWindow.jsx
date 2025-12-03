import React, { useEffect, useRef } from 'react';
import '../styles/animations.css';

function ChatWindow({ messages, isLoading, selectedCharacter }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

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
                <h1>AniMind Chat</h1>
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
