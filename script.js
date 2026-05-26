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

// Ícone 3D (Three.js) na seção Modalidades
const pesinhoContainer = document.getElementById('pesinho-3d');
const pesinhoFallback = document.getElementById('pesinho-fallback');

const showPesinhoFallback = () => {
  if (pesinhoFallback) pesinhoFallback.classList.add('is-visible');
};

if (pesinhoContainer && window.THREE && window.THREE.GLTFLoader) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.7, 3.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  pesinhoContainer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe7a1, 1.4);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.75);
  fillLight.position.set(-3, 1.5, -2);
  scene.add(fillLight);

  const loader = new THREE.GLTFLoader();
  const modelCandidates = ['pesinho.glb', 'pesinho.GLB', 'dumbell_10kg.glb'];
  let modelRoot = null;
  let modelLoaded = false;

  const resize3D = () => {
    const width = pesinhoContainer.clientWidth || 240;
    const height = pesinhoContainer.clientHeight || 460;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const createFallbackIcon = () => {
    const fallbackGroup = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4a017,
      metalness: 0.75,
      roughness: 0.3,
    });
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 24), material);
    bar.rotation.z = Math.PI / 2;
    fallbackGroup.add(bar);

    const plateGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32);
    const leftPlate = new THREE.Mesh(plateGeometry, material);
    const rightPlate = leftPlate.clone();
    leftPlate.position.x = -0.78;
    rightPlate.position.x = 0.78;
    fallbackGroup.add(leftPlate, rightPlate);

    fallbackGroup.position.y = -0.05;
    scene.add(fallbackGroup);
    modelRoot = fallbackGroup;
    modelLoaded = true;
  };

  const loadModelByIndex = (index) => {
    if (index >= modelCandidates.length) {
      createFallbackIcon();
      return;
    }
    loader.load(
      modelCandidates[index],
      (gltf) => {
        modelLoaded = true;
        modelRoot = gltf.scene;
        modelRoot.scale.setScalar(1.7);
        modelRoot.position.y = -0.05;
        scene.add(modelRoot);
      },
      undefined,
      (error) => {
        console.warn(`Não foi possível carregar ${modelCandidates[index]}.`, error);
        loadModelByIndex(index + 1);
      }
    );
  };

  loadModelByIndex(0);
  resize3D();
  window.addEventListener('resize', resize3D);

  const animatePesinho = () => {
    requestAnimationFrame(animatePesinho);
    renderer.render(scene, camera);
  };
  animatePesinho();
} else if (pesinhoContainer) {
  showPesinhoFallback();
}
