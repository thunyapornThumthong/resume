(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- live clock ---- */
  var clockEl = document.getElementById('clock');
  var pad = function(n){ return n < 10 ? '0'+n : ''+n; };
  function tick(){
    var now = new Date();
    clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }
  if (clockEl) {
    tick();
    setInterval(tick, 1000);
}

  /* ---- fluctuating system load widget ---- */
  var slFill = document.getElementById('sl-fill');
  function fluctuateLoad(){
    var val = 25 + Math.round(Math.random()*40);
    slFill.style.width = val + '%';
  }
 if (slFill) {
    fluctuateLoad();
    if(!reduceMotion){
        setInterval(fluctuateLoad,2200);
    }
}

  /* ---- top nav: scroll to section + highlight active link ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.topnav a'));
  navLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      var targetId = link.getAttribute('href');
      var target = document.querySelector(targetId);
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    });
  });

  var navSections = navLinks.map(function(link){
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if('IntersectionObserver' in window){
    var navObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = '#' + entry.target.id;
          navLinks.forEach(function(link){
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    navSections.forEach(function(sec){ navObs.observe(sec); });
  }

  /* ---- accordions (address panel + university course list) ---- */
  document.querySelectorAll('.accordion-header').forEach(function(header){
    header.addEventListener('click', function(){
      var parent = header.closest('.accordion');
      var body = parent.querySelector('.accordion-body');
      var isOpen = parent.classList.contains('open');
      if(isOpen){
        parent.classList.remove('open');
        body.style.maxHeight = '0px';
        header.setAttribute('aria-expanded', 'false');
      } else {
        parent.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---- animate skill bars into view ---- */
  var bars = document.querySelectorAll('.bar-fill[data-target]');
  if('IntersectionObserver' in window && !reduceMotion){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.getAttribute('data-target');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function(bar){ obs.observe(bar); });
  } else {
    bars.forEach(function(bar){ bar.style.width = bar.getAttribute('data-target'); });
  }

  /* ---- chip tilt on mouse move ---- */
  var chip = document.getElementById('chip');
  if(chip && !reduceMotion && window.matchMedia('(hover: hover)').matches){
    var wrap = chip.closest('.overview-body') || chip.parentElement;
    wrap.addEventListener('mousemove', function(e){
      var rect = chip.getBoundingClientRect();
      var cx = rect.left + rect.width/2;
      var cy = rect.top + rect.height/2;
      var dx = (e.clientX - cx) / (rect.width/2);
      var dy = (e.clientY - cy) / (rect.height/2);
      var rx = Math.max(-1, Math.min(1, -dy)) * 12;
      var ry = Math.max(-1, Math.min(1, dx)) * 12;
      chip.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    wrap.addEventListener('mouseleave', function(){
      chip.style.transform = 'rotateX(0) rotateY(0)';
    });
  }
})();