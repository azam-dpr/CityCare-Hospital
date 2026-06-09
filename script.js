(function() {

  /* ---- DARK MODE ---- */
  const themeBtn  = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const body      = document.body;

  function applyTheme(dark) {
    if (dark) {
      body.setAttribute('data-theme','dark');
      themeIcon.className = 'fas fa-sun';
    } else {
      body.removeAttribute('data-theme');
      themeIcon.className = 'fas fa-moon';
    }
  }

  // Load saved preference
  applyTheme(localStorage.getItem('ccTheme') === 'dark');

  themeBtn.addEventListener('click', () => {
    const isDark = body.hasAttribute('data-theme');
    localStorage.setItem('ccTheme', isDark ? 'light' : 'dark');
    applyTheme(!isDark);
  });

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ---- TOAST ---- */
  function showToast(msg, type='success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type==='success'?'circle-check':'circle-exclamation'}"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut .3s ease both';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ---- FORM VALIDATION HELPER ---- */
  function validateRequired(input, groupId) {
    const group = document.getElementById(groupId);
    if (!input.value.trim()) {
      group.classList.add('has-error');
      return false;
    }
    group.classList.remove('has-error');
    return true;
  }
  function validateEmail(input, groupId) {
    const group = document.getElementById(groupId);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!ok) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error');
    return true;
  }
  function validatePhone(input, groupId) {
    const group = document.getElementById(groupId);
    const ok = /^\+?[\d\s\-]{10,}$/.test(input.value.trim());
    if (!ok) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error');
    return true;
  }
  function validateDate(input, groupId) {
    const group = document.getElementById(groupId);
    const chosen = new Date(input.value);
    const today  = new Date(); today.setHours(0,0,0,0);
    if (!input.value || chosen < today) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error');
    return true;
  }

  /* ---- APPOINTMENT FORM ---- */
  document.getElementById('appointmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ok = [
      validateRequired(document.getElementById('ap-name'),  'fg-name'),
      validatePhone   (document.getElementById('ap-phone'), 'fg-phone'),
      validateEmail   (document.getElementById('ap-email'), 'fg-email'),
      validateRequired(document.getElementById('ap-dept'),  'fg-dept'),
      validateDate    (document.getElementById('ap-date'),  'fg-date'),
    ].every(Boolean);

    if (ok) {
      this.reset();
      showToast('Appointment booked! We\'ll confirm within 2 hours.', 'success');
    } else {
      showToast('Please fix the errors above.', 'error');
    }
  });

  /* ---- LOGIN FORM ---- */
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const ok = [
      validateEmail   (document.getElementById('l-email'), 'fg-lemail'),
      validateRequired(document.getElementById('l-pwd'),   'fg-lpwd'),
    ].every(Boolean);
    if (ok) { this.reset(); showToast('Logged in successfully!', 'success'); }
    else showToast('Please fix the errors above.', 'error');
  });

  /* ---- REGISTER FORM ---- */
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const pwd  = document.getElementById('r-pwd');
    const pwd2 = document.getElementById('r-pwd2');
    const pwdGroup2 = document.getElementById('fg-rpwd2');

    const ok = [
      validateRequired(document.getElementById('r-name'),  'fg-rname'),
      validateEmail   (document.getElementById('r-email'), 'fg-remail'),
      validateRequired(pwd, 'fg-rpwd'),
    ].every(Boolean);

    // password match
    let matchOk = true;
    if (pwd.value !== pwd2.value || !pwd2.value) {
      pwdGroup2.classList.add('has-error');
      matchOk = false;
    } else {
      pwdGroup2.classList.remove('has-error');
    }

    // min length
    if (pwd.value.length < 6) {
      document.getElementById('fg-rpwd').classList.add('has-error');
    }

    if (ok && matchOk && pwd.value.length >= 6) {
      this.reset();
      showToast('Registration successful! You can now login.', 'success');
    } else {
      showToast('Please fix the errors above.', 'error');
    }
  });

  /* ---- TESTIMONIAL SLIDER ---- */
  const slides    = document.getElementById('testSlides');
  const dots      = document.querySelectorAll('.dot');
  let current     = 0;
  const total     = dots.length;

  function goTo(index) {
    current = index;
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i === index));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(+dot.dataset.index));
  });

  // Auto-advance
  setInterval(() => goTo((current + 1) % total), 5000);

  // Touch/swipe support for slider
  let touchStartX = 0;
  slides.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  slides.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? Math.min(current+1,total-1) : Math.max(current-1,0));
  });

  /* ---- SET MIN DATE for appointment ---- */
  const dateInput = document.getElementById('ap-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

})();
