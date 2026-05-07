/* ===== PARTICLE CANVAS ===== */
(function () {
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var COUNT = 75;
  var MAX_DIST = 130;
  var particles = [];
  var raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 1.8 + 0.8;
      this.alpha = Math.random() * 0.45 + 0.15;
    };
    this.reset();
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(192, 132, 252, ' + this.alpha + ')';
    ctx.fill();
  };

  function init() {
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function drawLines() {
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          var alpha = (1 - dist / MAX_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(124, 58, 237, ' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    drawLines();
    raf = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(raf);
      resize();
      init();
      animate();
    }, 150);
  });
})();

/* ===== TYPEWRITER ===== */
(function () {
  var phrases = [
    'Staff Forward Deployed AI Engineer',
    'Voice AI Systems Architect',
    'Agent Orchestration Lead',
    'Enterprise AI Deployment Expert',
  ];
  var el = document.getElementById('typewriter');
  var pi = 0, ci = 0, del = false;

  function tick() {
    var word = phrases[pi];
    if (!del) {
      ci++;
      el.textContent = word.slice(0, ci);
      if (ci === word.length) {
        del = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 72);
    } else {
      ci--;
      el.textContent = word.slice(0, ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }

  setTimeout(tick, 1600);
})();

/* ===== NAV SCROLL ===== */
(function () {
  var nav = document.getElementById('nav');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ===== MOBILE MENU ===== */
(function () {
  var btn = document.getElementById('menuBtn');
  var drawer = document.getElementById('mobileNav');

  function toggle() {
    var open = btn.classList.toggle('open');
    drawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);

  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      btn.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ===== STAT COUNT-UP ===== */
(function () {
  var statEls = document.querySelectorAll('.stat-number[data-count]');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutQuart(progress);
      var current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = parseInt(el.closest('[data-delay]') ? el.closest('[data-delay]').dataset.delay : '0', 10);
        setTimeout(function () { animateCount(el); }, delay + 200);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(function (el) { countObserver.observe(el); });
})();

/* ===== SKILL TAG STAGGER ===== */
(function () {
  document.querySelectorAll('.skill-category').forEach(function (cat) {
    var tags = cat.querySelectorAll('.tag');
    tags.forEach(function (t) {
      t.style.opacity = '0';
      t.style.transform = 'translateY(8px)';
    });

    var observed = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tags.forEach(function (t, i) {
            setTimeout(function () {
              t.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.22s, border-color 0.22s, color 0.22s, box-shadow 0.22s';
              t.style.opacity = '1';
              t.style.transform = '';
            }, i * 55);
          });
          observed.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observed.observe(cat);
  });
})();

/* ===== ACTIVE NAV HIGHLIGHT ===== */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        links.forEach(function (link) {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--p3)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (s) { sectionObserver.observe(s); });
})();
