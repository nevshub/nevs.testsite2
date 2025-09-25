let musicLibrary = JSON.parse(localStorage.getItem("musicLibrary") || "[]");
const musicInput = document.getElementById("musicInput");
const musicList = document.getElementById("musicList");
const audioPlayer = document.getElementById("audioPlayer");
const canvas = document.getElementById("visualizer");

function renderMusic() {
  musicList.innerHTML = "";
  musicLibrary.forEach((song, i) => {
    const li = document.createElement("li");
    li.style.marginBottom = "8px";
    li.innerHTML = `
      ${song.name}
      <button onclick="playSong(${i})">Play</button>
      <button onclick="deleteSong(${i})">Delete</button>
    `;
    musicList.appendChild(li);
  });
}

function playSong(index) {
  audioPlayer.src = musicLibrary[index].url;
  audioPlayer.play();
  setupVisualizer();
}

function deleteSong(index) {
  musicLibrary.splice(index, 1);
  localStorage.setItem("musicLibrary", JSON.stringify(musicLibrary));
  renderMusic();
}

musicInput.addEventListener("change", () => {
  Array.from(musicInput.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      musicLibrary.push({ name: file.name, url: e.target.result });
      localStorage.setItem("musicLibrary", JSON.stringify(musicLibrary));
      renderMusic();
    };
    reader.readAsDataURL(file);
  });
});

function setupVisualizer() {
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audioPlayer);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = "#ff66cc";
    ctx.lineWidth = 2;
    let sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 255;
      let y = v * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  }
  draw();
}

renderMusic();
