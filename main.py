from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a random secret key

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# This should be replaced with a database in a real application
users = {}

class User(UserMixin):
    def __init__(self, id, first_name, email, password):
        self.id = id
        self.first_name = first_name
        self.email = email
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = next((user for user in users.values() if user.email == email), None)
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        first_name = request.form['firstName']
        email = request.form['email']
        password = request.form['password']
        if email in [user.email for user in users.values()]:
            flash('Email already exists')
        else:
            user_id = str(len(users) + 1)
            new_user = User(user_id, first_name, email, generate_password_hash(password))
            users[user_id] = new_user
            flash("Welcome to Memory Nest! Your account has been created. Let's start preserving your memories together.", 'success')
            return redirect(url_for('login'))
    return render_template('signup.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
