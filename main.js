/* ── Canvas Splash Animation ── */
(function() {
  const canvas = document.getElementById('splash');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const rings = [];
  const GOLD  = [184, 150, 12];

  function spawnRing(x, y) {
    rings.push({ x, y, r: 0, maxR: 120 + Math.random() * 180, speed: 0.6 + Math.random() * 0.8, alpha: 0.6, life: 1 });
  }

  function seedRings() {
    const cx = canvas.width  * (0.3 + Math.random() * 0.4);
    const cy = canvas.height * (0.3 + Math.random() * 0.4);
    spawnRing(cx, cy);
    for (let i = 0; i < 2; i++) {
      setTimeout(() => spawnRing(cx + (Math.random()-0.5)*30, cy + (Math.random()-0.5)*30), i * 180);
    }
  }

  seedRings();
  setInterval(seedRings, 3200);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.r    += ring.speed;
      ring.life  = 1 - ring.r / ring.maxR;
      ring.alpha = ring.life * 0.55;

      if (ring.life <= 0) { rings.splice(i, 1); continue; }

      const [r, g, b] = GOLD;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},${ring.alpha})`;
      ctx.lineWidth   = 1.2 * ring.life;
      ctx.stroke();

      /* inner shimmer */
      const grad = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, ring.r * 0.6);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${ring.life * 0.04})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();

  /* click / touch → new rings */
  canvas.addEventListener('click', e => spawnRing(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', e => {
    const t = e.touches[0];
    spawnRing(t.clientX, t.clientY);
  }, { passive: true });
})();

/* ── Nav scroll class ── */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));
