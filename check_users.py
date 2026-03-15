import sqlite3
import os

db_path = os.path.join('backend', 'isg.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
else:
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT id, full_name, email, role, is_active FROM users;")
        rows = cursor.fetchall()
        if not rows:
            print("No users found in the database.")
        else:
            print(f"Found {len(rows)} users:")
            for row in rows:
                print(row)
        conn.close()
    except Exception as e:
        print(f"Error: {e}")
