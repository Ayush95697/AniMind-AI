import React, { useState } from 'react';
import { isVoiceSupported } from '../utils/voice';
import usePersistentState from '../hooks/usePersistentState';
import '../styles/voice.css';

/**
 * Voice Toggle Component
 * Controls voice playback settings with localStorage persistence
 */
function VoiceToggle({ onVoiceChange, onVolumeChange }) {
    const [voiceEnabled, setVoiceEnabled] = usePersistentState('animind-voice-enabled', false);
    const [volume, setVolume] = usePersistentState('animind-voice-volume', 1.0);
    const [showSettings, setShowSettings] = useState(false);
    const supported = isVoiceSupported();

    const handleToggle = () => {
        const newValue = !voiceEnabled;
        setVoiceEnabled(newValue);
        if (onVoiceChange) {
            onVoiceChange(newValue);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (onVolumeChange) {
            onVolumeChange(newVolume);
        }
    };

    if (!supported) {
        return (
            <div className="voice-toggle unsupported">
                <span className="voice-icon">🔇</span>
                <span className="voice-label">Voice not supported</span>
            </div>
        );
    }

    return (
        <div className="voice-toggle-container">
            <div className="voice-toggle">
                <div className="voice-toggle-main">
                    <button
                        className={`voice-toggle-button ${voiceEnabled ? 'enabled' : 'disabled'}`}
                        onClick={handleToggle}
                        title="Play short character voice cues on character selection"
                    >
                        <span className="voice-icon">{voiceEnabled ? '🔊' : '🔇'}</span>
                        <span className="voice-label">Voice</span>
                    </button>

                    {voiceEnabled && (
                        <button
                            className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}
                            title="Voice settings"
                        >
                            ⚙️
                        </button>
                    )}
                </div>

                {voiceEnabled && showSettings && (
                    <div className="voice-settings">
                        <label className="volume-label">
                            <span>Volume</span>
                            <div className="volume-control">
                                <span className="volume-icon">🔉</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="volume-slider"
                                />
                                <span className="volume-value">{Math.round(volume * 100)}%</span>
                            </div>
                        </label>
                    </div>
                )}
            </div>

            <p className="voice-tooltip">
                {voiceEnabled
                    ? 'Characters will speak when selected'
                    : 'Enable to hear character voices'}
            </p>
        </div>
    );
}

export default VoiceToggle;

// Export values for parent components
export { usePersistentState };
