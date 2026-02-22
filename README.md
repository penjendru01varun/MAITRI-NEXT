# MAITRI: AI Assistant for Astronaut Well-Being

MAITRI is a holistic, mission-critical multi-agent system designed for the physical and psychological well-being of astronauts on long-duration space missions.

## System Architecture

### 1. Multi-Agent Orchestration
- **Orchestrator Agent**: Manages task delegation using a Directed Acyclic Graph (DAG) approach.
- **Agent Clusters**:
  - **Physical**: Vitals, Exercise, Sleep, Nutrition.
  - **Psychological**: Counselor, Mood Detector, Social.
  - **Mission**: Scheduler, Comms, Environmental.
  - **Intelligence**: Alert, Knowledge, Digital Twin.

### 2. Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion, Three.js (React Three Fiber).
- **Backend**: FastAPI (Python), WebSockets, Pydantic, LangChain.
- **State Management**: Jotai (Frontend), Redis (Backend simulation).

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
npm install --legacy-peer-deps
npm run dev
```

## Advanced Features Implemented
- **Living Mind Map**: A 3D orbital visualization of the 15-agent orchestration mesh.
- **Real-time Vitals**: Live streaming of simulated heart rate, O2, and CO2 levels via WebSockets.
- **Agentic Reasoning**: Simulated chain-of-thought processing for complex astronaut queries.
- **Futuristic UI**: Glassmorphism, holographic text, and animated nebula backgrounds.

## Roadmap
- [ ] Integration with Azure TTS Avatar for lifelike interaction.
- [ ] Vector Database (TiDB/Pinecone) for long-term agent memory.
- [ ] Real-time ECG/EEG signal processing pipeline.
- [ ] Space-based infrastructure simulation (Project Suncatcher).
