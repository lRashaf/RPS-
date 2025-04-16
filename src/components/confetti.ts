// A simplified confetti implementation
export default function confetti(options: { 
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number; }
}) {
  const count = options.particleCount || 50;
  const spread = options.spread || 70;
  const originX = options.origin?.x || 0.5;
  const originY = options.origin?.y || 0.5;

  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles: Particle[] = [];
  const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
  
  interface Particle {
    x: number;
    y: number;
    color: string;
    size: number;
    tilt: number;
    velocity: { x: number; y: number };
    gravity: number;
    rotation: number;
    rotationSpeed: number;
  }
  
  // Create particles
  for (let i = 0; i < count; i++) {
    particles.push({
      x: originX * canvas.width,
      y: originY * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      tilt: Math.floor(Math.random() * 10) - 10,
      velocity: {
        x: Math.random() * (spread / 2) - spread / 4,
        y: Math.random() * -spread - 3
      },
      gravity: 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 0.2 - 0.1
    });
  }
  
  let animationFrame: number;
  
  function animate() {
    if (!ctx) return; // ✅ هذا هو التعديل الوحيد المطلوب

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let particleCount = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      ctx.save();
      ctx.beginPath();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      
      ctx.restore();
      
      // Update particle position
      p.velocity.y += p.gravity;
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      p.rotation += p.rotationSpeed;
      
      // Keep particles on screen
      if (p.y < canvas.height && p.x > -100 && p.x < canvas.width + 100) {
        particleCount++;
      }
    }
    
    // Stop animation when all particles are off screen
    if (particleCount > 0) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
    }
  }
  
  animationFrame = requestAnimationFrame(animate);
  
  // Clean up after a few seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
  }, 8000);
}
