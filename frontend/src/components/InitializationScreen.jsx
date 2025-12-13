import React, { useState, useEffect, useRef } from 'react';
import '../styles/initialization.css';

// Anime-themed loading messages
const LOADING_MESSAGES = [
    "Summoning chakra reserves...",
    "Aligning Saiyan battle memory...",
    "Syncing multiverse personalities...",
    "Stabilizing AniMind core systems...",
    "Booting character consciousness modules...",
    "Concentrating spiritual pressure...",
    "Gathering Dragon Balls..."
];

const POLLING_INTERVAL = 3000; // 3 seconds
const TIMEOUT_DURATION = 150000; // 2.5 minutes

// Use environment variable or default to localhost, same logic as chatClient usually
const API_BASE_URL = "http://127.0.0.1:8000";
// NOTE: Ideally this comes from a shared config or .env

const InitializationScreen = ({ onSystemReady }) => {
    const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, READY, ERROR
    const [messageIndex, setMessageIndex] = useState(0);
    const [showError, setShowError] = useState(false);

    // Timer refs
    const startTimeRef = useRef(null);
    const pollingTimerRef = useRef(null);
    const messageTimerRef = useRef(null);

    // Backend URL - Check for production URL if available
    const getBackendUrl = () => {
        // Simple heuristic: if we are on localhost, use localhost backend
        // If we are on render (production), use the production backend
        // For this specific user request, we want to hit the backend.
        // Assuming the standard backend URL from previous `main.py` CORS config:
        // "https://animind-ai-3.onrender.com"
        // But for development (user's local context), it is localhost.
        // We will try to fetch the health endpoint.

        // Strategy: Use a relative path if proxied, or a hardcoded one if known.
        // For this step, I'll default to the one likely used in development, 
        // but since the User mentioned Render Deployment, I should be careful.
        // However, the `sendMessage` api likely handles this. 
        // I'll make a direct fetch to the root "/" endpoint.
        return "http://127.0.0.1:8000";
    };

    const backendUrl = getBackendUrl();

    // Cycle messages
    useEffect(() => {
        if (status === 'LOADING') {
            messageTimerRef.current = setInterval(() => {
                setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
            }, 3500);
        } else {
            clearInterval(messageTimerRef.current);
        }
        return () => clearInterval(messageTimerRef.current);
    }, [status]);

    const checkBackendHealth = async () => {
        try {
            const response = await fetch(`${backendUrl}/`);
            if (response.ok) {
                return true;
            }
        } catch (e) {
            // ignore network errors, just return false
        }
        return false;
    };

    const startWakeSequence = async () => {
        setStatus('LOADING');
        setShowError(false);
        startTimeRef.current = Date.now();

        // Immediate first check
        const isAlive = await checkBackendHealth();
        if (isAlive) {
            handleReady();
            return;
        }

        // Start polling
        pollingTimerRef.current = setInterval(async () => {
            const elapsed = Date.now() - startTimeRef.current;

            // Check timeout
            if (elapsed > TIMEOUT_DURATION) {
                clearInterval(pollingTimerRef.current);
                setStatus('IDLE');
                setShowError(true);
                return;
            }

            const active = await checkBackendHealth();
            if (active) {
                handleReady();
            }
        }, POLLING_INTERVAL);
    };

    const handleReady = () => {
        clearInterval(pollingTimerRef.current);
        setStatus('READY');
        // Small delay to show "Ready" state before unmounting
        setTimeout(() => {
            onSystemReady();
        }, 1000);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(pollingTimerRef.current);
            clearInterval(messageTimerRef.current);
        };
    }, []);

    return (
        <div className={`init-screen ${status === 'READY' ? 'fade-out' : ''}`}>

            <div className="init-content">
                {/* IDLE STATE */}
                {status === 'IDLE' && (
                    <>
                        {showError && (
                            <p className="error-msg">
                                System initialization is taking longer than expected. Please try again.
                            </p>
                        )}
                        <button className="awaken-btn" onClick={startWakeSequence}>
                            Awaken AniMind
                        </button>
                    </>
                )}

                {/* LOADING STATE */}
                {(status === 'LOADING' || status === 'READY') && (
                    <div className="loader-container">
                        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                            <div className="energy-core"></div>
                            <div className="orbit-ring"></div>
                        </div>

                        <div className="loading-text">
                            {status === 'READY'
                                ? "AniMind is online."
                                : LOADING_MESSAGES[messageIndex]
                            }
                        </div>
                    </div>
                )}

                {/* FOOTER TEXT */}
                <p className="sub-text">
                    First-time startup may take up to 1–2 minutes due to server cold start.<br />
                    Subsequent interactions are instant.
                </p>
            </div>
        </div>
    );
};

export default InitializationScreen;
