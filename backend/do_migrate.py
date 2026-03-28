import sqlite3, psycopg2, json, sys, os

PG_URL = 'postgresql://postgres:CneKqSDrVNWHUGWUQHQapkORIAsHgabP@hopper.proxy.rlwy.net:36704/railway'
LOCATIONS_JSON = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'turkeyLocations.json')

print("SQLite baglaniyor...", flush=True)
sq = sqlite3.connect('isg.db')
sq.row_factory = sqlite3.Row
sq_cur = sq.cursor()

print("PostgreSQL baglaniyor...", flush=True)
pg = psycopg2.connect(PG_URL, connect_timeout=15)
pg.autocommit = True
pg_cur = pg.cursor()

pg_cur.execute("""
    SELECT pg_terminate_backend(pid) FROM pg_stat_activity
    WHERE datname = current_database() AND pid <> pg_backend_pid() AND state = 'idle in transaction'
""")
pg.autocommit = False

def get_bool_cols(table):
    pg_cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = %s AND data_type = 'boolean'
    """, (table,))
    return {r[0] for r in pg_cur.fetchall()}

sq_cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
tables = set(r[0] for r in sq_cur.fetchall())

order = [
    'danger_classes', 'nace_codes', 'cities', 'districts',
    'companies', 'users', 'personnel',
    'company_professionals', 'assignments', 'risk_assessments',
    'trainings', 'training_documents',
    'health_records', 'health_documents', 'documents', 'periodic_controls'
]
ordered = [t for t in order if t in tables] + [t for t in tables if t not in order]

# Tum tablolari temizle
print("Tablolar temizleniyor...", flush=True)
for table in reversed(ordered):
    try:
        pg_cur.execute(f'TRUNCATE TABLE "{table}" CASCADE')
    except Exception as e:
        pg.rollback()
        print(f'  TRUNCATE {table}: {e}', flush=True)
try:
    pg.commit()
    print("Temizleme tamam.", flush=True)
except Exception as e:
    pg.rollback()
    print(f"TRUNCATE commit hatasi: {e}", flush=True)

# Cities ve Districts'i JSON'dan seed et
print("Sehirler JSON'dan yukleniyor...", flush=True)
with open(LOCATIONS_JSON, encoding='utf-8') as f:
    locations = json.load(f)

city_rows = [(c['id'], c['name']) for c in locations]
district_rows = [(d['id'], d['name'], c['id']) for c in locations for d in c['districts']]

try:
    pg_cur.executemany('INSERT INTO cities (id, name) VALUES (%s, %s) ON CONFLICT DO NOTHING', city_rows)
    pg.commit()
    print(f"  cities: {len(city_rows)} sehir eklendi", flush=True)
    pg_cur.execute("SELECT setval(pg_get_serial_sequence('cities','id'), COALESCE((SELECT MAX(id) FROM cities),1))")
    pg.commit()
except Exception as e:
    pg.rollback()
    print(f"  cities hatasi: {e}", flush=True)

try:
    pg_cur.executemany('INSERT INTO districts (id, name, city_id) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING', district_rows)
    pg.commit()
    print(f"  districts: {len(district_rows)} ilce eklendi", flush=True)
    pg_cur.execute("SELECT setval(pg_get_serial_sequence('districts','id'), COALESCE((SELECT MAX(id) FROM districts),1))")
    pg.commit()
except Exception as e:
    pg.rollback()
    print(f"  districts hatasi: {e}", flush=True)

# Diger tablolari SQLite'tan aktar (cities/districts atla)
skip = {'cities', 'districts'}
for table in ordered:
    if table in skip:
        continue
    sq_cur.execute(f'SELECT * FROM {table}')
    rows = sq_cur.fetchall()
    if not rows:
        print(f'  {table}: bos, atlaniyor', flush=True)
        continue

    cols = [d[0] for d in sq_cur.description]
    bool_cols = get_bool_cols(table)

    placeholders = ','.join(['%s'] * len(cols))
    col_names = ','.join(f'"{c}"' for c in cols)
    insert_sql = f'INSERT INTO "{table}" ({col_names}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

    data = []
    for row in rows:
        converted = []
        for col, val in zip(cols, list(row)):
            if col in bool_cols and isinstance(val, int):
                converted.append(bool(val))
            else:
                converted.append(val)
        data.append(converted)

    BATCH = 500
    count = 0
    for i in range(0, len(data), BATCH):
        batch = data[i:i+BATCH]
        try:
            pg_cur.executemany(insert_sql, batch)
            pg.commit()
            count += len(batch)
        except Exception as e:
            pg.rollback()
            print(f'  {table} batch hatasi: {e}', flush=True)
            break

    if 'id' in cols:
        try:
            pg_cur.execute(f"SELECT setval(pg_get_serial_sequence('{table}', 'id'), COALESCE((SELECT MAX(id) FROM \"{table}\"), 1))")
            pg.commit()
        except:
            pg.rollback()

    print(f'  {table}: {count}/{len(rows)} satir OK', flush=True)

sq.close()
pg.close()
print("\nMigration tamamlandi!", flush=True)
