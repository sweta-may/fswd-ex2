document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     LOGIN PROTECTION
  ===================================================== */

  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const feed = document.getElementById("feed");
  const postInput = document.getElementById("post-input");
  const postBtn = document.getElementById("post-btn");
  const searchInput = document.getElementById("search-input");

  const tabs = document.querySelectorAll(".tab-item");
  const navItems = document.querySelectorAll(".nav-item");

  const mobilePost = document.getElementById("mobile-post");
  const sidebarPost = document.getElementById("sidebar-post");
  const logoutBtn = document.getElementById("logout-btn");

  const notificationsList =
    document.getElementById("notifications-list");

  const messagesList =
    document.getElementById("messages-list");

  const profileContent =
    document.getElementById("profile-content");

  const userProfilePage =
    document.getElementById("user-profile-page");

  const userProfileContent =
    document.getElementById("user-profile-content");

  const profileBackBtn =
    document.getElementById("profile-back-btn");

  let previousPage = "home";


  /* =====================================================
     DEFAULT POSTS
  ===================================================== */

  const defaultPosts = [

    {
      id: 1,
      name: "Sahana Radhakrishnan",
      username: "@sahanar",
      avatar: "S",
      verified: true,
      text:
        "Building something new today. Sometimes the smallest ideas turn into the biggest projects. 🚀",
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
      name: "Sowmiya Lakshmi",
      username: "@sowmi",
      avatar: "S",
      verified: true,
      text:
        "The web keeps getting more interesting. There is so much we can build when good design and good technology come together.",
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
      name: "Oviyaa SM",
      username: "@oviyaasm",
      avatar: "O",
      verified: false,
      text:
        "What's one technology you think will completely change the way we work over the next five years?",
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


  let posts =
    JSON.parse(localStorage.getItem("posts")) ||
    defaultPosts;


  /* =====================================================
     USERS
  ===================================================== */

  const defaultUsers = [

    {
      id: "sahanar",
      name: "Sahana Radhakrishnan",
      username: "@sahanar",
      avatar: "S",
      bio:
        "Building, learning and sharing little things along the way. 🚀",
      followers: 124,
      following: 86,
      followingYou: false
    },

    {
      id: "sowmi",
      name: "Sowmiya Lakshmi",
      username: "@sowmi",
      avatar: "S",
      bio:
        "Web, design and technology enthusiast.",
      followers: 842,
      following: 143,
      followingYou: false
    },

    {
      id: "oviyaasm",
      name: "Oviyaa SM",
      username: "@oviyaasm",
      avatar: "O",
      bio:
        "Curious about technology and the future of work.",
      followers: 327,
      following: 71,
      followingYou: false
    }

  ];


  let users =
    JSON.parse(localStorage.getItem("blogUsers")) ||
    defaultUsers;


  /* =====================================================
     NOTIFICATIONS / MESSAGES
  ===================================================== */

  let notifications =
    JSON.parse(
      localStorage.getItem("notifications")
    ) || [];


  /* =====================================================
     SAVE DATA
  ===================================================== */

  function savePosts() {

    localStorage.setItem(
      "posts",
      JSON.stringify(posts)
    );

  }


  function saveUsers() {

    localStorage.setItem(
      "blogUsers",
      JSON.stringify(users)
    );

  }


  function saveNotifications() {

    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );

  }


  /* =====================================================
     CURRENT USER
  ===================================================== */

  function getCurrentUsername() {

    return (
      localStorage.getItem("username") ||
      "Sweta"
    );

  }


  function getCurrentUserHandle() {

    return (
      "@" +
      getCurrentUsername()
        .toLowerCase()
        .replace(/\s+/g, "")
    );

  }


  /* =====================================================
     FIND USER
  ===================================================== */

  function getUserByUsername(username) {

    const clean =
      String(username)
        .replace("@", "")
        .toLowerCase();


    if (
      clean ===
        getCurrentUsername()
          .toLowerCase()
          .replace(/\s+/g, "")
      ||
      clean === "sweta"
    ) {

      return {

        id: "current-user",

        name: getCurrentUsername(),

        username:
          getCurrentUserHandle(),

        avatar:
          getCurrentUsername()
            .charAt(0)
            .toUpperCase(),

        bio:
          "Information Technology student • Developer • Builder ✨",

        followers:
          Number(
            localStorage.getItem("myFollowers") || 0
          ),

        following:
          users.filter(
            user => user.followingYou
          ).length,

        postCount:
          posts.filter(
            post =>
              post.username.toLowerCase() ===
              getCurrentUserHandle().toLowerCase()
          ).length

      };

    }


    return users.find(
      user =>
        user.username.toLowerCase() ===
        "@" + clean
    );

  }


  /* =====================================================
     FORMAT NUMBERS
  ===================================================== */

  function formatNumber(number) {

    if (number >= 1000000) {

      return (
        number / 1000000
      ).toFixed(1) + "M";

    }


    if (number >= 1000) {

      return (
        number / 1000
      ).toFixed(1) + "K";

    }


    return number;

  }


  /* =====================================================
     ESCAPE HTML
  ===================================================== */

  function escapeHTML(value) {

    return String(value)

      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* =====================================================
     RENDER POSTS
  ===================================================== */

  function renderPosts(list = posts) {

    if (!feed) {
      return;
    }


    feed.innerHTML = "";


    if (list.length === 0) {

      feed.innerHTML = `

        <div class="empty-feed">

          <h2>No posts found</h2>

          <p>
            Try searching for something else.
          </p>

        </div>

      `;

      return;

    }


    list.forEach(post => {

      const article =
        document.createElement("article");


      article.className =
        "post-card";


      article.innerHTML = `

        <div class="post-avatar avatar">

          ${escapeHTML(post.avatar)}

        </div>


        <div class="post-content">

          <div class="post-header">

            <button
              class="post-user-link"
              data-username="${escapeHTML(
                post.username
              )}"
            >

              <strong>

                ${escapeHTML(post.name)}

                ${
                  post.verified
                    ? '<span class="verified">✓</span>'
                    : ""
                }

              </strong>


              <span class="post-username">

                ${escapeHTML(post.username)}

              </span>

            </button>


            <span class="post-dot">
              ·
            </span>


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

              <span>
                ${formatNumber(post.replies)}
              </span>

            </button>


            <button
              class="post-action repost ${
                post.reposted
                  ? "reposted"
                  : ""
              }"
              data-id="${post.id}"
              title="Repost"
            >

              <i class="fi fi-rr-refresh"></i>

              <span>
                ${formatNumber(post.reposts)}
              </span>

            </button>


            <button
              class="post-action like ${
                post.liked
                  ? "liked"
                  : ""
              }"
              data-id="${post.id}"
              title="Like"
            >

              <i class="fi ${
                post.liked
                  ? "fi-sr-heart"
                  : "fi-rr-heart"
              }"></i>

              <span>
                ${formatNumber(post.likes)}
              </span>

            </button>


            <button
              class="post-action bookmark ${
                post.bookmarked
                  ? "bookmarked"
                  : ""
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


  /* =====================================================
     CREATE POST
  ===================================================== */

  function createPost() {

    if (!postInput) {
      return;
    }


    const text =
      postInput.value.trim();


    if (!text) {
      return;
    }


    const username =
      getCurrentUsername();


    const newPost = {

      id: Date.now(),

      name: username,

      username:
        "@" +
        username
          .toLowerCase()
          .replace(/\s+/g, ""),

      avatar:
        username
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

    if (postBtn) {
      postBtn.disabled = true;
    }

  }


  /* =====================================================
     POST INPUT
  ===================================================== */

  if (postInput && postBtn) {

    postInput.addEventListener(
      "input",
      () => {

        const hasText =
          postInput.value.trim().length > 0;

        postBtn.disabled =
          !hasText;

      }
    );


    postBtn.addEventListener(
      "click",
      createPost
    );

  }


  /* =====================================================
     FEED ACTIONS
  ===================================================== */

  if (feed) {

    feed.addEventListener(
      "click",
      event => {

        /* PROFILE */

        const profileLink =
          event.target.closest(
            ".post-user-link"
          );


        if (profileLink) {

          event.preventDefault();

          event.stopPropagation();

          openUserProfile(
            profileLink.dataset.username
          );

          return;

        }


        /* POST ACTION */

        const button =
          event.target.closest(
            ".post-action"
          );


        if (!button) {
          return;
        }


        const id =
          Number(button.dataset.id);


        const post =
          posts.find(
            item =>
              item.id === id
          );


        if (!post) {
          return;
        }


        /* LIKE */

        if (
          button.classList.contains(
            "like"
          )
        ) {

          post.liked =
            !post.liked;

          post.likes +=
            post.liked
              ? 1
              : -1;

        }


        /* REPOST */

        if (
          button.classList.contains(
            "repost"
          )
        ) {

          post.reposted =
            !post.reposted;

          post.reposts +=
            post.reposted
              ? 1
              : -1;

        }


        /* BOOKMARK */

        if (
          button.classList.contains(
            "bookmark"
          )
        ) {

          post.bookmarked =
            !post.bookmarked;

        }


        /* REPLY */

        if (
          button.classList.contains(
            "reply"
          )
        ) {

          const reply =
            prompt(
              "Write your reply:"
            );


          if (
            reply &&
            reply.trim()
          ) {

            post.replies++;

            alert(
              "Reply posted!"
            );

          }

        }


        /* SHARE */

        if (
          button.classList.contains(
            "share"
          )
        ) {

          const shareText =
            `${post.name}: ${post.text}`;


          if (
            navigator.share
          ) {

            navigator.share({

              title: "Post",

              text: shareText

            });

          } else {

            navigator.clipboard
              .writeText(
                shareText
              )
              .then(() => {

                alert(
                  "Post copied to clipboard."
                );

              });

          }

        }


        savePosts();

        renderPosts();

      }
    );

  }


  /* =====================================================
     SEARCH
  ===================================================== */

  if (searchInput) {

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
          posts.filter(
            post =>

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


        renderPosts(
          filtered
        );

      }
    );

  }


  /* =====================================================
     HOME TABS
  ===================================================== */

  tabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        tabs.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        tab.classList.add(
          "active"
        );


        const type =
          tab.dataset.tab;


        if (
          type === "following"
        ) {

          renderPosts(
            posts.filter(
              post =>
                post.following
            )
          );

        } else {

          renderPosts();

        }

      }
    );

  });


  /* =====================================================
     FOLLOW -> MESSAGE
  ===================================================== */

  function addFollowNotification(user) {

    const message = {

      id: Date.now(),

      type: "follow",

      userId: user.id,

      name: user.name,

      username: user.username,

      avatar: user.avatar,

      text:
        `You followed ${user.name}.`,

      time: "now",

      read: false

    };


    notifications.unshift(
      message
    );


    saveNotifications();

    renderNotifications();

    renderMessages();

    updateMessageBadge();

  }


  /* =====================================================
     RENDER NOTIFICATIONS
  ===================================================== */

  function renderNotifications() {

    if (!notificationsList) {
      return;
    }


    notificationsList.innerHTML = "";


    if (
      notifications.length === 0
    ) {

      notificationsList.innerHTML = `

        <div class="empty-notifications">

          <i class="fi fi-rr-bell"></i>

          <h2>
            No notifications yet
          </h2>

          <p>
            Follow someone and your
            activity will appear here.
          </p>

        </div>

      `;

      return;

    }


    notifications.forEach(
      notification => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          `notification-item ${
            notification.read
              ? ""
              : "unread"
          }`;


        item.innerHTML = `

          <div class="avatar notification-avatar">

            ${escapeHTML(
              notification.avatar
            )}

          </div>


          <div class="notification-content">

            <strong>

              ${escapeHTML(
                notification.name
              )}

            </strong>


            <span>

              ${escapeHTML(
                notification.username
              )}

            </span>


            <p>

              ${escapeHTML(
                notification.text
              )}

            </p>


            <small>

              ${escapeHTML(
                notification.time
              )}

            </small>

          </div>


          <button
            class="notification-profile-btn"
            data-username="${escapeHTML(
              notification.username
            )}"
          >

            View profile

          </button>

        `;


        notificationsList.appendChild(
          item
        );

      }
    );

  }


  /* =====================================================
     RENDER MESSAGES
  ===================================================== */

  function renderMessages() {

    if (!messagesList) {
      return;
    }


    messagesList.innerHTML = "";


    if (
      notifications.length === 0
    ) {

      messagesList.innerHTML = `

        <div class="empty-messages">

          <i class="fi fi-rr-paper-plane"></i>

          <h2>
            Your messages
          </h2>

          <p>
            When you follow someone,
            your interaction will
            appear here.
          </p>

        </div>

      `;

      return;

    }


    notifications.forEach(
      message => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "message-item";


        item.innerHTML = `

          <div class="avatar message-avatar">

            ${escapeHTML(
              message.avatar
            )}

          </div>


          <div class="message-info">

            <div class="message-header">

              <strong>

                ${escapeHTML(
                  message.name
                )}

              </strong>


              <span>

                ${escapeHTML(
                  message.username
                )}

              </span>


              <small>

                ${escapeHTML(
                  message.time
                )}

              </small>

            </div>


            <p>

              ${escapeHTML(
                message.text
              )}

            </p>

          </div>


          <button
            class="message-profile-btn"
            data-username="${escapeHTML(
              message.username
            )}"
          >

            View

          </button>

        `;


        messagesList.appendChild(
          item
        );

      }
    );

  }


  /* =====================================================
     MESSAGE PROFILE CLICK
  ===================================================== */

  if (messagesList) {

    messagesList.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            ".message-profile-btn"
          );


        if (!button) {
          return;
        }


        openUserProfile(
          button.dataset.username
        );

      }
    );

  }


  /* =====================================================
     MESSAGE BADGE
  ===================================================== */

  function updateMessageBadge() {

    const badge =
      document.getElementById(
        "message-badge"
      );


    if (!badge) {
      return;
    }


    const unread =
      notifications.filter(
        item =>
          !item.read
      ).length;


    badge.textContent =
      unread;


    badge.style.display =
      unread
        ? "inline-flex"
        : "none";

  }


  /* =====================================================
     MARK NOTIFICATIONS READ
  ===================================================== */

  function markNotificationsRead() {

    notifications =
      notifications.map(
        item => ({

          ...item,

          read: true

        })
      );


    saveNotifications();

    updateMessageBadge();

    renderNotifications();

  }


  /* =====================================================
     GET USER POSTS
  ===================================================== */

  function getUserPosts(user) {

    if (
      user.id ===
      "current-user"
    ) {

      return posts.filter(
        post =>
          post.username.toLowerCase() ===
          getCurrentUserHandle().toLowerCase()
      );

    }


    return posts.filter(
      post =>
        post.username.toLowerCase() ===
        user.username.toLowerCase()
    );

  }


  /* =====================================================
     RENDER USER PROFILE
  ===================================================== */

  function renderUserProfile(user) {

    if (
      !userProfileContent ||
      !user
    ) {
      return;
    }


    const userPosts =
      getUserPosts(user);


    const isCurrentUser =
      user.id ===
      "current-user";


    userProfileContent.innerHTML = `

      <section class="user-profile-card">

        <div class="profile-cover"></div>


        <div class="profile-info">

          <div class="avatar profile-avatar-large">

            ${escapeHTML(
              user.avatar
            )}

          </div>


          <div class="profile-actions">

            ${
              isCurrentUser

                ? `

                  <button
                    class="profile-action secondary"
                    disabled
                  >
                    My profile
                  </button>

                `

                : `

                  <button
                    class="profile-action ${
                      user.followingYou
                        ? "following"
                        : ""
                    }"
                    id="profile-follow-btn"
                    data-user-id="${escapeHTML(
                      user.id
                    )}"
                  >

                    ${
                      user.followingYou
                        ? "Following"
                        : "Follow"
                    }

                  </button>

                `
            }

          </div>


          <h2>

            ${escapeHTML(
              user.name
            )}

          </h2>


          <p class="profile-handle">

            ${escapeHTML(
              user.username
            )}

          </p>


          <p class="profile-bio">

            ${escapeHTML(
              user.bio
            )}

          </p>


          <div class="profile-stats">

            <button>

              <strong>
                ${user.following}
              </strong>

              <span>
                Following
              </span>

            </button>


            <button>

              <strong>
                ${user.followers}
              </strong>

              <span>
                Followers
              </span>

            </button>


            <button>

              <strong>
                ${userPosts.length}
              </strong>

              <span>
                Posts
              </span>

            </button>

          </div>

        </div>

      </section>


      <section class="profile-posts">

        <div class="profile-posts-title">

          Posts

        </div>


        ${
          userPosts.length

            ? userPosts
                .map(
                  post => `

                    <article
                      class="profile-post"
                    >

                      <div class="avatar">

                        ${escapeHTML(
                          post.avatar
                        )}

                      </div>


                      <div>

                        <div
                          class="profile-post-header"
                        >

                          <strong>

                            ${escapeHTML(
                              post.name
                            )}

                          </strong>


                          <span>

                            ${escapeHTML(
                              post.username
                            )}

                          </span>


                          <span>

                            · ${escapeHTML(
                              post.time
                            )}

                          </span>

                        </div>


                        <p>

                          ${escapeHTML(
                            post.text
                          )}

                        </p>

                      </div>

                    </article>

                  `
                )
                .join("")

            : `

                <div
                  class="empty-profile-posts"
                >

                  <h3>
                    No posts yet
                  </h3>

                  <p>
                    This user hasn't
                    posted anything yet.
                  </p>

                </div>

              `
        }

      </section>

    `;


    const followButton =
      document.getElementById(
        "profile-follow-btn"
      );


    if (!followButton) {
      return;
    }


    followButton.addEventListener(
      "click",
      () => {

        const target =
          users.find(
            item =>
              item.id ===
              followButton.dataset.userId
          );


        if (!target) {
          return;
        }


        target.followingYou =
          !target.followingYou;


        if (
          target.followingYou
        ) {

          target.followers++;

          addFollowNotification(
            target
          );

        } else {

          target.followers =
            Math.max(
              0,
              target.followers - 1
            );


          notifications =
            notifications.filter(
              item =>
                item.userId !==
                target.id
            );


          saveNotifications();

          renderNotifications();

          renderMessages();

          updateMessageBadge();

        }


        saveUsers();

        renderUserProfile(
          target
        );

        updateFollowButtons();

      }
    );

  }


  /* =====================================================
     OPEN USER PROFILE
  ===================================================== */

  function openUserProfile(username) {

    const user =
      getUserByUsername(
        username
      );


    if (!user) {

      console.log(
        "User not found:",
        username
      );

      return;

    }


    const currentPage =
      document.querySelector(
        ".page:not(.hidden-page)"
      );


    previousPage =
      currentPage?.id
        ?.replace(
          "-page",
          ""
        ) ||
      "home";


    document
      .querySelectorAll(
        ".page"
      )
      .forEach(
        page =>
          page.classList.add(
            "hidden-page"
          )
      );


    if (userProfilePage) {

      userProfilePage.classList.remove(
        "hidden-page"
      );

    }


    renderUserProfile(
      user
    );


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }


  /* =====================================================
     UPDATE FOLLOW BUTTONS
  ===================================================== */

  function updateFollowButtons() {

    document
      .querySelectorAll(
        ".follow-user"
      )
      .forEach(
        card => {

          const user =
            users.find(
              item =>
                item.username ===
                card.dataset.username
            );


          const button =
            card.querySelector(
              ".follow-btn"
            );


          if (
            !user ||
            !button
          ) {
            return;
          }


          button.textContent =
            user.followingYou
              ? "Following"
              : "Follow";


          button.classList.toggle(

            "following",

            user.followingYou

          );

        }
      );

  }


  /* =====================================================
     WHO TO FOLLOW
  ===================================================== */

  document
    .querySelectorAll(
      ".follow-user"
    )
    .forEach(
      card => {

        const button =
          card.querySelector(
            ".follow-btn"
          );


        /* OPEN PROFILE */

        card.addEventListener(
          "click",
          event => {

            if (
              event.target.closest(
                ".follow-btn"
              )
            ) {
              return;
            }


            openUserProfile(
              card.dataset.username
            );

          }
        );


        /* FOLLOW */

        if (button) {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();


              const username =
                card.dataset.username;


              const user =
                users.find(
                  item =>
                    item.username ===
                    username
                );


              if (!user) {
                return;
              }


              user.followingYou =
                !user.followingYou;


              if (
                user.followingYou
              ) {

                user.followers++;

                addFollowNotification(
                  user
                );

              } else {

                user.followers =
                  Math.max(
                    0,
                    user.followers - 1
                  );


                notifications =
                  notifications.filter(
                    item =>
                      item.userId !==
                      user.id
                  );


                saveNotifications();

                renderNotifications();

                renderMessages();

                updateMessageBadge();

              }


              saveUsers();

              updateFollowButtons();

            }
          );

        }

      }
    );


  /* =====================================================
     NOTIFICATION PROFILE CLICK
  ===================================================== */

  if (notificationsList) {

    notificationsList.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            ".notification-profile-btn"
          );


        if (!button) {
          return;
        }


        openUserProfile(
          button.dataset.username
        );

      }
    );

  }


  /* =====================================================
     PROFILE BACK
  ===================================================== */

  if (profileBackBtn) {

    profileBackBtn.addEventListener(
      "click",
      () => {

        if (userProfilePage) {

          userProfilePage.classList.add(
            "hidden-page"
          );

        }


        document
          .querySelectorAll(
            ".page"
          )
          .forEach(
            page =>
              page.classList.add(
                "hidden-page"
              )
          );


        const page =
          document.getElementById(
            `${previousPage}-page`
          ) ||
          document.getElementById(
            "home-page"
          );


        page.classList.remove(
          "hidden-page"
        );


        navItems.forEach(
          item => {

            item.classList.toggle(

              "active",

              item.dataset.page ===
                previousPage

            );

          }
        );


        window.scrollTo({

          top: 0,

          behavior: "smooth"

        });

      }
    );

  }


  /* =====================================================
     OWN PROFILE
  ===================================================== */

  function renderProfilePage() {

    if (!profileContent) {
      return;
    }


    const currentUser =
      getUserByUsername(
        getCurrentUserHandle()
      );


    if (!currentUser) {
      return;
    }


    profileContent.innerHTML = `

      <div
        class="profile-card own-profile-card"
      >

        <div
          class="avatar profile-avatar-large"
        >

          ${escapeHTML(
            currentUser.avatar
          )}

        </div>


        <h2>

          ${escapeHTML(
            currentUser.name
          )}

        </h2>


        <p>

          ${escapeHTML(
            currentUser.username
          )}

        </p>


        <p class="profile-bio">

          ${escapeHTML(
            currentUser.bio
          )}

        </p>


        <div class="profile-stats">

          <button>

            <strong>
              ${currentUser.following}
            </strong>

            <span>
              Following
            </span>

          </button>


          <button>

            <strong>
              ${currentUser.followers}
            </strong>

            <span>
              Followers
            </span>

          </button>


          <button>

            <strong>
              ${currentUser.postCount}
            </strong>

            <span>
              Posts
            </span>

          </button>

        </div>

      </div>

    `;

  }


  /* =====================================================
     MAIN NAVIGATION
  ===================================================== */

  navItems.forEach(
    item => {

      item.addEventListener(
        "click",
        () => {

          const pageName =
            item.dataset.page;


          navItems.forEach(
            nav =>
              nav.classList.remove(
                "active"
              )
          );


          item.classList.add(
            "active"
          );


          document
            .querySelectorAll(
              ".page"
            )
            .forEach(
              page =>
                page.classList.add(
                  "hidden-page"
                )
            );


          const targetPage =
            document.getElementById(
              `${pageName}-page`
            );


          if (targetPage) {

            targetPage.classList.remove(
              "hidden-page"
            );

          }


          /* NOTIFICATIONS */

          if (
            pageName ===
            "notifications"
          ) {

            renderNotifications();

            markNotificationsRead();

          }


          /* MESSAGES */

          if (
            pageName ===
            "messages"
          ) {

            renderMessages();

          }


          /* PROFILE */

          if (
            pageName ===
            "profile"
          ) {

            renderProfilePage();

          }


          /* HOME */

          if (
            pageName ===
            "home"
          ) {

            renderPosts();

          }


          window.scrollTo({

            top: 0,

            behavior: "smooth"

          });

        }
      );

    }
  );


  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  document
    .querySelectorAll(
      ".footer-btn[data-page]"
    )
    .forEach(
      item => {

        item.addEventListener(
          "click",
          () => {

            const pageName =
              item.dataset.page;


            document
              .querySelectorAll(
                ".footer-btn"
              )
              .forEach(
                btn =>
                  btn.classList.remove(
                    "active"
                  )
              );


            item.classList.add(
              "active"
            );


            document
              .querySelectorAll(
                ".page"
              )
              .forEach(
                page =>
                  page.classList.add(
                    "hidden-page"
                  )
              );


            const targetPage =
              document.getElementById(
                `${pageName}-page`
              );


            if (targetPage) {

              targetPage.classList.remove(
                "hidden-page"
              );

            }


            if (
              pageName ===
              "notifications"
            ) {

              renderNotifications();

              markNotificationsRead();

            }


            if (
              pageName ===
              "messages"
            ) {

              renderMessages();

            }


            if (
              pageName ===
              "profile"
            ) {

              renderProfilePage();

            }


            if (
              pageName ===
              "home"
            ) {

              renderPosts();

            }

          }
        );

      }
  );


  /* =====================================================
     POST BUTTONS
  ===================================================== */

  function focusComposer() {

    if (!postInput) {
      return;
    }


    postInput.focus();


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }


  if (sidebarPost) {

    sidebarPost.addEventListener(
      "click",
      focusComposer
    );

  }


  if (mobilePost) {

    mobilePost.addEventListener(
      "click",
      focusComposer
    );

  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      () => {

        const confirmLogout =
          confirm(
            "Log out of this account?"
          );


        if (!confirmLogout) {
          return;
        }


        localStorage.removeItem(
          "loggedIn"
        );


        window.location.href =
          "login.html";

      }
    );

  }


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  renderPosts();

  renderNotifications();

  renderMessages();

  renderProfilePage();

  updateFollowButtons();

  updateMessageBadge();

});