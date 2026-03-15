from app import app, db
from models import User

with app.app_context():
    db.create_all()
    print("Database tables created.")
    
    # Check if a default user exists, if not create one
    if not User.query.first():
        u = User(full_name='Emrah AKDAMAR', email='emrah@isgpro.com', password='password123', role='İş Güvenliği Uzmanı (A)')
        db.session.add(u)
        db.session.commit()
        print("Default user added.")
