import { gsap } from 'gsap';

export function bootHero() {
  gsap.config({ force3D: true });

  // --- CANVAS CLOCK ---
  const clockCanvas = document.getElementById('clock-canvas') as HTMLCanvasElement | null;
  if (clockCanvas) {
    const updateClock = () => {
      const ctx = clockCanvas.getContext('2d');
      if (!ctx) return;

      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const sastTime = new Date(utc + (3600000 * 2));

      const hours = String(sastTime.getHours()).padStart(2, '0');
      const minutes = String(sastTime.getMinutes()).padStart(2, '0');
      const seconds = String(sastTime.getSeconds()).padStart(2, '0');
      const timeStr = `${hours}:${minutes}:${seconds} SAST`;

      const dpr = window.devicePixelRatio || 1;
      clockCanvas.width = 160 * dpr;
      clockCanvas.height = 24 * dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, 160, 24);
      ctx.font = '700 15px monospace, sans-serif';
      ctx.fillStyle = '#111111';
      ctx.textBaseline = 'middle';
      ctx.fillText(timeStr, 0, 12);
      ctx.restore();
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- CAROUSEL ---
  function startKenBurnsCarousel() {
    const fullscreenBg = document.getElementById('fullscreen-bg');
    const heroFrame = document.getElementById('hero-frame');
    if (!fullscreenBg || !heroFrame) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const slidesAttr = isMobile 
      ? fullscreenBg.getAttribute('data-slides-mobile') 
      : fullscreenBg.getAttribute('data-slides-desktop');

    if (!slidesAttr) return;

    const slideUrls: string[] = JSON.parse(slidesAttr);
    const fragment = document.createDocumentFragment();

    slideUrls.forEach((url, idx) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Facet Architecture Showcase Slide ${idx + 1}`;
      img.className = 'hero-img slide-img';
      img.decoding = 'async';
      img.loading = 'lazy';
      fragment.appendChild(img);
    });

    fullscreenBg.appendChild(fragment);

    const slides = fullscreenBg.querySelectorAll<HTMLImageElement>('.slide-img');
    if (slides.length === 0) return;

    slides.forEach((s, i) => {
      gsap.set(s, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
        opacity: i === 0 ? 1 : 0
      });
    });

    gsap.to(heroFrame, { 
      opacity: 0, 
      duration: 1.2, 
      ease: 'power2.inOut',
      onComplete: () => {
        heroFrame.style.display = 'none';
      }
    });

    let current = 0;
    const directions = [
      { xStart: -25, xEnd: 25, scaleStart: 1.05, scaleEnd: 1.18 },
      { xStart: 25, xEnd: -25, scaleStart: 1.18, scaleEnd: 1.05 },
      { xStart: -20, xEnd: 20, scaleStart: 1.08, scaleEnd: 1.20 },
      { xStart: 20, xEnd: -20, scaleStart: 1.15, scaleEnd: 1.05 }
    ];

    setInterval(() => {
      const next = (current + 1) % slides.length;
      const dir = directions[next % directions.length];

      gsap.set(slides[next], { opacity: 0, x: dir.xStart, scale: dir.scaleStart, zIndex: 2 });
      gsap.set(slides[current], { zIndex: 1 });

      gsap.to(slides[next], { opacity: 1, duration: 1.8, ease: 'power2.inOut', force3D: true });
      gsap.to(slides[next], { x: dir.xEnd, scale: dir.scaleEnd, duration: 7.5, ease: 'none', force3D: true });
      gsap.to(slides[current], { opacity: 0, duration: 1.8, ease: 'power2.inOut', force3D: true });

      current = next;
    }, 5800);
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    setTimeout(startKenBurnsCarousel, 3000);
  } else {
    const logoCenter = document.getElementById('logo-center');
    const heroTextContainer = document.getElementById('hero-text-container');
    const clock = document.getElementById('hero-clock');
    const heroFrame = document.getElementById('hero-frame');

    if (!logoCenter || !heroTextContainer || !clock || !heroFrame) return;

    gsap.set(heroTextContainer, { top: '50%', left: '50%', xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(logoCenter, { top: '50%', left: '50%', xPercent: -50, yPercent: -50, scale: 1, opacity: 1 });
    gsap.set(heroFrame, { opacity: 0, scale: 0.1, transformOrigin: 'center center' });
    gsap.set(clock, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ 
      defaults: { ease: 'power3.inOut' },
      onComplete: startKenBurnsCarousel 
    });

    tl
      .to(heroTextContainer, { opacity: 1, duration: 0.6, delay: 0.2 })
      .to(heroTextContainer, { top: '130px', left: '30px', xPercent: 0, yPercent: 0, duration: 1.0 })
      .to(logoCenter, { top: '130px', left: '120vw', xPercent: 0, scale: 0.55, opacity: 0, duration: 1.0 }, '<')
      .to(clock, { opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
      .to(heroFrame, { opacity: 1, scale: 1, duration: 1.0, ease: 'power4.out' }, '-=0.5');
  }
}