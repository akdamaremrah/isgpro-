import requests
import json

def test_granularity():
    url = "http://localhost:5000/api/generate-risks"
    # Sadece 2 madde gönderiyoruz, ancak sistem talimatı gereği en az 6-8 madde bekliyoruz
    payload = {
        "context": "Mermer Atölyesi",
        "hazards": ["Yüksek Gürültü", "Toz Maruziyeti"],
        "scope": "general"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Sending request to {url} with 2 hazards...")
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=60)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Generated {len(result)} risk rows.")
            for i, row in enumerate(result[:5]):
                print(f"Row {i+1}: {row.get('activity')} | {row.get('hazard')}")
            
            if len(result) >= 6:
                print("SUCCESS: Granularity improved (at least 3 rows per hazard).")
            else:
                print(f"WARNING: Granularity might still be low ({len(result)} rows).")
        else:
            print(f"Error Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_granularity()
