/**
 * JORWIN 卓汇官网 - 多页面交互脚本
 * 包含: 导航、粒子、滚动动画、数字计数、响应式菜单
 */

/* ══════════════════════════════════════
   1. 导航栏 滚动变色 + 移动端菜单
══════════════════════════════════════ */
(function () {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.getElementById('navLinks');
  const navCta    = document.getElementById('navCta');
  const toggle    = document.getElementById('mobileToggle');
  let isOpen      = false;

  // 滚动时导航变色
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // 移动端汉堡菜单
  if (toggle) {
    toggle.addEventListener('click', function () {
      isOpen = !isOpen;
      navLinks.classList.toggle('open', isOpen);
      if (navCta) navCta.classList.toggle('open', isOpen);
      var bars = toggle.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '1';
        bars[2].style.transform = '';
      }
    });
  }

  // 点击链接后关闭移动端菜单
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        navLinks.classList.remove('open');
        if (navCta) navCta.classList.remove('open');
        var bars = toggle.querySelectorAll('span');
        bars[0].style.transform = '';
        bars[1].style.opacity   = '1';
        bars[2].style.transform = '';
      });
    });
  }
})();


/* ══════════════════════════════════════
   2. Hero 粒子系统
══════════════════════════════════════ */
(function () {
  var container = document.getElementById('particles');
  if (!container) return;

  var PARTICLE_COUNT = 28;
  var colors = [
    'rgba(124, 58, 237, 0.6)',
    'rgba(99, 102, 241, 0.5)',
    'rgba(217, 119, 6, 0.4)',
    'rgba(167, 139, 250, 0.5)',
    'rgba(245, 158, 11, 0.35)',
  ];

  function createParticle() {
    var el = document.createElement('div');
    el.className = 'particle';
    var size   = Math.random() * 4 + 2;
    var color  = colors[Math.floor(Math.random() * colors.length)];
    var left   = Math.random() * 100;
    var delay  = Math.random() * 12;
    var dur    = 10 + Math.random() * 15;

    el.style.cssText =
      'width:' + size + 'px;' +
      'height:' + size + 'px;' +
      'background:' + color + ';' +
      'left:' + left + '%;' +
      'animation-duration:' + dur + 's;' +
      'animation-delay:' + delay + 's;' +
      'box-shadow: 0 0 ' + (size * 2) + 'px ' + color + ';';
    return el;
  }

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    container.appendChild(createParticle());
  }
})();


/* ══════════════════════════════════════
   3. Intersection Observer 滚动淡入
══════════════════════════════════════ */
(function () {
  var targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ══════════════════════════════════════
   4. 数字滚动计数动画
══════════════════════════════════════ */
(function () {
  var counters = document.querySelectorAll('.count-up[data-target]');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el) {
    var target   = parseInt(el.dataset.target, 10);
    var duration = 1800;
    var start    = performance.now();
    var initial  = 0;

    function step(now) {
      var elapsed  = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutQuart(progress);
      var value    = Math.floor(initial + (target - initial) * eased);
      el.textContent = value.toLocaleString('zh-CN');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('zh-CN');
      }
    }
    requestAnimationFrame(step);
  }

  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { countObserver.observe(el); });
})();


/* ══════════════════════════════════════
   5. Logo 墙无缝滚动（CSS animation 驱动）
══════════════════════════════════════ */



