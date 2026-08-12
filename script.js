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
  var targets = Array.prototype.slice.call(document.querySelectorAll('.stream .media-block img'));
  if(!targets.length) return;

  var currentIndex = -1;

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

  var prevBtn = document.createElement('button');
  prevBtn.className = 'lightbox-nav prev';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.innerHTML = '&#8249;';
  overlay.appendChild(prevBtn);

  var nextBtn = document.createElement('button');
  nextBtn.className = 'lightbox-nav next';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.innerHTML = '&#8250;';
  overlay.appendChild(nextBtn);

  var hint = document.createElement('div');
  hint.className = 'lightbox-hint';
  hint.textContent = targets.length > 1
    ? 'Click image to zoom · \u2190 \u2192 to navigate · Esc to close'
    : 'Click image to zoom · Esc to close';
  overlay.appendChild(hint);

  document.body.appendChild(overlay);

  if(targets.length < 2){
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  function showAt(index){
    var len = targets.length;
    currentIndex = ((index % len) + len) % len;
    var el = targets[currentIndex];
    img.src = el.currentSrc || el.src;
    img.alt = el.alt || '';
    img.classList.remove('zoomed');
    img.style.transformOrigin = 'center center';
  }
  function openLightbox(index){
    showAt(index);
    overlay.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeLightbox(){
    overlay.classList.remove('open');
    img.classList.remove('zoomed');
    document.documentElement.style.overflow = '';
  }

  targets.forEach(function(el, i){
    el.addEventListener('click', function(){
      openLightbox(i);
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

  prevBtn.addEventListener('click', function(e){
    e.stopPropagation();
    showAt(currentIndex - 1);
  });
  nextBtn.addEventListener('click', function(e){
    e.stopPropagation();
    showAt(currentIndex + 1);
  });

  overlay.addEventListener('click', function(e){
    if(e.target === overlay){ closeLightbox(); }
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function(e){
    if(!overlay.classList.contains('open')) return;
    if(e.key === 'Escape'){ closeLightbox(); }
    if(e.key === 'ArrowLeft'){ showAt(currentIndex - 1); }
    if(e.key === 'ArrowRight'){ showAt(currentIndex + 1); }
  });
})();

// scroll-by-segment helper for wide panoramic images (e.g. Red River drawing)
function scrollWide(id, dir){
  var track = document.querySelector('#' + id + ' .wide-scroll-track');
  if(!track) return;
  var amount = track.clientWidth * dir;
  track.scrollBy({ left: amount, behavior: 'smooth' });
}
