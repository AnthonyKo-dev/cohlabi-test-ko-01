document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const platformSelect = document.getElementById('platform-select');
    const resultsContainer = document.getElementById('results-container');

    // --- Mock Data ---
    const creators = [
        {
            name: 'Insta Wellness',
            handle: '@instawellness',
            platform: 'Instagram',
            followers: 85000,
            outlier_score: 80,
            health_score: 90,
            intent_score: 75,
            total_score: 82, // Weighted average could be calculated here
            category_tags: ['wellness', 'sleep', 'protein'],
            profilePic: 'https://i.pravatar.cc/150?u=instawellness',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_instawellness'
        },
        {
            name: 'X Tech Reviews',
            handle: '@xtech',
            platform: 'X',
            followers: 45000,
            outlier_score: 88,
            health_score: 85,
            intent_score: 80,
            total_score: 85,
            category_tags: ['tech', 'gadgets', 'ai'],
            profilePic: 'https://i.pravatar.cc/150?u=xtech',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_xtech'
        },
        {
            name: 'IG Foodie',
            handle: '@igfoodie',
            platform: 'Instagram',
            followers: 98000,
            outlier_score: 92,
            health_score: 95,
            intent_score: 80,
            total_score: 90,
            category_tags: ['food', 'recipes', 'healthy-eating'],
            profilePic: 'https://i.pravatar.cc/150?u=igfoodie',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_igfoodie'
        },
        {
            name: 'X Fitness Coach',
            handle: '@xfitness',
            platform: 'X',
            followers: 32000,
            outlier_score: 95,
            health_score: 88,
            intent_score: 92,
            total_score: 91,
            category_tags: ['senior', 'fitness', 'wellness'],
            profilePic: 'https://i.pravatar.cc/150?u=xfitness',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_xfitness'
        }
    ];

    // --- Theme Toggle Functionality ---
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    function loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }
    }

    // --- Creator Display Functionality ---
    function displayCreators(creatorList) {
        resultsContainer.innerHTML = '';
        if (creatorList.length === 0) {
            resultsContainer.innerHTML = '<p>No creators found.</p>';
            return;
        }

        creatorList.forEach(creator => {
            const card = document.createElement('div');
            card.className = 'influencer-card'; // Re-using old class name
            const platformIconUrl = {
                'X': 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
                'Instagram': 'https://instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png'
            }[creator.platform] || '';

            card.innerHTML = `
                <div class="card-header" style="background-image: url('${creator.headerPic}')">
                    <img class="platform-icon" src="${platformIconUrl}" alt="${creator.platform}">
                    <img class="profile-pic" src="${creator.profilePic}" alt="${creator.name}">
                </div>
                <div class="card-body">
                    <h3 class="name">${creator.name}</h3>
                    <p class="handle">${creator.handle}</p>
                    <div class="tags-container">
                        ${creator.category_tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <span class="stat-value">${(creator.followers / 1000).toFixed(1)}K</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${creator.outlier_score}</span>
                            <span class="stat-label">Outlier</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${creator.health_score}</span>
                            <span class="stat-label">Health</span>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // --- Search Functionality ---
    function searchCreators() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPlatform = platformSelect.value;

        const filteredCreators = creators.filter(creator => {
            const matchesPlatform = selectedPlatform === 'all' || creator.platform === selectedPlatform;
            const matchesSearch = searchTerm === '' ||
                creator.name.toLowerCase().includes(searchTerm) ||
                creator.handle.toLowerCase().includes(searchTerm) ||
                creator.category_tags.some(tag => tag.toLowerCase().includes(searchTerm));
            return matchesPlatform && matchesSearch;
        });
        displayCreators(filteredCreators);
    }

    searchBtn.addEventListener('click', searchCreators);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchCreators();
        }
    });
    platformSelect.addEventListener('change', searchCreators);


    // --- Initial Load ---
    loadTheme();
    displayCreators(creators); // Display all creators on initial load
});

