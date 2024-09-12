document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Dashboard script started');

        const memoryGrid = document.getElementById('memoryGrid');
        const createMemoryBtn = document.getElementById('createMemory');
        const createBookBtn = document.getElementById('createBook');

        console.log('DOM elements retrieved:', { memoryGrid, createMemoryBtn, createBookBtn });

        if (!memoryGrid || !createMemoryBtn || !createBookBtn) {
            throw new Error('One or more required DOM elements not found');
        }

        // Sample data for memory cards (replace with actual data from the server)
        const memories = [
            { title: "Summer Vacation", date: "July 15, 2023", image: "https://placehold.co/600x400/A2C7BE/ffffff?text=Summer+Vacation" },
            { title: "Family Reunion", date: "August 5, 2023", image: "https://placehold.co/600x400/A2C7BE/ffffff?text=Family+Reunion" },
            { title: "Graduation Day", date: "June 10, 2023", image: "https://placehold.co/600x400/A2C7BE/ffffff?text=Graduation+Day" },
            { title: "First Day at Work", date: "September 1, 2023", image: "https://placehold.co/600x400/A2C7BE/ffffff?text=First+Day+at+Work" }
        ];

        function createMemoryCard(memory) {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <img src="${memory.image}" alt="${memory.title}">
                <div class="info">
                    <h3>${memory.title}</h3>
                    <p>${memory.date}</p>
                </div>
            `;
            return card;
        }

        function renderMemories() {
            console.log('Rendering memories');
            memoryGrid.innerHTML = '';
            memories.forEach(memory => {
                memoryGrid.appendChild(createMemoryCard(memory));
            });
            console.log('Memories rendered');
        }

        renderMemories();

        // Add event listeners for new buttons
        createMemoryBtn.addEventListener('click', function() {
            console.log('Create Memory button clicked');
            // Implement functionality to create a new memory
        });

        createBookBtn.addEventListener('click', function() {
            console.log('Create Book button clicked');
            // Implement functionality to create a new book
        });

        // Add event listeners for toolbar icons
        document.querySelectorAll('.toolbar-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.preventDefault();
                // Implement functionality for each icon (e.g., add new memory, open settings)
                console.log('Clicked:', this.querySelector('i').className);
            });
        });

        console.log('Dashboard script completed successfully');
    } catch (error) {
        console.error('Error in dashboard script:', error);
    }
});
