// ---------------------- Auth & Role ----------------------
const isAdmin = window.location.href.includes("admin.html");
if (isAdmin) {
  const password = prompt("Enter Admin Password:");
  if (password !== "GroveFire") {
    alert("Wrong password");
    window.location.href = "index.html";
  }
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
let peerConnections = {};
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

async function startStream(){
  const video = document.getElementById(isAdmin ? "adminStream" : "streamVideo");
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = localStream;

  // For recording (admin)
  if(isAdmin){
    const mediaRecorder = new MediaRecorder(localStream);
    let chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.onstop = e => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.download = "recordedStream.webm";
      a.textContent = "Download Stream";
      li.appendChild(a);
      document.getElementById("recordedList").appendChild(li);
      chunks = [];
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 1000*60*5); // Auto-stop 5 min
  }
}

document.getElementById("startStream")?.addEventListener("click", startStream);
document.getElementById("joinStream")?.addEventListener("click", startStream);

// ---------------------- Music Visualizer ----------------------
const audio = document.getElementById("musicPlayer");
const canvas = document.getElementById("visualizer");
if(audio && canvas){
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
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
