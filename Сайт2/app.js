const grid = document.querySelector('.comparison-grid');
const controls = document.querySelector('.comparison-controls');
const figures = [...grid.querySelectorAll('figure')];
controls.hidden = false;
controls.addEventListener('click', event => {
  const button = event.target.closest('button[data-view]');
  if (!button) return;
  controls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const view = button.dataset.view;
  grid.classList.toggle('single', view !== 'both');
  figures.forEach((figure, index) => { figure.hidden = view !== 'both' && (view === 'before' ? index !== 0 : index !== 1); });
});
const dialog = document.querySelector('.lightbox');
const fullImage = document.querySelector('#enlarged-photo');
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('.photo-full').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    fullImage.src = link.href;
    fullImage.alt = link.querySelector('img').alt;
    document.querySelector('#photo-title').textContent = link.closest('figure').querySelector('figcaption').textContent;
    dialog.showModal();
  }));
  document.querySelector('#close-photo').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
}
if ('IntersectionObserver' in window) {
  const navigation = [...document.querySelectorAll('.header nav a')];
  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { navigation.forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }); } });
  }, { rootMargin: '-18% 0px -55% 0px' });
  navigation.forEach(link => { const section = document.querySelector(link.hash); if (section) activeObserver.observe(section); });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.animate([{ opacity: .5, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' }); revealObserver.unobserve(entry.target); } });
    }, { threshold: .1 });
    document.querySelectorAll('.service, .section-heading, .steps article').forEach(element => revealObserver.observe(element));
  }
}
