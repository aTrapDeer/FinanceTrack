from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'database.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            Hours REAL NOT NULL,
            Rate REAL NOT NULL,
            Pay REAL GENERATED ALWAYS AS (Hours * Rate) STORED
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()  # Initialize the database

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    username = request.args.get('username')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM jobs WHERE username = ?', (username,))
    jobs = cursor.fetchall()
    total_pay = sum(job['Pay'] for job in jobs)
    conn.close()
    return jsonify({"jobs": [dict(job) for job in jobs], "totalPay": total_pay})

@app.route('/api/jobs', methods=['POST'])
def add_job():
    job_data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO jobs (username, Hours, Rate) VALUES (?, ?, ?)',
                   (job_data['username'], job_data['hours'], job_data['rate']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Job added successfully"}), 201

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM jobs WHERE id = ?', (job_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Job deleted successfully"}), 200

@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    username = request.args.get('username')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM expenses WHERE username = ?', (username,))
    expenses = cursor.fetchall()
    total_expenses = sum(expense['amount'] for expense in expenses)
    conn.close()
    return jsonify({"expenses": [dict(expense) for expense in expenses], "totalExpenses": total_expenses})

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    expense_data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO expenses (username, amount, description) VALUES (?, ?, ?)',
                   (expense_data['username'], expense_data['amount'], expense_data['description']))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense added successfully"}), 201

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense deleted successfully"}), 200

@app.route('/api/reset', methods=['DELETE'])
def reset_all():
    username = request.args.get('username')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM jobs WHERE username = ?', (username,))
    cursor.execute('DELETE FROM expenses WHERE username = ?', (username,))
    conn.commit()
    conn.close()
    return jsonify({"message": "All data reset for user"}), 200

if __name__ == '__main__':
    app.run(debug=True)