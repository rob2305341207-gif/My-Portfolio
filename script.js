(() => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.getElementById('navbar');
  const typewriterElement = document.getElementById('typewriter');
  const revealElements = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('.progress-bar');
  const terminalLines = document.querySelectorAll('.terminal-line');
  const navAnchors = document.querySelectorAll('a[href^="#"]');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(isHidden));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth anchor scroll
  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  // Navbar backdrop/shadow on scroll
  const handleNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-lg');
      navbar.classList.add('border-white/10');
      navbar.classList.add('bg-bgdark/90');
    } else {
      navbar.classList.remove('shadow-lg');
      navbar.classList.remove('border-white/10');
      navbar.classList.remove('bg-bgdark/90');
    }
  };
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Skill bars animate on scroll
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;

  const animateSkills = () => {
    if (skillsAnimated || !skillSection) return;
    skillsAnimated = true;

    progressBars.forEach((bar, index) => {
      const width = bar.getAttribute('data-width') || '0%';
      setTimeout(() => {
        bar.style.width = width;
      }, index * 100);
    });
  };

  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25
    });
    skillObserver.observe(skillSection);
  }

  // Typewriter effect
  const phrases = [
    'secure networks',
    'reliable infrastructure',
    'robust systems',
    'scalable solutions'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout = null;

  function typeWriter() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];
    let nextDelay = 100;

    if (!isDeleting) {
      charIndex++;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      nextDelay = 100;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        nextDelay = 2000;
      }
    } else {
      charIndex--;
      typewriterElement.textContent = currentPhrase.substring(0, charIndex);
      nextDelay = 50;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        nextDelay = 500;
      }
    }

    typeTimeout = window.setTimeout(typeWriter, nextDelay);
  }

  function startTypewriter() {
    if (!typewriterElement || prefersReducedMotion) {
      if (typewriterElement) typewriterElement.textContent = phrases[0];
      return;
    }
    typewriterElement.textContent = '';
    window.setTimeout(typeWriter, 500);
  }

  window.addEventListener('load', startTypewriter);

  // Terminal animation sequential
  function animateTerminal() {
    if (prefersReducedMotion) {
      terminalLines.forEach((line) => line.classList.add('visible'));
      return;
    }

    terminalLines.forEach((line, index) => {
      window.setTimeout(() => {
        line.classList.add('visible');
      }, index * 200);
    });
  }

  window.addEventListener('load', () => {
    animateTerminal();
  });

  // Background network canvas
  const canvas = document.getElementById('network-canvas');
  let ctx = null;
  let width = 0;
  let height = 0;
  let animationId = null;
  let particles = [];

  if (canvas && canvas.getContext && !prefersReducedMotion) {
    ctx = canvas.getContext('2d');

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.8 + 0.8;

        if (!initial) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= width) this.vx *= -1;
        if (this.y <= 0 || this.y >= height) this.vy *= -1;

        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(14, 165, 233, 0.55)';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    }

    function initParticles() {
      const maxParticles = 50;
      const responsiveCount = Math.min(maxParticles, Math.max(18, Math.floor(window.innerWidth / 28)));
      particles = [];
      for (let i = 0; i < responsiveCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = 0.2 * (1 - distance / 150);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(14, 165, 233, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      if (document.hidden) return;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationId = requestAnimationFrame(animateCanvas);
    }

    function startCanvas() {
      resizeCanvas();
      initParticles();
      cancelAnimationFrame(animationId);
      animateCanvas();
    }

    window.addEventListener('resize', startCanvas, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        startCanvas();
      }
    });

    startCanvas();
  }

  // Pause CSS animations when tab hidden
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('pause-animations', document.hidden);
  });

  // Improve keyboard accessibility for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenuBtn) {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Small console signature
  console.log('%cKhaled Bin A. Rob Portfolio loaded', 'color:#0ea5e9;font-size:14px;font-weight:700;');

  // Cleanup safeguard
  window.addEventListener('beforeunload', () => {
    if (typeTimeout) window.clearTimeout(typeTimeout);
    if (animationId) cancelAnimationFrame(animationId);
  });
})();