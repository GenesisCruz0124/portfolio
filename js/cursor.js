(() => {
  const cursor      = document.getElementById('cursor');
  const trail       = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let cx = -100, cy = -100;   /* cursor dot — snaps immediately */
  let tx = -100, ty = -100;   /* trail ring — lerps */

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
  });

  /* Tick: trail follows with lag */
  function tick() {
    tx = lerp(tx, cx, 0.14);
    ty = lerp(ty, cy, 0.14);

    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    trail.style.left  = tx + 'px';
    trail.style.top   = ty + 'px';

    requestAnimationFrame(tick);
  }
  tick();

  /* Grow on interactive elements */
  const hoverTargets = 'a, button, [data-hover], input, textarea, .tilt-card, .btn-copy';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('is-hovering');
      trail.classList.add('is-hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('is-hovering');
      trail.classList.remove('is-hovering');
    }
  });

  /* Hide when leaving window */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity  = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity  = '1';
  });
})();
