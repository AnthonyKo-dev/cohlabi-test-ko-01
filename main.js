document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');

    // --- Mock Data ---
    const influencers = [
        {
            name: 'Wellness Wendy',
            handle: '@wellnesswendy',
            platform: 'Instagram',
            followers: 15000,
            health_score: 90,
            intent_score: 75,
            total_score: 83,
            category_tags: ['wellness', 'sleep', 'protein'],
            profilePic: 'https://i.pravatar.cc/150?u=wendy',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_wendy'
        },
        {
            name: 'Techie Tom',
            handle: '@techtom',
            platform: 'Twitter',
            followers: 25000,
            health_score: 85,
            intent_score: 88,
            total_score: 86,
            category_tags: ['tech', 'gadgets', 'ai'],
            profilePic: 'https://i.pravatar.cc/150?u=tom',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_tom'
        },
        {
            name: 'Foodie Fiona',
            handle: '@foodiefiona',
            platform: 'Instagram',
            followers: 55000,
            health_score: 95,
            intent_score: 80,
            total_score: 88,
            category_tags: ['food', 'recipes', 'healthy-eating'],
            profilePic: 'https://i.pravatar.cc/150?u=fiona',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_fiona'
        },
        {
            name: 'Senior Fitness Sam',
            handle: '@seniorsam',
            platform: 'TikTok',
            followers: 42000,
            health_score: 88,
            intent_score: 92,
            total_score: 90,
            category_tags: ['senior', 'fitness', 'wellness'],
            profilePic: 'https://i.pravatar.cc/150?u=sam',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_sam'
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

    // --- Influencer Display Functionality ---
    function displayInfluencers(influencerList) {
        resultsContainer.innerHTML = '';
        if (influencerList.length === 0) {
            resultsContainer.innerHTML = '<p>No creators found.</p>';
            return;
        }

        influencerList.forEach(influencer => {
            const card = document.createElement('div');
            card.className = 'influencer-card';
            const platformIconUrl = {
                'Twitter': 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
                'Instagram': 'https://instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png',
                'TikTok': 'https://sf-tb-sg.ibytedtos.com/obj/tiktok-web/tiktok/web/node/_next/static/images/logo-dark-e951266221f66b533a1040523fdad930.svg'
            }[influencer.platform] || '';

            card.innerHTML = `
                <div class="card-header" style="background-image: url('${influencer.headerPic}')">
                    <img class="platform-icon" src="${platformIconUrl}" alt="${influencer.platform}">
                    <img class="profile-pic" src="${influencer.profilePic}" alt="${influencer.name}">
                </div>
                <div class="card-body">
                    <h3 class="name">${influencer.name}</h3>
                    <p class="handle">${influencer.handle}</p>
                    <div class="tags-container">
                        ${influencer.category_tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <span class="stat-value">${(influencer.followers / 1000).toFixed(1)}K</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${influencer.health_score}</span>
                            <span class="stat-label">Health</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${influencer.intent_score}</span>
                            <span class="stat-label">Intent</span>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // --- Search Functionality ---
    function searchInfluencers() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredInfluencers = influencers.filter(influencer =>
            influencer.name.toLowerCase().includes(searchTerm) ||
            influencer.handle.toLowerCase().includes(searchTerm) ||
            influencer.category_tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        displayInfluencers(filteredInfluencers);
    }

    searchBtn.addEventListener('click', searchInfluencers);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchInfluencers();
        }
    });

    // --- Initial Load ---
    loadTheme();
    displayInfluencers(influencers); // Display all influencers on initial load
});

