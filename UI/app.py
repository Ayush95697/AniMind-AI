import gradio as gr
import requests
import uuid
import os

# --- Configuration ---
BACKEND_URL = "http://127.0.0.1:8000/chat"

# Character Data (Mirrored from backend for display purposes)
CHARACTERS = {
    "goku": {
        "name": "Goku",
        "avatar": "assets/goku.png",
        "bio": "A simple, battle-loving Saiyan who lives for training and improvement.",
        "theme_color": "#f97316",
        "accent_color": "#facc15"
    },
    "vegeta": {
        "name": "Vegeta",
        "avatar": "assets/vegeta.png",
        "bio": "The proud Saiyan prince who despises weakness and competition with Goku.",
        "theme_color": "#4c1d95",
        "accent_color": "#7c3aed"
    },
    "itachi": {
        "name": "Itachi Uchiha",
        "avatar": "assets/itachi.png",
        "bio": "A wise, calm shinobi who speaks with emotional intelligence and reflective depth.",
        "theme_color": "#111827",
        "accent_color": "#6b7280"
    }
}

# --- State Management ---
def get_session_id(request: gr.Request):
    """
    Generates or retrieves a session ID.
    In a real deployment, this might come from cookies or headers.
    For now, we generate a new one per page load if not persistent.
    """
    # Note: Gradio's state is per-user-session already.
    # We'll create a unique ID and store it in a State component.
    return str(uuid.uuid4())

# --- Backend Interaction ---
def send_message(session_id, character_key, user_message, history):
    """
    Sends message to backend and updates history.
    """
    if not user_message.strip():
        return "", history

    payload = {
        "session_id": session_id,
        "character": character_key,
        "user_message": user_message
    }

    try:
        response = requests.post(BACKEND_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        bot_reply = data.get("bot_message", "Error: No response from backend.")
    except Exception as e:
        bot_reply = f"Error communicating with backend: {str(e)}"

    # Update history
    history.append((user_message, bot_reply))
    return "", history

# --- UI Logic ---
def update_character_info(character_key):
    """Updates the character card details when a new character is selected."""
    char = CHARACTERS.get(character_key)
    if not char:
        return None, "", "", ""
    
    # Return values for: avatar_image, name_text, bio_text, theme_css_trigger
    return (
        char["avatar"],
        char["name"],
        char["bio"],
        character_key # Pass key to trigger JS/CSS updates if needed later
    )

# --- Layout ---
def load_css():
    try:
        with open("UI/custom.css", "r") as f:
            return f"<style>{f.read()}</style>"
    except Exception as e:
        print(f"Error loading CSS: {e}")
        return ""

with gr.Blocks(title="AniMind") as demo:
    gr.HTML(load_css())
    
    # State for session_id
    session_id_state = gr.State(value=lambda: str(uuid.uuid4()))
    
    # State for current character
    current_character_state = gr.State(value="goku")

    with gr.Row(elem_id="main-container"):
        # --- Left Panel: Character Selection ---
        with gr.Column(scale=1, elem_id="left-panel"):
            gr.Markdown("## Select Character")
            
            # Character Selector
            character_radio = gr.Radio(
                choices=[(data["name"], key) for key, data in CHARACTERS.items()],
                value="goku",
                label="Choose your partner",
                interactive=True,
                elem_id="character-selector"
            )

            # Character Card
            with gr.Group(elem_id="character-card"):
                char_avatar = gr.Image(
                    value=CHARACTERS["goku"]["avatar"],
                    show_label=False,
                    interactive=False,
                    elem_id="char-avatar",
                    height=300
                )
                char_name = gr.Markdown(f"### {CHARACTERS['goku']['name']}")
                char_bio = gr.Markdown(CHARACTERS["goku"]["bio"])

        # --- Right Panel: Chat Interface ---
        with gr.Column(scale=3, elem_id="right-panel"):
            chatbot = gr.Chatbot(
                label="Conversation",
                elem_id="chatbot",
                height=600
            )
            
            with gr.Row(elem_id="input-area"):
                msg_input = gr.Textbox(
                    show_label=False,
                    placeholder="Type your message...",
                    scale=4,
                    autofocus=True,
                    elem_id="msg-input"
                )
                send_btn = gr.Button("Send", scale=1, variant="primary", elem_id="send-btn")

    # --- JavaScript for Dynamic Theming ---
    # This JS function updates CSS variables based on the selected character
    js_func = """
    (character_key) => {
        const themes = {
            "goku": { "primary": "#f97316", "accent": "#facc15", "bg": "#fff7ed" },
            "vegeta": { "primary": "#4c1d95", "accent": "#7c3aed", "bg": "#f5f3ff" },
            "itachi": { "primary": "#1f2937", "accent": "#9ca3af", "bg": "#111827" }
        };
        const theme = themes[character_key] || themes["goku"];
        
        document.documentElement.style.setProperty('--theme-primary', theme.primary);
        document.documentElement.style.setProperty('--theme-accent', theme.accent);
        document.documentElement.style.setProperty('--theme-bg', theme.bg);
        
        // Update body background for immersive feel
        document.body.style.background = `linear-gradient(135deg, ${theme.bg}, #ffffff)`;
        
        return character_key;
    }
    """

    # --- Event Wiring ---
    
    # 1. Character Selection Updates
    # We use _js to execute the theming logic on the client side
    character_radio.change(
        fn=update_character_info,
        inputs=[character_radio],
        outputs=[char_avatar, char_name, char_bio, current_character_state],
        js=js_func
    )

    # 2. Sending Messages
    # On Enter
    msg_input.submit(
        fn=send_message,
        inputs=[session_id_state, character_radio, msg_input, chatbot],
        outputs=[msg_input, chatbot]
    )
    # On Button Click
    send_btn.click(
        fn=send_message,
        inputs=[session_id_state, character_radio, msg_input, chatbot],
        outputs=[msg_input, chatbot]
    )

    # Initialize theme on load (hacky way: trigger change event or just set default in CSS)
    demo.load(None, None, None, js="() => { " + js_func.replace("(character_key)", "('goku')") + " }")

if __name__ == "__main__":
    demo.launch(server_name="127.0.0.1")
