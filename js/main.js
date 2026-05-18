/* ── Scroll progress bar ────────────────────────────────────── */
(() => {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });
})();

/* ── Navbar scroll behavior ─────────────────────────────────── */
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ── Mobile nav ─────────────────────────────────────────────── */
(() => {
  const burger  = document.getElementById('navBurger');
  const overlay = document.getElementById('navOverlay');
  if (!burger || !overlay) return;

  let open = false;

  function toggle() {
    open = !open;
    burger.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger.addEventListener('click', toggle);

  overlay.querySelectorAll('.overlay-link').forEach(link => {
    link.addEventListener('click', () => {
      if (open) toggle();
    });
  });

  /* Close on escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) toggle();
  });
})();

/* ── Email copy to clipboard ────────────────────────────────── */
(() => {
  const btn      = document.getElementById('copyBtn');
  const emailEl  = document.getElementById('contactEmail');
  const textEl   = document.getElementById('copyText');
  if (!btn || !emailEl) return;

  btn.addEventListener('click', () => {
    const email = emailEl.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      textEl.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        textEl.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      /* Fallback for non-https */
      const input = document.createElement('input');
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      textEl.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        textEl.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
})();

/* ── Contact form ───────────────────────────────────────────── */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"] span');
    const orig = btn.textContent;
    btn.textContent = 'Sent!';
    form.reset();
    setTimeout(() => { btn.textContent = orig; }, 3000);
  });
})();

/* ── Smooth active nav highlight ────────────────────────────── */
(() => {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => {
          const active = a.getAttribute('href') === '#' + id;
          a.style.color = active ? 'var(--text)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();
