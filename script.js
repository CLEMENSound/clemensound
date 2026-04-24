const canvas = document.querySelector("#soundCanvas");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let pixelRatio = 1;
let frame = 0;

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawWave(y, amplitude, frequency, speed, color, lineWidth) {
  context.beginPath();
  for (let x = -20; x <= width + 20; x += 8) {
    const drift = frame * speed;
    const wave = Math.sin(x * frequency + drift) * amplitude;
    const overtone = Math.sin(x * frequency * 0.43 - drift * 1.6) * amplitude * 0.36;
    const currentY = y + wave + overtone;
    if (x === -20) {
      context.moveTo(x, currentY);
    } else {
      context.lineTo(x, currentY);
    }
  }
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
}

function drawParticles() {
  for (let i = 0; i < 76; i += 1) {
    const x = ((i * 137 + frame * 0.42) % (width + 120)) - 60;
    const y = height * (0.16 + ((i * 43) % 70) / 100);
    const size = 0.8 + (i % 4) * 0.34;
    const alpha = 0.14 + ((i % 8) / 8) * 0.24;
    context.fillStyle = `rgba(245, 242, 235, ${alpha})`;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
  }
}

function render() {
  frame += 1;
  context.clearRect(0, 0, width, height);

  drawParticles();
  drawWave(height * 0.36, 58, 0.009, 0.018, "rgba(215, 180, 106, 0.52)", 1.4);
  drawWave(height * 0.5, 88, 0.006, -0.014, "rgba(119, 215, 213, 0.28)", 1.1);
  drawWave(height * 0.66, 42, 0.013, 0.022, "rgba(217, 95, 80, 0.30)", 1);

  requestAnimationFrame(render);
}

resizeCanvas();
render();
window.addEventListener("resize", resizeCanvas);
