/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. PROFILE PHOTO UPLOAD
  ---------------------------------------------------------- */
  const photoInput        = document.getElementById('photo-input');
  const profileImg        = document.getElementById('profileImg');
  const profilePlaceholder = document.getElementById('profilePlaceholder');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        profileImg.src = ev.target.result;
        profileImg.style.display = 'block';
        profilePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  /* ----------------------------------------------------------
     2. SCROLL REVEAL (IntersectionObserver)
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
          const delay = siblings.indexOf(entry.target) * 90;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Math.max(0, delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     3. NAVBAR — scroll shadow + active link highlight
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => navObserver.observe(s));

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ----------------------------------------------------------
     4. HAMBURGER MENU (mobile)
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL for all anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ----------------------------------------------------------
     6. PARALLAX — subtle orb movement on mouse move
  ---------------------------------------------------------- */
  const orbs = document.querySelectorAll('.orb');

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;   // -1 to 1
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const strength = (i + 1) * 14;
      orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
  });

  /* ----------------------------------------------------------
     7. TYPING EFFECT — hero name placeholder
     Replace "Your Name Here" with your actual name in index.html
     OR set window.PORTFOLIO_NAME = "Your Name" before this script.
  ---------------------------------------------------------- */
  const heroName   = document.getElementById('heroName');
  const footerName = document.getElementById('footerName');
  const name = window.PORTFOLIO_NAME || heroName?.textContent || 'Your Name Here';

  if (heroName && name !== 'Your Name Here') {
    heroName.textContent   = '';
    footerName.textContent = name;

    let i = 0;
    const type = () => {
      if (i < name.length) {
        heroName.textContent += name[i++];
        setTimeout(type, 55);
      }
    };
    setTimeout(type, 600);
  }

  /* ----------------------------------------------------------
     8. SKILL CARDS — ripple on click
  ---------------------------------------------------------- */
  document.querySelectorAll('.skill-item').forEach((card) => {
    card.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect   = card.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
        background: rgba(168, 216, 234, 0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      `;

      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(2.5); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

});
