// ----- Storage Setup -----
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// ----- Elements -----
const loginContainer = document.getElementById("login-container");
const profileContainer = document.getElementById("profile-container");
const loginBtn = document.getElementById("login-btn");
const createAccountBtn = document.getElementById("create-account-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const profileName = document.getElementById("profile-name");
const postText = document.getElementById("post-text");
const addPostBtn = document.getElementById("add-post-btn");
const newsfeedDiv = document.getElementById("newsfeed");
const musicFile = document.getElementById("music-file");
const addMusicBtn = document.getElementById("add-music-btn");
const musicList = document.getElementById("music-list");

let currentUser = null;

// ----- Functions -----
function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }
function savePosts() { localStorage.setItem("posts", JSON.stringify(posts)); }

function showProfile(user){
  currentUser = user;
  loginContainer.classList.add("hidden");
  profileContainer.classList.remove("hidden");
  profileName.textContent = user.username;

  renderPosts();
  renderMusic();
}

function renderPosts(){
  newsfeedDiv.innerHTML = "";
  posts.forEach(p => {
    let div = document.createElement("div");
    div.textContent = `${p.username}: ${p.text}`;
    newsfeedDiv.appendChild(div);
  });
}

function renderMusic(){
  musicList.innerHTML = "";
  if(!currentUser.music) currentUser.music = [];
  currentUser.music.forEach((m, i) => {
    let audio = document.createElement("audio");
    audio.controls = true;
    audio.src = m;
    musicList.appendChild(audio);
  });
}

// ----- Event Listeners -----
loginBtn.addEventListener("click", () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();

  let user = users.find(u => u.username === username && u.password === password);
  if(user){
    showProfile(user);
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

  let newUser = { username, password, music: [] };
  users.push(newUser);
  saveUsers();
  alert("Account created!");
});

logoutBtn.addEventListener("click", () => {
  profileContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  currentUser = null;
});

addPostBtn.addEventListener("click", () => {
  if(postText.value.trim() === "") return;
  posts.push({ username: currentUser.username, text: postText.value });
  savePosts();
  postText.value = "";
  renderPosts();
});

addMusicBtn.addEventListener("click", () => {
  if(musicFile.files.length === 0) return;
  const file = musicFile.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    currentUser.music.push(e.target.result);
    saveUsers();
    renderMusic();
  };
  reader.readAsDataURL(file);
});
