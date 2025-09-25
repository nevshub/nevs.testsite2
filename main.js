// ==================== Profile ====================
function setProfile() {
  const name = document.getElementById('username').value;
  if(name){
    localStorage.setItem('profileName', name);
    document.getElementById('profile-name').innerText = name;
  }
}

// Load profile on start
window.onload = () => {
  const storedName = localStorage.getItem('profileName');
  if(storedName){
    document.getElementById('profile-name').innerText = storedName;
  }
  loadPosts();
  loadMusic();
  loadImages();
};

// ==================== Posts ====================
function addPost() {
  const postText = document.getElementById('new-post').value;
  if(!postText) return;
  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.push(postText);
  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('new-post').value = '';
  loadPosts();
}

function loadPosts() {
  const postsContainer = document.getElementById('posts-container');
  postsContainer.innerHTML = '';
  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerText = post;
    postsContainer.appendChild(div);
  });
}

// ==================== Music ====================
function addMusic() {
  const fileInput = document.getElementById('music-file');
  if(fileInput.files.length === 0) return;
  let musicList = JSON.parse(localStorage.getItem('musicList') || '[]');

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    musicList.push({name: file.name, data: e.target.result});
    localStorage.setItem('musicList', JSON.stringify(musicList));
    loadMusic();
  }
  reader.readAsDataURL(file);
}

function loadMusic() {
  const musicContainer = document.getElementById('music-list');
  const audioPlayer = document.getElementById('audio');
  musicContainer.innerHTML = '';
  let musicList = JSON.parse(localStorage.getItem('musicList') || '[]');
  musicList.forEach((music, index) => {
    const btn = document.createElement('button');
    btn.innerText = music.name;
    btn.onclick = () => {
      audioPlayer.src = music.data;
      audioPlayer.play();
    };
    musicContainer.appendChild(btn);
  });
}

// ==================== Images ====================
function uploadImage() {
  const fileInput = document.getElementById('image-file');
  if(fileInput.files.length === 0) return;
  let images = JSON.parse(localStorage.getItem('images') || '[]');

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function(e){
    images.push(e.target.result);
    localStorage.setItem('images', JSON.stringify(images));
    loadImages();
  }
  reader.readAsDataURL(file);
}

function loadImages() {
  const container = document.getElementById('images-container');
  container.innerHTML = '';
  let images = JSON.parse(localStorage.getItem('images') || '[]');
  images.forEach(imgSrc => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.className = 'uploaded-image';
    container.appendChild(img);
  });
}

// ==================== Login ====================
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  alert(`Logged in as ${username} with temporary password: ${password}`);
}
