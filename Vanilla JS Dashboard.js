// HTML structure (paste this in your HTML file)
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memory App Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F0EFE9;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #4A4A4A;
            text-align: center;
        }
        .button-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            cursor: pointer;
        }
        #captureMoment {
            background-color: #A2C7BE;
        }
        #createBook {
            background-color: #E8D0C3;
        }
        #searchBox {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 20px;
            margin-bottom: 20px;
        }
        .memory-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .memory-card {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .memory-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        .memory-card .info {
            padding: 10px;
        }
        .memory-card h3 {
            margin: 0;
            color: #4A4A4A;
        }
        .memory-card p {
            margin: 5px 0 0;
            font-size: 0.8em;
            color: #4A4A4A;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>My Memory Vault</h1>
        <div class="button-container">
            <button id="captureMoment">Capture Moment</button>
            <button id="createBook">Create Book</button>
        </div>
        <input type="text" id="searchBox" placeholder="Find Your Moments">
        <div class="memory-grid" id="memoryGrid"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
`

// JavaScript (paste this in your script.js file)
document.addEventListener('DOMContentLoaded', function() {
    const memories = [
        { title: "Summer Vacation", date: "July 15, 2023", image: "https://via.placeholder.com/300x200.png?text=Beach" },
        { title: "Family Reunion", date: "August 5, 2023", image: "https://via.placeholder.com/300x200.png?text=Family" },
        { title: "Graduation Day", date: "June 10, 2023", image: "https://via.placeholder.com/300x200.png?text=Graduation" },
        { title: "First Day at Work", date: "September 1, 2023", image: "https://via.placeholder.com/300x200.png?text=Office" }
    ];

    const memoryGrid = document.getElementById('memoryGrid');

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
        memoryGrid.innerHTML = '';
        memories.forEach(memory => {
            memoryGrid.appendChild(createMemoryCard(memory));
        });
    }

    renderMemories();

    document.getElementById('captureMoment').addEventListener('click', function() {
        console.log('Capture Moment clicked');
    });

    document.getElementById('createBook').addEventListener('click', function() {
        console.log('Create Book clicked');
    });

    document.getElementById('searchBox').addEventListener('input', function(e) {
        console.log('Searching for:', e.target.value);
    });
});
