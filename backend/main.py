import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import random
from typing import List, Dict

app = FastAPI(title="MAITRI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simulated Agent State
class AgentCluster:
    def __init__(self, name: str, agents: List[str]):
        self.name = name
        self.agents = agents
        self.status = "Active"

clusters = {
    "Physical": AgentCluster("Physical", ["Vitals", "Exercise", "Sleep", "Nutrition"]),
    "Psychological": AgentCluster("Psychological", ["Counselor", "MoodDetector", "Social"]),
    "Mission": AgentCluster("Mission", ["Scheduler", "Comms", "Environmental"]),
    "Intelligence": AgentCluster("Intelligence", ["Orchestrator", "Alert", "Knowledge", "DigitalTwin"])
}

agents = []
for c in clusters.values():
    agents.extend(c.agents)

agent_states = {name: {"status": "Active", "last_action": "Monitoring..."} for name in agents}

def simulate_reasoning(query: str):
    """Simulates the orchestrator breaking down a query into tasks."""
    tasks = [
        {"agent": "Orchestrator", "action": f"Analyzing query: '{query}'"},
        {"agent": "Orchestrator", "action": "Decomposing into subtasks..."},
        {"agent": "Psyche", "action": "Detecting emotional markers..."},
        {"agent": "Vitals", "action": "Cross-referencing biometric trends..."},
        {"agent": "Orchestrator", "action": "Synthesizing recommendations."},
    ]
    return tasks

@app.get("/query/{text}")
async def process_query(text: str):
    reasoning = simulate_reasoning(text)
    return {"reasoning_chain": reasoning, "response": f"MAITRI has processed your request regarding '{text}'."}

@app.get("/")
async def root():
    return {"message": "MAITRI Backend is running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send simulated vitals and agent updates
            vitals = {
                "heart_rate": random.randint(65, 80),
                "sleep_quality": random.randint(80, 95),
                "stress_level": random.randint(10, 30),
                "o2_level": round(random.uniform(20.8, 21.2), 1),
                "co2_level": round(random.uniform(0.03, 0.05), 2),
                "temperature": round(random.uniform(21.5, 23.5), 1),
            }
            
            # Update random agent status
            active_agent = random.choice(agents)
            agent_states[active_agent]["status"] = random.choice(["Active", "Processing"])
            agent_states[active_agent]["last_action"] = f"Monitoring {active_agent.lower()} parameters..."
            
            data = {
                "vitals": vitals,
                "agent_states": agent_states,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(1) # Send update every second
            
    except WebSocketDisconnect:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
