/**
 * AND THAT IS OKAY - CINEMATIC POETRY EXPERIENCE
 * Background Slideshow, Audio Controller, and Atmospheric Particles
 */

(function () {
  'use strict';

  /* ============================================================
     1. IMAGE CONFIGURATION
     Place your 12 or 13 JPG images directly in this project folder.
     You can either list their exact names below or name them 1.jpg, 2.jpg...
     Any file that doesn't exist yet is automatically skipped!
     ============================================================ */
  const IMAGE_CANDIDATES = [
    // Current files in your folder:
    '2025-Oct-12.jpg',
    '2025-Oct-13.jpg',

    // You can add your remaining photos here:
    '2025-Oct-14.jpg',
    '2025-Oct-15.jpg',
    '2025-Oct-16.jpg',
    '2025-Oct-17.jpg',
    '2025-Oct-18.jpg',
    '2025-Oct-19.jpg',
    '2025-Oct-20.jpg',
    '2025-Oct-21.jpg',
    '2025-Oct-22.jpg',
    '2025-Oct-23.jpg',
    '2025-Oct-24.jpg',

    // Also supports simple numbered names:
    '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
    '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
    '11.jpg', '12.jpg', '13.jpg'
  ];

  let verifiedImages = [];
  let currentImageIndex = 0;
  let activeSlide = 'a'; // Alternates between 'a' and 'b' for seamless cross-fading

  const slideA = document.getElementById('slide-a');
  const slideB = document.getElementById('slide-b');
  const indicatorCounter = document.getElementById('indicator-counter');
  const memoryIndicator = document.getElementById('memory-indicator');

  /**
   * Preload and verify which images actually exist on the server
   */
  async function initImageSlideshow() {
    const checks = IMAGE_CANDIDATES.map(src => {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ src, ok: true });
        img.onerror = () => resolve({ src, ok: false });
        img.src = src;
      });
    });

    const results = await Promise.all(checks);
    verifiedImages = results.filter(r => r.ok).map(r => r.src);

    // If no images found (fallback safeguard)
    if (verifiedImages.length === 0) {
      verifiedImages = ['2025-Oct-12.jpg', '2025-Oct-13.jpg'];
    }

    updateIndicator();

    // Start with the first image
    if (slideA) {
      slideA.style.backgroundImage = `url('${verifiedImages[0]}')`;
      slideA.style.zIndex = '1';
      slideA.classList.add('slide-active');
    }
    if (slideB) {
      slideB.style.zIndex = '0';
    }

    // Begin cycling if we have more than 1 image (cross-fade every 7.5 seconds)
    if (verifiedImages.length > 1) {
      setInterval(nextSlide, 7500);
    }

    // Allow user to click the photo counter in the corner to manually trigger next picture
    if (memoryIndicator) {
      memoryIndicator.style.pointerEvents = 'auto';
      memoryIndicator.style.cursor = 'pointer';
      memoryIndicator.title = 'Click to switch photo';
      memoryIndicator.addEventListener('click', nextSlide);
    }
  }

  function updateIndicator() {
    if (!indicatorCounter) return;
    const cur = String(currentImageIndex + 1).padStart(2, '0');
    const tot = String(verifiedImages.length).padStart(2, '0');
    indicatorCounter.textContent = `${cur} / ${tot}`;
  }

  function nextSlide() {
    if (verifiedImages.length <= 1) return;

    currentImageIndex = (currentImageIndex + 1) % verifiedImages.length;
    const nextImgSrc = verifiedImages[currentImageIndex];

    const currentSlideEl = activeSlide === 'a' ? slideA : slideB;
    const nextSlideEl = activeSlide === 'a' ? slideB : slideA;

    // Bring incoming slide to top layer
    nextSlideEl.style.zIndex = '2';
    currentSlideEl.style.zIndex = '1';

    // Set background of the incoming slide and smoothly fade it in
    nextSlideEl.style.backgroundImage = `url('${nextImgSrc}')`;
    nextSlideEl.classList.add('slide-active');

    // After fade transition (2.8s), reset previous slide
    setTimeout(() => {
      currentSlideEl.classList.remove('slide-active');
      currentSlideEl.style.zIndex = '0';
    }, 2800);

    activeSlide = activeSlide === 'a' ? 'b' : 'a';
    updateIndicator();
  }

  /* ============================================================
     2. AUDIO CONTROLLER & ENTRY GATE
     ============================================================ */
  const entryGate = document.getElementById('entry-gate');
  const enterBtn = document.getElementById('enter-btn');
  const bgAudio = document.getElementById('bg-audio');
  const audioControl = document.getElementById('audio-control');
  const toggleAudioBtn = document.getElementById('toggle-audio');
  const soundBars = document.getElementById('sound-bars');

  let isPlaying = false;
  let fadeInterval = null;

  function fadeAudioIn(targetVolume = 0.75, duration = 3000) {
    if (!bgAudio) return;
    bgAudio.volume = 0;
    bgAudio.play().then(() => {
      isPlaying = true;
      updateAudioUi();
      const step = 0.02;
      const interval = duration / (targetVolume / step);
      clearInterval(fadeInterval);
      fadeInterval = setInterval(() => {
        if (bgAudio.volume + step >= targetVolume) {
          bgAudio.volume = targetVolume;
          clearInterval(fadeInterval);
        } else {
          bgAudio.volume = Math.min(1, bgAudio.volume + step);
        }
      }, interval);
    }).catch(err => {
      console.warn("Audio play prevented or blocked:", err);
    });
  }

  function toggleAudio() {
    if (!bgAudio) return;
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
    } else {
      bgAudio.play();
      isPlaying = true;
    }
    updateAudioUi();
  }

  function updateAudioUi() {
    if (isPlaying) {
      soundBars.classList.add('playing');
    } else {
      soundBars.classList.remove('playing');
    }
  }

  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (entryGate) {
        entryGate.classList.add('dismissed');
      }
      if (audioControl) {
        audioControl.classList.remove('hidden');
      }
      fadeAudioIn();
    });
  }

  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', toggleAudio);
  }

  /* ============================================================
     3. SCROLL REVEAL (INTERSECTION OBSERVER)
     ============================================================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ============================================================
     4. ATMOSPHERIC PARTICLES (DELICATE DUST MOTES)
     ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numParticles = 40;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: -Math.random() * 0.35 - 0.1,
        osc: Math.random() * Math.PI * 2
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < numParticles; i++) {
        const p = particles[i];
        p.osc += 0.02;
        p.x += p.speedX + Math.sin(p.osc) * 0.15;
        p.y += p.speedY;

        // Wrap around
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 192, 141, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  /* ============================================================
     INITIALIZATION
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initImageSlideshow();
    initScrollReveal();
    initParticles();
  });

})();
