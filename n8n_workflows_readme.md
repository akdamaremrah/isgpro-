# n8n Workflow Definitions for ISG Pro+

This document defines the JSON structure and logic for n8n workflows to integrate with the ISG Pro+ backend.

## 1. Smart Document Generator
**Trigger:** Webhook POST from Backend (`/api/n8n/callback`)
**Expected Payload:**
```json
{
  "event": "DOCUMENT_REQUESTED",
  "data": {
    "type": "Employee_Representative_Form",
    "company_id": 123,
    "company_name": "Aksa Isı",
    "variables": {
       "date": "2024-03-08",
       "representative_name": "Ali Yılmaz"
    }
  }
}
```
**n8n Logic:**
1. Fetch template from Google Drive/Local.
2. Replace `{{variables}}`.
3. Convert to PDF.
4. Upload to storage.
5. POST result back to `app.py` (`/api/n8n/callback`) with `{"event": "DOCUMENT_GENERATED", "data": {"pdf_url": "..."}}`.

---

## 2. Proactive ISG Alert Engine
**Trigger:** CRON (Daily at 01:00)
**n8n Logic:**
1. HTTP Request to Backend (`GET /api/alerts/expiring-records`).
2. Loop through results.
3. Send Email (SendGrid) or SMS (Twilio/Local provider).
4. Mark as "Alert Sent" in DB via HTTP Request.

---

## 3. Reactive Team Synchronization
**Trigger:** Webhook POST from Backend (`PERSONNEL_UPLOADED` or `COMPANY_CREATED`)
**Expected Payload:**
```json
{
  "event": "BULK_UPLOAD_COMPLETED",
  "data": {
    "company_id": 456,
    "success_count": 50
  }
}
```
**n8n Logic:**
1. Fetch current employee count.
2. Apply 30/40/50 rule:
   - Çok Tehlikeli: 30 personelde 1 destek elemanı.
   - Tehlikeli: 40 personelde 1.
   - Az Tehlikeli: 50 personelde 1.
3. If count is insufficient, POST back to `/api/n8n/callback` with `{"event": "COMPLIANCE_ISSUE", "data": {"type": "EmergencyTeam", "missing": 2}}`.
