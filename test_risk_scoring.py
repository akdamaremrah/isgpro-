import requests
import json

def test_scoring_logic():
    url = "http://localhost:5000/api/generate-risks"
    payload = {
        "context": "Ağır Makine Atölyesi",
        "hazards": ["Pres Makinesinde Sıkışma (Uzuv Kaybı Riski)", "Hafif Tozlanma"],
        "scope": "specific"
    }
    headers = {"Content-Type": "application/json"}
    
    try:
        print("Scoring mantığı test ediliyor...")
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=60)
        if response.status_code == 200:
            result = response.json()
            for row in result:
                risk_score = row['initialProbability'] * row['initialSeverity'] * row['initialFrequency']
                print(f"\nTehlike: {row['hazard']}")
                print(f"Risk Etkisi: {row['riskEffect']}")
                print(f"Puanlama: O:{row['initialProbability']} x Ş:{row['initialSeverity']} x F:{row['initialFrequency']} = {risk_score}")
                
                # Doğrulama kriterleri
                if "uzuv" in row['hazard'].lower() or "kaybı" in row['hazard'].lower():
                    if row['initialSeverity'] >= 15:
                        print("✅ Şiddet puanı (15+) doğru şekilde yüksek seçildi.")
                    else:
                        print("❌ HATA: Ciddi risk için şiddet puanı çok düşük!")
                
                if row['initialSeverity'] == row['finalSeverity']:
                    print("✅ İlk şiddet = Son şiddet kuralına uyuldu.")
                else:
                    print(f"❌ HATA: Şiddet değerleri tutarsız! ({row['initialSeverity']} vs {row['finalSeverity']})")
        else:
            print(f"API Hatası: {response.status_code}")
    except Exception as e:
        print(f"Bağlantı Hatası: {e}")

if __name__ == "__main__":
    test_scoring_logic()
