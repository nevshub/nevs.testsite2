// ======= LOGIN =======
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    // Show all sections after login
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('posts-section').style.display = 'block';
    document.getElementById('music-section').style.display = 'block';
    document.getElementById('files-section').style.display = 'block';
    document.getElementById('stream-btn').style.display = 'block';
    document.querySelector('.login-container').style.display = 'none';

    loadProfile();
    loadPosts();
    loadMusic();
    loadFiles();
  } else {
    alert('Enter username and password');
  }
}

// ======= PROFILE =======
function saveProfile() {
  const name = document.getElementById('profile-name').value;
  const bio = document.getElementById('profile-bio').value;
  const profile = { name, bio };
  localStorage.setItem('profile', JSON.stringify(profile));
  alert('Profile saved');
}

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('profile'));
  if (profile) {
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-bio').value = profile.bio;
  }
}

// ======= POSTS =======
function addPost() {
  const content = document.getElementById('post-content').value;
  if (!content) return;

  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.push({ content, date: new Date().toLocaleString() });
  localStorage.setItem('posts', JSON.stringify(posts));
  document.getElementById('post-content').value = '';
  loadPosts();
}

function loadPosts() {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '';
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'post';
    div.innerHTML = `<strong>${post.date}</strong><p>${post.content}</p>`;
    postsList.appendChild(div);
  });
}

// ======= MUSIC =======
function addMusic() {
  const fileInput = document.getElementById('music-file');
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const music = JSON.parse(localStorage.getItem('music') || '[]');
    music.push({ name: file.name, data: e.target.result });
    localStorage.setItem('music', JSON.stringify(music));
    loadMusic();
  }
  reader.readAsDataURL(file);
  fileInput.value = '';
}

function loadMusic() {
  const musicList = document.getElementById('music-list');
  const audioPlayer = document.getElementById('audio-player');
  musicList.innerHTML = '';

  const music = JSON.parse(localStorage.getItem('music') || '[]');
  music.forEach((track, i) => {
    const btn = document.createElement('button');
    btn.textContent = track.name;
    btn.onclick = () => {
      audioPlayer.src = track.data;
      audioPlayer.play();
    }
    musicList.appendChild(btn);
  });
}

// ======= FILE UPLOADER =======
function loadFiles() {
  const filesDiv = document.getElementById('uploaded-files');
  filesDiv.innerHTML = '';

  const files = JSON.parse(localStorage.getItem('files') || '[]');
  files.forEach(file => {
    const div = document.createElement('div');
    div.textContent = file.name;
    filesDiv.appendChild(div);
  });
}

document.getElementById('file-input').addEventListener('change', function() {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    files.push({ name: file.name, data: e.target.result });
    localStorage.setItem('files', JSON.stringify(files));
    loadFiles();
  }
  reader.readAsDataURL(file);
  this.value = '';
});

// ======= STREAM =======
async function openStream() {
  const streamContainer = document.getElementById('stream-container');
  const video = document.getElementById('stream-video');
  streamContainer.style.display = 'block';

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
  } catch (err) {
    alert('Cannot access camera/mic');
  }
}

function closeStream() {
  const video = document.getElementById('stream-video');
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  video.srcObject = null;
  document.getElementById('stream-container').style.display = 'none';
}

// ======= VISUALIZER =======
const visualizerSection = document.getElementById('visualizer-section');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
let source;

document.getElementById('audio-player').addEventListener('play', function() {
  if (!source) {
    source = audioCtx.createMediaElementSource(this);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  drawVisualizer();
});

function drawVisualizer() {
  visualizerSection.style.display = 'flex';
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 100;
  visualizerSection.innerHTML = '';
  visualizerSection.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = `rgb(${barHeight + 100},50,200)`;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  }
  renderFrame();
}
