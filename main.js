// ---------------------- Stream Popup ----------------------
const joinBtn = document.getElementById("joinStream");
const modal = document.getElementById("streamModal");
const closeModal = document.getElementById("closeModal");

if(joinBtn){
  joinBtn.addEventListener("click", async () => {
    modal.style.display = "block";
    const video = document.getElementById("streamVideo");
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = localStream;
  });
}
if(closeModal){
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    document.getElementById("streamVideo").srcObject = null;
  });
}

// ---------------------- Music Visualizer ----------------------
function setupVisualizer() {
  if(!audioPlayer || !canvas) return;
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audioPlayer);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw(){
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Gradient for Nev’s vibe
    const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
    gradient.addColorStop(0,"#ff66cc");
    gradient.addColorStop(0.5,"#ff6600");
    gradient.addColorStop(1,"#66ccff");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;

    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for(let i=0;i<bufferLength;i++){
      let v = dataArray[i]/255;
      let y = v * canvas.height/2 + canvas.height/4;
      if(i===0){
        ctx.moveTo(x,y);
      } else {
        ctx.lineTo(x,y);
      }
      x += sliceWidth;
    }
    ctx.stroke();
  }
  draw();
}
