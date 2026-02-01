document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const platformSelect = document.getElementById('platform-select');
    const radarContainer = document.getElementById('radar-container');

    // Stat card elements
    const totalCreatorsValue = document.getElementById('total-creators-value');
    const avgOutlierValue = document.getElementById('avg-outlier-value');
    const avgHealthValue = document.getElementById('avg-health-value');

    // --- Mock Data ---
    const creators = [
        {
            id: '1', name: 'Insta Wellness', handle: '@instawellness', platform: 'Instagram', followers: 85000,
            outlier_score: 80, health_score: 90, intent_score: 75, total_score: 82,
            category_tags: ['wellness', 'sleep', 'protein'], profilePic: 'https://i.pravatar.cc/150?u=instawellness', headerPic: 'https://i.pravatar.cc/600/200?u=header_instawellness'
        },
        {
            id: '2', name: 'X Tech Reviews', handle: '@xtech', platform: 'X', followers: 45000,
            outlier_score: 88, health_score: 85, intent_score: 80, total_score: 85,
            category_tags: ['tech', 'gadgets', 'ai'], profilePic: 'https://i.pravatar.cc/150?u=xtech', headerPic: 'https://i.pravatar.cc/600/200?u=header_xtech'
        },
        {
            id: '3', name: 'IG Foodie', handle: '@igfoodie', platform: 'Instagram', followers: 98000,
            outlier_score: 92, health_score: 95, intent_score: 80, total_score: 90,
            category_tags: ['food', 'recipes', 'healthy-eating'], profilePic: 'https://i.pravatar.cc/150?u=igfoodie', headerPic: 'https://i.pravatar.cc/600/200?u=header_igfoodie'
        },
        {
            id: '4', name: 'X Fitness Coach', handle: '@xfitness', platform: 'X', followers: 32000,
            outlier_score: 95, health_score: 88, intent_score: 92, total_score: 91,
            category_tags: ['senior', 'fitness', 'wellness'], profilePic: 'https://i.pravatar.cc/150?u=xfitness', headerPic: 'https://i.pravatar.cc/600/200?u=header_xfitness'
        },
        {
            id: '5', name: 'Traveler Jane', handle: '@wanderlustjane', platform: 'Instagram', followers: 60000,
            outlier_score: 70, health_score: 80, intent_score: 65, total_score: 72,
            category_tags: ['travel', 'adventure', 'photography'], profilePic: 'https://i.pravatar.cc/150?u=jane_travel', headerPic: 'https://i.pravatar.cc/600/200?u=header_jane_travel'
        },
        {
            id: '6', name: 'Coding Guru', handle: '@codeguru', platform: 'X', followers: 12000,
            outlier_score: 90, health_score: 92, intent_score: 88, total_score: 90,
            category_tags: ['coding', 'software', 'dev'], profilePic: 'https://i.pravatar.cc/150?u=codeguru', headerPic: 'https://i.pravatar.cc/600/200?u=header_codeguru'
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

    // --- Stats Calculation & Rendering ---
    function calculateStats(creatorList) {
        const total = creatorList.length;
        const sumOutlier = creatorList.reduce((sum, c) => sum + c.outlier_score, 0);
        const sumHealth = creatorList.reduce((sum, c) => sum + c.health_score, 0);

        return {
            totalCreators: total,
            avgOutlier: total > 0 ? (sumOutlier / total).toFixed(0) : 0,
            avgHealth: total > 0 ? (sumHealth / total).toFixed(0) : 0
        };
    }

    function renderStats(stats) {
        totalCreatorsValue.textContent = stats.totalCreators;
        avgOutlierValue.textContent = stats.avgOutlier;
        avgHealthValue.textContent = stats.avgHealth;
    }

    // --- Radar Visualization ---
    function renderRadarView(creatorList) {
        // Clear previous dots and tooltips
        Array.from(radarContainer.querySelectorAll('.creator-dot, .radar-tooltip')).forEach(el => el.remove());

        // Define the bounds of the radar container (assuming 0-100 score range)
        const radarWidth = radarContainer.offsetWidth;
        const radarHeight = radarContainer.offsetHeight;

        creatorList.forEach(creator => {
            const dot = document.createElement('div');
            dot.className = 'creator-dot';
            dot.dataset.creatorId = creator.id;
            dot.style.backgroundColor = creator.platform === 'X' ? '#000000' : '#c13584'; // X black, Instagram pink

            // Position calculation: score 0-100 maps to 0-100% of container size
            // Adjust for dot size to keep it within bounds and centered
            const xPos = (creator.health_score / 100) * radarWidth;
            const yPos = (1 - (creator.outlier_score / 100)) * radarHeight; // Y-axis inverted for top=100

            dot.style.left = `${Math.max(6, Math.min(xPos, radarWidth - 6))}px`; // Clamp within bounds
            dot.style.top = `${Math.max(6, Math.min(yPos, radarHeight - 6))}px`; // Clamp within bounds

            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'radar-tooltip';
            tooltip.textContent = `${creator.name} (${creator.handle}) - Health: ${creator.health_score}, Outlier: ${creator.outlier_score}`;
            tooltip.style.left = `${dot.style.left}`;
            tooltip.style.top = `${dot.style.top}`;

            dot.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            dot.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });

            radarContainer.appendChild(dot);
            radarContainer.appendChild(tooltip);
        });
    }

    // --- Filter & Search Functionality ---
    function filterAndRender() {
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

        const stats = calculateStats(filteredCreators);
        renderStats(stats);
        renderRadarView(filteredCreators);
    }

    searchInput.addEventListener('keyup', filterAndRender);
    platformSelect.addEventListener('change', filterAndRender);

    // --- Initial Load ---
    loadTheme();
    filterAndRender(); // Display initial state of dashboard
});

