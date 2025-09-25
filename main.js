// ======== Login & Account Management ========
const loginSection = document.getElementById('login-section');
const profileSection = document.getElementById('profile-section');
const newsSection = document.getElementById('news-section');
const musicSection = document.getElementById('music-section');

const loginBtn = document.getElementById('login-btn');
const createAccountBtn = document.getElementById('create-account-btn');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const authMsg = document.getElementById('auth-msg');

let currentUser = null;

// Check if any users exist in localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify({}));
}

// Helper to save user data
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Login
loginBtn.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('users'));
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (users[username] && users[username].password === password) {
        currentUser = username;
        loadProfile();
        loadNewsFeed();
        loadMusic();
        showSections();
        authMsg.textContent = '';
    } else {
        authMsg.textContent = 'Invalid username or password';
    }
});

// Create Account
createAccountBtn.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('users'));
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (!username || !password) {
        authMsg.textContent = 'Username & password required';
        return;
    }

    if (users[username]) {
        authMsg.textContent = 'Username already exists';
        return;
    }

    users[username] = { password, profile: { bio: '', photo: '' }, posts: [], music: [] };
    saveUsers(users);
    authMsg.textContent = 'Account created! You can now login.';
});

// Show Profile, News & Music Sections
function showSections() {
    loginSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
    newsSection.classList.remove('hidden');
    musicSection.classList.remove('hidden');
}

// ======== Profile Management ========
const profilePhoto = document.getElementById('profile-photo');
const profileBio = document.getElementById('profile-bio');
const profilePhotoPreview = document.getElementById('profile-photo-preview');
const saveProfileBtn = document.getElementById('save-profile-btn');

saveProfileBtn.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];

    userData.profile.bio = profileBio.value;
    userData.profile.photo = profilePhotoPreview.innerHTML;

    users[currentUser] = userData;
    saveUsers(users);
    alert('Profile saved!');
});

profilePhoto.addEventListener('change', () => {
    const file = profilePhoto.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        profilePhotoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Photo" style="max-width:100px; max-height:100px; border-radius:50%;">`;
    };
    reader.readAsDataURL(file);
});

function loadProfile() {
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];

    profileBio.value = userData.profile.bio;
    profilePhotoPreview.innerHTML = userData.profile.photo || '';
}

// ======== News Feed ========
const newsFeed = document.getElementById('news-feed');
const newPost = document.getElementById('new-post');
const postBtn = document.getElementById('post-btn');

postBtn.addEventListener('click', () => {
    const content = newPost.value.trim();
    if (!content) return;

    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];

    const postObj = { user: currentUser, content, date: new Date().toLocaleString() };
    userData.posts.push(postObj);

    users[currentUser] = userData;
    saveUsers(users);
    newPost.value = '';
    loadNewsFeed();
});

function loadNewsFeed() {
    newsFeed.innerHTML = '';
    const users = JSON.parse(localStorage.getItem('users'));
    let allPosts = [];

    for (const user in users) {
        allPosts = allPosts.concat(users[user].posts);
    }

    // Sort posts newest first
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    allPosts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post');
        div.innerHTML = `<strong>${post.user}</strong> <em>${post.date}</em><p>${post.content}</p>`;
        newsFeed.appendChild(div);
    });
}

// ======== Music Player ========
const musicUpload = document.getElementById('music-upload');
const musicList = document.getElementById('music-list');
const audioPlayer = document.getElementById('audio-player');
const musicVisualizer = document.getElementById('music-visualizer');
const canvasCtx = musicVisualizer.getContext('2d');

musicUpload.addEventListener('change', () => {
    const files = Array.from(musicUpload.files);
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            userData.music.push({ name: file.name, data: e.target.result });
            saveUsers(users);
            loadMusic();
        };
        reader.readAsDataURL(file);
    });
});

function loadMusic() {
    const users = JSON.parse(localStorage.getItem('users'));
    const userData = users[currentUser];
    musicList.innerHTML = '';

    userData.music.forEach((track, index) => {
        const div = document.createElement('div');
        div.textContent = track.name;
        div.classList.add('track');
        div.addEventListener('click', () => {
            audioPlayer.src = track.data;
            audioPlayer.play();
            startVisualizer();
        });
        musicList.appendChild(div);
    });
}

// ======== Music Visualizer ========
let audioCtx, analyser, source, dataArray;

function startVisualizer() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#2a0b3d';
        canvasCtx.fillRect(0, 0, musicVisualizer.width, musicVisualizer.height);

        const barWidth = (musicVisualizer.width / dataArray.length) * 2.5;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = dataArray[i];
            canvasCtx.fillStyle = `rgb(${barHeight + 100},50,${barHeight + 50})`;
            canvasCtx.fillRect(x, musicVisualizer.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
    }

    draw();
}

// Resize canvas
window.addEventListener('resize', () => {
    musicVisualizer.width = musicVisualizer.offsetWidth;
    musicVisualizer.height = 100;
});
musicVisualizer.width = musicVisualizer.offsetWidth;
musicVisualizer.height = 100;
