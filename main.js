// ----- Storage Setup -----
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// ----- Elements -----
const loginContainer = document.getElementById("login-container");
const newsfeedContainer = document.getElementById("newsfeed-container");
const loginBtn = document.getElementById("login-btn");
const createAccountBtn = document.getElementById("create-account-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const newsfeedDiv = document.getElementById("newsfeed");

// ----- Functions -----
function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }
function savePosts() { localStorage.setItem("posts", JSON.stringify(posts)); }

function showNewsFeed(user) {
  loginContainer.classList.add("hidden");
  newsfeedContainer.classList.remove("hidden");
  newsfeedDiv.innerHTML = "";

  // Show "new account" messages
  users.forEach(u => {
    if(u.username !== user.username){
      let div = document.createElement("div");
      div.textContent = `${u.username} has an account.`;
      newsfeedDiv.appendChild(div);
    }
  });

  // Show posts
  posts.forEach(p => {
    let div = document.createElement("div");
    div.textContent = `${p.username}: ${p.text}`;
    newsfeedDiv.appendChild(div);
  });
}

// ----- Event Listeners -----
loginBtn.addEventListener("click", () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  let user = users.find(u => u.username === username && u.password === password);
  if(user){
    showNewsFeed(user);
  } else {
    alert("Incorrect login!");
  }
});

createAccountBtn.addEventListener("click", () => {
  const username = prompt("Enter new username:");
  const password = prompt("Enter new password:");
  if(!username || !password) return;

  if(users.find(u => u.username === username)){
    alert("Username already exists!");
    return;
  }

  let newUser = { username, password };
  users.push(newUser);
  saveUsers();
  alert("Account created!");
});

logoutBtn.addEventListener("click", () => {
  newsfeedContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});
