import numpy as np
from collections import deque

class FusionEngine:
    def __init__(self, window_size=30):
        print("🧠 Initializing Fusion Engine...")
        # We keep the last 30 frames (approx 1 second) of data in memory
        self.velocity_window = deque(maxlen=window_size)
        
        # Threshold: If speed is 2.5 standard deviations above normal, it's a risk.
        self.VELOCITY_THRESHOLD = 3.0

    def analyze_risk(self, metrics):
        """
        Calculates a Risk Score (0-100) based on crowd behavior.
        """
        current_vel = metrics.get('avg_velocity', 0)
        self.velocity_window.append(current_vel)
        
        risk_score = 0
        reasons = []

        # We need at least 5 frames of history to calculate statistics
        if len(self.velocity_window) > 5:
            vel_mean = np.mean(self.velocity_window)
            vel_std = np.std(self.velocity_window) + 1e-5
            
            # Calculate Z-Score (How weird is this movement?)
            z_score = (current_vel - vel_mean) / vel_std
            
            # Rule 1: Sudden Velocity Surge (Panic running)
            if z_score > self.VELOCITY_THRESHOLD:
                risk_score += 50
                reasons.append(f"Sudden Surge (+{z_score:.1f}σ)")
            
            # Rule 2: Absolute High Speed (Running)
            if current_vel > 20.0:
                risk_score += 30
                reasons.append("High Speed Motion")

        # Rule 3: Crowd Density Risk
        if metrics['people_count'] > 5:
            risk_score += 20
            reasons.append("High Density")

        return {
            "risk_score": min(risk_score, 100),
            "reasons": reasons
        }