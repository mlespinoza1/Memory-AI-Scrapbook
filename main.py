from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
import whisper

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key
app.config['UPLOAD_FOLDER'] = 'uploads'  # Create this folder in your project directory
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16MB

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# This should be replaced with a database in a real application
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
    # In a real application, you would fetch the user's memories from a database
    # For now, we'll pass an empty list to be populated by JavaScript
    return render_template('dashboard.html', memories=[])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember', False)

        if not email or not password:
            flash('Please provide both email and password', 'error')
            return redirect(url_for('login'))

        user = next((user for user in users.values() if user.email == email), None)
        if user and check_password_hash(user.password, password):
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password', 'error')
    return render_template('login.html')

@app.route('/logout')
def logout():
    return redirect(url_for('login'))

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first_name = request.form.get('firstName')
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not first_name or not email or not password:
            flash('Please fill in all fields', 'error')
            return redirect(url_for('signup'))
        
        if email in [user.email for user in users.values()]:
            flash('Email already exists', 'error')
        else:
            user_id = str(len(users) + 1)
            new_user = User(user_id, first_name, email, generate_password_hash(password))
            users[user_id] = new_user
            flash("Welcome to Memory Nest! Your account has been created. Let's start preserving your memories together.", 'success')
            return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'success': False, 'message': 'No audio file part'}), 400
    
    file = request.files['audio']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Transcribe the audio file
        transcription = transcribe_audio(file_path)
        
        return jsonify({'success': True, 'message': 'File uploaded and transcribed successfully', 'transcription': transcription})
    
    return jsonify({'success': False, 'message': 'Invalid file type'}), 400

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def transcribe_audio(file_path):
    model = whisper.load_model("base")
    result = model.transcribe(file_path)
    return result["text"]

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
