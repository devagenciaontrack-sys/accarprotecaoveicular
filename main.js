(function () {
  var WHATSAPP = '5561996297632';

  // Eventos: dataLayer (GTM) e, se existirem, gtag e Meta Pixel.
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

  // Topo ganha uma linha ao rolar.
  var bar = document.querySelector('.topbar');
  function onScroll() { if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Simulador "E se acontecer com você?": abas acessíveis por teclado.
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.sim-tabs [role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    if (window.matchMedia('(max-width: 899px)').matches) tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      select(t, false);
      track('accar_simulator_select', { scenario: t.id.replace('t-', '') });
    });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (k === 'ArrowUp' || k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (k === 'Home') n = tabs[0];
      if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); select(n, true); }
    });
  });

  // Vídeo do YouTube: o player só carrega no clique. Sem ID, o botão fica desativado.
  var box = document.querySelector('.video[data-video-id]');
  if (box) {
    var id = box.getAttribute('data-video-id').trim();
    var poster = box.querySelector('.video-poster');
    if (!id) {
      poster.disabled = true;
    } else {
      poster.addEventListener('click', function () {
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

  // Cotação: valida, monta a mensagem e abre o WhatsApp do consultor.
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
      var bad = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (i) {
        var ok = i.value.trim().length > 1;
        if (i.name === 'telefone') ok = i.value.replace(/\D/g, '').length >= 10;
        i.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) bad.push(i);
      });
      if (bad.length) {
        err.textContent = bad[0].name === 'telefone' && bad[0].value.trim()
          ? 'Confira o WhatsApp: use DDD e número, por exemplo (61) 99999-9999.'
          : 'Preencha os campos destacados para receber a cotação.';
        bad[0].focus();
        return;
      }
      err.textContent = '';
      var d = new FormData(form);
      var msg = 'Olá! Quero uma cotação de proteção veicular.\n\n' +
        'Nome: ' + d.get('nome') + '\n' +
        'WhatsApp: ' + d.get('telefone') + '\n' +
        'Carro: ' + d.get('carro') +
        (d.get('placa') ? '\nPlaca: ' + String(d.get('placa')).toUpperCase() : '');
      track('accar_form_submit');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  // Barra fixa do celular some quando o formulário está na tela.
  var dock = document.querySelector('.dock');
  var target = document.getElementById('cotacao');
  if (dock && target && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { dock.classList.toggle('is-hidden', en[0].isIntersecting); }, { threshold: 0.2 }).observe(target);
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
