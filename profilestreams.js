const role = localStorage.getItem("userRole");

// Elements
const coverPhoto = document.getElementById("coverPhoto");
const profilePhoto = document.getElementById("profilePhoto");
const coverInput = document.getElementById("coverInput");
const profileInput = document.getElementById("profileInput");
const changeCover = document.getElementById("changeCover");
const changeProfile = document.getElementById("changeProfile");
const adminWallBtn = document.getElementById("adminWallBtnContainer");
const startStreamBtn = document.getElementById("startStreamBtn");
const joinStreamBtn = document.getElementById("joinStreamBtn");

// Show admin/member options
if(role === "admin" || role === "member") {
  changeCover.style.display = "inline-block";
  changeProfile.style.display = "inline-block";
  joinStreamBtn.style.display = "inline-block";
  if(role === "admin") {
    startStreamBtn.style.display = "inline-block";
    adminWallBtn.style.display = "block";
  }
}

// Load saved images
coverPhoto.src = localStorage.getItem("coverPhoto") || "";
profilePhoto.src = localStorage.getItem("profilePhoto") || "";

// Change Cover Photo
changeCover.addEventListener("click", () => coverInput.click());
coverInput.addEventListener("change", () => {
  const file = coverInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      coverPhoto.src = reader.result;
      localStorage.setItem("coverPhoto", reader.result);
    };
    reader.readAsDataURL(file);
  }
});

// Change Profile Photo
changeProfile.addEventListener("click", () => profileInput.click());
profileInput.addEventListener("change", () => {
  const file = profileInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      profilePhoto.src = reader.result;
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  }
});

// --- Multi-User Streaming ---
let localStream = null;
let peerConnections = {};
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Admin starts the stream
startStreamBtn.addEventListener("click", async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    window.localStream = localStream; // For testing purposes

    alert("Stream started! Members can now join.");

    // In real deployment: implement WebRTC signaling server
  } catch(err) {
    alert("Cannot start stream: " + err);
  }
});

// Member joins stream
joinStreamBtn.addEventListener("click", async () => {
  if (!localStream) {
    alert("Waiting for Admin to start the stream...");
    return;
  }

  const streamWindow = window.open("", "streamWindow", "width=600,height=400");
  streamWindow.document.write("<h1>Live Stream</h1>");
  const video = streamWindow.document.createElement("video");
  video.autoplay = true;
  video.style.width = "100%";
  video.style.height = "100%";
  streamWindow.document.body.appendChild(video);
  video.srcObject = localStream;
});
