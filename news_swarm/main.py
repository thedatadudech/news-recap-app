from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hive_swarm import livepeer_swarm
from hive_swarm.tools.livepeer_api import text_to_image, image_to_video
from hive_swarm.tools.video_editor import video_editor
from typing import Optional

app = FastAPI()


# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)


class TextToImageRequest(BaseModel):
    prompt: str


class ImageToVideoRequest(BaseModel):
    image_path: str


class ClipsToVideoRequest(BaseModel):
    clips: list[str]
    output_filename: str
    transition_type: Optional[str] = None
    video_format: Optional[str] = None


class SwarmPromptRequest(BaseModel):
    prompt: str


@app.get("/")
async def read_root():
    return {
        "message": "Welcome to the Livepeer Youtube Video Generator Swarm! Visit https://SwarmZero.ai to learn more."
    }


@app.post("/chat/")
async def chat(request: SwarmPromptRequest):
    try:
        if request.prompt.lower() == "exit":
            return {"response": "Goodbye!"}
        response = await livepeer_swarm.chat(request.prompt)
        return {"response": response}
    except Exeption as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/text-to-image/")
async def generate_text_to_image(request: TextToImageRequest):
    try:
        image_url = text_to_image(request.prompt)
        if image_url:
            return {"image_url": image_url}
        else:
            raise HTTPException(status_code=500, detail="Image generation failed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/image-to-video/")
async def generate_image_to_video(request: ImageToVideoRequest):
    try:
        video_url = image_to_video(request.image_path)
        if video_url:
            return {"video_url": video_url}
        else:
            raise HTTPException(status_code=500, detail="Video generation failed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/clips-to-video-full/")
async def generate_full_video(request: ClipsToVideoRequest):
    try:
        output_filename = video_editor(
            request.clips,
            request.output_filename,
            request.transition_type,
            request.video_format,
        )
        if output_filename:
            return {"file_path": output_filename}
        else:
            raise HTTPException(status_code=500, detail="Video generation failed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
