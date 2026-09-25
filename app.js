/* ===== Mobile menu ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = mobileMenu.querySelectorAll('a');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ===== GSAP scroll reveals ===== */
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const reveals = document.querySelectorAll(
    '.tjeneste-card, .trust__item, .kontakt__detail, .partner-card, .galleri__item, ' +
    '.section-header, .om-oss__content, .om-oss__visual, .cta-section__inner, ' +
    '.hero__inner, .kontakt__info, .kontakt__map'
  );

  reveals.forEach(el => {
    el.classList.add('reveal');
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });
}

/* ===== Header background on scroll ===== */
const header = document.getElementById('header');
let ticking = false;

const updateHeader = () => {
  header.classList.toggle('header--scrolled', window.scrollY > 40);
};

updateHeader();
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateHeader();
      ticking = false;
    });
    ticking = true;
  }
});

/* ===== Gallery "see more" ===== */
const galleriMore = document.getElementById('galleriMore');

if (galleriMore) {
  galleriMore.addEventListener('click', () => {
    document.querySelectorAll('.galleri__item--hidden').forEach(item => {
      item.classList.remove('galleri__item--hidden', 'reveal');
      gsap.set(item, { opacity: 1, y: 0 });
    });
    galleriMore.remove();
  });
}

/* ===== Gallery lightbox ===== */
const galleryTriggers = Array.from(document.querySelectorAll('.galleri__trigger'));

if (galleryTriggers.length) {
  const items = galleryTriggers.map(trigger => {
    const isVideo = trigger.dataset.type === 'video';
    const media = trigger.querySelector(isVideo ? 'video' : 'img');
    return {
      type: isVideo ? 'video' : 'image',
      src: media.src,
      alt: isVideo ? '' : media.alt
    };
  });

  const lightbox = document.getElementById('lightbox');
  const stage = document.getElementById('lightboxStage');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const renderItem = (index) => {
    const item = items[index];
    stage.innerHTML = '';
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.playsInline = true;
      stage.appendChild(video);
      video.play().catch(() => {});
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      stage.appendChild(img);
    }
  };

  const openLightbox = (index) => {
    currentIndex = index;
    renderItem(currentIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    stage.innerHTML = '';
  };

  const showRelative = (delta) => {
    currentIndex = (currentIndex + delta + items.length) % items.length;
    renderItem(currentIndex);
  };

  galleryTriggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showRelative(-1));
  nextBtn.addEventListener('click', () => showRelative(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (items[currentIndex].type === 'video') return;
    if (e.key === 'ArrowLeft') showRelative(-1);
    if (e.key === 'ArrowRight') showRelative(1);
  });
}
