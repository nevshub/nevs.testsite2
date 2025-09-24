let role = localStorage.getItem("userRole") || "guest";

const streamSection = document.getElementById("streamSection");
const startStreamBtn = document.getElementById("startStreamBtn");
const stopStreamBtn = document.getElementById("stopStreamBtn");
const liveStream = document.getElementById("liveStream");
const streamListEl = document.getElementById("streamList");

let localStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let streams = JSON.parse(localStorage.getItem("streams") || "[]");

if(role === "admin") streamSection.style.display = "block";

async function startStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    liveStream.srcObject = localStream;

    recordedChunks = [];
    mediaRecorder = new MediaRecorder(localStream);
    mediaRecorder.ondataavailable = e => { if(e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start();

    startStreamBtn.style.display = "none";
    stopStreamBtn.style.display = "inline-block";

  } catch(err) {
    alert("Cannot access camera/microphone: " + err);
  }
}

function stopStream() {
  if(mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
  if(localStream) localStream.getTracks().forEach(track => track.stop());

  startStreamBtn.style.display = "inline-block";
  stopStreamBtn.style.display = "none";
}

function saveRecording() {
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const url = URL.createObjectURL(blob);

  const name = prompt("Enter a name for this stream:", "New Stream") || "New Stream";
  const timestamp = new Date().toLocaleString();
  const streamEntry = { id: Date.now(), name, timestamp, url };
  streams.unshift(streamEntry);
  localStorage.setItem("streams", JSON.stringify(streams));
  renderStreamList();
}

function renderStreamList() {
  streamListEl.innerHTML = "";
  streams.forEach(stream => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    li.innerHTML = `
      <strong>Name:</strong> <span class="streamName">${stream.name}</span> 
      | <strong>Time:</strong> ${stream.timestamp} 
      <a href="${stream.url}" target="_blank" style="margin-left:10px;">Watch</a>
      <button class="editBtn" style="margin-left:10px;">Edit</button>
      <button class="deleteBtn" style="margin-left:5px;">Delete</button>
    `;

    li.querySelector(".editBtn").addEventListener("click", () => {
      const newName = prompt("Edit stream name:", stream.name);
      if(newName) {
        stream.name = newName;
        localStorage.setItem("streams", JSON.stringify(streams));
        renderStreamList();
      }
    });

    li.querySelector(".deleteBtn").addEventListener("click", () => {
      if(confirm("Delete this stream?")) {
        streams = streams.filter(s => s.id !== stream.id);
        localStorage.setItem("streams", JSON.stringify(streams));
        renderStreamList();
      }
    });

    streamListEl.appendChild(li);
  });
}

startStreamBtn.addEventListener("click", startStream);
stopStreamBtn.addEventListener("click", stopStream);
renderStreamList();
