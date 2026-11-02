// Year update
const yearNode = document.getElementById('year');
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll animations for sections
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target.classList.contains('about')) {
      entry.target.classList.toggle('about-visible', entry.isIntersecting);
    }

    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.projects, .about, .skills, .certificates, .contact, .project-card, .stat-item, .certificate-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Reparent the single profile image between Hero and About with a position-preserving animation.
const profileImage = document.querySelector('.hero-image');
const heroVisual = document.querySelector('.hero-visual');
const aboutVisual = document.querySelector('.about-visual');

const moveProfileImage = (destination, imageClass) => {
  if (!profileImage || !destination || profileImage.parentElement === destination) return;

  const first = profileImage.getBoundingClientRect();
  profileImage.classList.remove('hero-image', 'about-image');
  profileImage.classList.add(imageClass);
  destination.appendChild(profileImage);
  const last = profileImage.getBoundingClientRect();
  const scaleX = first.width / last.width;
  const scaleY = first.height / last.height;
  const offsetX = first.left - last.left;
  const offsetY = first.top - last.top;

  profileImage.style.transition = 'none';
  profileImage.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scaleX}, ${scaleY})`;

  requestAnimationFrame(() => {
    profileImage.style.transition = 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
    profileImage.style.transform = '';
  });
};

const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver(([entry]) => {
  if (!entry || !profileImage) return;

  entry.target.classList.toggle('about-visible', entry.isIntersecting);
  if (entry.isIntersecting) {
    moveProfileImage(aboutVisual, 'about-image');
  } else {
    moveProfileImage(heroVisual, 'hero-image');
  }
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

if (aboutSection) aboutObserver.observe(aboutSection);

// Skill bar animation
const skillBars = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.style.width;
      entry.target.style.width = '0';
      setTimeout(() => {
        entry.target.style.width = width;
      }, 200);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// Gallery navigation for project cards
const galleryGroups = document.querySelectorAll('.project-card .gallery');

galleryGroups.forEach((gallery) => {
  const images = gallery.querySelectorAll('.gallery-image');
  const prevBtn = gallery.querySelector('.prev');
  const nextBtn = gallery.querySelector('.next');

  if (!images.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  let autoSlideTimer;

  const showImage = (index) => {
    const nextIndex = (index + images.length) % images.length;
    currentIndex = nextIndex;

    images.forEach((img, i) => {
      const offset = i - currentIndex;
      img.classList.toggle('active', i === currentIndex);
      img.style.transform = `translateX(${offset * 100}%)`;
      img.style.opacity = i === currentIndex ? '1' : '0';
    });
  };

  const startAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    }, 2500);
  };

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
    startAutoSlide();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
    startAutoSlide();
  });

  gallery.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  gallery.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();
});

// Parallax effect for floating shapes
const shapes = document.querySelectorAll('.floating-shape');

document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 20;
    const xOffset = (x - 0.5) * speed;
    const yOffset = (y - 0.5) * speed;
    shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  });
});

// Hide cursor on mobile
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
}
