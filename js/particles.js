(() => {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles, mouse;
  const COUNT       = 110;
  const CONNECT_DIST = 110;
  const REPEL_DIST   = 90;
  const REPEL_FORCE  = 0.6;
  const SPEED        = 0.35;
  const COLOR_MAIN   = '0, 212, 255';   /* cyan */
  const COLOR_ALT    = '124, 58, 237';  /* violet */

  mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function makeParticle() {
    const alt = Math.random() < 0.15;
    return {
      x:  rand(0, W),
      y:  rand(0, H),
      vx: rand(-SPEED, SPEED),
      vy: rand(-SPEED, SPEED),
      r:  rand(1, 2.2),
      color: alt ? COLOR_ALT : COLOR_MAIN,
      alpha: rand(0.4, 0.9),
      twinkleSpeed: rand(0.008, 0.02),
      twinkleDir:   1,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }

  function update() {
    particles.forEach(p => {
      /* Mouse repulsion */
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_DIST && dist > 0) {
        const force = (REPEL_DIST - dist) / REPEL_DIST * REPEL_FORCE;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      /* Gentle speed cap */
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > SPEED * 3) {
        p.vx = (p.vx / speed) * SPEED * 3;
        p.vy = (p.vy / speed) * SPEED * 3;
      }

      /* Friction to settle back */
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      /* Wrap edges */
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      /* Twinkle */
      p.alpha += p.twinkleSpeed * p.twinkleDir;
      if (p.alpha >= 0.9 || p.alpha <= 0.3) p.twinkleDir *= -1;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Draw connecting lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${a.color}, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    /* Draw dots */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();

      /* Glow for larger particles */
      if (p.r > 1.6) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.15})`;
        ctx.fill();
      }
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  /* Track mouse inside hero only */
  const hero = document.getElementById('hero');
  hero.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', () => {
    resize();
    /* Re-spread particles to fill new dimensions */
    particles.forEach(p => {
      if (p.x > W) p.x = rand(0, W);
      if (p.y > H) p.y = rand(0, H);
    });
  });

  init();
  loop();
})();
