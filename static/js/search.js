document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        searchInput.addEventListener('focus', function() {
            this.placeholder = 'Type to search...';
        });

        searchInput.addEventListener('blur', function() {
            this.placeholder = 'Search memories...';
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
                                console.log('Clicked:', item);
                            });
                            searchResults.appendChild(div);
                        });
                        searchResults.style.display = 'block';
                    } else {
                        searchResults.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                    searchResults.style.display = 'none';
                });
        }, 300));
    } else {
        console.error('Search elements not found');
    }
});

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
