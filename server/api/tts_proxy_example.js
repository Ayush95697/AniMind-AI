/**
 * OPTIONAL: Server-side TTS Proxy Example (Node.js/Express)
 * 
 * This is a skeleton implementation showing how to integrate server-side TTS
 * (ElevenLabs, Google Cloud TTS, etc.) with local caching.
 * 
 * DO NOT USE THIS IN PRODUCTION WITHOUT PROPER CONFIGURATION.
 * 
 * Setup Instructions:
 * 1. Install dependencies: npm install express node-fetch
 * 2. Set environment variables:
 *    - ELEVENLABS_API_KEY=your_api_key
 *    - TTS_CACHE_DIR=./cache/tts
 * 3. Uncomment and modify the playServerVoice function in utils/voice.js
 * 4. Run this server alongside your backend
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
// const fetch = require('node-fetch'); // Uncomment if using

const app = express();
app.use(express.json());

// Configuration
const PORT = process.env.TTS_PORT || 8001;
const CACHE_DIR = process.env.TTS_CACHE_DIR || path.join(__dirname, '../../cache/tts');
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

// Voice ID mappings for ElevenLabs (example)
const VOICE_IDS = {
    goku: 'voice_id_1',    // Replace with actual ElevenLabs voice IDs
    vegeta: 'voice_id_2',
    itachi: 'voice_id_3'
};

// Ensure cache directory exists
async function ensureCacheDir() {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (error) {
        console.error('Failed to create cache directory:', error);
    }
}

/**
 * GET /api/tts?character=goku&line=select
 * 
 * Returns audio file (mp3) for the character's voice line.
 * Uses cache if available, otherwise calls TTS service and caches result.
 */
app.get('/api/tts', async (req, res) => {
    const { character, line = 'select' } = req.query;

    if (!character || !VOICE_IDS[character]) {
        return res.status(400).json({ error: 'Invalid character' });
    }

    try {
        // Check cache first
        const cacheKey = `${character}_${line}`;
        const cacheFile = path.join(CACHE_DIR, `${cacheKey}.mp3`);

        try {
            const cachedAudio = await fs.readFile(cacheFile);
            console.log(`[TTS] Serving cached audio for ${cacheKey}`);
            res.set('Content-Type', 'audio/mpeg');
            return res.send(cachedAudio);
        } catch (error) {
            // Cache miss, continue to generate
        }

        // Get voice text (you would map this to actual text)
        const voiceText = getVoiceText(character, line);

        if (!voiceText) {
            return res.status(404).json({ error: 'Voice line not found' });
        }

        // Call TTS service (ElevenLabs example - COMMENTED OUT)
        /*
        const audioBlob = await callElevenLabs(VOICE_IDS[character], voiceText);
        
        // Save to cache
        await fs.writeFile(cacheFile, audioBlob);
        console.log(`[TTS] Generated and cached audio for ${cacheKey}`);
        
        // Return audio
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioBlob);
        */

        // For demonstration, return error since TTS is not configured
        res.status(501).json({
            error: 'TTS service not configured',
            message: 'Uncomment and configure ElevenLabs/Google TTS integration'
        });

    } catch (error) {
        console.error('[TTS] Error:', error);
        res.status(500).json({ error: 'TTS generation failed' });
    }
});

/**
 * Call ElevenLabs TTS API (example implementation)
 */
async function callElevenLabs(voiceId, text) {
    /*
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        })
    });

    if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    return await response.buffer();
    */
    throw new Error('ElevenLabs integration not implemented');
}

/**
 * Get voice text for character and line
 */
function getVoiceText(character, line) {
    const texts = {
        goku: {
            select: "Let's go! Time to train!",
            // Add more lines as needed
        },
        vegeta: {
            select: "Tch. Let's see what you've got.",
        },
        itachi: {
            select: "Speak. I am listening.",
        }
    };

    return texts[character]?.[line] || null;
}

// Start server
ensureCacheDir().then(() => {
    app.listen(PORT, () => {
        console.log(`[TTS Proxy] Server running on port ${PORT}`);
        console.log(`[TTS Proxy] Cache directory: ${CACHE_DIR}`);

        if (!ELEVENLABS_API_KEY) {
            console.warn('[TTS Proxy] WARNING: ELEVENLABS_API_KEY not set. TTS will not work.');
        }
    });
});

// ============================================================================
// SECURITY NOTES
// ============================================================================
//
// 1. API Key Management:
//    - NEVER commit API keys to git
//    - Use environment variables (.env file with dotenv package)
//    - Rotate keys regularly
//
// 2. Rate Limiting:
//    - Implement rate limiting to prevent abuse (use express-rate-limit)
//    - Cache aggressively to minimize API calls
//
// 3. Cost Management:
//    - Monitor TTS API usage and costs
//    - Set up billing alerts
//    - Implement usage quotas per user if needed
//
// 4. Privacy:
//    - Do not log sensitive user data
//    - Inform users that audio is generated via third-party service
//    - Consider GDPR/privacy regulations
//
// 5. Error Handling:
//    - Graceful fallback to browser TTS if server TTS fails
//    - Return appropriate HTTP status codes
//    - Log errors server-side for debugging
