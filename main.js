const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    // Sets the initial position.
    this.x = x;
    this.y = y;
    
    // Sets the particle radius.
    this.radius = 3;
    
    // The velocity.
    this.vx = 0; // horizontal speed.
    this.vy = Math.random() * 2 + 1; // slight randomness in fall speed.
  }

  // Updates the particle movement each frame.
  update(repellers) {
    // Applies gravity.
    this.vy += 0.05;

    // Loops through each repeller to apply repelling force.
    repellers.forEach(repeller => {
      // Distance between the particle and the repeller.
      const dx = this.x - repeller.x;
      const dy = this.y - repeller.y;
      const dist = Math.sqrt(dx * dx + dy * dy); // Euclidean distance.
      
      // The minimum distance for repelling to happen.
      const minDist = repeller.radius + 50;

      // Only applies force if the particle is close enough.
      if (dist < minDist && dist > 0.1) {
        // The repelling is stronger when closer.
        const force = 100 / (dist * dist);
        const angle = Math.atan2(dy, dx); // angle between the particle and repeller.
        
        // Pushes the particle away from the repeller.
        this.vx += Math.cos(angle) * force;
        this.vy += Math.sin(angle) * force;
      }
    });

    // Moves the particle based on current velocity.
    this.x += this.vx;
    this.y += this.vy;
  }

  // Draws the particle as a white circle.
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Checks if the particle has fallen below the screen.
  isOffScreen() {
    return this.y > canvas.height + 100;
  }
}

class Repeller {
  constructor(x, y, radius = 50) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  // Draws the repeller as a faint circle to show its range.
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.2)';
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Array to store all the particles.
const particles = [];

// Array of fixed repelling circles.
const repellers = [
  new Repeller(canvas.width / 3, canvas.height / 2, 80),
  new Repeller(canvas.width * 0.7, canvas.height / 3, 100)
];

// Main loop
function animate() {
  // Clears the screen before each new frame.
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Add new particles if there aren't already too many.
  if (particles.length < 300) {
    particles.push(new Particle(Math.random() * canvas.width, 0));
  }

  // Loops through all the particles backwards as some might be removed.
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    
    // Updates the position and velocity based on the gravity and repellers.
    p.update(repellers);
    
    // Draws the particle.
    p.draw();

    // Removes the particle if it's off the screen.
    if (p.isOffScreen()) {
      particles.splice(i, 1); // Remove particle if it's below screen
    }
  }

  // Draw all repellers on the screen.
  repellers.forEach(r => r.draw());

  requestAnimationFrame(animate);
}

animate();