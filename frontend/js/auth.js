// Authentication Management

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
    localStorage.removeItem('user');
}

function isAuthenticated() {
    return !!getToken();
}

function logout() {
    removeToken();
    removeUser();
    window.location.href = '/';
}

// Check authentication on page load
function checkAuth() {
    if (isAuthenticated()) {
        const user = getUser();
        showNavbar(user);
        return true;
    }
    return false;
}

function showNavbar(user) {
    const navbar = document.getElementById('navbar');
    const userName = document.getElementById('userName');
    
    if (navbar && user) {
        navbar.style.display = 'block';
        if (userName) {
            userName.textContent = user.name;
            // Add role as data attribute for tooltip
            const roleDisplay = user.role === 'admin' ? 'Administrator' : 'Team Member';
            userName.setAttribute('data-role', roleDisplay);
        }
    }
}

function hideNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.display = 'none';
    }
}