document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const platformSelect = document.getElementById('platform-select'); // For sidebar dropdown
    const intentMinSlider = document.getElementById('intent-min-slider');
    const intentMinValueSpan = document.getElementById('intent-min-value');
    const reachMinSlider = document.getElementById('reach-min-slider');
    const reachMinValueSpan = document.getElementById('reach-min-value');
    const excludeFraudCheckbox = document.getElementById('exclude-fraud');
    const excludeInactiveCheckbox = document.getElementById('exclude-inactive');
    const excludeRiskCheckbox = document.getElementById('exclude-risk');
    const viewListBtn = document.getElementById('view-list-btn');

    // Stat card elements
    const totalCreatorsValue = document.getElementById('total-creators-value');
    const avgOutlierValue = document.getElementById('avg-outlier-value');
    const avgHealthValue = document.getElementById('avg-health-value');
    const highPriorityValue = document.getElementById('high-priority-value');

    // Radar elements
    const radarContainer = document.getElementById('radar-container');
    const platformTabs = document.querySelectorAll('.platform-tab');
    let activePlatformTab = 'all'; // Default active tab for radar section

    // --- Mock Data ---
    // Enhanced with avg_views_lastN, avg_likes_lastN, avg_comments_lastN, and flags
    const creators = [
        {
            id: '1', name: 'Insta Wellness', handle: '@instawellness', platform: 'Instagram', followers: 85000,
            metrics: { avg_views_lastN: 120000, avg_likes_lastN: 8000, avg_comments_lastN: 500 },
            scores: { outlier: 80, health: 90, intent: 75, total: 82 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['wellness', 'sleep', 'protein'], profilePic: 'https://i.pravatar.cc/150?u=instawellness', headerPic: 'https://i.pravatar.cc/600/200?u=header_instawellness'
        },
        {
            id: '2', name: 'X Tech Reviews', handle: '@xtech', platform: 'X', followers: 45000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 2000, avg_comments_lastN: 150 },
            scores: { outlier: 88, health: 85, intent: 80, total: 85 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['tech', 'gadgets', 'ai'], profilePic: 'https://i.pravatar.cc/150?u=xtech', headerPic: 'https://i.pravatar.cc/600/200?u=header_xtech'
        },
        {
            id: '3', name: 'IG Foodie', handle: '@igfoodie', platform: 'Instagram', followers: 98000,
            metrics: { avg_views_lastN: 150000, avg_likes_lastN: 10000, avg_comments_lastN: 800 },
            scores: { outlier: 92, health: 95, intent: 80, total: 90 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['food', 'recipes', 'healthy-eating'], profilePic: 'https://i.pravatar.cc/150?u=igfoodie', headerPic: 'https://i.pravatar.cc/600/200?u=header_igfoodie'
        },
        {
            id: '4', name: 'X Fitness Coach', handle: '@xfitness', platform: 'X', followers: 32000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 1500, avg_comments_lastN: 100 },
            scores: { outlier: 95, health: 88, intent: 92, total: 91 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['senior', 'fitness', 'wellness'], profilePic: 'https://i.pravatar.cc/150?u=xfitness', headerPic: 'https://i.pravatar.cc/600/200?u=header_xfitness'
        },
        {
            id: '5', name: 'Traveler Jane', handle: '@wanderlustjane', platform: 'Instagram', followers: 60000,
            metrics: { avg_views_lastN: 50000, avg_likes_lastN: 3000, avg_comments_lastN: 200 },
            scores: { outlier: 70, health: 80, intent: 65, total: 72 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: true }, // Inactive example
            category_tags: ['travel', 'adventure', 'photography'], profilePic: 'https://i.pravatar.cc/150?u=jane_travel', headerPic: 'https://i.pravatar.cc/600/200?u=header_jane_travel'
        },
        {
            id: '6', name: 'Coding Guru', handle: '@codeguru', platform: 'X', followers: 12000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 1000, avg_comments_lastN: 80 },
            scores: { outlier: 90, health: 92, intent: 88, total: 90 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['coding', 'software', 'dev'], profilePic: 'https://i.pravatar.cc/150?u=codeguru', headerPic: 'https://i.pravatar.cc/600/200?u=header_codeguru'
        },
        {
            id: '7', name: 'Fake Follower Frank', handle: '@frankfakes', platform: 'Instagram', followers: 70000,
            metrics: { avg_views_lastN: 5000, avg_likes_lastN: 100, avg_comments_lastN: 5 },
            scores: { outlier: 40, health: 50, intent: 30, total: 40 },
            flags: { fraud_suspect: true, brand_safety_risk: false, inactive: false }, // Fraud example
            category_tags: ['lifestyle', 'fashion'], profilePic: 'https://i.pravatar.cc/150?u=frankfakes', headerPic: 'https://i.pravatar.cc/600/200?u=header_frankfakes'
        },
        {
            id: '8', name: 'Brand Risk Betty', handle: '@bettybad', platform: 'X', followers: 20000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 1000, avg_comments_lastN: 50 },
            scores: { outlier: 70, health: 60, intent: 50, total: 60 },
            flags: { fraud_suspect: false, brand_safety_risk: true, inactive: false }, // Brand risk example
            category_tags: ['politics', 'controversial'], profilePic: 'https://i.pravatar.cc/150?u=bettybad', headerPic: 'https://i.pravatar.cc/600/200?u=header_bettybad'
        },
        {
            id: '9', name: 'Eco Enthusiast', handle: '@ecoemily', platform: 'Instagram', followers: 30000,
            metrics: { avg_views_lastN: 40000, avg_likes_lastN: 2500, avg_comments_lastN: 180 },
            scores: { outlier: 85, health: 90, intent: 88, total: 88 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['eco-friendly', 'sustainability', 'lifestyle'], profilePic: 'https://i.pravatar.cc/150?u=ecoemily', headerPic: 'https://i.pravatar.cc/600/200?u=header_ecoemily'
        },
        {
            id: '10', name: 'Gaming Galore', handle: '@gamegirl', platform: 'X', followers: 50000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 3000, avg_comments_lastN: 250 },
            scores: { outlier: 90, health: 85, intent: 70, total: 80 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['gaming', 'esports'], profilePic: 'https://i.pravatar.cc/150?u=gamegirl', headerPic: 'https://i.pravatar.cc/600/200?u=header_gamegirl'
        },
        {
            id: '11', name: 'Artistic Aaron', handle: '@artofaaron', platform: 'Instagram', followers: 20000,
            metrics: { avg_views_lastN: 25000, avg_likes_lastN: 1800, avg_comments_lastN: 120 },
            scores: { outlier: 78, health: 82, intent: 68, total: 76 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['art', 'drawing', 'illustration'], profilePic: 'https://i.pravatar.cc/150?u=artofaaron', headerPic: 'https://i.pravatar.cc/600/200?u=header_artofaaron'
        },
        {
            id: '12', name: 'Music Maestro', handle: '@musicman', platform: 'X', followers: 18000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 900, avg_comments_lastN: 70 },
            scores: { outlier: 80, health: 75, intent: 60, total: 72 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['music', 'production'], profilePic: 'https://i.pravatar.cc/150?u=musicman', headerPic: 'https://i.pravatar.cc/600/200?u=header_musicman'
        },
        {
            id: '13', name: 'DIY Diva', handle: '@diydiva', platform: 'Instagram', followers: 40000,
            metrics: { avg_views_lastN: 60000, avg_likes_lastN: 4000, avg_comments_lastN: 300 },
            scores: { outlier: 88, health: 90, intent: 85, total: 87 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['diy', 'crafts', 'home-decor'], profilePic: 'https://i.pravatar.cc/150?u=diydiva', headerPic: 'https://i.pravatar.cc/600/200?u=header_diydiva'
        },
        {
            id: '14', name: 'Science Seeker', handle: '@sciencelover', platform: 'X', followers: 28000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 1200, avg_comments_lastN: 90 },
            scores: { outlier: 82, health: 80, intent: 72, total: 78 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['science', 'education'], profilePic: 'https://i.pravatar.cc/150?u=sciencelover', headerPic: 'https://i.pravatar.cc/600/200?u=header_sciencelover'
        },
        {
            id: '15', name: 'Bookworm Blake', handle: '@bookblake', platform: 'Instagram', followers: 10000,
            metrics: { avg_views_lastN: 15000, avg_likes_lastN: 1000, avg_comments_lastN: 60 },
            scores: { outlier: 70, health: 75, intent: 60, total: 68 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['books', 'reading', 'literature'], profilePic: 'https://i.pravatar.cc/150?u=bookblake', headerPic: 'https://i.pravatar.cc/600/200?u=header_bookblake'
        },
        {
            id: '16', name: 'Pet Parent Pat', handle: '@petpat', platform: 'X', followers: 22000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 1100, avg_comments_lastN: 85 },
            scores: { outlier: 88, health: 83, intent: 78, total: 83 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['pets', 'animals'], profilePic: 'https://i.pravatar.cc/150?u=petpat', headerPic: 'https://i.pravatar.cc/600/200?u=header_petpat'
        },
        {
            id: '17', name: 'Gardener Gus', handle: '@greenthumbgus', platform: 'Instagram', followers: 28000,
            metrics: { avg_views_lastN: 35000, avg_likes_lastN: 2200, avg_comments_lastN: 150 },
            scores: { outlier: 80, health: 85, intent: 70, total: 78 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['gardening', 'plants'], profilePic: 'https://i.pravatar.cc/150?u=greenthumbgus', headerPic: 'https://i.pravatar.cc/600/200?u=header_greenthumbgus'
        },
        {
            id: '18', name: 'History Buff Holly', handle: '@historyholly', platform: 'X', followers: 15000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 700, avg_comments_lastN: 40 },
            scores: { outlier: 75, health: 70, intent: 60, total: 68 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['history', 'education'], profilePic: 'https://i.pravatar.cc/150?u=historyholly', headerPic: 'https://i.pravatar.cc/600/200?u=header_historyholly'
        },
        {
            id: '19', name: 'Fitness Fanatic Fran', handle: '@fitfran', platform: 'Instagram', followers: 90000,
            metrics: { avg_views_lastN: 130000, avg_likes_lastN: 9000, avg_comments_lastN: 700 },
            scores: { outlier: 93, health: 96, intent: 90, total: 93 }, // High scores for top 20
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['fitness', 'workout', 'health'], profilePic: 'https://i.pravatar.cc/150?u=fitfran', headerPic: 'https://i.pravatar.cc/600/200?u=header_fitfran'
        },
        {
            id: '20', name: 'Gadget Guru Gary', handle: '@gadgetgary', platform: 'X', followers: 48000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 2800, avg_comments_lastN: 200 },
            scores: { outlier: 91, health: 90, intent: 89, total: 90 }, // High scores for top 20
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['tech', 'gadgets', 'reviews'], profilePic: 'https://i.pravatar.cc/150?u=gadgetgary', headerPic: 'https://i.pravatar.cc/600/200?u=header_gadgetgary'
        },
        {
            id: '21', name: 'Low Intent Leo', handle: '@lowintent', platform: 'Instagram', followers: 10000,
            metrics: { avg_views_lastN: 5000, avg_likes_lastN: 100, avg_comments_lastN: 5 },
            scores: { outlier: 30, health: 40, intent: 20, total: 30 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['random', 'daily-life'], profilePic: 'https://i.pravatar.cc/150?u=lowintent', headerPic: 'https://i.pravatar.cc/600/200?u=header_lowintent'
        },
        {
            id: '22', name: 'High Reach Low Intent Rachel', handle: '@reachrachel', platform: 'X', followers: 35000,
            metrics: { avg_views_lastN: null, avg_likes_lastN: 2500, avg_comments_lastN: 100 },
            scores: { outlier: 80, health: 70, intent: 40, total: 60 },
            flags: { fraud_suspect: false, brand_safety_risk: false, inactive: false },
            category_tags: ['memes', 'humor'], profilePic: 'https://i.pravatar.cc/150?u=reachrachel', headerPic: 'https://i.pravatar.cc/600/200?u=header_reachrachel'
        }
    ];

    // --- Helper Functions ---
    function calculateReachEfficiency(creator) {
        if (creator.derived && typeof creator.derived.reach_efficiency === 'number') {
            return creator.derived.reach_efficiency;
        }

        const followers = creator.followers;
        if (!followers || followers === 0) return null;

        if (creator.metrics.avg_views_lastN) {
            return parseFloat((creator.metrics.avg_views_lastN / followers).toFixed(3));
        } else if (creator.metrics.avg_likes_lastN && creator.metrics.avg_comments_lastN) {
            return parseFloat(((creator.metrics.avg_likes_lastN + creator.metrics.avg_comments_lastN) / followers).toFixed(3));
        }
        return null;
    }

    function calculateStats(creatorList) {
        const total = creatorList.length;
        const sumOutlier = creatorList.reduce((sum, c) => sum + (c.scores.outlier || 0), 0);
        const sumHealth = creatorList.reduce((sum, c) => sum + (c.scores.health || 0), 0);

        const highPriorityCount = creatorList.filter(c =>
            (c.scores.intent || 0) >= 70 && (c.derived.reach_efficiency || 0) >= 0.02
        ).length;

        return {
            totalCreators: total,
            avgOutlier: total > 0 ? (sumOutlier / total).toFixed(0) : 0,
            avgHealth: total > 0 ? (sumHealth / total).toFixed(0) : 0,
            highPriorityCreators: highPriorityCount
        };
    }

    function renderStats(stats) {
        totalCreatorsValue.textContent = stats.totalCreators;
        avgOutlierValue.textContent = stats.avgOutlier;
        avgHealthValue.textContent = stats.avgHealth;
        highPriorityValue.textContent = stats.highPriorityCreators;
    }

    // --- Radar Visualization ---
    function renderRadarView(creatorList) {
        // Clear previous dots and tooltips
        Array.from(radarContainer.querySelectorAll('.creator-dot, .radar-tooltip')).forEach(el => el.remove());

        // Re-add fixed labels and lines
        radarContainer.innerHTML = `
            <div class="radar-axis-label y-axis">Commercial Intent Score</div>
            <div class="radar-axis-label x-axis">Reach Efficiency</div>
            <div class="quadrant-line horizontal" style="bottom: 70%;"></div>
            <div class="quadrant-line vertical" style="left: 20%;"></div>
            <div class="high-priority-label">High Priority</div>
        `;

        const radarWidth = radarContainer.offsetWidth;
        const radarHeight = radarContainer.offsetHeight;

        // Sort by total_score descending to identify top 20
        const sortedCreatorsByTotalScore = [...creatorList].sort((a, b) => (b.scores.total || 0) - (a.scores.total || 0));
        const top20CreatorIds = new Set(sortedCreatorsByTotalScore.slice(0, Math.min(20, sortedCreatorsByTotalScore.length)).map(c => c.id));

        creatorList.forEach(creator => {
            const reachEfficiency = creator.derived.reach_efficiency;
            const intentScore = creator.scores.intent;

            if (reachEfficiency === null || intentScore === null) {
                // Exclude creators without valid scores from the chart
                return;
            }

            const dot = document.createElement('div');
            dot.className = 'creator-dot';
            dot.dataset.creatorId = creator.id;

            // Platform color
            dot.classList.add(`platform-${creator.platform}`);

            // Fading for flagged creators
            if (creator.flags.fraud_suspect || creator.flags.inactive || creator.flags.brand_safety_risk) {
                dot.classList.add('faded');
            }

            // Emphasize top 20
            if (top20CreatorIds.has(creator.id)) {
                dot.classList.add('emphasized');
            }

            // Position calculation: assuming X (reach) from 0 to 0.1, Y (intent) from 0 to 100
            // Max reach efficiency for scaling X axis: let's assume 0.1 (10%) as a practical max for micro creators
            const maxReachEfficiency = 0.1;
            const xPos = (reachEfficiency / maxReachEfficiency) * radarWidth; // Map 0-0.1 to 0-100% width
            const yPos = (1 - (intentScore / 100)) * radarHeight; // Map 0-100 to 100-0% height (Y-axis inverted)

            // Bubble size based on followers (log scale)
            const minFollowers = 500; // Smallest follower count
            const maxFollowers = 100000; // Largest follower count
            const minSize = 10; // Min dot size in px
            const maxSize = 30; // Max dot size in px
            const logFollowers = Math.log(Math.max(creator.followers, minFollowers));
            const logMinFollowers = Math.log(minFollowers);
            const logMaxFollowers = Math.log(maxFollowers);
            const size = minSize + (maxSize - minSize) * (logFollowers - logMinFollowers) / (logMaxFollowers - logMinFollowers);

            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${Math.max(size / 2, Math.min(xPos - size / 2, radarWidth - size / 2))}px`;
            dot.style.top = `${Math.max(size / 2, Math.min(yPos - size / 2, radarHeight - size / 2))}px`;

            // Tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'radar-tooltip';
            tooltip.setAttribute('data-tooltip-id', creator.id);
            tooltip.innerHTML = `
                <strong>${creator.name}</strong> (${creator.handle})<br>
                Platform: ${creator.platform}<br>
                Followers: ${creator.followers.toLocaleString()}<br>
                Reach: ${creator.derived.reach_efficiency !== null ? (creator.derived.reach_efficiency * 100).toFixed(1) + '%' : 'N/A'}<br>
                Intent: ${creator.scores.intent}<br>
                Total: ${creator.scores.total}<br>
                Flags: ${Object.keys(creator.flags).filter(f => creator.flags[f]).join(', ') || 'None'}
            `;
            document.body.appendChild(tooltip); // Append to body to avoid clipping issues

            let timeout;
            dot.addEventListener('mouseenter', (e) => {
                clearTimeout(timeout);
                // Position tooltip near the dot, adjust for mouse position if preferred, or center on dot
                tooltip.style.left = `${e.clientX + 15}px`; // Offset from mouse
                tooltip.style.top = `${e.clientY + 15}px`;
                tooltip.style.display = 'block';
            });

            dot.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => { // Delay hiding to allow moving mouse to tooltip
                    tooltip.style.display = 'none';
                }, 100);
            });

            tooltip.addEventListener('mouseenter', () => {
                clearTimeout(timeout); // Keep tooltip open if mouse enters it
            });
            tooltip.addEventListener('mouseleave', () => {
                timeout = setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 100);
            });

            dot.addEventListener('click', () => {
                console.log(`Navigating to /creators/${creator.id}. (Simulation only)`);
                // In a real app, this would be router.push(`/creators/${creator.id}`);
            });

            radarContainer.appendChild(dot);
        });
    }

    // --- Filter & Render Logic ---
    function filterAndRender() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedPlatform = activePlatformTab; // Use active tab for platform filter
        const minIntent = parseInt(intentMinSlider.value);
        const minReach = parseFloat(reachMinSlider.value);
        const excludeFraud = excludeFraudCheckbox.checked;
        const excludeInactive = excludeInactiveCheckbox.checked;
        const excludeRisk = excludeRiskCheckbox.checked;

        let processedCreators = creators.map(c => ({
            ...c,
            derived: {
                ...c.derived,
                reach_efficiency: calculateReachEfficiency(c)
            }
        }));

        const filteredCreators = processedCreators.filter(creator => {
            const matchesPlatform = selectedPlatform === 'all' || creator.platform === selectedPlatform;
            const matchesSearch = searchTerm === '' ||
                creator.name.toLowerCase().includes(searchTerm) ||
                creator.handle.toLowerCase().includes(searchTerm) ||
                creator.category_tags.some(tag => tag.toLowerCase().includes(searchTerm));

            // Ensure intentScore and reachEfficiency are numbers for comparison
            const creatorIntent = creator.scores.intent || 0;
            const creatorReach = creator.derived.reach_efficiency || 0;

            const meetsIntentMin = creatorIntent >= minIntent;
            const meetsReachMin = creatorReach >= minReach;

            const passesFlags = (!excludeFraud || !creator.flags.fraud_suspect) &&
                                (!excludeInactive || !creator.flags.inactive) &&
                                (!excludeRisk || !creator.flags.brand_safety_risk);

            // Hide creators with null intent_score or reach_efficiency from chart as per plan.md
            const hasValidIntentScore = creator.scores.intent !== null && creator.scores.intent !== undefined;
            const hasValidReachEfficiency = creator.derived.reach_efficiency !== null && creator.derived.reach_efficiency !== undefined;

            return matchesPlatform && matchesSearch && meetsIntentMin && meetsReachMin && passesFlags && hasValidIntentScore && hasValidReachEfficiency;
        });

        // Sort by total_score desc, then reach_efficiency desc
        filteredCreators.sort((a, b) => {
            if ((b.scores.total || 0) !== (a.scores.total || 0)) return (b.scores.total || 0) - (a.scores.total || 0);
            return (b.derived.reach_efficiency || 0) - (a.derived.reach_efficiency || 0);
        });

        // Apply result limit (top 200) - for current mock data, it won't exceed 200
        const limitedCreators = filteredCreators.slice(0, 200);

        const stats = calculateStats(limitedCreators);
        renderStats(stats);
        renderRadarView(limitedCreators);
    }

    // --- Event Listeners ---
    searchInput.addEventListener('keyup', filterAndRender);
    // platformSelect.addEventListener('change', filterAndRender); // Sidebar dropdown is replaced by tabs

    intentMinSlider.addEventListener('input', () => {
        intentMinValueSpan.textContent = intentMinSlider.value;
        filterAndRender();
    });
    reachMinSlider.addEventListener('input', () => {
        reachMinValueSpan.textContent = parseFloat(reachMinSlider.value).toFixed(3);
        filterAndRender();
    });
    excludeFraudCheckbox.addEventListener('change', filterAndRender);
    excludeInactiveCheckbox.addEventListener('change', filterAndRender);
    excludeRiskCheckbox.addEventListener('change', filterAndRender);

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            platformTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activePlatformTab = tab.dataset.platform;
            filterAndRender();
        });
    });

    viewListBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        const selectedPlatform = activePlatformTab;
        const minIntent = intentMinSlider.value;
        const minReach = reachMinSlider.value;
        const excludeFraud = excludeFraudCheckbox.checked ? '1' : '0';
        const excludeInactive = excludeInactiveCheckbox.checked ? '1' : '0';
        const excludeRisk = excludeRiskCheckbox.checked ? '1' : '0';

        const queryString = new URLSearchParams({
            platform: selectedPlatform,
            keyword: searchTerm,
            intentMin: minIntent,
            reachMin: minReach,
            excludeFraud: excludeFraud,
            excludeInactive: excludeInactive,
            excludeRisk: excludeRisk
        }).toString();
        console.log(`Simulating navigation to /creators?${queryString}`);
        // In a real app, this would be router.push(`/creators?${queryString}`);
        alert(`Navigating to /creators?${queryString} (simulated)`);
    });


    // --- Initial Load ---
    loadTheme();
    filterAndRender(); // Display initial state of dashboard
});