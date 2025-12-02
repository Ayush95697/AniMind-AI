import React, { useEffect, useRef } from 'react';

function ChatWindow({ messages, isLoading, selectedCharacter }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="chat-container">
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
                            <div className="loading-indicator">
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
                                <div className="loading-dot"></div>
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
