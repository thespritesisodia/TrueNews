// Dummy news data
const dummyNews = [
    {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders have agreed on ambitious new climate targets for 2030, marking a significant step forward in the fight against climate change. The agreement includes unprecedented commitments from major economies.",
        urlToImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T10:30:00Z",
        source: { name: "Global News Network" },
        url: "#"
    },
    {
        title: "Revolutionary AI Breakthrough in Healthcare",
        description: "Scientists have developed a new artificial intelligence system that can predict potential health issues with 95% accuracy. The breakthrough could revolutionize preventive healthcare worldwide.",
        urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T09:15:00Z",
        source: { name: "Tech Daily" },
        url: "#"
    },
    {
        title: "Space Mission Discovers Signs of Ancient Life on Mars",
        description: "NASA's latest Mars rover has discovered compelling evidence of ancient microbial life. The findings could reshape our understanding of life in the universe.",
        urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T08:45:00Z",
        source: { name: "Space News" },
        url: "#"
    },
    {
        title: "Global Economy Shows Strong Recovery Signs",
        description: "The world economy is showing robust signs of recovery, with major markets posting their strongest growth in a decade. Experts predict sustained growth through 2024.",
        urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T07:30:00Z",
        source: { name: "Financial Times" },
        url: "#"
    },
    {
        title: "Breakthrough in Renewable Energy Storage",
        description: "A new battery technology promises to revolutionize renewable energy storage, potentially solving the intermittency problem of solar and wind power.",
        urlToImage: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T06:20:00Z",
        source: { name: "Energy Weekly" },
        url: "#"
    },
    {
        title: "Major Sports League Announces Expansion",
        description: "The world's premier sports league has announced plans for expansion into new markets, promising to bring the sport to millions of new fans worldwide.",
        urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T05:15:00Z",
        source: { name: "Sports Central" },
        url: "#"
    }
];

// Premium features configuration
const PREMIUM_FEATURES = {
    savedArticles: [],
    readingHistory: [],
    preferences: {
        categories: ['Technology', 'Business', 'Science'],
        notifications: true,
        darkMode: false
    }
};

// Function to create a news item element
function createNewsItem(article) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    // Create image element
    const image = document.createElement('img');
    image.className = 'news-image';
    image.src = article.urlToImage;
    image.alt = article.title;
    image.onerror = function() {
        this.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
    };
    
    // Create title element
    const title = document.createElement('h3');
    title.textContent = article.title;
    
    // Create content element
    const content = document.createElement('p');
    content.textContent = article.description;
    
    // Create source element
    const source = document.createElement('span');
    source.className = 'source';
    source.textContent = article.source.name;
    
    // Create date element
    const date = document.createElement('span');
    date.className = 'date';
    date.textContent = new Date(article.publishedAt).toLocaleDateString();
    
    // Create read more link
    const readMore = document.createElement('a');
    readMore.href = article.url;
    readMore.className = 'read-more';
    readMore.textContent = 'Read More';
    readMore.target = '_blank';
    
    // Append all elements to news item
    newsItem.appendChild(image);
    newsItem.appendChild(title);
    newsItem.appendChild(content);
    newsItem.appendChild(source);
    newsItem.appendChild(date);
    newsItem.appendChild(readMore);

    // Add save button if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === VALID_CREDENTIALS.email) {
        const saveButton = document.createElement('button');
        saveButton.className = 'save-article-btn';
        saveButton.innerHTML = '<i class="fas fa-bookmark"></i>';
        saveButton.onclick = () => saveArticle(article);
        newsItem.appendChild(saveButton);
    }
    
    return newsItem;
}

// Function to load news items
function loadNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('News container not found');
        return;
    }
    
    newsContainer.innerHTML = '';
    
    dummyNews.forEach(article => {
        const newsItem = createNewsItem(article);
        newsContainer.appendChild(newsItem);
    });
}

// Function to initialize premium features
function initializePremiumFeatures() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email === VALID_CREDENTIALS.email) {
        // Add premium navigation items
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            const premiumNav = document.createElement('div');
            premiumNav.className = 'premium-nav';
            premiumNav.innerHTML = `
                <button class="premium-btn" onclick="toggleDarkMode()">
                    <i class="fas fa-moon"></i> Dark Mode
                </button>
                <button class="premium-btn" onclick="showSavedArticles()">
                    <i class="fas fa-bookmark"></i> Saved
                </button>
                <button class="premium-btn" onclick="showReadingHistory()">
                    <i class="fas fa-history"></i> History
                </button>
                <button class="premium-btn" onclick="showPreferences()">
                    <i class="fas fa-cog"></i> Settings
                </button>
            `;
            mainNav.appendChild(premiumNav);
        }

        // Load saved articles and preferences
        loadSavedArticles();
        loadPreferences();
    }
}

// Function to save article
function saveArticle(article) {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    savedArticles.push(article);
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
    showNotification('Article saved successfully!');
}

// Function to show saved articles
function showSavedArticles() {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    const newsContainer = document.getElementById('newsContainer');
    
    if (savedArticles.length === 0) {
        showNotification('No saved articles yet!');
        return;
    }

    newsContainer.innerHTML = '<h2>Saved Articles</h2>';
    savedArticles.forEach(article => {
        const newsItem = createNewsItem(article);
        newsContainer.appendChild(newsItem);
    });
}

// Function to show reading history
function showReadingHistory() {
    const readingHistory = JSON.parse(localStorage.getItem('readingHistory') || '[]');
    const newsContainer = document.getElementById('newsContainer');
    
    if (readingHistory.length === 0) {
        showNotification('No reading history yet!');
        return;
    }

    newsContainer.innerHTML = '<h2>Reading History</h2>';
    readingHistory.forEach(article => {
        const newsItem = createNewsItem(article);
        newsContainer.appendChild(newsItem);
    });
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
}

// Function to show preferences
function showPreferences() {
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    const newsContainer = document.getElementById('newsContainer');
    
    newsContainer.innerHTML = `
        <div class="preferences-container">
            <h2>Preferences</h2>
            <div class="preference-item">
                <h3>Categories</h3>
                <div class="category-list">
                    ${['Technology', 'Business', 'Science', 'Sports', 'Entertainment'].map(category => `
                        <label>
                            <input type="checkbox" 
                                   ${preferences.categories?.includes(category) ? 'checked' : ''}
                                   onchange="updateCategory('${category}')">
                            ${category}
                        </label>
                    `).join('')}
                </div>
            </div>
            <div class="preference-item">
                <h3>Notifications</h3>
                <label class="switch">
                    <input type="checkbox" 
                           ${preferences.notifications ? 'checked' : ''}
                           onchange="toggleNotifications()">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="preference-item">
                <h3>Dark Mode</h3>
                <label class="switch">
                    <input type="checkbox" 
                           ${document.body.classList.contains('dark-mode') ? 'checked' : ''}
                           onchange="toggleDarkMode()">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `;
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load news when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    setInterval(loadNews, 300000);
    
    // Check login status and initialize premium features
    checkLoginStatus();
    initializePremiumFeatures();
    
    // Add login form handler if on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Update date and time
    updateDateTime();
});

// Dummy user credentials
const VALID_CREDENTIALS = {
    email: 'spritesisodi@gmail.com',
    password: '12345678',
    name: 'SPRITE SISODIA'
};

// Check if user is logged in
function checkLoginStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        updateUIForLoggedInUser(JSON.parse(user));
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            name: VALID_CREDENTIALS.name,
            email: VALID_CREDENTIALS.email
        }));
        
        // Initialize premium features
        initializePremiumFeatures();
        
        // Redirect to main page
        window.location.replace('index.html');
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const signInBtn = document.querySelector('.sign-in-btn');
    if (signInBtn) {
        signInBtn.innerHTML = `
            <span class="user-name">${user.name}</span>
            <button onclick="handleLogout()" class="logout-btn">Logout</button>
        `;
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    window.location.reload();
}

function deleteAllCookies() {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
    
    alert('All cookies have been deleted.');
}

// Function to update date and time
function updateDateTime() {
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        dateTimeElement.textContent = now.toLocaleString('en-US', options);
    }
}

// Update date and time every second
setInterval(updateDateTime, 1000);

// Function to update category preferences
function updateCategory(category) {
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    const index = preferences.categories?.indexOf(category);
    if (index === -1) {
        preferences.categories.push(category);
    } else {
        preferences.categories.splice(index, 1);
    }
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showNotification('Preferences updated!');
}

// Function to toggle notifications
function toggleNotifications() {
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    preferences.notifications = !preferences.notifications;
    localStorage.setItem('preferences', JSON.stringify(preferences));
    showNotification('Notification preferences updated!');
}

// Function to load saved articles
function loadSavedArticles() {
    const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    PREMIUM_FEATURES.savedArticles = savedArticles;
}

// Function to load preferences
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
    PREMIUM_FEATURES.preferences = preferences;
}

// Update the handleLogin function
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
            name: VALID_CREDENTIALS.name,
            email: VALID_CREDENTIALS.email
        }));
        
        // Initialize premium features
        initializePremiumFeatures();
        
        // Redirect to main page
        window.location.replace('index.html');
    } else {
        alert('Invalid credentials. Please try again.');
    }
} 