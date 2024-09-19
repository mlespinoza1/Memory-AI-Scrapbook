import logging
from flask import Flask, jsonify, request, render_template, abort, redirect, url_for, flash
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import HTTPException
from forms import MemoryForm, LoginForm, SignupForm
from urllib.parse import urlparse
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key'  # Change this to a random secret key
csrf = CSRFProtect(app)
bcrypt = Bcrypt(app)
Session(app)
jwt = JWTManager(app)

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

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"msg": "Missing Authorization Header"}), 401
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            current_user = get_jwt_identity()
            if not current_user:
                return jsonify({"msg": "Invalid or expired token"}), 401
        except Exception as e:
            return jsonify({"msg": "Invalid token format"}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def index():
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
@token_required
def dashboard():
    return render_template('dashboard.html', memories=memories)

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    user = next((user for user in users.values() if user.email == email), None)
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/logout')
def logout():
    logging.info("User logged out")
    return redirect(url_for('login'))

@app.route("/signup", methods=['POST'])
def signup():
    first_name = request.json.get('first_name', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    if email in [user.email for user in users.values()]:
        return jsonify({"msg": "Email already exists"}), 400
    
    user_id = str(len(users) + 1)
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(user_id, first_name, email, hashed_password)
    users[user_id] = new_user
    logging.info(f"New user created: {email}")
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/memories', methods=['GET', 'POST'])
@token_required
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
@token_required
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
@token_required
def search():
    query = request.args.get('query', '')
    results = [memory for memory in memories if query.lower() in memory['title'].lower()]
    return render_template('search_results.html', query=query, results=results)

@app.route('/api/search')
@token_required
def api_search():
    query = request.args.get('query', '').lower()
    results = [memory for memory in memories if query in memory['title'].lower()]
    return jsonify(results)

@app.route('/protected', methods=['GET'])
@token_required
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200

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
