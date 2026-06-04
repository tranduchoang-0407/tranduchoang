// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// Active nav highlight (sidebar)
const links = document.querySelectorAll('.sidebar-menu a');
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// Liquid glass ripple on card click
document.querySelectorAll('.card, .contact-item, .btn').forEach(el => {
  el.addEventListener('click', function(e) {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'liquid-ripple';
    ripple.style.left = (e.clientX - rect.left - 40) + 'px';
    ripple.style.top  = (e.clientY - rect.top  - 40) + 'px';
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// === Cursor magnetic glow on cards ===
const glowTargets = document.querySelectorAll(
  '.card, #contact .contact-item, .hero-inner'
);

glowTargets.forEach(el => {
  // Inject glow-spot div
  const spot = document.createElement('div');
  spot.className = 'glow-spot';
  el.appendChild(spot);

  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
    el.style.setProperty('--mx', x);
    el.style.setProperty('--my', y);
  });
});
