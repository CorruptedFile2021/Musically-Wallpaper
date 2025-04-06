console.log("Particles script loaded!");

const ParticleCanvas = document.getElementById('particles');
const ParticleCtx = ParticleCanvas.getContext('2d');



let particles = [];
function resizeParticleCanvas() {
    ParticleCanvas.width = window.innerWidth;
    ParticleCanvas.height = window.innerHeight;
  }
  resizeParticleCanvas();

  window.addEventListener("resize", resizeParticleCanvas);


class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * ParticleCanvas.width;
    this.y = Math.random() * ParticleCanvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.alpha = Math.random() * 0.5 + 0.5; // instead of 0.1 to 0.6, now it's 0.5 to 1

  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (
      this.x < 0 || this.x > ParticleCanvas.width ||
      this.y < 0 || this.y > ParticleCanvas.height
    ) {
      this.reset();
    }
  }

  draw() {
    ParticleCtx.fillStyle = `hsla(${window.hue}, 100%, 70%, ${this.alpha})`;
    ParticleCtx.beginPath();
    ParticleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ParticleCtx.fill();
  }
}

for (let i = 0; i < 150; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ParticleCtx.clearRect(0, 0, ParticleCanvas.width, ParticleCanvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();
