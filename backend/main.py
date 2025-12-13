import os
from typing import Dict, List

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

from prompts import build_chat_messages
from characters import CHARACTERS

# 1) Load environment variables from .env (for GOOGLE_API_KEY, etc.)
load_dotenv()

# 2) Create FastAPI app
app = FastAPI(
    title="AniMind Backend",
    description="Anime character chatbot backend (Goku, Vegeta, Itachi)",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://animind-ai-3.onrender.com",
        "https://animind-ai-3.onrender.com/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3) Global LLM instance (lazy-initialized) and in-memory conversation store
llm = None  # will hold ChatGoogleGenerativeAI instance

# conversations[session_id] = list of {"role": "...", "content": "..."}
conversations: Dict[str, List[Dict[str, str]]] = {}


# 4) Request/Response models for the /chat endpoint
class ChatRequest(BaseModel):
    session_id: str  # unique id per user/session (frontend will manage)
    character: str  # "goku", "vegeta", "itachi"
    user_message: str  # latest user message text


class ChatResponse(BaseModel):
    character: str  # echoes which character replied
    bot_message: str  # model's reply text


# 5) Helper: create or return the global LLM instance
def get_llm() -> ChatGoogleGenerativeAI:
    """
    Returns a singleton ChatGoogleGenerativeAI instance.
    Creates it on first use.
    """
    global llm

    if llm is not None:
        return llm

    # Make sure API key is available
    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GOOGLE_API_KEY is not set. "
            "Add it to your .env file or environment variables."
        )

    # LangChain's ChatGoogleGenerativeAI reads the key from environment,
    # so we don't need to pass it manually.
   
    llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",  # <--- CHANGE TO THIS
    temperature=0.7,
    # ... rest of your code
    )

    # if that errors, use this alias instead:
    # llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)

    return llm


# 6) Helper: convert our simple {role, content} messages into LangChain messages
def call_llm_with_messages(messages: List[Dict[str, str]]) -> str:
    """
    Takes a list of {"role": "...", "content": "..."} messages,
    converts them to LangChain message objects, and gets a reply
    from the Gemini chat model.
    Returns the assistant's reply text.
    """
    # Get or create the LLM
    model = get_llm()

    # Convert our messages to LangChain chat messages
    lc_messages = []
    for msg in messages:
        role = msg.get("role")
        content = msg.get("content", "")

        if not content:
            continue

        if role == "system":
            lc_messages.append(SystemMessage(content=content))
        elif role == "user":
            lc_messages.append(HumanMessage(content=content))
        elif role == "assistant":
            lc_messages.append(AIMessage(content=content))
        else:
            # Unknown role → skip
            continue

    # Ask the model
    response = model.invoke(lc_messages)

    # LangChain chat models return an object with a `.content` string field
    return response.content


# 7) Small health check endpoint
@app.get("/")
def root():
    return {"status": "ok", "message": "AniMind backend is running"}


# 8) Main chat endpoint
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Main endpoint for AniMind.

    Flow:
    1. Get history for this session_id.
    2. Build messages using selected character + history + new user_message.
    3. Call LLM to get reply.
    4. Update history.
    5. Return reply to caller.
    """
    try:
        # 1) Get or create conversation history
        history = conversations.setdefault(request.session_id, [])

        # 2) Build full message list (system + history + current user)
        messages = build_chat_messages(
            character_id=request.character,
            user_message=request.user_message,
            history=history,
        )

        # 3) Call LLM
        bot_reply = call_llm_with_messages(messages)

        # 4) Update history (so future calls have context)
        history.append({"role": "user", "content": request.user_message})
        history.append({"role": "assistant", "content": bot_reply})

        # 5) Return response
        return ChatResponse(
            character=request.character,
            bot_message=bot_reply,
        )
    
    except RuntimeError as e:
        # Handle API key errors
        print(f"Runtime error in /chat: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Configuration error: {str(e)}"}
        )
    
    except Exception as e:
        # Handle all other errors
        print(f"Error in /chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred: {str(e)}"}
        )

