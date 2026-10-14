(() => {
  const menuToggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#main-nav');
  const progressBar = document.querySelector('#progress-bar');
  const signalButton = document.querySelector('#signal-button');
  const imageDialog = document.querySelector('#image-dialog');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');

  // Menu para telas menores.
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        nav.classList.remove('is-open');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        menuToggle.focus();
      }
    });
  }

  // Barra fina no topo para mostrar o quanto da página já foi percorrido.
  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, amount))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // O botão muda a luz vermelha da página, como se o sinal estivesse ligado.
  if (signalButton) {
    signalButton.addEventListener('click', () => {
      const active = document.body.classList.toggle('signal-active');
      signalButton.setAttribute('aria-pressed', String(active));
      signalButton.innerHTML = active
        ? '<span class="signal-dot" aria-hidden="true"></span> Apagar o sinal'
        : '<span class="signal-dot" aria-hidden="true"></span> Acender o sinal';
    });
  }

  // Entrada suave das seções. Se o navegador não tiver suporte, tudo continua visível.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  // Galeria com ampliação. O diálogo também pode ser fechado pela tecla Esc.
  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      if (!imageDialog || !lightboxImage || !lightboxCaption) return;
      const imageUrl = card.dataset.image;
      const caption = card.dataset.caption || 'Imagem do arquivo visual';
      if (!imageUrl) return;
      lightboxImage.src = imageUrl;
      lightboxImage.alt = caption;
      lightboxCaption.textContent = caption;
      if (typeof imageDialog.showModal === 'function') imageDialog.showModal();
    });
  });

  if (imageDialog) {
    imageDialog.addEventListener('click', (event) => {
      if (event.target === imageDialog) imageDialog.close();
    });
    imageDialog.addEventListener('close', () => {
      if (lightboxImage) lightboxImage.src = '';
    });
  }
})();
