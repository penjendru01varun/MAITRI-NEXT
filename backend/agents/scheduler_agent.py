from datetime import datetime, timedelta
from typing import Dict, Any, List
from .base_agent import BaseAgent


class SchedulerAgent(BaseAgent):
    """Manages mission schedules and task prioritization"""

    def __init__(self, agent_id: str = None):
        super().__init__(
            agent_id=agent_id or "scheduler_agent",
            name="Scheduler",
            agent_type="coordination",
            capabilities=[
                "task_scheduling",
                "priority_management",
                "timeline_optimization",
                "crew_coordination",
            ],
        )
        
        self.schedule = [
            {"time": "07:00", "task": "Wake up & Vitals Check", "priority": "High"},
            {"time": "08:00", "task": "Breakfast", "priority": "Med"},
            {"time": "09:00", "task": "Experiment: Fluid Dynamics", "priority": "High"},
            {"time": "11:00", "task": "Exercise Segment 1", "priority": "High"},
            {"time": "12:30", "task": "Lunch", "priority": "Med"},
            {"time": "13:30", "task": "Maintenance: CO2 Scrubber", "priority": "High"},
            {"time": "15:30", "task": "Exercise Segment 2", "priority": "Med"},
            {"time": "17:00", "task": "Communication Window: Earth", "priority": "High"},
            {"time": "18:30", "task": "Dinner", "priority": "Med"},
            {"time": "20:00", "task": "Free Time / Earth Gazing", "priority": "Low"},
            {"time": "22:00", "task": "Sleep Onset", "priority": "High"},
        ]

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process scheduling request"""
        action = input_data.get("action", "get_schedule")
        
        if action == "get_schedule":
            return {
                "agent": self.name,
                "schedule": self.schedule,
                "timestamp": datetime.now().isoformat(),
            }
        elif action == "optimize":
            return {
                "agent": self.name,
                "status": "Schedule optimized for energy conservation",
                "changes": ["Shifted Exercise Segment 2 by 30 mins"],
                "timestamp": datetime.now().isoformat(),
            }
        else:
            return {"agent": self.name, "response": "Task scheduling synchronized."}
