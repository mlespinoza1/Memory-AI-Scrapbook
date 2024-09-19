// Constants
const DEBOUNCE_DELAY = 300;

// Utility functions
const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// DOM manipulation functions
const createMemoryCard = (memory) => {
    const { title, date, image } = memory;
    return `
        <div class="dashboard__memory-card">
            <img src="${sanitizeHTML(image)}" alt="${sanitizeHTML(title)}" class="dashboard__memory-card-image">
            <div class="dashboard__memory-card-info">
                <h3 class="dashboard__memory-card-title">${sanitizeHTML(title)}</h3>
                <p class="dashboard__memory-card-date">${sanitizeHTML(date)}</p>
            </div>
        </div>
    `;
};

const renderMemories = (memories) => {
    const memoryGrid = document.getElementById('memoryGrid');
    if (!memoryGrid) {
        console.error('Memory grid element not found');
        return;
    }
    memoryGrid.innerHTML = memories.map(createMemoryCard).join('');
};

// Event listeners
const attachEventListeners = () => {
    const createMemoryBtn = document.querySelector('.dashboard__action-button:nth-child(1)');
    const createBookBtn = document.querySelector('.dashboard__action-button:nth-child(2)');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (createMemoryBtn) {
        createMemoryBtn.addEventListener('click', () => {
            console.log('Create Memory button clicked');
            // Implement functionality to create a new memory
        });
    }

    if (createBookBtn) {
        createBookBtn.addEventListener('click', () => {
            console.log('Create Book button clicked');
            // Implement functionality to create a new book
        });
    }

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', debounce(() => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            performSearch(query);
        }, DEBOUNCE_DELAY));

        searchInput.addEventListener('focus', () => {
            searchInput.placeholder = 'Type to search...';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.placeholder = 'Search memories...';
            setTimeout(() => {
                searchResults.style.display = 'none';
            }, 200);
        });
    }
};

const performSearch = (query) => {
    const token = localStorage.getItem('access_token');
    fetch(`/api/search?query=${encodeURIComponent(query)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
};

const displaySearchResults = (results) => {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    if (results.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'dashboard__search-results-list';
        results.forEach(item => {
            const li = document.createElement('li');
            li.className = 'dashboard__search-result-item';
            li.innerHTML = `
                <h3>${sanitizeHTML(item.title)}</h3>
                <p>${sanitizeHTML(item.date)}</p>
            `;
            li.addEventListener('click', () => {
                window.location.href = `/memory/${item.id}`;
            });
            li.setAttribute('tabindex', '0');
            ul.appendChild(li);
        });
        searchResults.appendChild(ul);
        searchResults.style.display = 'block';
    } else {
        const noResults = document.createElement('p');
        noResults.className = 'dashboard__search-no-results';
        noResults.textContent = 'No results found';
        searchResults.appendChild(noResults);
        searchResults.style.display = 'block';
    }
};

// Main function
const initDashboard = () => {
    try {
        console.log('Initializing dashboard');
        
        // Fetch memories from the server
        const token = localStorage.getItem('access_token');
        fetch('/memories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                renderMemories(data);
                attachEventListeners();
                console.log('Dashboard initialized successfully');
            })
            .catch(error => {
                console.error('Error fetching memories:', error);
            });
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
};

// Initialize the dashboard when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initDashboard);
