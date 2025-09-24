// === Grove News Feed System ===
const role = localStorage.getItem("userRole");
const postSection = document.getElementById("postSection");
const postBtn = document.getElementById("postBtn");
const pinPostBtn = document.getElementById("pinPostBtn");
const postContent = document.getElementById("postContent");
const postImage = document.getElementById("postImage");
const feed = document.getElementById("feed");

// Only Admins and Members can post
if (role === "admin" || role === "member") {
  postSection.style.display = "block";
  if (role === "admin") pinPostBtn.style.display = "inline-block";
}

// Function to add a post
function addPost(content, imageSrc, pinned=false) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.style.border = "1px solid #333";
  postDiv.style.padding = "10px";
  postDiv.style.margin = "10px auto";
  postDiv.style.maxWidth = "700px";
  postDiv.style.backgroundColor = "#222";

  if (pinned) {
    postDiv.style.borderColor = "#ff6600";
    postDiv.style.backgroundColor = "#333";
  }

  // Profile picture
  const profileImg = document.createElement("img");
  profileImg.src = localStorage.getItem("profilePhoto") || "";
  profileImg.alt = "Profile Photo";
  profileImg.style.width = "50px";
  profileImg.style.height = "50px";
  profileImg.style.borderRadius = "50%";
  profileImg.style.objectFit = "cover";
  profileImg.style.marginRight = "10px";
  profileImg.style.verticalAlign = "middle";

  const text = document.createElement("span");
  text.textContent = content;
  text.style.verticalAlign = "middle";

  const container = document.createElement("div");
  container.appendChild(profileImg);
  container.appendChild(text);

  postDiv.appendChild(container);

  if (imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style.maxWidth = "100%";
    img.style.marginTop = "10px";
    postDiv.appendChild(img);
  }

  if (pinned) {
    feed.prepend(postDiv);
  } else {
    feed.appendChild(postDiv);
  }
}

// Handle post button click
postBtn.addEventListener("click", () => {
  const content = postContent.value.trim();
  if (!content && !postImage.files[0]) return alert("Add text or an image to post.");

  if (postImage.files[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      addPost(content, reader.result);
      postContent.value = "";
      postImage.value = "";
      savePosts();
    };
    reader.readAsDataURL(postImage.files[0]);
  } else {
    addPost(content);
    postContent.value = "";
    savePosts();
  }
});

// Pin post button (Admin only)
pinPostBtn.addEventListener("click", () => {
  const lastPost = feed.lastChild;
  if (lastPost) {
    feed.prepend(lastPost);
    savePosts();
  }
});

// Load existing posts (localStorage)
const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
savedPosts.forEach(p => addPost(p.content, p.image, p.pinned));

// Save posts to localStorage
function savePosts() {
  const allPosts = [];
  document.querySelectorAll("#feed .post").forEach(div => {
    const content = div.querySelector("span").textContent;
    const img = div.querySelector("img:not([style*='50px'])"); // exclude profile photo
    const pinned = div.style.borderColor === "rgb(255, 102, 0)";
    allPosts.push({ content, image: img ? img.src : null, pinned });
  });
  localStorage.setItem("posts", JSON.stringify(allPosts));
}
