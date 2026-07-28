document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Simulate a successful login and save state.
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'index.html';
  });

  const loggedIn = localStorage.getItem('loggedIn');
  if (loggedIn === 'true') {
    window.location.href = 'index.html';
  }
});
