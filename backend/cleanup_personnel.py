import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app import app, db, sync_risk_assessment_team
from models import Personnel, Company

def cleanup():
    with app.app_context():
        print("Starting cleanup of skeletal personnel records...")
        
        # 1. Identify skeletal records (TC is 00000000000 or similar dummy)
        skeletal = Personnel.query.filter(Personnel.tc_no.like('00000%')).all()
        count = len(skeletal)
        
        for p in skeletal:
            print(f"Deleting skeletal personnel: {p.first_name} {p.last_name} (ID: {p.id})")
            db.session.delete(p)
        
        db.session.commit()
        print(f"Successfully deleted {count} skeletal records.")
        
        # 2. Trigger sync for all companies to rebuild risk teams correctly
        print("Re-syncing all companies...")
        companies = Company.query.all()
        for c in companies:
            print(f"Syncing Risk Team for: {c.short_name}")
            sync_risk_assessment_team(c.id)
            
        print("Cleanup and Re-sync complete!")

if __name__ == "__main__":
    cleanup()
