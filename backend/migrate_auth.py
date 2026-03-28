import os
import sys
import psycopg2
from werkzeug.security import generate_password_hash

def run():
    db_url = os.environ.get('DATABASE_URL', '')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)

    if not db_url:
        print("ERROR: DATABASE_URL environment variable not set.")
        sys.exit(1)

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    # Add user_id column to companies if not exists
    cur.execute("""
        ALTER TABLE companies ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
    """)
    print("Ensured user_id column exists in companies table.")

    # Get first user id
    cur.execute("SELECT id, password FROM users ORDER BY id LIMIT 1")
    row = cur.fetchone()
    if row:
        user_id, password = row
        print(f"Found user id={user_id}")

        # Assign all companies to this user
        cur.execute("UPDATE companies SET user_id = %s WHERE user_id IS NULL", (user_id,))
        print(f"Updated {cur.rowcount} companies with user_id={user_id}")

        # Hash password if plain text
        if not (password.startswith('pbkdf2:') or password.startswith('scrypt:')):
            hashed = generate_password_hash(password)
            cur.execute("UPDATE users SET password = %s WHERE id = %s", (hashed, user_id))
            print(f"Hashed password for user id={user_id}")
        else:
            print(f"Password for user id={user_id} is already hashed, skipping.")
    else:
        print("No users found in database. Please create a user first.")

    conn.commit()
    cur.close()
    conn.close()
    print("Migration complete!")

if __name__ == '__main__':
    run()
