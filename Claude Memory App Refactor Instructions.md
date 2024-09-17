# Replit AI Instructions: Dashboard Refactoring

Follow these steps to refactor the dashboard, improving modularity and preventing unintended style changes:

1. Update dashboard.html:
   - Open the file 'templates/dashboard.html'
   - Replace the entire content with the following HTML:

```html
<div class="dashboard">
    <header class="dashboard__header">
        <h1 class="dashboard__title">My Memory Nest</h1>
        <a href="{{ url_for('logout') }}" class="dashboard__logout-button">Logout</a>
    </header>

    <div class="dashboard__action-bar">
        <div class="dashboard__button-container">
            <button class="dashboard__action-button">Create Memory</button>
            <button class="dashboard__action-button">Create Book</button>
        </div>
        <div class="dashboard__search-container">
            <input type="text" id="search-input" placeholder="Search..." class="dashboard__search-input">
            <div id="search-results" class="dashboard__search-results"></div>
        </div>
    </div>

    <main class="dashboard__main">
        <div id="memoryGrid" class="dashboard__memory-grid">
            <!-- Memory items will be populated here -->
        </div>
    </main>

    <nav class="dashboard__toolbar">
        <a href="#" class="dashboard__toolbar-icon">Icon 1</a>
        <a href="#" class="dashboard__toolbar-icon">Icon 2</a>
        <a href="#" class="dashboard__toolbar-icon">Icon 3</a>
    </nav>
</div>

<script src="{{ url_for('static', filename='js/search.js') }}"></script>
```

2. Update style.css:
   - Open the file 'static/style.css'
   - Add the following CSS at the end of the file:

```css
/* Dashboard Styles */
.dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.dashboard__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.dashboard__title {
    font-size: 24px;
    color: #4A4A4A;
}

.dashboard__logout-button {
    padding: 8px 16px;
    background-color: #A2C7BE;
    color: white;
    border: none;
    border-radius: 20px;
    text-decoration: none;
}

.dashboard__action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.dashboard__button-container {
    display: flex;
    gap: 10px;
}

.dashboard__action-button {
    padding: 8px 16px;
    background-color: #A2C7BE;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

.dashboard__search-container {
    position: relative;
}

.dashboard__search-input {
    width: 150px;
    padding: 8px 16px;
    border: 1px solid #A2C7BE;
    border-radius: 20px;
    transition: width 0.3s ease-in-out;
}

.dashboard__search-input:focus {
    width: 300px;
    outline: none;
}

.dashboard__search-results {
    position: absolute;
    top: 100%;
    right: 0;
    width: 300px;
    max-height: 300px;
    overflow-y: auto;
    background-color: white;
    border: 1px solid #A2C7BE;
    border-radius: 0 0 20px 20px;
    display: none;
    z-index: 1000;
}

.dashboard__memory-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.dashboard__toolbar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 20px;
    background-color: white;
    padding: 10px 20px;
    border-radius: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard__toolbar-icon {
    color: #A2C7BE;
    text-decoration: none;
}
```

3. Create search.js:
   - Create a new file 'static/js/search.js'
   - Add the following JavaScript code to the file:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.querySelector('.dashboard__search-results');

    searchInput.addEventListener('focus', function() {
        this.placeholder = 'Type to search...';
    });

    searchInput.addEventListener('blur', function() {
        this.placeholder = 'Search...';
        setTimeout(() => {
            searchResults.style.display = 'none';
        }, 200);
    });

    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                searchResults.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.classList.add('dashboard__search-result-item');
                        div.textContent = `${item.title} - ${item.date}`;
                        div.addEventListener('click', () => {
                            // Navigate to memory detail page or perform desired action
                            console.log('Clicked:', item);
                        });
                        searchResults.appendChild(div);
                    });
                    searchResults.style.display = 'block';
                } else {
                    searchResults.style.display = 'none';
                }
            });
    }, 300));
});

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
```

4. Update main.py:
   - Open the file 'main.py'
   - Add the following route after the existing routes:

```python
from flask import jsonify

@app.route('/api/search')
def api_search():
    query = request.args.get('query', '').lower()
    # Mock memory data for demonstration
    memories = [
        {"id": 1, "title": "Summer Vacation", "date": "2023-07-15"},
        {"id": 2, "title": "Family Reunion", "date": "2023-08-05"},
        {"id": 3, "title": "Graduation Day", "date": "2023-06-10"},
        {"id": 4, "title": "First Day at Work", "date": "2023-09-01"},
    ]
    results = [memory for memory in memories if query in memory['title'].lower()]
    return jsonify(results)
```

These changes will refactor the dashboard to be more modular, implement the search functionality, and prevent unintended style changes. The search input will be on the same line as the action buttons and will expand when focused.
