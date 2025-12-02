function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
    }
}

function checkAdminAuth() {
    const user = getUser();
    if (!user || user.role !== 'cr') {
        window.location.href = 'dashboard.html';
    }
}

// Setup logout button
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Display user info
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
        const user = getUser();
        if (user) {
            userInfo.textContent = `${user.name} (${user.role.toUpperCase()})`;
        }
    }

    // Show admin link if CR
    const user = getUser();
    if (user && user.role === 'cr') {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = 'block';
        }
    }
});