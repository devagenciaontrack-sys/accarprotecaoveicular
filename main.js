(function () {
  var WHATSAPP = '5561996297632';

  // Eventos vão para o dataLayer (GTM) e, se existirem na página, para gtag e Meta Pixel.
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    params = params || {};
    window.dataLayer.push(Object.assign({ event: name }, params));
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    if (typeof window.fbq === 'function') window.fbq('trackCustom', name, params);
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (el) track(el.getAttribute('data-track'), { location: el.getAttribute('data-location') || '' });
  });

  // Vídeo do YouTube: só carrega o player no clique. O ID fica em data-video-id.
  var box = document.querySelector('.video[data-video-id]');
  if (box) {
    var id = box.getAttribute('data-video-id').trim();
    var btn = box.querySelector('.video-poster');
    if (!id) {
      btn.disabled = true;
      btn.style.cursor = 'default';
      box.querySelector('.play').style.display = 'none';
    } else {
      btn.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
        f.title = 'Vídeo da AC Car';
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        box.innerHTML = '';
        box.appendChild(f);
        track('accar_video_play', { video_id: id });
      }, { once: true });
    }
  }

  // Cotação: monta a mensagem e abre o WhatsApp do consultor.
  var form = document.getElementById('form-cotacao');
  if (form) {
    var err = document.getElementById('form-error');
    var started = false;
    form.addEventListener('input', function (e) {
      if (!started) { started = true; track('accar_form_start'); }
      if (e.target.value.trim()) e.target.removeAttribute('aria-invalid');
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var missing = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (i) {
        var ok = i.value.trim().length > 0;
        if (i.name === 'telefone') ok = i.value.replace(/\D/g, '').length >= 10;
        i.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) missing.push(i);
      });
      if (missing.length) {
        err.textContent = missing[0].name === 'telefone' && missing[0].value.trim()
          ? 'Confira o WhatsApp: use DDD e número, por exemplo (61) 99999-9999.'
          : 'Preencha os campos destacados para enviar a cotação.';
        missing[0].focus();
        return;
      }
      err.textContent = '';
      var d = new FormData(form);
      var msg = 'Olá! Quero uma cotação de proteção veicular.\n\n' +
        'Nome: ' + d.get('nome') + '\n' +
        'WhatsApp: ' + d.get('telefone') + '\n' +
        'Veículo: ' + d.get('marca') + ' ' + d.get('modelo') + ' ' + d.get('ano') +
        (d.get('placa') ? '\nPlaca: ' + d.get('placa') : '');
      track('accar_form_submit');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  // CTA fixo do celular some quando o formulário de cotação está na tela.
  var sticky = document.querySelector('.sticky');
  var target = document.getElementById('cotacao');
  if (sticky && target && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      sticky.classList.toggle('is-hidden', en[0].isIntersecting);
    }, { threshold: 0.15 }).observe(target);
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
