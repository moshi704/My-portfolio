(() => {

  //  NAV SCROLL STATE 
  const nav = document.getElementById('nav');

  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  //  ACTIVE NAV LINK ON SCROLL 
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');

  const setActiveLink = () => {
    let current = '';
    const offset = window.innerHeight * 0.4;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - offset) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').slice(1);
      link.classList.toggle('active', href === current);
    });
  };

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();


  //  MOBILE MENU 
  const burger = document.getElementById('burger');
  const overlay = document.getElementById('mobile-overlay');
  const mobLinks = document.querySelectorAll('.mob-link');

  const toggleMenu = (open) => {
    burger.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      toggleMenu(false);
    }
  });


  // SCROLL REVEAL
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  //  BACK TO TOP 
  const backBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // PROFILE IMAGE FALLBACK 
  const profileImg = document.getElementById('profile-img');
  const photoFrame = profileImg?.parentElement;

  if (profileImg) {
    profileImg.addEventListener('load', () => {
      photoFrame.classList.remove('no-photo');
    });

    // If already errored (cached)
    if (profileImg.complete && !profileImg.naturalWidth) {
      photoFrame.classList.add('no-photo');
    }
  }


  //  CONTACT FORM 
  const form = document.getElementById('contact-form');

  if (form) {
    const fields = {
      name:    { el: form.querySelector('#name'),    err: form.querySelector('#name-error') },
      email:   { el: form.querySelector('#email'),   err: form.querySelector('#email-error') },
      subject: { el: form.querySelector('#subject'), err: form.querySelector('#subject-error') },
      message: { el: form.querySelector('#message'), err: form.querySelector('#message-error') },
    };

    const status   = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText  = document.getElementById('btn-text');
    const btnIcon  = document.getElementById('btn-icon');

    const validators = {
      name:    (v) => v.trim().length >= 2 ? '' : 'Name must be at least 2 characters.',
      email:   (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address.',
      subject: (v) => v.trim().length >= 3 ? '' : 'Subject is required.',
      message: (v) => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
    };

    const clearError = (key) => {
      fields[key].el.classList.remove('error');
      fields[key].err.textContent = '';
    };

    const showError = (key, msg) => {
      fields[key].el.classList.add('error');
      fields[key].err.textContent = msg;
    };

    // Live validation on blur
    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => {
        const error = validators[key](fields[key].el.value);
        error ? showError(key, error) : clearError(key);
      });

      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) {
          const error = validators[key](fields[key].el.value);
          error ? showError(key, error) : clearError(key);
        }
      });
    });

    const validateAll = () => {
      let valid = true;
      Object.keys(fields).forEach(key => {
        const error = validators[key](fields[key].el.value);
        if (error) {
          showError(key, error);
          valid = false;
        } else {
          clearError(key);
        }
      });
      return valid;
    };

    const setSubmitting = (loading) => {
      submitBtn.disabled = loading;
      btnText.textContent = loading ? 'Sending…' : 'Send Message';
      btnIcon.className = loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane';
    };

    const showStatus = (type, msg) => {
      status.className = `form-status ${type}`;
      status.textContent = msg;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateAll()) return;

      setSubmitting(true);
      status.className = 'form-status';

      const name    = fields.name.el.value.trim();
      const email   = fields.email.el.value.trim();
      const subject = fields.subject.el.value.trim();
      const message = fields.message.el.value.trim();

      // Build mailto link as fallback 
      const mailBody = encodeURIComponent(
        `Hi Erick,\n\nName: ${name}\nEmail: ${email}\n\n${message}`
      );
      const mailSubject = encodeURIComponent(subject);
      const mailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=moshi9077@gmail.com&su=${mailSubject}&body=${mailBody}`;

      // open mail client
      await new Promise(r => setTimeout(r, 800));

      window.open(mailHref, '_blank');

      showStatus('success', '✓ Opening your mail client — message ready to send.');
      form.reset();
      Object.keys(fields).forEach(clearError);
      setSubmitting(false);
    });
  }


 
  //  subtle flash effect on anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();
