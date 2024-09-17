# Detailed Search Implementation Instructions

## 1. Update dashboard.html

Open `dashboard.html` and locate the search-container div. Replace its contents with the following code:

```html
<div class="search-container">
    <form action="{{ url_for('search') }}" method="GET">
        <input type="text" name="query" placeholder="Search memories..." required>
        <button type="submit">Search</button>
    </form>
</div>
```

## 2. Update app.py

Open `app.py` and add the following import at the top of the file:

```python
from flask import request
```

Then, add the following route after your existing routes:

```python
@app.route('/search')
def search():
    query = request.args.get('query', '')
    # Mock memory data for demonstration
    memories = [
        {"id": 1, "title": "Summer Vacation", "date": "2023-07-15"},
        {"id": 2, "title": "Family Reunion", "date": "2023-08-05"},
        {"id": 3, "title": "Graduation Day", "date": "2023-06-10"},
        {"id": 4, "title": "First Day at Work", "date": "2023-09-01"},
    ]
    results = [memory for memory in memories if query.lower() in memory['title'].lower()]
    return render_template('search_results.html', query=query, results=results)
```

## 3. Create search_results.html

Create a new file named `search_results.html` in the templates folder with the following content:

```html
{% extends "base.html" %}
{% block content %}
<div class="search-results-container">
    <h2>Search Results for "{{ query }}"</h2>
    {% if results %}
        <ul class="search-results-list">
        {% for result in results %}
            <li class="search-result-item">
                <h3>{{ result.title }}</h3>
                <p>Date: {{ result.date }}</p>
            </li>
        {% endfor %}
        </ul>
    {% else %}
        <p>No results found.</p>
    {% endif %}
    <a href="{{ url_for('dashboard') }}" class="back-button">Back to Dashboard</a>
</div>
{% endblock %}
```

## 4. Update style.css

Open `style.css` and add the following styles:

```css
.search-container {
    margin: 20px 0;
    text-align: center;
}

.search-container input[type="text"] {
    padding: 10px;
    width: 70%;
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 20px 0 0 20px;
    outline: none;
}

.search-container button {
    padding: 10px 20px;
    background-color: #A2C7BE;
    color: white;
    border: none;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-container button:hover {
    background-color: #8EB5AB;
}

.search-results-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.search-results-list {
    list-style-type: none;
    padding: 0;
}

.search-result-item {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.search-result-item h3 {
    margin: 0 0 10px 0;
    color: #4A4A4A;
}

.back-button {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #E8D0C3;
    color: #4A4A4A;
    text-decoration: none;
    border-radius: 20px;
    transition: background-color 0.3s;
}

.back-button:hover {
    background-color: #D3A284;
}

@media (max-width: 600px) {
    .search-container input[type="text"] {
        width: 60%;
    }
}
```

## 5. Test the implementation

After making these changes:
1. Run your Flask application.
2. Navigate to the dashboard page.
3. Use the search bar to search for terms like "Summer" or "Day".
4. Verify that the search results page displays correctly.
5. Test the responsiveness on different screen sizes.

If you encounter any issues or need further assistance, please let me know.
