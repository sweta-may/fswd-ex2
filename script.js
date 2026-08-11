document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     LOGIN PROTECTION
  ========================= */

  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }


  /* =========================
     ELEMENTS
  ========================= */

  const feed = document.getElementById("feed");
  const postInput = document.getElementById("post-input");
  const postBtn = document.getElementById("post-btn");
  const searchInput = document.getElementById("search-input");

  const tabs = document.querySelectorAll(".tab-item");
  const navItems = document.querySelectorAll(".nav-item");

  const mobilePost = document.getElementById("mobile-post");
  const sidebarPost = document.getElementById("sidebar-post");

  const logoutBtn = document.getElementById("logout-btn");


  /* =========================
     DEFAULT POSTS
  ========================= */

  const defaultPosts = [

    {
      id: 1,
      name: "Alex Johnson",
      username: "@alex",
      avatar: "A",
      verified: true,
      text: "Building something new today. Sometimes the smallest ideas turn into the biggest projects. 🚀",
      time: "2h",
      likes: 124,
      reposts: 18,
      replies: 12,
      liked: false,
      reposted: false,
      bookmarked: false,
      following: true
    },

    {
      id: 2,
      name: "Sarah Chen",
      username: "@sarahchen",
      avatar: "S",
      verified: true,
      text: "The web keeps getting more interesting. There is so much we can build when good design and good technology come together.",
      time: "4h",
      likes: 842,
      reposts: 91,
      replies: 48,
      liked: false,
      reposted: false,
      bookmarked: false,
      following: true
    },

    {
      id: 3,
      name: "David Smith",
      username: "@davidsmith",
      avatar: "D",
      verified: false,
      text: "What's one technology you think will completely change the way we work over the next five years?",
      time: "6h",
      likes: 327,
      reposts: 36,
      replies: 104,
      liked: false,
      reposted: false,
      bookmarked: false,
      following: false
    }

  ];


  let posts = JSON.parse(
    localStorage.getItem("posts")
  ) || defaultPosts;


  /* =========================
     SAVE POSTS
  ========================= */

  function savePosts() {
    localStorage.setItem(
      "posts",
      JSON.stringify(posts)
    );
  }


  /* =========================
     FORMAT NUMBERS
  ========================= */

  function formatNumber(number) {

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }

    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }

    return number;
  }


  /* =========================
     RENDER FEED
  ========================= */

  function renderPosts(list = posts) {

    feed.innerHTML = "";

    if (list.length === 0) {

      feed.innerHTML = `
        <div class="empty-feed">
          <h2>No posts found</h2>
          <p>Try searching for something else.</p>
        </div>
      `;

      return;
    }


    list.forEach(post => {

      const article = document.createElement("article");

      article.className = "post-card";

      article.innerHTML = `

        <div class="post-avatar avatar">
          ${escapeHTML(post.avatar)}
        </div>

        <div class="post-content">

          <div class="post-header">

            <strong>
              ${escapeHTML(post.name)}
              ${post.verified
                ? '<span class="verified">✓</span>'
                : ""
              }
            </strong>

            <span class="post-username">
              ${escapeHTML(post.username)}
            </span>

            <span class="post-dot">·</span>

            <span class="post-time">
              ${escapeHTML(post.time)}
            </span>

            <button class="post-more">
              •••
            </button>

          </div>


          <div class="post-text">
            ${escapeHTML(post.text)}
          </div>


          <div class="post-actions">

            <button
              class="post-action reply"
              data-id="${post.id}"
              title="Reply"
            >
              <i class="fi fi-rr-comment"></i>
              <span>${formatNumber(post.replies)}</span>
            </button>


            <button
              class="post-action repost ${
                post.reposted ? "reposted" : ""
              }"
              data-id="${post.id}"
              title="Repost"
            >
              <i class="fi fi-rr-refresh"></i>
              <span>${formatNumber(post.reposts)}</span>
            </button>


            <button
              class="post-action like ${
                post.liked ? "liked" : ""
              }"
              data-id="${post.id}"
              title="Like"
            >
              <i class="fi ${
                post.liked
                  ? "fi-sr-heart"
                  : "fi-rr-heart"
              }"></i>

              <span>${formatNumber(post.likes)}</span>
            </button>


            <button
              class="post-action bookmark ${
                post.bookmarked ? "bookmarked" : ""
              }"
              data-id="${post.id}"
              title="Bookmark"
            >
              <i class="fi ${
                post.bookmarked
                  ? "fi-sr-bookmark"
                  : "fi-rr-bookmark"
              }"></i>
            </button>


            <button
              class="post-action share"
              data-id="${post.id}"
              title="Share"
            >
              <i class="fi fi-rr-share"></i>
            </button>

          </div>

        </div>
      `;


      feed.appendChild(article);

    });

  }


  /* =========================
     ESCAPE HTML
  ========================= */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =========================
     CREATE POST
  ========================= */

  function createPost() {

    const text = postInput.value.trim();

    if (!text) {
      return;
    }


    const username =
      localStorage.getItem("username") || "Alex";


    const newPost = {

      id: Date.now(),

      name: username,

      username: "@" + username
        .toLowerCase()
        .replace(/\s+/g, ""),

      avatar: username
        .charAt(0)
        .toUpperCase(),

      verified: false,

      text: text,

      time: "now",

      likes: 0,

      reposts: 0,

      replies: 0,

      liked: false,

      reposted: false,

      bookmarked: false,

      following: true

    };


    posts.unshift(newPost);

    savePosts();

    renderPosts();

    postInput.value = "";

    postBtn.disabled = true;

  }


  /* =========================
     POST INPUT
  ========================= */

  postInput.addEventListener("input", () => {

    const hasText =
      postInput.value.trim().length > 0;

    postBtn.disabled = !hasText;

  });


  postBtn.addEventListener(
    "click",
    createPost
  );


  /* =========================
     FEED ACTIONS
  ========================= */

  feed.addEventListener("click", event => {

    const button =
      event.target.closest(".post-action");

    if (!button) {
      return;
    }


    const id = Number(button.dataset.id);

    const post =
      posts.find(item => item.id === id);

    if (!post) {
      return;
    }


    /* LIKE */

    if (button.classList.contains("like")) {

      post.liked = !post.liked;

      post.likes += post.liked ? 1 : -1;

    }


    /* REPOST */

    if (button.classList.contains("repost")) {

      post.reposted = !post.reposted;

      post.reposts += post.reposted ? 1 : -1;

    }


    /* BOOKMARK */

    if (button.classList.contains("bookmark")) {

      post.bookmarked =
        !post.bookmarked;

    }


    /* REPLY */

    if (button.classList.contains("reply")) {

      const reply = prompt(
        "Write your reply:"
      );

      if (reply && reply.trim()) {

        post.replies++;

        alert("Reply posted!");

      }

    }


    /* SHARE */

    if (button.classList.contains("share")) {

      const shareText =
        `${post.name}: ${post.text}`;

      if (navigator.share) {

        navigator.share({
          title: "Post",
          text: shareText
        });

      } else {

        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            alert("Post copied to clipboard.");
          });

      }

    }


    savePosts();

    renderPosts();

  });


  /* =========================
     SEARCH
  ========================= */

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!query) {

        renderPosts();

        return;

      }


      const filtered =
        posts.filter(post =>

          post.text
            .toLowerCase()
            .includes(query)

          ||

          post.name
            .toLowerCase()
            .includes(query)

          ||

          post.username
            .toLowerCase()
            .includes(query)

        );


      renderPosts(filtered);

    }
  );


  /* =========================
     TABS
  ========================= */

  tabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        tabs.forEach(item =>
          item.classList.remove("active")
        );

        tab.classList.add("active");


        const type =
          tab.dataset.tab;


        if (type === "following") {

          renderPosts(
            posts.filter(
              post => post.following
            )
          );

        } else {

          renderPosts();

        }

      }
    );

  });


  /* =========================
     NAVIGATION
  ========================= */

  navItems.forEach(item => {

    item.addEventListener(
      "click",
      () => {

        navItems.forEach(nav =>
          nav.classList.remove("active")
        );

        item.classList.add("active");

      }
    );

  });


  /* =========================
     POST BUTTONS
  ========================= */

  function focusComposer() {

    postInput.focus();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  sidebarPost.addEventListener(
    "click",
    focusComposer
  );


  mobilePost.addEventListener(
    "click",
    focusComposer
  );


  /* =========================
     LOGOUT
  ========================= */

  logoutBtn.addEventListener(
    "click",
    () => {

      const confirmLogout =
        confirm("Log out of this account?");

      if (!confirmLogout) {
        return;
      }

      localStorage.removeItem("loggedIn");

      window.location.href =
        "login.html";

    }
  );


  /* =========================
     FOLLOW BUTTONS
  ========================= */

  document
    .querySelectorAll(".follow-user button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const following =
            button.textContent === "Following";

          button.textContent =
            following
              ? "Follow"
              : "Following";

          button.classList.toggle(
            "following",
            !following
          );

        }
      );

    });


  /* =========================
     INITIAL RENDER
  ========================= */

  renderPosts();

});
