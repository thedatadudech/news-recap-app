from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

api_key = os.getenv("OPEN_AI_KEY")
client = OpenAI(api_key=api_key)

with open(
    "message.txt",
    "r",
) as file:
    text_input = file.read()

speech_file_path = "speech.mp3"
response = client.audio.speech.create(
    model="tts-1",
    voice="onyx",
    input=text_input,
)

# Assuming the response object has a method to save the audio file
with open(speech_file_path, "wb") as f:
    f.write(response.content)  # Changed from response.audio_content to response.content
