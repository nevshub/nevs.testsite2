// ==== Account Management ====
let accounts = JSON.parse(localStorage.getItem('accounts')) || {};
let currentUser = null;

const authSection = document.getElementById('auth-section');
const profileSection = document.getElementById('profile-section');
const newsFeedSection = document.getElementById('news-feed-section');
const musicSection = document.getElementById('music-section');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const createBtn = document.getElementById('create-btn');
const authMsg = document.getElementById('auth-msg');

loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (accounts[username] && accounts[username].password === password) {
    loginUser(username);
  } else {
    authMsg.textContent = "Invalid login!";
  }
});

createBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    authMsg.textContent = "Enter username & password!";
    return;
  }

  if (accounts[username]) {
    authMsg.textContent = "Username taken!";
    return;
  }

  accounts[username] = {
    password,
    bio: "",
    photo: "",
    news: [],
    music: []
  };

  localStorage.setItem('accounts', JSON.stringify(accounts));
  loginUser(username);
});

function loginUser(username) {
  currentUser = username;
  authSection.classList.add('hidden');
  profileSection.classList.remove('hidden');
  newsFeedSection.classList.remove('hidden');
  musicSection.classList.remove('hidden');
  loadProfile();
  loadNewsFeed();
  loadMusic();
}

// ==== Profile Management ====
const profileUsername = document.getElementById('profile-username');
const profilePhotoInput = document.getElementById('profile-photo-input');
const uploadPhotoBtn = document.getElementById('upload-photo-btn');
const profilePhotoPreview = document.getElementById('profile-photo-preview');
const profileBio = document.getElementById('profile-bio');
const saveProfileBtn = document.getElementById('save-profile-btn');

function loadProfile() {
  const user = accounts[currentUser];
  profileUsername.textContent = currentUser;
  profileBio.value = user.bio || "";
  profilePhotoPreview.innerHTML = user.photo ? `<img src="${user.photo}" alt="Profile Photo" width="150">` : "";
}

uploadPhotoBtn.addEventListener('click', () => {
  const file = profilePhotoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    accounts[currentUser].photo = reader.result;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    loadProfile();
  };
  reader.readAsDataURL(file);
});

saveProfileBtn.addEventListener('click', () => {
  accounts[currentUser].bio = profileBio.value;
  localStorage.setItem('accounts', JSON.stringify(accounts));
  alert("Profile saved!");
});

// ==== News Feed ====
const newsFeed = document.getElementById('news-feed');

function loadNewsFeed() {
  newsFeed.innerHTML = "";
  for (let user in accounts) {
    const userPosts = accounts[user].news || [];
    userPosts.forEach(post => {
      const div = document.createElement('div');
      div.classList.add('post');
      div.innerHTML = `<strong>${user}:</strong> ${post}`;
      newsFeed.appendChild(div);
    });
  }
}

// Optional: add new post functionality
// (Could add a textarea and button if you want posting live)

// ==== Music Player ====
const musicInput = document.getElementById('music-input');
const addMusicBtn = document.getElementById('add-music-btn');
const musicList = document.getElementById('music-list');
const audioPlayer = document.getElementById('audio-player');
const visualizer = document.getElementById('music-visualizer');
const ctx = visualizer.getContext('2d');

addMusicBtn.addEventListener('click', () => {
  const file = musicInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    accounts[currentUser].music.push({name: file.name, src: reader.result});
    localStorage.setItem('accounts', JSON.stringify(accounts));
    loadMusic();
  };
  reader.readAsDataURL(file);
});

function loadMusic() {
  musicList.innerHTML = "";
  accounts[currentUser].music.forEach((track, i) => {
    const btn = document.createElement('button');
    btn.textContent = track.name;
    btn.addEventListener('click', () => {
      audioPlayer.src = track.src;
      audioPlayer.play();
    });
    musicList.appendChild(btn);
  });
}

// ==== Basic Visualizer ====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source;

audioPlayer.addEventListener('play', () => {
  if (source) source.disconnect();
  source = audioCtx.createMediaElementSource(audioPlayer);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  visualizerLoop();
});

function visualizerLoop() {
  requestAnimationFrame(visualizerLoop);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#220033";
  ctx.fillRect(0, 0, visualizer.width, visualizer.height);

  const barWidth = (visualizer.width / bufferLength) * 2.5;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = `rgb(${barHeight+100}, 50, 200)`;
    ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
