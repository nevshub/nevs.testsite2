// ---------------------- Admin Login ----------------------
const loginBtn = document.getElementById("loginBtn");
const adminPassword = document.getElementById("adminPassword");
if(loginBtn){
  loginBtn.addEventListener("click", () => {
    if(adminPassword.value === "Temp1234"){
      document.getElementById("login-section").style.display = "none";
      document.getElementById("stream-control").style.display = "block";
      document.getElementById("recordings").style.display = "block";
      document.getElementById("admin-news").style.display = "block";
      alert("Admin access granted");
    } else {
      alert("Wrong password");
    }
  });
}

// ---------------------- News Feed ----------------------
const feed = document.getElementById("feed");
const postBtn = document.getElementById("postBtn");
const newPost = document.getElementById("newPost");
if(postBtn){
  postBtn.addEventListener("click", () => {
    if(newPost.value){
      const post = document.createElement("div");
      post.textContent = newPost.value;
      feed.prepend(post);
      newPost.value = "";
    }
  });
}

// ---------------------- Live Stream ----------------------
let localStream;
async function startStream(videoId){
  const video = document.getElementById(videoId);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = localStream;
}

// Admin stream controls
document.getElementById("startStream")?.addEventListener("click", ()=>startStream("adminStream"));
document.getElementById("joinStream")?.addEventListener("click", ()=>startStream("streamVideo"));

// ---------------------- Music Player ----------------------
const audioInput = document.getElementById("musicFile");
const audioPlayer = document.getElementById("musicPlayer");
const canvas = document.getElementById("visualizer");

function setupVisualizer() {
  if(!audioPlayer || !canvas) return;
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audioPlayer);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#ff6600';
    const barWidth = (canvas.width / bufferLength);
    let x = 0;
    dataArray.forEach(v=>{
      const h = v;
      ctx.fillRect(x,canvas.height-h,barWidth,h);
      x += barWidth + 1;
    });
  }
  draw();
}

// File opener
function loadAudioFile(event){
  const file = event.target.files[0];
  if(file){
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
    audioPlayer.play();
    setupVisualizer();
  }
}
