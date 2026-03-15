import requests
import os
import threading
from flask import current_app

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook-test/isg-events")

def emit_event(event_type, payload):
    """
    Sends a JSON payload to n8n webhook URL in a background thread.
    """
    def send():
        try:
            data = {
                "event": event_type,
                "timestamp": None, # Will be set below
                "data": payload
            }
            # Add timestamp if possible, otherwise skip or import datetime
            from datetime import datetime
            data["timestamp"] = datetime.now().isoformat()
            
            response = requests.post(N8N_WEBHOOK_URL, json=data, timeout=5)
            if response.status_code >= 400:
                print(f"Webhook error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Failed to emit event {event_type}: {e}")

    # Run in background to not block the main request
    thread = threading.Thread(target=send)
    thread.start()
