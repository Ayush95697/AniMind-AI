# 🎭 AniMind AI

<div align="center">

![AniMind Banner](https://img.shields.io/badge/AniMind-AI%20Chatbot-orange?style=for-the-badge&logo=react)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

**An immersive anime-themed AI chatbot featuring iconic characters with distinct personalities**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

AniMind is an interactive AI chatbot that brings your favorite anime characters to life! Chat with **Goku**, **Vegeta**, or **Itachi**, each with their own unique personality, speaking style, and visual theme. The application combines modern web technologies with AI to create an engaging, immersive experience.

### Why AniMind?

- 🎯 **Character-Specific Personalities**: Each character responds authentically to their persona
- 🎨 **Dynamic Theming**: UI transforms based on selected character
- 🎭 **Mood-Reactive Animations**: Avatar animations respond to conversation sentiment
- 🔊 **Anime Sound Effects**: Immersive audio cues on character selection
- 💾 **Persistent Chat History**: Conversations saved across character switches
- ⚡ **Real-Time Responses**: Fast, context-aware AI responses

---

## ✨ Features

### 🎬 Character System

- **Goku** - The cheerful Saiyan warrior with boundless energy
  - Motivational and encouraging responses
  - Orange/gold visual theme with Ki aura effects
  - Perfect for gym advice and positive encouragement

- **Vegeta** - The prideful Saiyan Prince
  - Harsh, direct, and brutally honest
  - Purple/royal theme with energy surge animations
  - Ideal for no-nonsense motivation

- **Itachi** - The calm, philosophical ninja prodigy
  - Deep wisdom and emotional support
  - Red/dark theme with Sharingan effects
  - Great for life advice and strategic thinking

### 🎨 Visual Features

- **Dynamic Theming**: Each character has a unique color palette and visual style
- **Mood Animations**: Avatar reacts to message sentiment (excited, angry, sad, neutral)
- **Particle Effects**: Floating particles and background animations
- **Smooth Transitions**: Polished character switching animations
- **Responsive Design**: Works seamlessly on desktop and mobile

### 🔊 Audio Experience

- **Sound Effects**: Character-specific audio cues (Sharingan, Ki aura, Scouter beep)
- **Volume Control**: Adjustable sound with persistent settings
- **Toggle On/Off**: Complete control over audio playback

### 🧠 AI Features

- **Context-Aware**: Maintains conversation context
- **Personality Consistency**: Responses match character traits
- **Mood Detection**: Client-side sentiment analysis for animations
- **Session Persistence**: Chat history preserved during character switches

---

## 🎥 Demo

### Character Selection
```
Choose between Goku, Vegeta, or Itachi
Each with unique arrival animations and sound effects
```

### Chat Interface
```
Real-time messaging with character-specific responses
Mood-reactive avatar animations
Persistent chat history across sessions
```

### Settings
```
Sound effects toggle with volume control
Animation preferences
Dark anime-themed UI
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush95697/AniMind-AI.git
   cd AniMind-AI
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your API keys
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here  # Optional
   ```

4. **Run the backend server**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add audio files** (Optional but recommended)
   - Download or create anime sound effects (<2s each)
   - Place in `frontend/public/audio/`:
     - `goku.mp3` - Ki aura sound
     - `vegeta.mp3` - Scouter beep
     - `itachi.mp3` - Sharingan activation
   - See [`frontend/public/audio/README.md`](frontend/public/audio/README.md) for sourcing guide

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

---

## 🎮 Usage

### Starting a Conversation

1. Open the application in your browser
2. Select a character (Goku, Vegeta, or Itachi)
3. Hear the character's signature sound effect
4. Start chatting!

### Switching Characters

- Click on another character's mini-card in the sidebar
- Chat history is preserved
- Theme updates instantly

### Controls

- **Sound Toggle**: Enable/disable sound effects (default: ON)
- **Volume Slider**: Adjust audio volume (0-100%)
- **Character Cards**: Click to switch personalities

### Tips for Best Experience

- **For Motivation**: Chat with Goku for positive encouragement
- **For Tough Love**: Ask Vegeta for brutal honesty
- **For Wisdom**: Seek Itachi's philosophical insights
- **Try Different Moods**: Type excited/angry/sad messages to see avatar animations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Custom styling with animations
- **HTML5 Audio API** - Sound effects playback

### Backend
- **FastAPI** - Python web framework
- **OpenAI API** - LLM for character responses
- **Uvicorn** - ASGI server
- **Python 3.8+** - Backend language

### AI/ML
- **GPT-4** - Character personality modeling
- **Rule-based Sentiment Analysis** - Client-side mood detection

### Utilities
- **localStorage** - Settings persistence
- **CSS Animations** - Mood-based visual effects
- **Custom Hooks** - React state management

---

## 📁 Project Structure

```
AniMind-AI/
├── frontend/               # React frontend
│   ├── public/
│   │   ├── audio/         # Character sound effects
│   │   ├── characters/    # Character images
│   │   └── backgrounds/   # Theme backgrounds
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── CharacterSelector.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── CharacterAvatar.jsx
│   │   │   ├── SoundToggle.jsx
│   │   │   └── ...
│   │   ├── utils/         # Utilities
│   │   │   ├── sfx.js            # Sound effects
│   │   │   └── mood.js           # Mood detection
│   │   ├── hooks/         # Custom React hooks
│   │   ├── styles/        # CSS files
│   │   └── data/          # Character data
│   └── package.json
│
├── backend/               # FastAPI backend
│   ├── main.py           # API entry point
│   ├── characters/       # Character personality configs
│   ├── utils/            # Helper functions
│   └── requirements.txt
│
└── README.md
```

---

## 🎨 Features Deep Dive

### Character Personalities

Each character is powered by carefully crafted system prompts that define:
- **Speaking style** (Goku: casual, Vegeta: formal/harsh, Itachi: philosophical)
- **Response patterns** (short/long, direct/thoughtful)
- **Personality traits** (cheerful, prideful, calm)
- **Knowledge domains** (training, strength, sacrifice)

### Mood Detection

The application uses a lightweight rule-based system to detect user sentiment:
- **Keyword matching** (excited, angry, sad words)
- **Punctuation analysis** (exclamation marks boost excitement)
- **Context awareness** (question marks reduce excitement)
- **6 mood categories**: excited, positive, neutral, negative, angry, sad

### Animation System

Character avatars react dynamically:
- **Goku**: Golden sparks (excited), blue tint (sad), shake (angry)
- **Vegeta**: Purple pulse (excited), violent shake (rage), fade (sad)
- **Itachi**: Sharingan glow (angry), feather fall (sad), determined pulse (excited)

All animations are **CSS-only** for optimal performance (GPU-accelerated transforms).

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Areas for Contribution

- Add more anime characters (Naruto, Luffy, Eren, etc.)
- Improve mood detection accuracy
- Add more sound effects and audio variations
- Create mobile app version
- Add multiplayer chat rooms
- Implement voice chat with character voices

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Ayush Mishra**

- B.Tech CSE (AI/ML)
- GitHub: [@Ayush95697](https://github.com/Ayush95697)
- LinkedIn: [Ayush Mishra](https://www.linkedin.com/in/ayush-mishra-183b61275/)
- Project Link: [AniMind-AI](https://github.com/Ayush95697/AniMind-AI)

---

## 🙏 Acknowledgments

- Character images and themes inspired by respective anime series
- Sound effects sourced from royalty-free libraries
- OpenAI for GPT-4 API
- React and FastAPI communities

---

## 📧 Support

If you encounter any issues or have questions:
1. Check existing [Issues](https://github.com/Ayush95697/AniMind-AI/issues)
2. Create a new issue with detailed description
3. Contact via [LinkedIn](https://www.linkedin.com/in/ayush-mishra-183b61275/)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=Ayush95697/AniMind-AI&type=Date)](https://star-history.com/#Ayush95697/AniMind-AI&Date)

---

<div align="center">

**Made with ❤️ by Ayush Mishra**

*Bringing anime characters to life through AI*

</div>
