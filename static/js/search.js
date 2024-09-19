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
                        const ul = document.createElement('ul');
                        ul.className = 'dashboard__search-results-list';
                        data.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'dashboard__search-result-item';
                            li.innerHTML = `
                                <h3>${item.title}</h3>
                                <p>${item.date}</p>
                            `;
                            li.addEventListener('click', () => {
                                console.log('Clicked:', item);
                                // TODO: Implement navigation to memory detail page
                            });
                            li.addEventListener('keypress', (e) => {
                                if (e.key === 'Enter') {
                                    console.log('Clicked:', item);
                                    // TODO: Implement navigation to memory detail page
                                }
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
