import React, { useState } from 'react';
import { isSoundSupported } from '../utils/sfx';
import usePersistentState from '../hooks/usePersistentState';
import '../styles/sound.css';

/**
 * Sound Effects Toggle Component
 * Controls sound effect playback settings with localStorage persistence
 */
function SoundToggle({ onSoundChange, onVolumeChange }) {
    const [soundEnabled, setSoundEnabled] = usePersistentState('animind-sound-enabled', true);
    const [volume, setVolume] = usePersistentState('animind-sound-volume', 0.7);
    const [showSettings, setShowSettings] = useState(false);
    const supported = isSoundSupported();

    const handleToggle = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        if (onSoundChange) {
            onSoundChange(newValue);
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
            <div className="sound-toggle unsupported">
                <span className="sound-icon">🔇</span>
                <span className="sound-label">Sound not supported</span>
            </div>
        );
    }

    return (
        <div className="sound-toggle-container">
            <div className="sound-toggle">
                <div className="sound-toggle-main">
                    <button
                        className={`sound-toggle-button ${soundEnabled ? 'enabled' : 'disabled'}`}
                        onClick={handleToggle}
                        title="Play character sound effects on selection"
                    >
                        <span className="sound-icon">{soundEnabled ? '🔊' : '🔇'}</span>
                        <span className="sound-label">Sound FX</span>
                    </button>

                    {soundEnabled && (
                        <button
                            className="settings-button"
                            onClick={() => setShowSettings(!showSettings)}
                            title="Sound settings"
                        >
                            ⚙️
                        </button>
                    )}
                </div>

                {soundEnabled && showSettings && (
                    <div className="sound-settings">
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

            <p className="sound-tooltip">
                {soundEnabled
                    ? 'Sound effects enabled'
                    : 'Enable character sound effects'}
            </p>
        </div>
    );
}

export default SoundToggle;
