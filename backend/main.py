import os
import asyncio
import json
import random
from datetime import datetime
from typing import List, Dict, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from agents import (
    OrchestratorAgent, VitalsAgent, ExerciseAgent, SleepAgent, 
    NutritionAgent, CounselorAgent, MoodAgent, SocialAgent, 
    AlertAgent, DigitalTwinAgent, SchedulerAgent
)
from core.websocket_manager import ws_manager

app = FastAPI(title="MAITRI Intelligence System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agents
orchestrator = OrchestratorAgent()
vitals_agent = VitalsAgent()
exercise_agent = ExerciseAgent()
sleep_agent = SleepAgent()
nutrition_agent = NutritionAgent()
counselor_agent = CounselorAgent()
mood_agent = MoodAgent()
social_agent = SocialAgent()
alert_agent = AlertAgent()
digital_twin = DigitalTwinAgent()
scheduler_agent = SchedulerAgent()

# List of all agents for easy iteration
all_agents = [
    orchestrator, vitals_agent, counselor_agent, exercise_agent, 
    sleep_agent, nutrition_agent, mood_agent, social_agent,
    alert_agent, digital_twin, scheduler_agent
]

# Map names for frontend compatibility
AGENT_DISPLAY_NAMES = {
    "Orchestrator": "Orchestrator",
    "Vitals": "Vitals",
    "Counselor": "Counselor",
    "Exercise": "Exercise",
    "Sleep": "Sleep",
    "Nutrition": "Nutrition",
    "Mood Detector": "Mood",
    "Social": "Social",
    "Alert": "Alert",
    "Digital Twin": "DigitalTwin",
    "Scheduler": "Scheduler"
}

@app.on_event("startup")
async def startup_event():
    # Register all agents with the orchestrator
    for agent in all_agents:
        if agent != orchestrator:
            await orchestrator.register_agent(agent)
    print(f"MAITRI Agentic Mesh Initialized with {len(all_agents)} Agents.")

@app.get("/query/{text}")
async def process_query(text: str):
    # Use orchestrator to handle the query
    result = await orchestrator.process({
        "action": "handle_complex_query",
        "query": text
    })
    
    # The new Orchestrator returns 'response' and 'reasoning_chain' directly
    return {
        "response": result.get("response", "I've processed your request."),
        "reasoning_chain": result.get("reasoning_chain", [])
    }

@app.get("/status")
async def get_system_status():
    return await orchestrator.process({"action": "get_system_status"})

@app.get("/")
async def root():
    return {"message": "MAITRI Core is operational", "agents_active": len(all_agents)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    client_id = await ws_manager.connect(websocket)
    try:
        while True:
            # Generate simulated vitals for the dashboard
            vitals_data = {
                "heart_rate": random.randint(65, 82),
                "sleep_quality": random.randint(85, 98),
                "stress_level": random.randint(12, 28),
                "o2_level": round(random.uniform(20.9, 21.1), 1),
                "co2_level": round(random.uniform(0.03, 0.04), 2),
                "temperature": round(random.uniform(22.0, 23.0), 1),
            }
            
            # Update a random agent's status to simulate activity
            active_target = random.choice(all_agents)
            # Randomly change status for variety
            chance = random.random()
            if chance > 0.8:
                active_target.update_status("processing", f"Analyzing data stream for {active_target.name}...")
            elif chance > 0.98:
                active_target.update_status("alert", f"Anomaly detected in {active_target.name} parameters!")
            else:
                active_target.update_status("idle", f"Monitoring {active_target.name.lower()}...")

            # Collect states of all 10 agents
            agent_states = {}
            for agent in all_agents:
                # Use display name that matches frontend AGENTS array
                display_name = AGENT_DISPLAY_NAMES.get(agent.name, agent.name)
                agent_states[display_name] = {
                    "status": agent.state.value.capitalize(),
                    "last_action": agent.status_message
                }
            
            payload = {
                "vitals": vitals_data,
                "agent_states": agent_states,
                "timestamp": asyncio.get_event_loop().time()
            }
            
            await ws_manager.send_personal_message(payload, client_id)
            await asyncio.sleep(1)
            
    except WebSocketDisconnect:
        ws_manager.disconnect(client_id)
    except Exception as e:
        print(f"WS Error: {e}")
        ws_manager.disconnect(client_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
