// ---------------- LOGIN ----------------
const loginScreen = document.getElementById('login-screen');
const homeScreen = document.getElementById('home-screen');
const loginBtn = document.getElementById('login-btn');
const tempPass = document.getElementById('temp-pass');

loginBtn.addEventListener('click', () => {
  const password = document.getElementById('password').value;
  if(password === tempPass.textContent){
    loginScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    loadProfile();
    loadPosts();
    loadMusic();
    loadPhotos();
  } else {
    alert('Incorrect password');
  }
});

// ---------------- PROFILE ----------------
const profileInput = document.getElementById('profile-input');
const profileName = document.getElementById('profile-name');
const saveProfileBtn = document.getElementById('save-profile');

saveProfileBtn.addEventListener('click', () => {
  const name = profileInput.value.trim();
  if(name){
    localStorage.setItem('profileName', name);
    profileName.textContent = name;
    profileInput.value = '';
  }
});

function loadProfile(){
  const savedName = localStorage.getItem('profileName');
  if(savedName) profileName.textContent = savedName;
}

// ---------------- POSTS ----------------
const postInput = document.getElementById('post-input');
const savePostBtn = document.getElementById('save-post');
const postsContainer = document.getElementById('posts-container');

savePostBtn.addEventListener('click', () => {
  const content = postInput.value.trim();
  if(content){
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(content);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    postInput.value = '';
  }
});

function loadPosts(){
  displayPosts();
}

function displayPosts(){
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  postsContainer.innerHTML = '';
  posts.forEach((p, i) => {
    const div = document.createElement('div');
    div.textContent = p;
    div.className = 'post';
    postsContainer.appendChild(div);
  });
}

// ---------------- MUSIC ----------------
const musicFile = document.getElementById('music-file');
const addMusicBtn = document.getElementById('add-music');
const audioPlayer = document.getElementById('audio-player');
const musicList = document.getElementById('music-list');

addMusicBtn.addEventListener('click', () => {
  if(musicFile.files.length > 0){
    const file = musicFile.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const musicTracks = JSON.parse(localStorage.getItem('musicTracks') || '[]');
      musicTracks.push({name: file.name, data: reader.result});
      localStorage.setItem('musicTracks', JSON.stringify(musicTracks));
      loadMusic();
    };
    reader.readAsDataURL(file);
  }
});

function loadMusic(){
  musicList.innerHTML = '';
  const musicTracks = JSON.parse(localStorage.getItem('musicTracks') || '[]');
  musicTracks.forEach((track, idx) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.addEventListener('click', () => {
      audioPlayer.src = track.data;
      audioPlayer.play();
    });
    musicList.appendChild(li);
  });
}

// ---------------- VISUALIZER ----------------
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = 150;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source;

audioPlayer.addEventListener('play', () => {
  if(!source){
    source = audioCtx.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    drawVisualizer();
  }
});

function drawVisualizer(){
  requestAnimationFrame(drawVisualizer);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  dataArray.forEach(value => {
    const barHeight = value;
    ctx.fillStyle = `rgb(${barHeight+100},50,255)`;
    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  });
}

// ---------------- PHOTOS ----------------
const photoUpload = document.getElementById('photo-upload');
const photoContainer = document.getElementById('photo-container');

photoUpload.addEventListener('change', () => {
  const file = photoUpload.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    photos.push(reader.result);
    localStorage.setItem('photos', JSON.stringify(photos));
    loadPhotos();
  };
  reader.readAsDataURL(file);
});

function loadPhotos(){
  photoContainer.innerHTML = '';
  const photos = JSON.parse(localStorage.getItem('photos') || '[]');
  photos.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'photo';
    photoContainer.appendChild(img);
  });
}

// ---------------- STREAM POPUP ----------------
const openStreamBtn = document.getElementById('open-stream-btn');
const closeStreamBtn = document.getElementById('close-stream-btn');
const streamPopup = document.getElementById('stream-popup');
const streamVideo = document.getElementById('stream-video');

openStreamBtn.addEventListener('click', async () => {
  streamPopup.classList.remove('hidden');
  const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:false});
  streamVideo.srcObject = stream;
});

closeStreamBtn.addEventListener('click', () => {
  streamPopup.classList.add('hidden');
  if(streamVideo.srcObject){
    streamVideo.srcObject.getTracks().forEach(track => track.stop());
  }
});
