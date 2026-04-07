// ----------------------------------------
// FOOTER YEAR
// ----------------------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ----------------------------------------
// HAMBURGER
// ----------------------------------------
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', function() {
    var isOpen = navMobile.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    navMobile.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// ----------------------------------------
// GRID FADE-IN
// ----------------------------------------
var gridItems = document.querySelectorAll('.item');
if (gridItems.length) {
  var fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  gridItems.forEach(function(item) {
    fadeObserver.observe(item);
  });
}

// ----------------------------------------
// LIGHTBOX
// ----------------------------------------
var lightbox   = document.getElementById('lightbox');
var lbImg      = document.getElementById('lbImg');
var lbClose    = document.getElementById('lbClose');
var lbPrev     = document.getElementById('lbPrev');
var lbNext     = document.getElementById('lbNext');
var allImages  = Array.from(document.querySelectorAll('.item img'));
var currentIdx = 0;

function openLightbox(index) {
  currentIdx = index;
  var src = allImages[index].src;
  var isHomepage = src.includes('images/grid/');
  if (isHomepage) {
    var parts = src.split('photo');
    var num = parts[1].replace('.jpg', '');
    lbImg.src = 'images/lightbox/photo' + num + '.jpg';
  } else {
    lbImg.src = src;
  }
  lbImg.alt = allImages[index].alt;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lbImg.src = '';
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIdx = (currentIdx + dir + allImages.length) % allImages.length;
  lbImg.src  = 'images/lightbox/photo' + (currentIdx + 1) + '.jpg';
  lbImg.alt  = allImages[currentIdx].alt;
}

if (lightbox && lbImg) {
  allImages.forEach(function(img, i) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      var projectPage = img.closest('.item').getAttribute('data-project');
      if (projectPage) {
        window.location.href = projectPage;
      } else {
        openLightbox(i);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function() { navigate(-1); });
  lbNext.addEventListener('click',  function() { navigate(1); });

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

// ----------------------------------------
// EMAILJS CONTACT FORM
// ----------------------------------------
var cfForm    = document.getElementById('contactForm');
var cfConfirm = document.getElementById('cfConfirm');

if (cfForm && typeof emailjs !== 'undefined') {

  emailjs.init('jr4T5yLNEXwoN5mrj');

  var SERVICE_ID      = 'service_0e5o56o';
  var NOTIFY_TEMPLATE = 'template_o8x6xyg';
  var REPLY_TEMPLATE  = 'template_lrbht6k';

  function validateField(input) {
    var field = input.closest('.cf-field');
    if (!field) return true;
    var valid = input.type === 'email'
      ? input.value.trim().length > 0 && input.value.includes('@') && input.value.includes('.')
      : input.value.trim().length > 0;
    field.classList.toggle('has-error', !valid);
    return valid;
  }

  cfForm.querySelectorAll('input, textarea').forEach(function(input) {
    input.addEventListener('blur',  function() { if (input.value.trim()) validateField(input); });
    input.addEventListener('input', function() {
      if (input.closest('.cf-field') && input.closest('.cf-field').classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  cfForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var nameEl    = document.getElementById('cf-name');
    var emailEl   = document.getElementById('cf-email');
    var messageEl = document.getElementById('cf-message');

    if (!validateField(nameEl) | !validateField(emailEl) | !validateField(messageEl)) return;

    var submitBtn = cfForm.querySelector('.cf-submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('.cf-submit__text').textContent = 'Sending\u2026';

    var params = {
      name:    nameEl.value.trim(),
      email:   emailEl.value.trim(),
      message: messageEl.value.trim()
    };

    emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE, params)
      .then(function() { return emailjs.send(SERVICE_ID, REPLY_TEMPLATE, params); })
      .then(function() {
        cfForm.style.transition = 'opacity 0.3s ease';
        cfForm.style.opacity    = '0';
        setTimeout(function() {
          cfForm.style.display = 'none';
          if (cfConfirm) {
            cfConfirm.style.display    = 'flex';
            cfConfirm.style.opacity    = '0';
            cfConfirm.style.transition = 'opacity 0.4s ease';
            setTimeout(function() { cfConfirm.style.opacity = '1'; }, 20);
          }
        }, 300);
      })
      .catch(function(err) {
        console.error('EmailJS error:', err);
        submitBtn.disabled = false;
        submitBtn.querySelector('.cf-submit__text').textContent = 'Send message';
        var errorEl = cfForm.querySelector('.cf-send-error');
        if (!errorEl) {
          errorEl = document.createElement('p');
          errorEl.className  = 'cf-send-error';
          errorEl.style.cssText = 'font-size:0.8rem;color:#a0533a;margin-top:8px;font-weight:300;';
          cfForm.appendChild(errorEl);
        }
        errorEl.textContent = 'Something went wrong. Please email me directly at youremail@example.com';
      });
  });
}