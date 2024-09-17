# Updated Search Functionality Implementation Instructions

## 1. Update dashboard.html

Modify the `dashboard.html` file to include the new search bar:

1. Replace the existing search container with the following code:

```html
<div class="action-bar">
    <div class="button-container">
        <button class="action-button">Create Memory</button>
        <button class="action-button">Create Book</button>
    </div>
    <div class="search-container">
        <input type="text" id="search-input" placeholder="Search..." class="search-input-small">
        <div id="search-results" class="search-results"></div>
    </div>
</div>
```

2. Add the following script tag at the end of the file, just before the closing `</body>` tag:

```html
<script src="{{ url_for('static', filename='js/search.js') }}"></script>
```

## 2. Create search.js

Create a new file named `search.js` in the `static/js/` directory and add the following content:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

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
                        div.classList.add('search-result-item');
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

## 3. Update style.css

Add the following styles to your `style.css` file:

```css
.action-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    gap: 10px;
}

.search-container {
    position: relative;
}

.search-input-small {
    width: 150px;
    padding: 5px 10px;
    border: 1px solid #A2C7BE;
    border-radius: 20px;
    transition: width 0.3s ease-in-out;
}

.search-input-small:focus {
    width: 300px;
    outline: none;
}

.search-results {
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

.search-result-item {
    padding: 10px;
    cursor: pointer;
}

.search-result-item:hover {
    background-color: #F0EFE9;
}
```

## 4. Update main.py

Add a new route for the search API in `main.py`:

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

## 5. Implement Fuzzy Search (Optional)

For fuzzy search, install the `fuzzywuzzy` library:

```
pip install fuzzywuzzy[speedup]
```

Then update the `api_search` function in `main.py`:

```python
from fuzzywuzzy import fuzz

@app.route('/api/search')
def api_search():
    query = request.args.get('query', '').lower()
    memories = [
        {"id": 1, "title": "Summer Vacation", "date": "2023-07-15"},
        {"id": 2, "title": "Family Reunion", "date": "2023-08-05"},
        {"id": 3, "title": "Graduation Day", "date": "2023-06-10"},
        {"id": 4, "title": "First Day at Work", "date": "2023-09-01"},
    ]
    results = [
        memory for memory in memories
        if fuzz.partial_ratio(query, memory['title'].lower()) > 70
    ]
    return jsonify(results)
```

These updated instructions take into account your existing project structure and maintain consistency with your current design. The search functionality is now integrated into the action bar alongside the "Create Memory" and "Create Book" buttons, with a smaller initial size that expands when focused.
