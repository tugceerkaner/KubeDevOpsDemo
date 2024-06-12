import os
import psycopg2
from flask import Flask, jsonify, request
from datetime import datetime, timezone
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database connection details
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")

print(f"Connecting to database {DB_NAME} at {DB_HOST} as user {DB_USER}")

DATABASE_URL = (
    f"dbname='{DB_NAME}' "
    f"user='{DB_USER}' "
    f"password='{DB_PASSWORD}' "
    f"host='{DB_HOST}'"
)

# Establish a connection to the database
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True  # Ensure autocommit is enabled
        print("Database connection established.")
        return conn
    except psycopg2.Error as e:
        print(f"Error connecting to database: {e}")
        return None

# Create a global variable to hold the connection
conn = get_db_connection()

@app.route("/")
def home():
    return "Welcome to the backend!"

@app.route("/api/message", methods=["GET"])
def get_message():
    return jsonify({
        "message": "Hello from the backend!",
        "success": True
    })

@app.route("/api/check_connection", methods=["GET"])
def check_connection():
    global conn
    try:
        # Ensure the connection is open and valid
        if not conn or conn.closed != 0:
            conn = get_db_connection()
            if not conn:
                raise psycopg2.OperationalError("Database connection could not be established.")

        cursor = conn.cursor()
        cursor.execute("SELECT current_database(), current_schema()")
        db_info = cursor.fetchone()
        cursor.close()
        
        return jsonify(
            {
                "status": "success",
                "message": f"Connected to database: {db_info[0]}, schema: {db_info[1]}"
            }
        )
    except psycopg2.OperationalError as e:
        print(f"Operational error: {e}")
        return jsonify({"status": "error", "message": f"Operational error: {e}"}), 500
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return jsonify({"status": "error", "message": f"Database error: {e}"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"status": "error", "message": f"Unexpected error: {e}"}), 500

@app.route("/api/messages", methods=["GET"])
def fetch_messages():
    global conn
    try:
        if not conn or conn.closed != 0:
            conn = get_db_connection()
            if not conn:
                raise psycopg2.OperationalError("Database connection could not be established.")
                
        cursor = conn.cursor()
        cursor.execute("SELECT name, email, message, created_at FROM messages")
        messages = cursor.fetchall()
        cursor.close()
        return jsonify(
            [{"name": name, "email": email, "message": message, "created_at": created_at.isoformat()} for name, email, message, created_at in messages]
        )
    except psycopg2.Error as e:
        print(f"Error fetching messages: {e}")
        conn.rollback()  # Rollback any failed transaction
        if cursor:
            cursor.close()
        return jsonify({"error": str(e)}), 500

@app.route("/api/message/add", methods=["POST"])
def add_message():
    global conn
    try:
        if not conn or conn.closed != 0:
            conn = get_db_connection()
            if not conn:
                raise psycopg2.OperationalError("Database connection could not be established.")
                
        data = request.get_json()
        name = data["name"]
        email = data["email"]
        message = data["message"]
        created_at = datetime.now(timezone.utc)  
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO messages (name, email, message, created_at) VALUES (%s, %s, %s, %s)",
            (name, email, message, created_at),
        )
        cursor.close()
        return jsonify({"status": "success", "message": "Message added successfully."})
    except psycopg2.Error as e:
        print(f"Error adding message: {e}")
        conn.rollback()  # Rollback any failed transaction
        if cursor:
            cursor.close()
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
