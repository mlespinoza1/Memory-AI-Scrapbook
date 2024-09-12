from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Replace with a real secret key in production

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# This is a simple user model. In a real application, you'd use a database.
class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

# For this example, we'll use a dictionary to store users. In a real app, use a database.
users = {
    'user1': User('1', 'user1', generate_password_hash('password1')),
    'user2': User('2', 'user2', generate_password_hash('password2'))
}

@login_manager.user_loader
def load_user(user_id):
    for user in users.values():
        if user.id == user_id:
            return user
    return None

@app.route("/")
@login_required
def index():
    return render_template("index.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = users.get(username)
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            flash('Username already exists')
        else:
            new_user = User(str(len(users) + 1), username, generate_password_hash(password))
            users[username] = new_user
            flash('Account created successfully. Please log in.')
            return redirect(url_for('login'))
    return render_template('signup.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
