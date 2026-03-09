// ── HAMBURGER + MOBILE LAYOUT ─────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const navMark    = document.querySelector('.nav-mark');
const navLinks   = document.querySelector('.nav-links');
const nav        = document.querySelector('.nav');

// Read desktop --px once at startup, before any mobile class is applied.
// This is the largest padding value and never changes — use it always.
const DESKTOP_PX = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--px')) || 56;
const NAV_PAD    = DESKTOP_PX * 2; // left + right

let isCollapsed = null;

// Measure nav links via clone so we never touch real display state
function getLinksWidth() {
  const clone = navLinks.cloneNode(true);
  clone.style.cssText = [
    'position:absolute',
    'visibility:hidden',
    'display:flex',
    'top:-9999px',
    'left:-9999px',
    'pointer-events:none',
    'white-space:nowrap',
    // Force desktop font-size so measurement isn't affected by mobile state
    'font-size:24px',
    'letter-spacing:0.18em'
  ].join(';');
  document.body.appendChild(clone);
  const w = clone.getBoundingClientRect().width;
  document.body.removeChild(clone);
  return w;
}

function checkFit() {
  const markW  = navMark.getBoundingClientRect().width;
  const linksW = getLinksWidth();

  // Always use window.innerWidth minus the FIXED desktop padding —
  // never read from the nav element itself which changes with --px
  const available = window.innerWidth - NAV_PAD;
  const shouldCollapse = markW + linksW + 64 > available;

  if (shouldCollapse === isCollapsed) return;
  isCollapsed = shouldCollapse;

  nav.classList.toggle('collapsed', shouldCollapse);
  document.body.classList.toggle('mobile', shouldCollapse);
}

checkFit();
window.addEventListener('resize', checkFit, { passive: true });

// ── BURGER TOGGLE ─────────────────────────
burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── NAV FADE ON SCROLL ────────────────────
window.addEventListener('scroll', () => {
  nav.style.opacity = window.scrollY > 30 ? '0.3' : '1';
}, { passive: true });
nav.addEventListener('mouseenter', () => nav.style.opacity = '1');
nav.addEventListener('mouseleave', () => {
  if (window.scrollY > 30) nav.style.opacity = '0.3';
});