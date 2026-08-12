(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('visible'); });
  } else {
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    items.forEach(function(el){ obs.observe(el); });
  }
})();

// click-to-enlarge lightbox with click-to-zoom, for project stream images
(function(){
  var targets = document.querySelectorAll('.stream .media-block img');
  if(!targets.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Enlarged image viewer');

  var img = document.createElement('img');
  overlay.appendChild(img);

  var closeBtn = document.createElement('button');
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  overlay.appendChild(closeBtn);

  var hint = document.createElement('div');
  hint.className = 'lightbox-hint';
  hint.textContent = 'Click image to zoom · Esc to close';
  overlay.appendChild(hint);

  document.body.appendChild(overlay);

  function openLightbox(src, alt){
    img.src = src;
    img.alt = alt || '';
    img.classList.remove('zoomed');
    img.style.transformOrigin = 'center center';
    overlay.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeLightbox(){
    overlay.classList.remove('open');
    img.classList.remove('zoomed');
    document.documentElement.style.overflow = '';
  }

  targets.forEach(function(el){
    el.addEventListener('click', function(){
      openLightbox(el.currentSrc || el.src, el.alt);
    });
  });

  img.addEventListener('click', function(e){
    e.stopPropagation();
    if(img.classList.contains('zoomed')){
      img.classList.remove('zoomed');
      img.style.transformOrigin = 'center center';
    } else {
      var rect = img.getBoundingClientRect();
      var xPct = ((e.clientX - rect.left) / rect.width) * 100;
      var yPct = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = xPct + '% ' + yPct + '%';
      img.classList.add('zoomed');
    }
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay){ closeLightbox(); }
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeLightbox(); }
  });
})();

// scroll-by-segment helper for wide panoramic images (e.g. Red River drawing)
function scrollWide(id, dir){
  var track = document.querySelector('#' + id + ' .wide-scroll-track');
  if(!track) return;
  var amount = track.clientWidth * dir;
  track.scrollBy({ left: amount, behavior: 'smooth' });
}
