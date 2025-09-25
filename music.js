// ---------------- VISUALIZER ----------------
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = 150;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256; // finer frequency detail
let source;

audioPlayer.addEventListener('play', () => {
  if(!source){
    source = audioCtx.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    drawVisualizer();
  }
});

function drawVisualizer(){
  requestAnimationFrame(drawVisualizer);
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;
  dataArray.forEach((value, i) => {
    const bassBoost = i < 10 ? value * 1.5 : value; // bass stronger
    const hiHatBoost = i > bufferLength - 10 ? value * 1.2 : bassBoost; // hi-hat accent
    const barHeight = hiHatBoost;

    // playful gradient colors
    const r = 255 - barHeight;
    const g = Math.min(barHeight + 50, 255);
    const b = 200 + (barHeight / 2);
    ctx.fillStyle = `rgb(${r},${g},${b})`;

    ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
    x += barWidth + 1;
  });
}
