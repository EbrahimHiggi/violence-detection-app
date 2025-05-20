import sys
import cv2
from ultralytics import YOLO
import os
import time

model = YOLO('yolov8n.pt')  

video_path = sys.argv[1]
camera_id = sys.argv[2]

cap = cv2.VideoCapture(video_path)
frame_count = 0
violence_counter = 0
violence_threshold = 3  

os.makedirs("captured_violence", exist_ok=True)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1

    if frame_count % 15 == 0:  
        results = model.predict(frame, save=False, imgsz=640, verbose=False)

        
        boxes = results[0].boxes
        if len(boxes) > 0:
            violence_counter += 1
        else:
            violence_counter = 0

     
        if violence_counter >= violence_threshold:
            timestamp = time.strftime("%Y%m%d-%H%M%S")
            filename = f"captured_violence/camera_{camera_id}_{timestamp}.jpg"
            cv2.imwrite(filename, frame)
            print(f"VIOLENCE DETECTED {camera_id} {filename}")
            break

cap.release()
