import cv2
import numpy as np
from ultralytics import YOLO
from collections import defaultdict, deque

class VisionAgent:
    def __init__(self):
        print("👁️ Loading Vision Agent (With Noise Filtering)...")
        self.model = YOLO('yolov8n.pt') 
        self.PERSON_CLASS_ID = 0 
        self.track_history = defaultdict(lambda: deque(maxlen=5))
        
        # --- EMA SMOOTHING STATE ---
        # We store the previous velocity to smooth transitions
        self.smoothed_avg_velocity = 0.0 
        self.ALPHA = 0.3  # Smoothing Factor (0.1 = Slow/Smooth, 1.0 = Raw/Jittery)

    def extract_metrics(self, frame):
        results = self.model.track(frame, persist=True, verbose=False, classes=[self.PERSON_CLASS_ID])
        
        if not results or not results[0].boxes:
            return self._empty_payload(), frame

        boxes = results[0].boxes.xywh.cpu().numpy()
        track_ids = results[0].boxes.id
        
        if track_ids is None:
            return self._empty_payload(), frame

        track_ids = track_ids.int().cpu().tolist()
        annotated_frame = results[0].plot()
        
        velocities = []
        for box, track_id in zip(boxes, track_ids):
            x, y, w, h = box
            speed = self._calculate_velocity(track_id, x, y)
            velocities.append(speed)

        # 1. Calculate Raw Average
        raw_avg = np.mean(velocities) if velocities else 0.0

        # 2. APPLY EMA SMOOTHING (Low-Pass Filter)
        # Formula: Smooth = (alpha * current) + ((1 - alpha) * previous)
        self.smoothed_avg_velocity = (self.ALPHA * raw_avg) + ((1 - self.ALPHA) * self.smoothed_avg_velocity)

        metrics = {
            "people_count": len(track_ids),
            "avg_velocity": self.smoothed_avg_velocity, # Sending the CLEAN smoothed value
            "max_velocity": np.max(velocities) if velocities else 0.0,
        }
        
        return metrics, annotated_frame

    def _calculate_velocity(self, track_id, x, y):
        history = self.track_history[track_id]
        current_pos = np.array([float(x), float(y)])
        
        speed = 0.0
        if len(history) > 0:
            prev_pos = history[-1]
            speed = np.linalg.norm(current_pos - prev_pos)
            
        history.append(current_pos)

        # 3. MOTION DEAD ZONE (The "Anti-Jitter" Fix)
        # If the person moved less than 2.0 pixels, assume it's just camera noise.
        # This stops the graph from shaking when you sit still.
        if speed < 2.0:
            return 0.0

        return speed

    def _empty_payload(self):
        # If no one is seen, decay the velocity to 0 smoothly
        self.smoothed_avg_velocity = self.smoothed_avg_velocity * 0.5
        if self.smoothed_avg_velocity < 0.1: self.smoothed_avg_velocity = 0.0
            
        return {"people_count": 0, "avg_velocity": 0.0, "max_velocity": 0.0}