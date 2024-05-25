from datetime import datetime
import time
from psycopg2 import connect, extras

retry = 3
while retry > 0:
    try:
        print("Connecting to database...")
        conn = connect(
            dbname="postgres",
            user="postgres",
            password="password",
            # host="localhost",
            host="postgres",
            port="5432"
        )
        break
    except Exception as e:
        print(e)
        retry -= 1

        print("Retrying... " + str(retry) + " attempts left.")
        time.sleep(5)

conn.autocommit = True
cur = conn.cursor(cursor_factory=extras.DictCursor)

def table_exists(table_name):
    cur.execute(f"""
        SELECT EXISTS (
            SELECT FROM pg_tables
            WHERE  schemaname = 'public'
            AND    tablename  = '{table_name}'
        )
    """)
    return cur.fetchone()[0]

def reset_db():
    cur.execute("DROP TABLE IF EXISTS tickets CASCADE")
    cur.execute("DROP TABLE IF EXISTS messages CASCADE")
    if not table_exists("tickets"):
        cur.execute("""
            CREATE TABLE tickets (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                status VARCHAR(255),
                assignee VARCHAR(255),
                reported_by VARCHAR(255),
                priority VARCHAR(255),
                description TEXT,
                thread_id VARCHAR(255),
                created_at INTEGER,
                updated_at INTEGER
            )
        """)
    if not table_exists("messages"):
        cur.execute("""
            CREATE TABLE messages (
                id VARCHAR(255) PRIMARY KEY,
                ticket_id INTEGER,
                FOREIGN KEY (ticket_id) REFERENCES tickets(id),
                thread_id VARCHAR(255),
                created_at INTEGER,
                message TEXT,
                sender VARCHAR(255)
            )
        """)
    if not table_exists("status_history"):
        cur.execute("""
            CREATE TABLE status_history (
                count INTEGER,
                ts INTEGER PRIMARY KEY
            )
        """)
# reset_db()

def read_tickets():
    cur.execute("SELECT * FROM tickets")
    return [dict(row) for row in cur.fetchall()]


def create_ticket(ticket, thread_id='N/A', ts=int(time.time())):
    cur.execute("""
        INSERT INTO tickets (title, status, assignee, priority, description, thread_id, created_at, updated_at, reported_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (ticket["title"], ticket["status"], ticket["assignee"], ticket["priority"], ticket["description"], thread_id, ts, ts, ticket['reported_by']))
    try:
        return cur.fetchone()
    except:
        return None

def update_ticket(ticket_id, ticket):
    cur.execute("SELECT * FROM tickets WHERE id = %s", (ticket_id,))
    if cur.rowcount == 0:
        return None
    cur.execute("""
        UPDATE tickets
        SET title = %s, status = %s, assignee = %s, priority = %s, description = %s, reported_by = %s
        WHERE id = %s
    """, (ticket["title"], ticket["status"], ticket["assignee"], ticket["priority"], ticket["description"], ticket['reported_by'], ticket_id))
    cur.execute("SELECT * FROM tickets WHERE id = %s", (ticket_id,))
    try:
        return dict(cur.fetchone())
    except:
        return None

def get_ticket(ticket_id):
    cur.execute("SELECT * FROM tickets WHERE id = %s", (ticket_id,))
    try:
        return dict(cur.fetchone())
    except:
        return None

def delete_ticket(ticket_id):
    try:
        cur.execute("DELETE FROM tickets WHERE id = %s", (ticket_id,))
        return True
    except:
        return False
    
def check_ticket_exists(thread_id):
    cur.execute("SELECT * FROM tickets WHERE thread_id = %s", (thread_id,))
    if cur.rowcount > 0:
        res = dict(cur.fetchone())
        return res['id'], res['updated_at']
    return False, None

def check_message_exists(message_id):
    cur.execute("SELECT * FROM messages WHERE id = %s", (message_id,))
    return cur.rowcount > 0

def create_message(message, grant_id=None):
    cur.execute("""
        INSERT INTO messages (id, ticket_id, thread_id, created_at, message, sender)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (message["message_id"], message["ticket_id"], message["thread_id"], message['message_created_at'], message["original_message"], message["sender"]))
    cur.execute("UPDATE tickets SET updated_at = %s WHERE id = %s", (message['message_created_at'], message['ticket_id']))

def get_ticket_messages(ticket_id):
    cur.execute("SELECT * FROM messages WHERE ticket_id = %s", (ticket_id,))
    return [dict(row) for row in cur.fetchall()]

def get_active_tickets():
    cur.execute("SELECT * FROM tickets WHERE status != 'Closed'")
    return [dict(row) for row in cur.fetchall()]

def log_pending_tickets(count):
    if not table_exists("status_history"):
        cur.execute("""
            CREATE TABLE status_history (
                count INTEGER,
                ts INTEGER PRIMARY KEY
            )
        """)
    now = datetime.now()
    rounded_time = now.replace(minute=0, second=0, microsecond=0)
    timestamp = int(rounded_time.timestamp())
    cur.execute("SELECT * FROM status_history WHERE ts = %s", (timestamp,))
    if cur.rowcount == 0:
        cur.execute("INSERT INTO status_history (count, ts) VALUES (%s, %s)", (count, timestamp))

    cur.execute("DELETE FROM status_history WHERE ts < %s", (int(time.time()) - 2*86400,))

def get_status_history():
    cur.execute("SELECT * FROM status_history WHERE ts > %s", (int(time.time()) - 86400,))
    return [dict(row) for row in cur.fetchall()]

def create_ticket_message(message, ticket_id):
    cur.execute("SELECT thread_id FROM tickets WHERE id = %s", (ticket_id,))
    thread_id = cur.fetchone()[0]
    cur.execute("""
        INSERT INTO messages (id, ticket_id, thread_id, created_at, message, sender)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (message.id, ticket_id, thread_id, message.date, message.body, message.from_[0]['email']))
    cur.execute("UPDATE tickets SET updated_at = %s WHERE id = %s", (message.date, ticket_id))