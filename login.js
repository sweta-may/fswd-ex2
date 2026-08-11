document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");
  const googleBtn = document.getElementById("google-btn");
  const appleBtn = document.getElementById("apple-btn");

  function login() {
    localStorage.setItem("loggedIn", "true");

    const username =
      document.getElementById("username")?.value.trim() || "Alex";

    localStorage.setItem("username", username);

    window.location.href = "index.html";
  }


  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      login();
    });
  }


  if (googleBtn) {
    googleBtn.addEventListener("click", login);
  }


  if (appleBtn) {
    appleBtn.addEventListener("click", login);
  }


  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "index.html";
  }

});
