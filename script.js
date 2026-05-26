// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav: transparente enquanto a hero está em tela cheia
const nav = document.querySelector('nav');
const hero = document.querySelector('.hero');

const updateNavState = () => {
  if (!nav || !hero) return;
  const triggerPoint = 24;
  nav.classList.toggle('nav-solid', window.scrollY > triggerPoint);
};

window.addEventListener('scroll', updateNavState, { passive: true });
window.addEventListener('resize', updateNavState);
updateNavState();
