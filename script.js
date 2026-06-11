/* ============================================================
   script.js — tối ưu hiệu năng, giữ toàn bộ hiệu ứng
   ============================================================ */

const isMobile = window.innerWidth <= 768;

/* ── 1. Scroll reveal ───────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ── 2. Active nav ──────────────────────────────────────────── */
document.querySelectorAll('.sidebar-menu a').forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
});

/* ── 3. Liquid glass ripple ─────────────────────────────────── */
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

/* ── 4. Cursor magnetic glow — rAF throttled ───────────────── */
const glowTargets = document.querySelectorAll('.card, #contact .contact-item, .hero-inner');
glowTargets.forEach(el => {
  const spot = document.createElement('div');
  spot.className = 'glow-spot';
  el.appendChild(spot);

  let raf = null, lx = 0, ly = 0;
  el.addEventListener('mousemove', e => {
    lx = e.clientX; ly = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((lx - r.left) / r.width  * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((ly - r.top)  / r.height * 100).toFixed(1) + '%');
      raf = null;
    });
  }, { passive: true });
});

/* ── 5. CD disc interaction — rAF throttled ────────────────── */
const cdDisc    = document.querySelector('.cd-disc');
const cdSpecular = document.querySelector('.cd-specular');
const cdScatter  = document.querySelector('.cd-scatter');

if (cdDisc) {
  let cdRaf = null, lx = 0, ly = 0;

  cdDisc.addEventListener('mouseenter', () => {
    if (cdScatter) cdScatter.style.opacity = '1';
  }, { passive: true });

  cdDisc.addEventListener('mousemove', e => {
    lx = e.clientX; ly = e.clientY;
    if (cdRaf) return;
    cdRaf = requestAnimationFrame(() => {
      const r  = cdDisc.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const px = ((lx - r.left) / r.width  * 100).toFixed(1);
      const py = ((ly - r.top)  / r.height * 100).toFixed(1);

      if (cdSpecular) {
        cdSpecular.style.background = `radial-gradient(ellipse 38% 38% at ${px}% ${py}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 30%, transparent 65%)`;
        cdSpecular.style.opacity = '1';
      }
      if (cdScatter) {
        const d = Math.hypot(lx - cx, ly - cy);
        cdScatter.style.opacity = (0.4 + Math.min(d / (r.width / 2), 1) * 0.6).toFixed(2);
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

/* ── 6. Pause animations when tab hidden ───────────────────── */
document.addEventListener('visibilitychange', () => {
  const state = document.hidden ? 'paused' : 'running';
  document.querySelectorAll(
    '.orb,.bubble,.flare,.starburst,.aurora-band,.shooting-star,.ticker,.stars-sm,.stars-md,.stars-lg'
  ).forEach(el => el.style.animationPlayState = state);
}, { passive: true });

/* ── 7. Lazy load images ────────────────────────────────────── */
document.querySelectorAll('img:not([loading])').forEach(img => {
  img.loading = 'lazy';
  img.decoding = 'async';
});

/* ── 8. iOS smooth touch ────────────────────────────────────── */
if (isMobile) {
  document.querySelector('.sidebar')?.addEventListener('touchstart', () => {}, { passive: true });
}
