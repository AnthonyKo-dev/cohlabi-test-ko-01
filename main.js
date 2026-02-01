document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.querySelector('.numbers-container');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        themeToggleBtn.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Load theme from localStorage
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

    loadTheme();


    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
    });

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function displayNumbers(numbers) {
        numbersContainer.innerHTML = ''; // Clear previous numbers
        numbers.forEach(num => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = num;
            ball.classList.add(getColorClass(num)); // Add color based on number
            numbersContainer.appendChild(ball);
        });
    }

    function getColorClass(number) {
        if (number <= 10) return 'color-1';
        if (number <= 20) return 'color-2';
        if (number <= 30) return 'color-3';
        if (number <= 40) return 'color-4';
        return 'color-5';
    }
});
