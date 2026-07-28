document.addEventListener('DOMContentLoaded', function () {
    const redirect = function () {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
    };

    const phoneBtn = document.getElementById('phone-btn');
    const googleBtn = document.getElementById('google-btn');
    const appleBtn = document.getElementById('apple-btn');
    const loginForm = document.getElementById('login-form');

    if (phoneBtn) phoneBtn.addEventListener('click', redirect);
    if (googleBtn) googleBtn.addEventListener('click', redirect);
    if (appleBtn) appleBtn.addEventListener('click', redirect);

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            redirect();
        });
    }

    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        window.location.href = 'index.html';
    }
});
