import React, { useState } from 'react';

function MessageInput({ onSendMessage, isLoading }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="message-input-container">
            <form className="message-input-wrapper" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="message-input"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" className="send-button" disabled={isLoading || !message.trim()}>
                    {isLoading ? '...' : 'Send'}
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
