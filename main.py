import logging
from flask import Flask, jsonify, request, render_template, abort, redirect, url_for, flash
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import HTTPException
from forms import MemoryForm, LoginForm, SignupForm
from urllib.parse import urlparse

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key
csrf = CSRFProtect(app)

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO)

# Mock database (replace with actual database in production)
memories = [
    {"id": 1, "title": "Summer Vacation", "date": "2023-07-15", "description": "A wonderful trip to the beach"},
    {"id": 2, "title": "Family Reunion", "date": "2023-08-05", "description": "Great time with extended family"},
    {"id": 3, "title": "Graduation Day", "date": "2023-06-10", "description": "Proud moment receiving my diploma"},
    {"id": 4, "title": "First Day at Work", "date": "2023-09-01", "description": "Exciting start to my career"},
]

users = {}

class User:
    def __init__(self, id, first_name, email, password):
        self.id = id
        self.first_name = first_name
        self.email = email
        self.password = password

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', memories=memories)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data
        remember = form.remember.data

        user = next((user for user in users.values() if user.email == email), None)
        if user and check_password_hash(user.password, password):
            logging.info(f"User logged in: {email}")
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    logging.info("User logged out")
    return redirect(url_for('login'))

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        first_name = form.first_name.data
        email = form.email.data
        password = form.password.data
        
        if email in [user.email for user in users.values()]:
            flash('Email already exists', 'error')
        else:
            user_id = str(len(users) + 1)
            new_user = User(user_id, first_name, email, generate_password_hash(password))
            users[user_id] = new_user
            logging.info(f"New user created: {email}")
            flash("Welcome to Memory Nest! Your account has been created.", 'success')
            return redirect(url_for('login'))
    return render_template('signup.html', form=form)

@app.route('/memories', methods=['GET', 'POST'])
def handle_memories():
    if request.method == 'GET':
        return jsonify(memories)
    elif request.method == 'POST':
        form = MemoryForm()
        if form.validate_on_submit():
            new_memory = {
                "id": len(memories) + 1,
                "title": form.title.data,
                "date": form.date.data.strftime("%Y-%m-%d"),
                "description": form.description.data
            }
            memories.append(new_memory)
            logging.info(f"New memory created: {new_memory['title']}")
            return jsonify(new_memory), 201
        return jsonify({"errors": form.errors}), 400

@app.route('/memories/<int:memory_id>', methods=['GET', 'PUT', 'DELETE'])
def handle_memory(memory_id):
    memory = next((m for m in memories if m['id'] == memory_id), None)
    if not memory:
        abort(404)

    if request.method == 'GET':
        return jsonify(memory)
    elif request.method == 'PUT':
        form = MemoryForm()
        if form.validate_on_submit():
            memory['title'] = form.title.data
            memory['date'] = form.date.data.strftime("%Y-%m-%d")
            memory['description'] = form.description.data
            logging.info(f"Memory updated: {memory['title']}")
            return jsonify(memory)
        return jsonify({"errors": form.errors}), 400
    elif request.method == 'DELETE':
        memories.remove(memory)
        logging.info(f"Memory deleted: {memory['title']}")
        return '', 204

@app.route('/search')
def search():
    query = request.args.get('query', '')
    results = [memory for memory in memories if query.lower() in memory['title'].lower()]
    return render_template('search_results.html', query=query, results=results)

@app.route('/api/search')
def api_search():
    query = request.args.get('query', '').lower()
    results = [memory for memory in memories if query in memory['title'].lower()]
    return jsonify(results)

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    logging.error('Server Error: %s', (error))
    return render_template('500.html'), 500

@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return e
    logging.error('Unhandled Exception: %s', (e))
    return render_template("500.html"), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
