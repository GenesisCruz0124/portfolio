/* ── Scroll reveals ─────────────────────────────────────────── */
(() => {
  const revealClasses = [
    '.reveal-up',
    '.reveal-up-delay',
    '.reveal-up-delay2',
    '.reveal-up-delay3',
  ];

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealClasses.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => revealObserver.observe(el));
  });

  /* Project cards — stagger via data-delay attribute */
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card').forEach(card => cardObserver.observe(card));

  /* Skill items — stagger within each group */
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 80);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-group').forEach(g => skillObserver.observe(g));
})();

/* ── Hero typing effect ─────────────────────────────────────── */
(() => {
  const el     = document.getElementById('heroTitle');
  const cursor = document.getElementById('heroCursor');
  if (!el) return;

  const phrases = ['Full-Stack Developer', 'Frontend Engineer', 'Problem Solver'];
  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    const phrase = phrases[phraseIdx];

    if (paused) return;

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 2200);
      }
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    setTimeout(type, deleting ? 45 : 90);
  }

  /* Start after hero name animation settles */
  setTimeout(type, 1100);
})();

/* ── About code block typing ────────────────────────────────── */
(() => {
  const codeEl = document.getElementById('codeContent');
  if (!codeEl) return;

  const raw = `{
  "name":  "Genesis",
  "role":  "Full-Stack Developer",
  "based": "Anywhere with good Wi-Fi",
  "loves": [
    "clean code",
    "dark UIs",
    "fast deploys",
    "a good cup of coffee"
  ],
  "open_to": "Freelance & Full-time"
}`;

  /* Minimal syntax highlighting */
  function highlight(text) {
    return text
      .replace(/("[\w_]+")\s*:/g, '<span class="tok-key">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span class="tok-str">$1</span>')
      .replace(/[{}]/g, m => `<span class="tok-brace">${m}</span>`)
      .replace(/[\[\]]/g, m => `<span class="tok-arr">${m}</span>`);
  }

  let typed = false;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !typed) {
      typed = true;
      observer.disconnect();

      let i = 0;
      const interval = setInterval(() => {
        i++;
        codeEl.innerHTML = highlight(raw.slice(0, i));
        if (i >= raw.length) clearInterval(interval);
      }, 18);
    }
  }, { threshold: 0.4 });

  const wrap = document.querySelector('.about-code-wrap');
  if (wrap) observer.observe(wrap);
})();

/* ── 3D card tilt ───────────────────────────────────────────── */
(() => {
  const TILT = 10; /* max degrees */

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg) translateY(0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
