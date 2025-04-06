window.hue = 0;


let VisCanvas = document.getElementById("VisCanvas");
let max_height, startPos, vizWidth, midY;

let glob = { bloom: true, bloomRadius: 3 };
let backgroundColor = "rgb(20,20,20)";
let linesColor = "rgb(255,255,255)";
let square = true;

let VisCtx = VisCanvas.getContext("2d");
let gradient;
let hue = 0;

let smoothedValues = [];



function updateTextGlow(hue) {
  const glowBase = `hsla(${hue}, 100%, 70%,`; // 👈 base string for hsla

  const glowColor1 = `${glowBase} 0.3)`;  // softer
  const glowColor2 = `${glowBase} 0.15)`; // even softer

  document.querySelector('.title').style.textShadow = `
    0 0 2px white,
    0 0 4px rgba(255, 255, 255, 0.2),
    0 0 8px ${glowColor1},
    0 0 16px ${glowColor2}
  `;

  document.querySelector('.author').style.textShadow = `
    0 0 2px white,
    0 0 4px rgba(255, 255, 255, 0.2),
    0 0 8px ${glowColor1},
    0 0 16px ${glowColor2}
  `;
}





function drawGrid(spacing = 40) {
  VisCtx.save();
  VisCtx.lineWidth = 0.5;
  VisCtx.strokeStyle = 'rgba(123, 2, 243, 0.1)';
  VisCtx.shadowColor = "white"; 
  VisCtx.shadowBlur = 4;

  // Vertical lines
  for (let x = 0; x < VisCanvas.width; x += spacing) {
    VisCtx.beginPath();
    VisCtx.moveTo(x, 0);
    VisCtx.lineTo(x, VisCanvas.height);
    VisCtx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < VisCanvas.height; y += spacing) {
    VisCtx.beginPath();
    VisCtx.moveTo(0, y);
    VisCtx.lineTo(VisCanvas.width, y);
    VisCtx.stroke();
  }

  VisCtx.restore();
}


function setSize() {
  VisCanvas.width = window.innerWidth;
  VisCanvas.height = window.innerHeight * 0.6;
  max_height = VisCanvas.height * 0.3;
  startPos = window.innerWidth * 0.1;
  vizWidth = window.innerWidth * 0.8;
  midY = VisCanvas.height - 100;
  updateGradient();
}

function updateGradient() {
  gradient = VisCtx.createLinearGradient(0, midY, 0, max_height);
  gradient.addColorStop(0, backgroundColor);
  gradient.addColorStop(1, linesColor);
}

window.onload = () => {
  setSize();
};

window.onresize = () => {
  setSize();
};

function livelyPropertyListener(name, val) {
  switch (name) {
    case "lineColor":
      var color = hexToRgb(val);
      linesColor = `rgb(${color.r},${color.g},${color.b})`;
      updateGradient();
      break;
    case "backgroundColor":
      var color = hexToRgb(val);
      backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
      updateGradient();
      break;
    case "square":
      square = val;
      break;
  }
}

function livelyAudioListener(audioArray) {
  if (smoothedValues.length !== audioArray.length) {
    smoothedValues = new Array(audioArray.length).fill(0);
  }

  let maxVal = 1;
  for (var x of audioArray) {
    if (x > maxVal) maxVal = x;
  }

  const offSet = vizWidth / audioArray.length;
  VisCtx.fillStyle = backgroundColor;
  VisCtx.fillRect(0, 0, VisCanvas.width, VisCanvas.height);

  drawGrid();

  VisCtx.beginPath();
  VisCtx.lineJoin = "round";
  VisCtx.moveTo(startPos - offSet * 3, midY);
  VisCtx.lineTo(startPos, midY);

  let posInLine = -1;
  for (var x = 0; x < audioArray.length; x++) {
    posInLine++;

    // Smooth easing 🧈
    let target = audioArray[x] / maxVal;
    smoothedValues[x] += (target - smoothedValues[x]) * 0.25;
    let barHeight = smoothedValues[x] * max_height;

    VisCtx.lineTo(startPos + offSet * posInLine, midY - barHeight);

    if (square)
      VisCtx.lineTo(startPos + offSet * (posInLine + 1), midY - barHeight);
  }

  VisCtx.lineTo(startPos + offSet * (posInLine + (square ? 1 : 0)), midY);
  VisCtx.lineTo(startPos + offSet * (posInLine + (square ? 4 : 3)), midY);

  VisCtx.fillStyle = gradient;
  VisCtx.fill();
  renderLine(linesColor);
}

function renderLine(color) {
  VisCtx.lineWidth = 2;
  VisCtx.strokeStyle = color;
  if (glob.bloom) {
    VisCtx.shadowBlur = glob.bloomRadius;
    VisCtx.shadowColor = color;
  } else {
    VisCtx.shadowBlur = 0;
  }
  VisCtx.stroke();
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// 🎨 Color Cycling
setInterval(() => {
  window.hue = (window.hue + 1) % 360;
  linesColor = `hsl(${window.hue}, 100%, 70%)`;
  updateGradient();
  updateTextGlow(window.hue); // ✅ use the global one
}, 100);

// 🌟 Animated Bloom
setInterval(() => {
  glob.bloomRadius = 1 + Math.sin(Date.now() * 0.005) * 4;
}, 16);

