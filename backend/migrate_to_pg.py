"""
Migrate local SQLite (isg.db) to Railway PostgreSQL.
Run: python migrate_to_pg.py
"""
import sqlite3
import psycopg2

import os
PG_URL = os.environ.get("DATABASE_URL", "")
if not PG_URL:
    raise SystemExit("Hata: DATABASE_URL env değişkeni set edilmedi.\nÖrn: DATABASE_URL='postgresql://...' python migrate_to_pg.py")
SQLITE_PATH = "isg.db"

def get_tables(sqlite_cur):
    sqlite_cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    return [r[0] for r in sqlite_cur.fetchall()]

def get_columns(sqlite_cur, table):
    sqlite_cur.execute(f"PRAGMA table_info({table})")
    return [r[1] for r in sqlite_cur.fetchall()]

def get_bool_columns(pg_cur, table):
    pg_cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = %s AND data_type = 'boolean'
    """, (table,))
    return {r[0] for r in pg_cur.fetchall()}

def migrate():
    print("Connecting to SQLite...")
    sq = sqlite3.connect(SQLITE_PATH)
    sq.row_factory = sqlite3.Row
    sq_cur = sq.cursor()

    print("Connecting to PostgreSQL...")
    pg = psycopg2.connect(PG_URL)
    pg_cur = pg.cursor()

    tables = get_tables(sq_cur)
    print(f"Tables found: {tables}")

    # Disable FK checks for the session
    pg_cur.execute("SET session_replication_role = replica")
    pg.commit()

    # Disable FK checks order: insert in dependency order
    order = [
        'nace_codes', 'cities', 'districts', 'companies',
        'company_professionals', 'company_employees', 'assignments',
        'risk_assessments', 'risk_items', 'trainings', 'training_attendees',
        'training_documents', 'health_surveillance', 'users'
    ]
    # Add any table not in order list at the end
    ordered = [t for t in order if t in tables] + [t for t in tables if t not in order]

    for table in ordered:
        cols = get_columns(sq_cur, table)
        sq_cur.execute(f"SELECT * FROM {table}")
        rows = sq_cur.fetchall()
        if not rows:
            print(f"  {table}: empty, skipping")
            continue

        # Clear existing data in PG
        try:
            pg_cur.execute(f"TRUNCATE TABLE {table} CASCADE")
        except Exception as e:
            pg.rollback()
            print(f"  {table}: truncate failed ({e}), trying DELETE")
            try:
                pg_cur.execute(f"DELETE FROM {table}")
            except Exception as e2:
                pg.rollback()
                print(f"  {table}: skipping ({e2})")
                continue

        placeholders = ','.join(['%s'] * len(cols))
        col_names = ','.join(f'"{c}"' for c in cols)
        insert_sql = f'INSERT INTO "{table}" ({col_names}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

        bool_cols = get_bool_columns(pg_cur, table)
        count = 0
        for row in rows:
            try:
                values = []
                for col, val in zip(cols, list(row)):
                    if col in bool_cols and isinstance(val, int):
                        values.append(bool(val))
                    else:
                        values.append(val)
                pg_cur.execute(insert_sql, values)
                count += 1
            except Exception as e:
                pg.rollback()
                print(f"  {table}: row error {e}")
                break

        pg.commit()
        print(f"  {table}: {count} rows migrated")

        # Reset sequence if id column exists
        if 'id' in cols:
            try:
                pg_cur.execute(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM \"{table}\"), 1))")
                pg.commit()
            except:
                pg.rollback()

    # Re-enable FK checks
    pg_cur.execute("SET session_replication_role = DEFAULT")
    pg.commit()

    sq.close()
    pg.close()
    print("\nMigration complete!")

if __name__ == '__main__':
    migrate()
