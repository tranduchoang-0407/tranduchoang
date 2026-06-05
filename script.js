/* ============================================================
   script.js — Performance-optimized, all effects preserved
   ============================================================ */

// --- Detect low-end device ---
const isLowEnd = (
  navigator.hardwareConcurrency <= 4 ||
  navigator.deviceMemory <= 2 ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
  /Android [1-6]\.|iPhone OS [1-9]_/.test(navigator.userAgent)
);

const isMobile = window.innerWidth <= 768;

/* ── 1. Scroll reveal ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target); // stop observing once visible
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── 2. Active nav ────────────────────────────────────────── */
const links = document.querySelectorAll('.sidebar-menu a');
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

/* ── 3. Liquid glass ripple on click ─────────────────────── */
document.querySelectorAll('.card, .contact-item, .btn').forEach(el => {
  el.addEventListener('click', function(e) {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'liquid-ripple';
    ripple.style.cssText = `left:${e.clientX - rect.left - 40}px;top:${e.clientY - rect.top - 40}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }, { passive: true });
});

/* ── 4. Cursor magnetic glow — throttled with rAF ────────── */
if (!isLowEnd && !isMobile) {
  const glowTargets = document.querySelectorAll('.card, #contact .contact-item, .hero-inner');

  glowTargets.forEach(el => {
    const spot = document.createElement('div');
    spot.className = 'glow-spot';
    el.appendChild(spot);

    let rafId = null;
    let lastX = 0, lastY = 0;

    el.addEventListener('mousemove', e => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((lastX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((lastY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        el.style.setProperty('--mx', x);
        el.style.setProperty('--my', y);
        rafId = null;
      });
    }, { passive: true });
  });
}

/* ── 5. CD disc interaction (if present) — throttled ─────── */
const cdDisc   = document.querySelector('.cd-disc');
const cdSpecular = document.querySelector('.cd-specular');
const cdScatter  = document.querySelector('.cd-scatter');

if (cdDisc && !isLowEnd) {
  let cdRaf = null;
  let lastCX = 0, lastCY = 0;

  cdDisc.addEventListener('mouseenter', () => {
    if (cdScatter) cdScatter.style.opacity = '1';
  }, { passive: true });

  cdDisc.addEventListener('mousemove', e => {
    lastCX = e.clientX;
    lastCY = e.clientY;
    if (cdRaf) return;
    cdRaf = requestAnimationFrame(() => {
      const rect = cdDisc.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = lastCX - cx;
      const dy = lastCY - cy;

      const px = ((lastCX - rect.left) / rect.width  * 100).toFixed(1);
      const py = ((lastCY - rect.top)  / rect.height * 100).toFixed(1);

      if (cdSpecular) {
        cdSpecular.style.background = `radial-gradient(ellipse 38% 38% at ${px}% ${py}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 30%, transparent 65%)`;
        cdSpecular.style.opacity = '1';
      }

      if (cdScatter) {
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = rect.width / 2;
        cdScatter.style.opacity = (0.4 + Math.min(dist / maxDist, 1) * 0.6).toFixed(2);
        cdScatter.style.setProperty('--sx', px + '%');
        cdScatter.style.setProperty('--sy', py + '%');
      }

      cdRaf = null;
    });
  }, { passive: true });

  cdDisc.addEventListener('mouseleave', () => {
    if (cdSpecular) cdSpecular.style.opacity = '0';
    if (cdScatter)  cdScatter.style.opacity  = '0';
    if (cdRaf) { cancelAnimationFrame(cdRaf); cdRaf = null; }
  }, { passive: true });
}

/* ── 6. Lazy-load images (native + fallback) ─────────────── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.loading = 'lazy';
    img.decoding = 'async';
  });
} else {
  // Fallback IntersectionObserver lazy load
  const imgObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) img.src = img.dataset.src;
        imgObs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
}

/* ── 7. Pause heavy animations when tab not visible ─────── */
document.addEventListener('visibilitychange', () => {
  const heavy = document.querySelectorAll(
    '.orb, .bubble, .flare, .starburst, .aurora-band, .shooting-star, .ticker, .stars-sm, .stars-md, .stars-lg'
  );
  heavy.forEach(el => {
    el.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
}, { passive: true });

/* ── 8. Sidebar: use pointer events correctly ───────────── */
const sidebar = document.querySelector('.sidebar');
if (sidebar && isMobile) {
  // On mobile sidebar is bottom bar — no hover needed
  sidebar.addEventListener('touchstart', () => {}, { passive: true });
}
