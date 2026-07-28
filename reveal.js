/* Scroll reveal — auto-applies to section/header/footer content on every page */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const css = document.createElement('style');
  css.textContent = `
[data-rv="0"]{opacity:0 !important;transform:translate3d(0,44px,0) !important;transition:none !important}
[data-rv="1"]{opacity:1 !important;transform:translate3d(0,0,0) !important;transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1) !important;transition-delay:var(--rvd,0s) !important}
@media print{[data-rv]{opacity:1 !important;transform:none !important;transition:none !important}}`;
  document.head.appendChild(css);
  const seen = new WeakSet();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const el = e.target;
      const delay = parseFloat(el.style.getPropertyValue('--rvd')) || 0;
      requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute('data-rv', '1')));
      setTimeout(() => { el.removeAttribute('data-rv'); el.style.removeProperty('--rvd'); }, 1000 + delay * 1000);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  const skip = (el) => {
    if (el.getAttribute('aria-hidden') === 'true') return true;
    if (el.style.transform || el.style.animation) return true; // decorative / self-animated
    if (!el.textContent.trim() && !el.querySelector('img,svg,[style]')) return true; // spacers
    return false;
  };
  const tag = (el, i) => {
    seen.add(el);
    if (i) el.style.setProperty('--rvd', (Math.min(i, 8) * 0.1) + 's');
    el.setAttribute('data-rv', '0');
    io.observe(el);
  };
  const scan = () => {
    document.querySelectorAll('section, header[data-screen-label], footer').forEach((root) => {
      for (const child of root.children) {
        if (child.tagName === 'SECTION' || skip(child)) continue;
        const kids = Array.from(child.children);
        const disp = getComputedStyle(child).display;
        const uniformRows = disp === 'block' && kids.length >= 3 && kids.length <= 24 && kids.every((k) => k.tagName === kids[0].tagName);
        if ((disp === 'grid' && kids.length > 1 && kids.length <= 24) || uniformRows) {
          seen.add(child); // stagger grid items individually
          kids.forEach((k, i) => { if (!seen.has(k) && !skip(k)) tag(k, i); });
        } else if (!seen.has(child)) {
          tag(child, 0);
        }
      }
    });
  };
  const mo = new MutationObserver(() => { clearTimeout(mo._t); mo._t = setTimeout(scan, 150); });
  const start = () => { scan(); mo.observe(document.body, { childList: true, subtree: true }); };
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', start) : start();
})();
