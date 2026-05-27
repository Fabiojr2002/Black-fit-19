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

// Carrossel automático na seção de horários (fundo direito)
const scheduleBgImages = document.querySelectorAll('.schedule-bg-image');
if (scheduleBgImages.length > 1) {
  let scheduleBgIndex = 0;
  setInterval(() => {
    scheduleBgImages[scheduleBgIndex].classList.remove('is-active');
    scheduleBgIndex = (scheduleBgIndex + 1) % scheduleBgImages.length;
    scheduleBgImages[scheduleBgIndex].classList.add('is-active');
  }, 3500);
}


const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');

// Pega todas as imagens da galeria que têm src preenchido
const galImages = [...document.querySelectorAll('.gal-image')];
let current = 0;

function openLightbox(index) {
  const src = galImages[index].src;
  // Só abre se a imagem existir (src não vazio/placeholder)
  if (!src || galImages[index].naturalWidth === 0) return;
  current = index;
  lbImg.src = src;
  lbImg.alt = galImages[index].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigate(dir) {
  let next = current + dir;
  if (next < 0) next = galImages.length - 1;
  if (next >= galImages.length) next = 0;
  openLightbox(next);
}

// Clique nos itens da galeria
document.querySelectorAll('.gal-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

// Controles
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));

// Fecha clicando fora da imagem
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Fecha com ESC, navega com setas do teclado
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  navigate(1);
  if (e.key === 'ArrowLeft')   navigate(-1);
});

// Consentimento de cookies personalizado
const COOKIE_KEY = 'blackfit_cookie_preferences';
const cookieBanner = document.getElementById('cookie-consent');
const cookieAnalytics = document.getElementById('cookie-analytics');
const cookieMarketing = document.getElementById('cookie-marketing');
const cookieAccept = document.getElementById('cookie-accept');
const cookieReject = document.getElementById('cookie-reject');

function saveCookiePreferences(preferences) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({
    ...preferences,
    essential: true,
    consentedAt: new Date().toISOString()
  }));
  document.documentElement.dataset.cookieConsent = 'accepted';
}

function hideCookieBanner() {
  if (cookieBanner) cookieBanner.classList.remove('is-visible');
}

if (cookieBanner) {
  const savedPreferences = localStorage.getItem(COOKIE_KEY);

  if (!savedPreferences) {
    cookieBanner.classList.add('is-visible');
  } else {
    document.documentElement.dataset.cookieConsent = 'accepted';
    try {
      const parsed = JSON.parse(savedPreferences);
      if (cookieAnalytics) cookieAnalytics.checked = !!parsed.analytics;
      if (cookieMarketing) cookieMarketing.checked = !!parsed.marketing;
    } catch (_) {}
  }

  cookieAccept?.addEventListener('click', () => {
    saveCookiePreferences({
      analytics: !!cookieAnalytics?.checked,
      marketing: !!cookieMarketing?.checked
    });
    hideCookieBanner();
  });

  cookieReject?.addEventListener('click', () => {
    saveCookiePreferences({ analytics: false, marketing: false });
    if (cookieAnalytics) cookieAnalytics.checked = false;
    if (cookieMarketing) cookieMarketing.checked = false;
    hideCookieBanner();
  });
}
