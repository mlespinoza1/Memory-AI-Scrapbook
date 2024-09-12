from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
