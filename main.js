document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');

    // --- Mock Data ---
    const influencers = [
        {
            name: 'Anthony Ko',
            handle: '@anthonykodev',
            platform: 'Twitter',
            followers: 1200000,
            topicalityScore: 95,
            profilePic: 'https://i.pravatar.cc/150?u=anthony',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_anthony'
        },
        {
            name: 'Jane Doe',
            handle: '@janedoe',
            platform: 'Instagram',
            followers: 2500000,
            topicalityScore: 92,
            profilePic: 'https://i.pravatar.cc/150?u=jane',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_jane'
        },
        {
            name: 'John Smith',
            handle: '@johnsmith',
            platform: 'Twitter',
            followers: 850000,
            topicalityScore: 88,
            profilePic: 'https://i.pravatar.cc/150?u=john',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_john'
        },
        {
            name: 'Emily White',
            handle: '@emilywhite',
            platform: 'Instagram',
            followers: 3200000,
            topicalityScore: 98,
            profilePic: 'https://i.pravatar.cc/150?u=emily',
            headerPic: 'https://i.pravatar.cc/600/200?u=header_emily'
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
            resultsContainer.innerHTML = '<p>No influencers found.</p>';
            return;
        }

        influencerList.forEach(influencer => {
            const card = document.createElement('div');
            card.className = 'influencer-card';
            card.innerHTML = `
                <div class="card-header" style="background-image: url('${influencer.headerPic}')">
                    <img class="platform-icon" src="${influencer.platform === 'Twitter' ? 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png' : 'https://instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png'}" alt="${influencer.platform}">
                    <img class="profile-pic" src="${influencer.profilePic}" alt="${influencer.name}">
                </div>
                <div class="card-body">
                    <h3 class="name">${influencer.name}</h3>
                    <p class="handle">${influencer.handle}</p>
                    <div class="stats">
                        <div class="stat">
                            <span class="stat-value">${(influencer.followers / 1000000).toFixed(1)}M</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${influencer.topicalityScore}</span>
                            <span class="stat-label">Topicality</span>
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
            influencer.handle.toLowerCase().includes(searchTerm)
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

