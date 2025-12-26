import cv2
import json
import asyncio
import numpy as np
import random
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from vision_agent import VisionAgent
from fusion_engine import FusionEngine

# --- GLOBAL RESOURCES ---
class SystemState:
    camera = None
    vision = None
    brain = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 BOOTING ARGUS-AI SYSTEM...")
    SystemState.vision = VisionAgent()
    SystemState.brain = FusionEngine()
    
    # Try index 0, then 1
    SystemState.camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not SystemState.camera.isOpened():
        print("⚠️ Camera 0 failed, trying index 1...")
        SystemState.camera = cv2.VideoCapture(1, cv2.CAP_DSHOW)
    
    if SystemState.camera.isOpened():
        print("✅ CAMERA LOCKED & LOADED")
    else:
        print("❌ CRITICAL: NO CAMERA FOUND")

    yield
    print("🛑 SHUTTING DOWN...")
    if SystemState.camera:
        SystemState.camera.release()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_heatmap(risk_score):
    """
    Generates an 8x8 abstract grid based on risk intensity.
    Real systems map XY coordinates; for this MVP, we simulate
    spatial distribution based on overall threat level.
    0 = Empty/Safe, 1 = Low, 2 = Med, 3 = Critical
    """
    grid = [[0 for _ in range(8)] for _ in range(8)]
    
    # Number of 'hot' cells depends on risk
    active_cells = int((risk_score / 100) * 40) + random.randint(2, 5)
    
    for _ in range(active_cells):
        r, c = random.randint(0, 7), random.randint(0, 7)
        # Intensity
        val = 1
        if risk_score > 40: val = 2
        if risk_score > 75: val = 3
        grid[r][c] = val
        
    return grid

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    prev_risk = 0
    risk_momentum = 0

    try:
        while True:
            if not SystemState.camera or not SystemState.camera.isOpened():
                await asyncio.sleep(1)
                continue

            ret, frame = SystemState.camera.read()
            if not ret:
                await asyncio.sleep(0.1)
                continue

            metrics, _ = SystemState.vision.extract_metrics(frame)
            intelligence = SystemState.brain.analyze_risk(metrics)
            
            current_risk = intelligence['risk_score']

            # Momentum & Prediction
            delta = current_risk - prev_risk
            risk_momentum = (0.7 * risk_momentum) + (0.3 * delta)
            
            predicted_risk = current_risk + (risk_momentum * 5)
            predicted_risk = max(0, min(100, predicted_risk))
            
            # Escalation Tag
            escalation = "Stable"
            if risk_momentum > 2: escalation = "CRITICAL SURGE"
            elif risk_momentum > 0.5: escalation = "Rapid Rise"
            elif risk_momentum > 0: escalation = "Gradual"
            elif risk_momentum < 0: escalation = "De-escalating"
            
            prev_risk = current_risk

            # Payload
            payload = {
                "risk_score": int(current_risk),
                "predicted_risk": int(predicted_risk),
                "people_count": metrics['people_count'],
                "avg_velocity": round(metrics['avg_velocity'], 1),
                "reasons": intelligence['reasons'],
                "escalation": escalation,
                "heatmap": generate_heatmap(current_risk) # <--- NEW DATA
            }

            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(0.033)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"⚠️ ERROR: {e}")