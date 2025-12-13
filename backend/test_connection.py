import sys
import os

# Ensure backend directory is in path so imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from main import get_llm
from langchain_core.messages import HumanMessage

def test_connection():
    print("Testing Gemini API connection...")
    try:
        llm = get_llm()
        print(f"LLM initialized with model: {llm.model}")
        
        msg = HumanMessage(content="Hello! Just say 'Connected' if you can hear me.")
        print("Sending request...")
        
        response = llm.invoke([msg])
        print(f"Response Received: {response.content}")
        print("SUCCESS: Connection verified.")
    except Exception as e:
        print(f"FAILURE: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_connection()
