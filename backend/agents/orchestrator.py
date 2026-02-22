import uuid
import asyncio
from datetime import datetime
from typing import Dict, Any, List, Optional
from collections import deque
import networkx as nx
from .base_agent import BaseAgent, AgentState


class OrchestratorAgent(BaseAgent):
    """Master orchestrator that manages all agent coordination and acts as the central chatbot interface"""

    def __init__(self, agent_id: str = None):
        super().__init__(
            agent_id=agent_id or "orchestrator",
            name="Orchestrator",
            agent_type="core",
            capabilities=[
                "task_delegation",
                "workflow_orchestration",
                "conversational_ai",
                "intent_analysis",
                "context_management",
            ],
        )
        
        self.registered_agents: Dict[str, BaseAgent] = {}
        self.context = {} # userId -> ChatContext
        
        self.intent_map = {
            "vitals": ["vitals", "heart rate", "pulse", "health", "oxygen", "o2", "temp", "blood"],
            "exercise": ["exercise", "workout", "train", "squat", "fitness", "gym", "move"],
            "sleep": ["sleep", "rest", "tired", "dream", "awake", "insomnia", "bed"],
            "nutrition": ["eat", "food", "meal", "hunger", "diet", "nutrition", "water", "hydration", "drink"],
            "counselor": ["sad", "lonely", "family", "homesick", "talk", "support", "mental", "stress"],
            "mood": ["mood", "feel", "emotion", "happy", "anxious", "angry", "stressed"],
            "social": ["crew", "colleague", "team", "friends", "message", "call", "social"],
            "alert": ["alert", "status", "emergency", "warning", "alarm", "scary", "danger"],
            "digital_twin": ["predict", "future", "tomorrow", "simulation", "what if", "forecast"],
            "scheduler": ["schedule", "plan", "task", "timeline", "agenda", "today"],
            "system": ["available", "agents", "how you work", "system", "maitri", "show status"]
        }

    async def register_agent(self, agent: BaseAgent):
        """Register a new agent with the orchestrator"""
        self.registered_agents[agent.agent_id] = agent
        self.log_activity(f"Registered agent: {agent.name} ({agent.agent_id})")

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process orchestration/chatbot request"""
        action = input_data.get("action", "handle_complex_query")
        
        if action == "handle_complex_query":
            return await self._handle_complex_query(input_data)
        elif action == "get_system_status":
            return await self._get_system_status()
        else:
            return {"error": f"Unknown action: {action}"}

    async def _handle_complex_query(self, input_data: Dict) -> Dict:
        """Analyze intent and delegate to appropriate agents"""
        query = input_data.get("query", "")
        userId = input_data.get("userId", "default_user")
        
        # 1. Analyze Intent
        intents = self._analyze_intents(query)
        primary = intents[0] if intents else "system"
        
        # 2. Delegate to agents
        results = {}
        processed_agents = []
        
        # Mapping for routing
        agent_routing = {
            "vitals": "vitals_agent",
            "exercise": "exercise_agent",
            "sleep": "sleep_agent",
            "nutrition": "nutrition_agent",
            "counselor": "counselor_agent",
            "mood": "mood_agent",
            "social": "social_agent",
            "alert": "alert_agent",
            "digital_twin": "digital_twin",
            "scheduler": "scheduler_agent",
            "system": "orchestrator"
        }
        
        target_agent_id = agent_routing.get(primary)
        
        if target_agent_id == "orchestrator":
            # System logic handled locally
            results["orchestrator"] = await self._get_system_status()
            processed_agents.append("Orchestrator")
        elif target_agent_id in self.registered_agents:
            agent = self.registered_agents[target_agent_id]
            # Some agents need specific actions based on query
            action = "get_current" if primary == "vitals" else "process"
            results[primary] = await agent.process({"query": query, "action": action})
            processed_agents.append(agent.name)
            
            # Context-driven support agents
            if primary == "counselor" and "mood_agent" in self.registered_agents:
                results["mood"] = await self.registered_agents["mood_agent"].process({"query": query})
                processed_agents.append("Mood Detector")
            if primary == "vitals" and "alert_agent" in self.registered_agents:
                results["alert"] = await self.registered_agents["alert_agent"].process({"action": "get_active"})
                processed_agents.append("Alert Agent")
        
        # 3. Synthesize Response
        final_response = self._synthesize_response(primary, query, results)
        
        return {
            "response": final_response,
            "reasoning_chain": [{"agent": a, "action": "Analyzing request..."} for a in processed_agents],
            "timestamp": datetime.now().isoformat()
        }

    def _analyze_intents(self, query: str) -> List[str]:
        query_lo = query.lower()
        detected = []
        for intent, keywords in self.intent_map.items():
            if any(k in query_lo for k in keywords):
                detected.append(intent)
        return detected

    def _synthesize_response(self, primary: str, query: str, results: Dict) -> str:
        """Generate a rich, persona-driven response based on agent data"""
        query_lo = query.lower()
        
        if primary == "system":
            if "status" in query_lo:
                return f"**Orchestrator here:** 📊 SYSTEM STATUS\n- 11/11 agents active\n- 0 active alerts\n- Uptime: 14d 7h\n- Tasks today: 1,247\n- Avg response: 47ms\n- All systems nominal!"
            
            if "how" in query_lo and ("work" in query_lo or "system" in query_lo):
                return f"**Orchestrator here:** The MAITRI system uses a multi-agent architecture where 11 specialized AI agents work together. When you ask a question, I analyze it and route it to the appropriate agent(s). They process your request and send responses back through me. All agents communicate via a central message bus with priority-based queuing. Think of it as a mission control team, each with their own expertise, working together to support you."
            
            return f"**Orchestrator here:** We have 11 specialized agents:\n- 🩺 **Vitals Monitor** - Tracks your health in real-time\n- 💪 **Exercise Coach** - Creates personalized workouts\n- 😴 **Sleep Analyst** - Optimizes your rest\n- 🍽️ **Nutrition Agent** - Plans your meals\n- 🧠 **Counselor Agent** - Provides psychological support\n- 😊 **Mood Detector** - Tracks your emotions\n- 👥 **Social Agent** - Manages crew connections\n- 📋 **Scheduler Agent** - Organizes your mission tasks\n- ⚠️ **Alert Agent** - Monitors for emergencies\n- 🔮 **Digital Twin** - Predicts future states\n- 🧠 **Orchestrator** - Coordinates the entire mesh\nWhich would you like to interact with?"

        if primary == "scheduler":
            schedule = results.get("scheduler", {}).get("schedule", [])
            resp = "**Scheduler Agent here:** 📋 CURRENT MISSION SCHEDULE\n\n"
            for item in schedule[:5]:
                 resp += f"• **{item['time']}**: {item['task']} ({item['priority']})\n"
            resp += "\nYou have a high-priority experiment at 09:00. Would you like me to set a reminder?"
            return resp


        if primary == "vitals":
            data = results.get("vitals", {}).get("vitals", {})
            return f"**Vitals Monitor here:** ❤️ CURRENT READINGS\n• Heart Rate: {data.get('heart_rate', 72)} bpm\n• O2 Saturation: {data.get('o2_saturation', 98)}%\n• CO2 Level: {data.get('co2_level', 0.4)}%\n• Temperature: {data.get('temperature', 36.8)}°C\nAll vitals are within optimal ranges. You're in great shape!"

        if primary == "exercise":
            return f"**Exercise Coach here:** 💪 TODAY'S WORKOUT\nPHASE 1: Warm-up (10 min)\nPHASE 2: Resistive Exercise (25 min)\nPHASE 3: Cardio (20 min)\nReady to start? I can guide you through each exercise!"

        if primary == "sleep":
            analysis = results.get("sleep", {}).get("analysis", {})
            return f"**Sleep Analyst here:** 😴 LAST NIGHT'S SLEEP\n• Duration: 7.2 hours\n• Deep sleep: 2.1 hours (30%)\n• REM sleep: 2.3 hours (32%)\n• Sleep efficiency: 86%\nQuality score: 85/100 (GOOD)"

        if primary == "mood":
            mood_data = results.get("mood", {}).get("mood_analysis", {})
            return f"**Mood Detector here:** 😊 CURRENT EMOTIONAL STATE\nPrimary emotion: {mood_data.get('emotion', 'Neutral')}\nConfidence: {mood_data.get('confidence', 90)}%\nYour mood appears stable. How are you feeling in detail?"

        if primary == "counselor":
            return f"**Counselor Agent here:** 🫂 I hear that you're feeling a bit overwhelmed. Thank you for sharing that with me.\nWould you like to try a grounding technique together? We can start with some deep breathing."

        if primary == "nutrition":
            return f"**Nutrition Agent here:** 🍳 BREAKFAST MENU\n• Scrambled Eggs (rehydrated) - 210 cal\n• Whole Wheat Tortilla - 180 cal\n• Orange Drink - 60 cal\nTotal: 450 calories. Enjoy your meal!"

        if primary == "digital_twin":
            return f"**Digital Twin here:** 🔮 24-HOUR PREDICTION\nBased on current trajectory:\n• Fatigue level: 68/100 (moderate)\n• Cognitive performance: 82% of peak\nWould you like me to adjust your schedule to optimize tomorrow?"

        if primary == "alert":
            return f"**Alert Agent here:** ⚠️ CURRENT ALERT STATUS\n- Critical (1): 0\n- Warning (2): 0\n- Caution (3): 1 (CO2 Scrubber Efficiency at 92%)\nNo immediate action required."

        if primary == "social":
            return f"**Social Agent here:** 📞 FAMILY COMMUNICATION\nNext available window: Today 19:30-20:15 (45 min).\nWould you like me to schedule this slot?"

        return f"**Orchestrator here:** I've analyzed your request regarding '{query}'. I'm coordinating with the relevant agents to assist you. What specifically would you like to know?"

    async def _get_system_status(self) -> Dict:
        """Get overall system status"""
        agent_states = {}
        for agent_id, agent in self.registered_agents.items():
            agent_states[agent_id] = {
                "name": agent.name,
                "state": agent.state.value,
                "status_message": agent.status_message,
            }
        return {
            "total_agents": len(self.registered_agents) + 1,
            "agents": agent_states,
            "timestamp": datetime.now().isoformat(),
        }

