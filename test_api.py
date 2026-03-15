import requests
import json

def test_api():
    url = "http://localhost:5000/api/generate-checklist"
    payload = {
        "prompt": "test mermer atölyesi",
        "scope": "general"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=60)
        print(f"Status Code: {response.status_code}")
        print("Response Content:")
        print(response.text[:500])
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
