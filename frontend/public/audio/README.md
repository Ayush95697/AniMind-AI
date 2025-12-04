# Audio Files Placeholder

This directory contains character sound effect files for AniMind.

## Required Files

Place the following audio files here:

1. **itachi.mp3** - Sharingan activation sound
   - Low hum with spinning/circular effect
   - Duration: <2 seconds
   - Format: MP3, 128kbps, 44.1kHz

2. **goku.mp3** - Ki aura / power-up sound
   - Energy rising whoosh effect
   - Duration: <2 seconds
   - Format: MP3, 128kbps, 44.1kHz

3. **vegeta.mp3** - Scouter beep / energy charge
   - Electronic beep or energy charging sound
   - Duration: <2 seconds
   - Format: MP3, 128kbps, 44.1kHz

## Where to Find Sound Effects

- **Freesound.org** (CC0/CC-BY licensed)
- **Zapsplat.com** (free tier available)
- **OpenGameArt.org** (game sound effects)
- **YouTube Audio Library** (free, no attribution)

## Search Keywords

- For Itachi: "sharingan", "activate", "hum", "spin", "whoosh", "magic circle"
- For Goku: "ki", "aura", "power up", "energy", "whoosh", "wind"
- For Vegeta: "scouter", "beep", "charge", "electric", "scan"

## Creating Custom Sounds

You can create custom sounds using **Audacity** (free):
1. Generate tones for beeps/hums
2. Add reverb and echo effects
3. Layer multiple sounds
4. Export as MP3 at 128kbps

## File Placement

Simply place the three MP3 files in this directory:
```
frontend/public/audio/
├── itachi.mp3
├── goku.mp3
└── vegeta.mp3
```

The application will automatically load and play them on character selection.
