# MedVisionAI

**Hackathon Project of [Tequity](https://www.tequity.tech/)**

MedVisionAI is an AI-powered medical imaging project that detects PCOS from ultrasound images and provides personalized medical advice. It also includes a chatbot for health-related queries.

---

## Team

- **Sanjay Choudhary** (Team Leader)  
  - [LinkedIn](https://www.linkedin.com/in/sanjaychoudhary99/)  

- **Prateeksha Khichi**  
  - [LinkedIn](https://www.linkedin.com/in/prateeksha-khichi-790682290/)  

- **Lakshya Sharma**  
  - [LinkedIn](https://www.linkedin.com/in/lakshyasharma077/)  

---

## Features

- Upload ultrasound images to predict PCOS.
- Get AI-generated, detailed advice for:
  - Diet plan
  - Lifestyle changes
  - Exercise suggestions
  - Doctor consultation tips
- Chat with AI for health-related guidance.
- User-friendly frontend with real-time interactions.

---

## Tech Stack

- **Backend:** Python, FastAPI, TensorFlow/Keras, OpenRouter API  
- **Frontend:** React, TailwindCSS, Framer Motion  
- **Database:** N/A (stateless API)  
- **Other Tools:** Uvicorn, PIL, NumPy, dotenv

---

## Project Demo

You can watch the project in action by clicking the video below:

[Watch Demo Video](./demovideo.mp4)

## Installation

### Backend

1. Clone the repository:

```bash
git clone https://github.com/codecraft-sanju/MedVisionAI-Medical-image-AI-vision.
cd Backend
pip install -r requirements.txt

Set up .env file:
OPENROUTER_API_KEY=your_openrouter_api_key_here

Start backend server:
uvicorn backend_api:app --reload

cd..
cd frontend
npm install
npm run dev




