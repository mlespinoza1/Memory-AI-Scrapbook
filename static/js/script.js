document.addEventListener('DOMContentLoaded', function() {
    const memories = [
        { title: "Summer Vacation", date: "July 15, 2023", image: "/static/images/beach.jpg" },
        { title: "Family Reunion", date: "August 5, 2023", image: "/static/images/family.jpg" },
        { title: "Graduation Day", date: "June 10, 2023", image: "/static/images/graduation.jpg" },
        { title: "First Day at Work", date: "September 1, 2023", image: "/static/images/office.jpg" }
    ];

    const memoryGrid = document.getElementById('memoryGrid');
    const searchBox = document.getElementById('searchBox');

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

    function renderMemories(memoriesToRender) {
        memoryGrid.innerHTML = '';
        memoriesToRender.forEach(memory => {
            memoryGrid.appendChild(createMemoryCard(memory));
        });
    }

    function filterMemories(query) {
        return memories.filter(memory => 
            memory.title.toLowerCase().includes(query.toLowerCase()) ||
            memory.date.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderMemories(memories);

    document.getElementById('captureMoment').addEventListener('click', function() {
        alert('Capture Moment feature coming soon!');
    });

    document.getElementById('createBook').addEventListener('click', function() {
        alert('Create Book feature coming soon!');
    });

    searchBox.addEventListener('input', function(e) {
        const query = e.target.value;
        const filteredMemories = filterMemories(query);
        renderMemories(filteredMemories);
    });
});
