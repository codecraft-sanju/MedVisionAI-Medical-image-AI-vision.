# backend_api.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import img_to_array
from PIL import Image, UnidentifiedImageError
import numpy as np
import io
import os
import logging
from dotenv import load_dotenv
import traceback

# OpenRouter SDK
from openai import OpenAI

# -----------------------------
# Logging configuration
# -----------------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY missing in .env file!")

# -----------------------------
# Initialize OpenRouter client
# -----------------------------
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)

# -----------------------------
# Initialize FastAPI
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load CNN model
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.h5")

try:
    model = load_model(MODEL_PATH)
    logging.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception:
    logging.error(f"Model loading failed: {traceback.format_exc()}")
    raise RuntimeError(f"Could not load model: {traceback.format_exc()}")

# -----------------------------
# OpenRouter API function
# -----------------------------
def generate_dynamic_advice(prediction: str) -> str:
    prompt_text = f"""
The patient has the following PCOS status: {prediction}.
Provide detailed, medically safe advice including:
- Diet plan
- Lifestyle changes
- Exercise suggestions
- Doctor consultation tips
Format it for easy readability.
"""
    try:
        logging.debug(f"Sending prompt to OpenRouter API: {prompt_text}")

        completion = client.chat.completions.create(
            model="openai/gpt-4o",  # Use the model you have access to
            messages=[{"role": "user", "content": prompt_text}],
            temperature=0.7,
            max_tokens=500,
        )

        advice = completion.choices[0].message.content
        logging.debug(f"Received advice from OpenRouter API: {advice}")
        return advice

    except Exception as e:
        logging.error(f"OpenRouter API request failed: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"OpenRouter API error: {e}")

# -----------------------------
# PCOS prediction function
# -----------------------------
def pcos_predict(img: Image.Image):
    try:
        img = img.convert("RGB").resize((224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        logging.debug(f"Image array shape: {img_array.shape}")

        prediction_value = model.predict(img_array)
        logging.debug(f"Raw model prediction: {prediction_value}")

        result = "PCOS Detected" if prediction_value[0][0] > 0.5 else "Not PCOS"
        logging.info(f"Prediction result: {result}")

        advice = generate_dynamic_advice(result)
        logging.debug(f"Advice: {advice}")

        return {"prediction": result, "advice": advice}

    except Exception:
        logging.error(f"Prediction failed: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {traceback.format_exc()}")

# -----------------------------
# API endpoint
# -----------------------------
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img_bytes = await file.read()
        logging.debug(f"Received file: {file.filename}, size: {len(img_bytes)} bytes")

        img = Image.open(io.BytesIO(img_bytes))
        logging.debug(f"Image format: {img.format}, size: {img.size}, mode: {img.mode}")

        return pcos_predict(img)

    except UnidentifiedImageError:
        logging.error("Invalid image uploaded")
        raise HTTPException(status_code=400, detail="Invalid image file")
    except Exception:
        logging.error(f"API endpoint error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {traceback.format_exc()}")
