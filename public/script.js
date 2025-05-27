// Dummy news data
const dummyNews = [
    {
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders have agreed on ambitious new climate targets for 2030, marking a significant step forward in the fight against climate change.",
        urlToImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T10:30:00Z",
        source: { name: "Global News Network" },
        url: "#"
    },
    {
        title: "Revolutionary AI Breakthrough in Healthcare",
        description: "Scientists have developed a new artificial intelligence system that can predict potential health issues with 95% accuracy.",
        urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop",
        publishedAt: "2024-03-15T09:15:00Z",
        source: { name: "Tech Daily" },
        url: "#"
    },
    {
        title: "Space Mission Discovers Signs of Ancient Life on Mars",
        description: "NASA's latest Mars rover has discovered compelling evidence of ancient microbial life.",
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
                <div class="user-welcome">
                    <span>Welcome, ${user.name}</span>
                </div>
                <button class="premium-btn dark-mode-toggle" onclick="toggleDarkMode()" data-tooltip="Toggle Dark Mode">
                    <i class="fas fa-moon"></i>
                </button>
                <button class="premium-btn logout-btn" onclick="handleLogout()" data-tooltip="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            `;
            mainNav.appendChild(premiumNav);
        }

        // Load preferences
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
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Load news when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadNews();
    setInterval(loadNews, 300000);
    
    // Update date and time
    updateDateTime();

    // Add home link click handler
    const homeLink = document.querySelector('.nav-links a[href="index.html"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear any existing user data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }

    // Password visibility toggle and form handling
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.querySelector('#password');
    const signupForm = document.getElementById('signupForm');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Signup form validation
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Password validation
            if (password.length < 8 || !/\d/.test(password)) {
                showNotification('Password must be at least 8 characters long and include a number', 'error');
                return;
            }
            
            // Confirm password validation
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Account created successfully! Please login to continue.', 'success');
                    // Redirect to login page after 2 seconds
                    setTimeout(() => {
                        console.log('Redirecting to login page...');
                        window.location.href = './login.html';
                    }, 2000);
                } else {
                    showNotification(data.message || 'Error creating account', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('Error creating account. Please try again.', 'error');
            }
        });
    }

    // Login form handling
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Login successful!', 'success');
                    // Store user data and token
                    localStorage.setItem('user', JSON.stringify({
                        fullName: data.user.fullName,
                        email: data.user.email
                    }));
                    localStorage.setItem('token', data.token);
                    setTimeout(() => {
                        console.log('Login successful, redirecting to home page...');
                        window.location.href = './index.html';
                    }, 1000);
                } else {
                    showNotification(data.message || 'Invalid credentials', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Error logging in. Please try again.', 'error');
            }
        });
    }
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
    const currentPage = window.location.pathname.split('/').pop();
    
    if (user) {
        const userData = JSON.parse(user);
        updateUIForLoggedInUser(userData);
        
        // If on login or signup page, redirect to home
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'index.html';
        }
    } else {
        // Show sign in button on home page
        const signInBtn = document.querySelector('.sign-in-btn');
        if (signInBtn) {
            signInBtn.style.display = 'block';
            signInBtn.href = 'login.html';
        }
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const signInBtn = document.querySelector('.sign-in-btn');
    if (signInBtn) {
        signInBtn.style.display = 'none';
    }

    // Add user's full name to the navigation
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        // Remove existing user welcome if any
        const existingWelcome = document.querySelector('.user-welcome');
        if (existingWelcome) {
            existingWelcome.remove();
        }

        const userWelcome = document.createElement('div');
        userWelcome.className = 'user-welcome';
        userWelcome.innerHTML = `
            <span>Welcome, ${user.fullName}</span>
        `;
        navRight.insertBefore(userWelcome, navRight.firstChild);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
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