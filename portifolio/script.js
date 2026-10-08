'use strict';

document.documentElement.classList.add('js-enabled');
const menuButton = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');
const links = [...navigation.querySelectorAll('a')];
const mobile = window.matchMedia('(max-width: 700px)');

function setMenu(open, restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('is-open', open);
  if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
links.forEach(link => link.addEventListener('click', () => {
  setMenu(false);
  if (mobile.matches) {
    const target = document.querySelector(link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) setMenu(false);
});
mobile.addEventListener('change', () => setMenu(false));

const sections = [...document.querySelectorAll('main section[id]')];
let scrollQueued = false;
function updateActiveLink() {
  const threshold = window.innerHeight * 0.4;
  let active = sections[0];
  sections.forEach(section => { if (section.getBoundingClientRect().top <= threshold) active = section; });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections.at(-1);
  links.forEach(link => {
    if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateActiveLink); }
}, { passive: true });
window.addEventListener('resize', updateActiveLink);
updateActiveLink();

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-ready');
}

// Ornamentação vetorial leve; nenhum conteúdo depende dela.
const waves = document.querySelector('.contact-waves');
for (let i = 0; i < 14; i++) {
  const line = document.createElement('i');
  line.style.setProperty('--i', i);
  waves.append(line);
}
