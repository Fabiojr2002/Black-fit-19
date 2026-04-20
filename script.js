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

// Hero logo animation (letter by letter) on scroll using GSAP + ScrollTrigger
const initHeroLogoScrollAnimation = () => {
  if (!window.gsap || !window.ScrollTrigger || !hero) return;

  const heroTitle = document.querySelector('.hero-h1');
  if (!heroTitle) return;

  gsap.registerPlugin(ScrollTrigger);

  if (!heroTitle.dataset.splitReady) {
    heroTitle.querySelectorAll('.split-text').forEach((word) => {
      const chars = [...word.textContent];
      word.textContent = '';
      chars.forEach((char) => {
        const letter = document.createElement('span');
        letter.className = `hero-char${char === ' ' ? ' space' : ''}`;
        letter.textContent = char === ' ' ? '\u00A0' : char;
        word.appendChild(letter);
      });
    });
    heroTitle.dataset.splitReady = 'true';
  }

  const chars = heroTitle.querySelectorAll('.hero-char');
  const heroNumber = heroTitle.querySelector('.hero-number');
  if (!chars.length && !heroNumber) return;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  if (chars.length) {
    timeline.to(chars, {
      opacity: 0,
      y: -26,
      filter: 'blur(6px)',
      stagger: { each: 0.06, from: 'start' },
      ease: 'none'
    }, 0);
  }

  if (heroNumber) {
    timeline.to(heroNumber, {
      opacity: 0,
      y: -26,
      filter: 'blur(6px)',
      ease: 'none'
    }, 0.22);
  }
};

initHeroLogoScrollAnimation();
