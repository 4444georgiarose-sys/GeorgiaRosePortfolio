// --------------------------
// SELECTORS
// --------------------------
const heroHeading = document.querySelector('.hero h1');
const heroParagraph = document.querySelector('.hero p');
const portfolioImages = document.querySelectorAll('.project img');
const projects = document.querySelectorAll('.project');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.lightbox .close');
const prevBtn = document.querySelector('.lightbox .prev');
const nextBtn = document.querySelector('.lightbox .next');
const navOverlay = document.getElementById('navOverlay');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-overlay a');
let currentIndex = 0;

// --------------------------
// NAVIGATION
// --------------------------
hamburger.addEventListener('click', () => {
  navOverlay.style.display = navOverlay.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll with header offset
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetID = link.getAttribute('href').substr(1);
    const targetSection = document.getElementById(targetID);
    const headerOffset = 80; // adjust based on header height
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // close nav overlay after click
    navOverlay.style.display = 'none';
  });
});

// --------------------------
// HERO ANIMATION ON LOAD
// --------------------------
window.addEventListener('load', () => {
  heroHeading.classList.add('animate');
  heroParagraph.classList.add('animate');

  // Portfolio fade-in stagger
  projects.forEach((project, index) => {
    setTimeout(() => {
      project.classList.add('visible');
    }, index * 150);
  });

  // Reveal About & Contact sections if in viewport
  revealSections();
});

// --------------------------
// SCROLL-TRIGGERED ANIMATIONS
// --------------------------
function revealSections() {
  const windowHeight = window.innerHeight;
  const sections = document.querySelectorAll('.about, .contact');

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if(rect.top < windowHeight - 100){
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', () => {
  revealSections();
  portfolioParallax();
  heroParallax();
});

// --------------------------
// PORTFOLIO PARALLAX (SUBTLE)
// --------------------------
function portfolioParallax() {
  const scrollTop = window.pageYOffset;
  portfolioImages.forEach((img, index) => {
    const speed = 0.05 + index * 0.01;
    img.style.transform = `translateY(${scrollTop * speed}px)`;
  });
}

// HERO TEXT PARALLAX
function heroParallax() {
  const scrollTop = window.pageYOffset;
  heroHeading.style.transform = `translateY(${scrollTop * 0.05}px)`;
  heroParagraph.style.transform = `translateY(${scrollTop * 0.08}px)`;
}

// --------------------------
// LIGHTBOX FUNCTIONALITY
// --------------------------
portfolioImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    lightbox.classList.add('show');
    lightboxImg.src = img.src;
    currentIndex = index;
  });
});

// Close lightbox
closeBtn.addEventListener('click', () => lightbox.classList.remove('show'));
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('show'); });

// Navigate previous
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + portfolioImages.length) % portfolioImages.length;
  lightboxImg.src = portfolioImages[currentIndex].src;
});

// Navigate next
nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % portfolioImages.length;
  lightboxImg.src = portfolioImages[currentIndex].src;
});

// --------------------------
// MOBILE TAP OVERLAY SUPPORT
// --------------------------
if(window.innerWidth <= 768){
  portfolioImages.forEach((img) => {
    const overlay = img.nextElementSibling; // .overlay-text
    img.addEventListener('click', (e) => {
      if(!overlay.classList.contains('visible')){
        e.preventDefault(); // prevent lightbox on first tap
        overlay.classList.add('visible');
      }
      // second tap opens lightbox normally
    });
  });
}

// --------------------------
// CONTACT FORM (MAILTO)
// --------------------------
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e){
  e.preventDefault();
  const name = this.name.value;
  const email = this.email.value;
  const message = this.message.value;

  window.location.href = `mailto:youremail@example.com?subject=Contact from ${name}&body=${encodeURIComponent(message)}%0A%0AFrom: ${email}`;
});