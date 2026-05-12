# Thumbnail_Generator
AI-powered YouTube Thumbnail Generator built with FastAPI, React, and Gemini AI. Features JWT authentication, ImageKit CDN.
# 🎨 Thumbnail Generator

> AI-powered YouTube Thumbnail Generator built with FastAPI, React, and Google Gemini AI

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)

## ✨ Features

- 🤖 **AI-Powered Generation** — Uses Google Gemini AI to generate YouTube video ideas and thumbnail concepts
- 🔐 **JWT Authentication** — Secure register/login system with bcrypt password hashing
- ☁️ **ImageKit CDN** — Upload and serve headshot photos via ImageKit
- ⚡ **Real-time Streaming** — Server-Sent Events (SSE) for live thumbnail generation updates
- 🎨 **Multiple Styles** — Generate up to 3 different style variations (Bold, Minimal, Vibrant)
- 📱 **Responsive UI** — Clean, modern React frontend

## 🛠️ Tech Stack

### Backend
- **FastAPI** — Modern Python web framework
- **SQLModel** — Database ORM with SQLite
- **JWT** — JSON Web Token authentication
- **ImageKit** — Cloud image storage and CDN
- **Google Gemini AI** — AI content generation
- **Uvicorn** — ASGI server

### Frontend
- **React 19** — UI framework
- **Vite** — Build tool
- **Fetch API** — HTTP requests with JWT auth
- **Server-Sent Events** — Real-time updates

## 🚀 Getting Started

### Prerequisites
- Python 3.13+
- Node.js 18+
- ImageKit account
- Google Gemini API key

### Backend Setup

```bash
cd Backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create a `.env` file in the Backend folder:
```env
GEM_API_KEY=your_gemini_api_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Run the server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/upload-headshot` | Upload headshot photo |
| POST | `/api/jobs` | Create generation job |
| GET | `/api/jobs/{id}` | Get job status |
| GET | `/api/jobs/{id}/stream` | Stream job updates (SSE) |

## 🔄 Data Flow  
User Login/Register
↓
Upload Headshot → ImageKit CDN
↓
Create Job → SQLite Database
↓
Background Task → Gemini AI
↓
Real-time Updates → SSE Stream
↓
Display Results

## 👩‍💻 Author

**Srijita Ghosh**  
[GitHub](https://github.com/srijita-g)
