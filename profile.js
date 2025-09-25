// Profile data
let profile = JSON.parse(localStorage.getItem("profile") || "{}");

const nameInput = document.getElementById("displayName");
const profilePicInput = document.getElementById("profilePicInput");
const coverPicInput = document.getElementById("coverPicInput");
const saveProfileBtn = document.getElementById("saveProfile");

const profileName = document.getElementById("profileName");
const profilePic = document.getElementById("profilePic");
const coverPic = document.getElementById("coverPic");

function renderProfile() {
  if(profile.name) profileName.textContent = profile.name;
  if(profile.profilePic) profilePic.src = profile.profilePic;
  if(profile.coverPic) coverPic.src = profile.coverPic;
}

saveProfileBtn.addEventListener("click", () => {
  profile.name = nameInput.value || profile.name;

  if(profilePicInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      profile.profilePic = e.target.result;
      localStorage.setItem("profile", JSON.stringify(profile));
      renderProfile();
    };
    reader.readAsDataURL(profilePicInput.files[0]);
  }

  if(coverPicInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      profile.coverPic = e.target.result;
      localStorage.setItem("profile", JSON.stringify(profile));
      renderProfile();
    };
    reader.readAsDataURL(coverPicInput.files[0]);
  }

  profile.name = nameInput.value;
  localStorage.setItem("profile", JSON.stringify(profile));
  renderProfile();
});

renderProfile();

// ------------------- Posts -------------------
let posts = JSON.parse(localStorage.getItem("myPosts") || "[]");
const newPostInput = document.getElementById("newPost");
const postBtn = document.getElementById("postBtn");
const postList = document.getElementById("postList");

function renderPosts() {
  postList.innerHTML = "";
  posts.forEach(post => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    li.innerHTML = `
      <strong>${profile.name || "Me"}:</strong> ${post.text} <br>
      <small>${post.timestamp}</small>
    `;
    postList.appendChild(li);
  });
}

postBtn.addEventListener("click", () => {
  if(!newPostInput.value.trim()) return;
  const post = {
    text: newPostInput.value,
    timestamp: new Date().toLocaleString()
  };
  posts.unshift(post);
  localStorage.setItem("myPosts", JSON.stringify(posts));
  newPostInput.value = "";
  renderPosts();
});

renderPosts();
