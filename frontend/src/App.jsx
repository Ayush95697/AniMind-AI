import React, { useState, useEffect } from 'react';
import CharacterSelector from './components/CharacterSelector';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { sendMessage } from './api/chatClient';
import './styles/theme.css';
import './styles/app.css';
import './styles/chat-enhancements.css';
import './styles/sidebar-components.css';

function App() {
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => crypto.randomUUID());

    // Update theme when character changes
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', selectedCharacter);
    }, [selectedCharacter]);

    const handleSendMessage = async (text) => {
        // Add user message immediately
        const userMsg = { role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const response = await sendMessage(sessionId, selectedCharacter, text);

            // Add bot response
            const botMsg = { role: 'bot', content: response.bot_message };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error('Failed to send message:', error);
            const errorMsg = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container">
            <CharacterSelector
                selectedCharacter={selectedCharacter}
                onSelectCharacter={setSelectedCharacter}
            />
            {selectedCharacter && (
                <div className="right-column" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        selectedCharacter={selectedCharacter}
                    />
                    <MessageInput
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
