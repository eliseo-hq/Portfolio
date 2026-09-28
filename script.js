/* =========================================================
   ELISO — Design Studio
   Vanilla JS: nav state, mobile menu, scroll reveal, cursor,
   video play/pause interactions.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav scrolled state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small stagger for groups revealed together
          setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Custom cursor (desktop only) ---------- */
  const cursor = document.getElementById('cursorDot');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover && cursor) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .member').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }

  /* ---------- Contact form (EmailJS) ---------- */
  // 1) Create a free account at https://www.emailjs.com
  // 2) Add an email service + a template, then paste the three IDs below.
  // Template variables to use: {{from_name}} {{from_email}} {{company}}
  //                            {{project_type}} {{budget}} {{message}}
  const EMAILJS_PUBLIC_KEY  = 'XDANF6kdHQU-0IbJ9';
  const EMAILJS_SERVICE_ID  = 'service_ek2kyed';
  const EMAILJS_TEMPLATE_ID = 'template_8zenqst';

  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('cformStatus');
  const btn = document.getElementById('cformBtn');
  if (form && window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.classList.remove('is-error');
      if (!form.checkValidity()) {
        statusEl.textContent = 'Please fill in name, email, project type, budget and message.';
        statusEl.classList.add('is-error');
        return;
      }
      btn.disabled = true;
      statusEl.textContent = 'Sending…';
      try {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        statusEl.textContent = "Thanks, your message is on its way. We'll reply soon.";
        form.reset();
      } catch (err) {
        console.error(err);
        statusEl.textContent = 'Something went wrong. Please email us directly instead.';
        statusEl.classList.add('is-error');
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------- Subtle hero photo parallax ---------- */
  const heroPhoto = document.querySelector('.hero__photo');
  if (heroPhoto && canHover) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${y * 0.08}px)`;
      }
    }, { passive: true });
  }

});
