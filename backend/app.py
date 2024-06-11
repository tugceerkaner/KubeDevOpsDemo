import os
import psycopg2
from flask import Flask, jsonify, request
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
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True  # Ensure autocommit is enabled
    print("Database connection established.")

except psycopg2.Error as e:
    print(f"Error connecting to database: {e}")


@app.route("/")
def home():
    return "Welcome to the backend!"


@app.route("/api/message", methods=["GET"])
def get_message():
    return jsonify({"message": "Hello from the backend!"})


@app.route("/api/check_connection", methods=["GET"])
def check_connection():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT current_database(), current_schema()")
        db_info = cursor.fetchone()
        cursor.close()
        return jsonify(
            {
                "status": "success",
                "message": f"Connected to database: {db_info[0]}, schema: {db_info[1]}",
            }
        )
    except psycopg2.Error as e:
        print(f"Error checking connection: {e}")
        return (
            jsonify({"status": "error", "message": f"Database connection failed: {e}"}),
            500,
        )


@app.route("/api/messages", methods=["GET"])
def fetch_messages():
    try:
        cursor = conn.cursor()
        print("Executing SELECT name, message FROM messages")
        cursor.execute("SELECT name, message FROM messages")
        messages = cursor.fetchall()
        print(f"Fetched messages: {messages}")
        cursor.close()
        return jsonify(
            [{"name": name, "message": message} for name, message in messages]
        )
    except psycopg2.Error as e:
        print(f"Error fetching messages: {e}")
        conn.rollback()  # Rollback any failed transaction
        if cursor:
            cursor.close()
        return jsonify({"error": str(e)}), 500


@app.route("/api/messages", methods=["POST"])
def add_message():
    try:
        data = request.get_json()
        name = data["name"]
        message = data["message"]
        cursor = conn.cursor()
        print(f"Inserting message: name={name}, message={message}")
        cursor.execute(
            "INSERT INTO messages (name, message) VALUES (%s, %s)",
            (name, message),
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