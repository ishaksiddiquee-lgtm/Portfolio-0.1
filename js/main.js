/* ── FOLLOWER SYSTEM (Firebase Realtime Database) ── */
const BASE_COUNT   = 15000;
const followBtn    = document.getElementById('nav-follow-btn');
const followerDisp = document.getElementById('nav-follower-count');

const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyDJ9tI1I0KM6tkHT0Zy8-Crf1LpM7e1l0w',
  authDomain:        'portfolio-follow-23690.firebaseapp.com',
  projectId:         'portfolio-follow-23690',
  storageBucket:     'portfolio-follow-23690.firebasestorage.app',
  messagingSenderId: '116470511665',
  appId:             '1:116470511665:web:e713e24e5c7514ed1b7d10',
  measurementId:     'G-E57FC5KQ9W',
  databaseURL:       'https://portfolio-follow-23690-default-rtdb.firebaseio.com',
};

firebase.initializeApp(FIREBASE_CONFIG);
const countRef = firebase.database().ref('site/followers');

let followed = localStorage.getItem('site_followed') === 'true';

function renderBtn() {
  if (followed) {
    followBtn.textContent = '✓ Following';
    followBtn.classList.add('nav-follow-btn--active');
  } else {
    followBtn.textContent = '+ Follow';
    followBtn.classList.remove('nav-follow-btn--active');
  }
}

// Live-sync count from Firebase across all devices
countRef.on('value', (snap) => {
  const count = snap.val() ?? BASE_COUNT;
  followerDisp.textContent = Number(count).toLocaleString();
});

followBtn.addEventListener('click', () => {
  if (followed) return;
  // Atomic transaction — safe even if two people click at the same time
  countRef.transaction((current) => (current ?? BASE_COUNT) + 1);
  followed = true;
  localStorage.setItem('site_followed', 'true');
  renderBtn();
});

renderBtn();

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.getElementById('scroll-progress');

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('back-to-top');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── CURSOR GLOW ── */
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── NAV: scroll class + active link ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  /* scroll progress */
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = (scrolled * 100) + '%';

  /* back to top visibility */
  backToTop.classList.toggle('visible', window.scrollY > 400);

  navbar.classList.toggle('scrolled', window.scrollY > 60);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE MENU ── */
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navList.classList.toggle('open');
  document.body.style.overflow = navList.classList.contains('open') ? 'hidden' : '';
});

navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navList.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SECTION REVEAL ── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('[data-anim]').forEach(el => sectionObserver.observe(el));

/* ── INTERSECTION OBSERVER: reveal on scroll ── */
const revealEls = document.querySelectorAll('.skill-card, .project-card, .contact-detail-item, .contact-social-btn');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── COUNT-UP ANIMATION ── */
const statNums = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + '+';
    }
    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ── TYPING ANIMATION ── */
const phrases = ['Frontend Web Developer', 'HTML · CSS · JavaScript', 'UI Designer & Builder', 'Creative Problem Solver'];
const typedEl = document.getElementById('typed-text');
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const phrase = phrases[phraseIdx];
  typedEl.textContent = deleting ? phrase.slice(0, charIdx--) : phrase.slice(0, charIdx++);

  if (!deleting && charIdx > phrase.length) {
    deleting = true;
    setTimeout(type, 1800);
    return;
  }
  if (deleting && charIdx < 0) {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    charIdx = 0;
    setTimeout(type, 400);
    return;
  }
  setTimeout(type, deleting ? 50 : 80);
}
type();

/* ── TIMELINE REVEAL ── */
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
timelineItems.forEach(el => timelineObserver.observe(el));

/* ── CONTACT FORM — Web3Forms ── */
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const subject = form.subject.value.trim() || 'New message from portfolio';
  const msg     = form.message.value.trim();
  const key     = document.getElementById('w3f-key').value;

  if (!name || !email || !msg) {
    status.textContent = 'Please fill in your name, email, and message.';
    status.className = 'form-status error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.textContent = 'Please enter a valid email address.';
    status.className = 'form-status error';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.textContent = '';
  status.className = 'form-status';

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: key,
        name:       name,
        email:      email,
        subject:    subject,
        message:    msg,
        from_name:  'Portfolio Contact Form'
      })
    });
    const data = await res.json();

    if (data.success) {
      status.textContent = 'Message sent successfully! I will get back to you soon.';
      status.className = 'form-status success';
      form.reset();
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    status.textContent = 'Could not send message. Please email me directly at ishaksiddiquee@email.com';
    status.className = 'form-status error';
  }

  btn.disabled = false;
  btn.textContent = 'Send Message';
  setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 7000);
});
