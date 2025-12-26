import cv2
from vision_agent import VisionAgent
from fusion_engine import FusionEngine

def main():
    # 1. Initialize Subsystems
    vision = VisionAgent()
    brain = FusionEngine()
    
    # 2. Open Camera (0 = Webcam)
    cap = cv2.VideoCapture(0)
    
    print("🚀 ARGUS-AI System Online. Press 'q' to exit.")

    while True:
        ret, frame = cap.read()
        if not ret: break

        # --- STEP 1: SEE ---
        metrics, annotated_frame = vision.extract_metrics(frame)

        # --- STEP 2: THINK ---
        intelligence = brain.analyze_risk(metrics)

        # --- STEP 3: VISUALIZE ---
        risk = intelligence['risk_score']
        
        # Dynamic Color: Green (Safe) -> Red (Danger)
        color = (0, 255, 0) 
        if risk > 40: color = (0, 255, 255) # Yellow
        if risk > 75: color = (0, 0, 255)   # Red

        # Draw the HUD
        cv2.rectangle(annotated_frame, (0, 0), (600, 80), (0,0,0), -1)
        cv2.putText(annotated_frame, f"RISK SCORE: {risk}", (20, 40), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
        
        if intelligence['reasons']:
            cv2.putText(annotated_frame, " | ".join(intelligence['reasons']), (20, 70), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

        cv2.imshow("ARGUS-AI Commander", annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()