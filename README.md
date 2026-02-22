# MAITRI: AI Assistant for Astronaut Well-Being

MAITRI is a holistic, mission-critical multi-agent system designed for the physical and psychological well-being of astronauts on long-duration space missions.

## System Architecture

### 1. Multi-Agent Orchestration
- **Orchestrator Agent**: Manages task delegation and conversational intelligence.
- **11 Specialized Agents**: Vitals, Exercise, Sleep, Nutrition, Counselor, Mood, Social, Scheduler, Alert, Digital Twin, and Orchestrator.

### 2. Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion, Three.js (React Three Fiber).
- **Backend**: FastAPI (Python), WebSockets, LangChain.
- **State Management**: Jotai.

## 🚀 Deployment

This project is a monorepo. When deploying to platforms like **Vercel**, **Render**, or **Netlify**, you MUST set the **Root Directory** correctly for each service.

### 1. Frontend (Vercel/Netlify)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: 
  - `NEXT_PUBLIC_API_URL`: Your deployed Backend URL (e.g., `https://api.example.com`)

### 2. Backend (Render/Railway)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Installation

#### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Advanced Features Implemented
- **Living Mind Map**: A 3D orbital visualization of the 11-agent orchestration mesh.
- **Real-time Vitals**: Live streaming of simulated health metrics via WebSockets.
- **Agentic Reasoning**: Intent-based routing and persona-driven synthesized responses.
- **Futuristic UI**: Glassmorphism, holographic text, and animated nebula backgrounds.

## Roadmap
- [ ] Integration with Azure TTS Avatar for lifelike interaction.
- [ ] Vector Database (TiDB/Pinecone) for long-term agent memory.
- [ ] Real-time ECG/EEG signal processing pipeline.
- [ ] Space-based infrastructure simulation (Project Suncatcher).
