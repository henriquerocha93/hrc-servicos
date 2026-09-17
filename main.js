// =============================================
// main.js - HRC SERVICOS
// Site behavior & interactivity
// =============================================

(function() {
  'use strict';

  const cfg = window.HRC_CONFIG || {};

  // ---- WhatsApp URL builder ----
  function getWhatsAppUrl() {
    const num = (cfg.whatsapp || '').replace(/\D/g, '');
    const msg = cfg.whatsappMsg || 'Ol%C3%A1! Gostaria de solicitar um or%C3%A7amento.';
    if (!num) return '#';
    return 'https://wa.me/' + num + '?text=' + msg;
  }

  // ---- Populate contact info ----
  function populateConfig() {
    const waUrl = getWhatsAppUrl();

    // WhatsApp buttons
    document.querySelectorAll('.whatsapp-btn').forEach(el => {
      if (waUrl !== '#') el.href = waUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });

    // Phone display
    ['footerPhoneDisplay', 'orcPhoneDisplay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = cfg.telefone || '[INSERIR TELEFONE]';
    });

    // WhatsApp display
    const waDisp = document.getElementById('footerWhatsAppDisplay');
    if (waDisp) waDisp.textContent = cfg.whatsapp || '[INSERIR WHATSAPP]';

    // Email display (oculto se nao preenchido)
    const orcEmailEl = document.getElementById('orcEmailDisplay');
    if (orcEmailEl) {
      if (cfg.email) {
        orcEmailEl.textContent = cfg.email;
      } else {
        orcEmailEl.closest('.orcamento__opt')?.remove();
      }
    }

    const footerEmailEl = document.getElementById('footerEmailDisplay');
    if (footerEmailEl) {
      if (cfg.email) {
        footerEmailEl.textContent = cfg.email;
      } else {
        footerEmailEl.closest('li')?.remove();
      }
    }

    // Address display
    const addr = document.getElementById('footerAddressDisplay');
    if (addr) addr.textContent = cfg.endereco || '[INSERIR ENDERECO]';

    // Instagram
    if (cfg.instagram) {
      const social = document.getElementById('footerSocial');
      if (social) {
        social.innerHTML = '<a href="' + cfg.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>' +
          '<path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>' +
          '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' +
          '</svg></a>';
      }
    }
  }

  // ---- Sticky header ----
  function initStickyHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile menu ----
  function initMobileMenu() {
    const hamburger = document.getElementById('navHamburger');
    const menu      = document.getElementById('navMenu');
    const overlay   = document.getElementById('navOverlay');
    if (!hamburger || !menu) return;

    function openMenu() {
      menu.classList.add('open');
      hamburger.classList.add('open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ---- Scroll animations ----
  function initAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animated'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          setTimeout(() => entry.target.classList.add('animated'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 60px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => obs.observe(el));
  }

  // ---- Active nav link on scroll ----
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav__link');
    if (!sections.length || !links.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector('.nav__link[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(s => obs.observe(s));
  }

  // ---- Phone Input Mask ----
  function initPhoneMask() {
    const phoneInput = document.getElementById('telefone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function(e) {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        // (11) 99999-9999
        e.target.value = '(' + v.substring(0, 2) + ') ' + v.substring(2, 7) + '-' + v.substring(7, 11);
      } else if (v.length > 6) {
        // (11) 9999-9999
        e.target.value = '(' + v.substring(0, 2) + ') ' + v.substring(2, 6) + '-' + v.substring(6, 10);
      } else if (v.length > 2) {
        // (11) 9999
        e.target.value = '(' + v.substring(0, 2) + ') ' + v.substring(2);
      } else if (v.length > 0) {
        // (11
        e.target.value = '(' + v;
      }
    });
  }

  // ---- Quote form ----
  function initForm() {
    const form       = document.getElementById('orcamentoForm');
    const success    = document.getElementById('formSuccess');
    const errorBox   = document.getElementById('formError');
    const errorMsg   = document.getElementById('formErrorMsg');
    const submitBtn  = document.getElementById('formSubmitBtn');
    const resetBtn   = document.getElementById('formResetBtn');
    if (!form) return;

    initPhoneMask();

    function validateField(field) {
      field.classList.remove('error');
      if (field.required && !field.value.trim()) {
        field.classList.add('error');
        return false;
      }
      if (field.type === 'email' && field.value.trim()) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        if (!ok) { field.classList.add('error'); return false; }
      }
      return true;
    }

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        field.classList.remove('error');
        if (errorBox) errorBox.style.display = 'none';
      });
      if (field.tagName === 'SELECT') {
        field.addEventListener('change', () => field.classList.remove('error'));
      }
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'block';
        if (success) success.style.display = 'none';
        if (errorBox) errorBox.style.display = 'none';
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (errorBox) errorBox.style.display = 'none';

      let valid = true;
      form.querySelectorAll('[required]').forEach(f => { if (!validateField(f)) valid = false; });
      if (!valid) {
        const first = form.querySelector('.error');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const targetEmail = (cfg.emailOrcamento || cfg.email || '').trim();
      
      const nome       = (form.querySelector('#nome')?.value || '').trim();
      const empresa    = (form.querySelector('#empresa')?.value || '').trim();
      const tel        = (form.querySelector('#telefone')?.value || '').trim();
      const email      = (form.querySelector('#email')?.value || '').trim();
      const cidade     = (form.querySelector('#cidade')?.value || '').trim();
      const imovelEl   = form.querySelector('#imovel');
      const imovel     = imovelEl?.options[imovelEl.selectedIndex]?.value || '';
      const servEl     = form.querySelector('#servico');
      const servico    = servEl?.options[servEl.selectedIndex]?.value || '';
      const freqEl     = form.querySelector('#frequencia');
      const frequencia = freqEl?.options[freqEl.selectedIndex]?.value || '';
      const area       = (form.querySelector('#area')?.value || '').trim();
      const mensagem   = (form.querySelector('#mensagem')?.value || '').trim();

      // UI state: loading
      const btnText    = submitBtn?.querySelector('.btn__text');
      const btnSpinner = submitBtn?.querySelector('.btn__spinner');
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnSpinner) btnSpinner.style.display = 'inline-flex';

      // Check if target email is configured
      if (!targetEmail) {
        setTimeout(() => {
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.style.display = '';
          if (btnSpinner) btnSpinner.style.display = 'none';
          if (errorBox && errorMsg) {
            errorMsg.innerHTML = '<strong>Configuração necessária:</strong> Por favor, defina o seu e-mail no arquivo <code>config.js</code> no campo <code>emailOrcamento</code> para receber as solicitações.';
            errorBox.style.display = 'flex';
          }
        }, 500);
        return;
      }

      const payload = {
        _subject: `Novo Orçamento: ${nome} - ${servico || 'Limpeza e Zeladoria'}`,
        _template: 'table',
        _captcha: 'false',
        'Nome': nome,
        'Empresa ou Condomínio': empresa || 'Não informado',
        'Telefone / WhatsApp': tel,
        'E-mail do Solicitante': email,
        'Cidade': cidade,
        'Tipo de Imóvel': imovel || 'Não selecionado',
        'Serviço Desejado': servico,
        'Frequência Desejada': frequencia || 'Não selecionada',
        'Área / Informações': area || 'Não informado',
        'Mensagem': mensagem || 'Nenhuma observação extra'
      };

      try {
        const endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(targetEmail);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
          // Success!
          form.style.display = 'none';
          if (success) {
            success.style.display = 'flex';
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          throw new Error(result.message || 'Erro ao processar envio.');
        }
      } catch (err) {
        console.error('Erro ao enviar formulário:', err);
        if (errorBox && errorMsg) {
          errorMsg.textContent = 'Não foi possível enviar a solicitação no momento. Verifique sua conexão ou tente novamente.';
          errorBox.style.display = 'flex';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.style.display = '';
        if (btnSpinner) btnSpinner.style.display = 'none';
      }
    });
  }

  // ---- Smooth scroll for anchor links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#whatsapp-link' || targetId === '#whatsapp-final') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ---- Telephone link ----
  function initPhoneLinks() {
    if (cfg.telefone) {
      document.querySelectorAll('#footerPhoneDisplay, #orcPhoneDisplay').forEach(el => {
        const a = document.createElement('a');
        a.href = 'tel:' + cfg.telefone.replace(/\D/g, '');
        a.textContent = el.textContent;
        a.style.color = 'inherit';
        el.replaceWith(a);
      });
    }
    if (cfg.email) {
      document.querySelectorAll('#footerEmailDisplay, #orcEmailDisplay').forEach(el => {
        const a = document.createElement('a');
        a.href = 'mailto:' + cfg.email;
        a.textContent = el.textContent;
        a.style.color = 'inherit';
        el.replaceWith(a);
      });
    }
  }

  // ---- FAQ Accordion ----
  function initFaq() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq__item');
        const isActive = item.classList.contains('active');

        // Close others
        document.querySelectorAll('.faq__item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq__question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle clicked
        if (isActive) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ---- Interactive Coverage Map (Leaflet) ----
  function initInteractiveMap() {
    const mapContainer = document.getElementById('coverageMap');
    if (!mapContainer || typeof L === 'undefined') return;

    // Database of regions & neighborhoods
    const LOCATIONS = [
      // Porto Alegre Bairros
      { id: 'moinhos', name: 'Moinhos de Vento', region: 'Porto Alegre', group: 'poa', lat: -30.0248, lng: -51.2014, desc: 'Condomínios residenciais de alto padrão e prédios comerciais.', services: 'Limpeza de Condomínios • Zeladoria • Vidros' },
      { id: 'belavista', name: 'Bela Vista', region: 'Porto Alegre', group: 'poa', lat: -30.0366, lng: -51.1945, desc: 'Edifícios residenciais e condomínios com equipe dedicada.', services: 'Limpeza de Condomínios • Áreas Comuns • Zeladoria' },
      { id: 'petropolis', name: 'Petrópolis', region: 'Porto Alegre', group: 'poa', lat: -30.0450, lng: -51.1830, desc: 'Rotas frequentes para condomínios e estabelecimentos comerciais.', services: 'Limpeza Empresarial • Zeladoria • Pós-Obra' },
      { id: 'meninodeus', name: 'Menino Deus', region: 'Porto Alegre', group: 'poa', lat: -30.0535, lng: -51.2220, desc: 'Atendimento contínuo para clínicas, condomínios e escritórios.', services: 'Limpeza Empresarial • Condomínios • Zeladoria' },
      { id: 'centro', name: 'Centro Histórico', region: 'Porto Alegre', group: 'poa', lat: -30.0326, lng: -51.2297, desc: 'Prédios comerciais, escritórios e condomínios tradicionais.', services: 'Limpeza Empresarial • Zeladoria • Vidros' },
      { id: 'montserrat', name: "Mont'Serrat", region: 'Porto Alegre', group: 'poa', lat: -30.0289, lng: -51.1930, desc: 'Rotas estruturadas para condomínios residenciais e comerciais.', services: 'Limpeza de Condomínios • Zeladoria' },
      { id: 'auxiliadora', name: 'Auxiliadora', region: 'Porto Alegre', group: 'poa', lat: -30.0205, lng: -51.1920, desc: 'Equipes uniformizadas para edifícios e lojas da região.', services: 'Limpeza Empresarial • Áreas Comuns • Zeladoria' },
      { id: 'passodareia', name: "Passo d'Areia", region: 'Porto Alegre', group: 'poa', lat: -30.0150, lng: -51.1760, desc: 'Atendimento em condomínios e centros comerciais da Zona Norte.', services: 'Limpeza de Condomínios • Empresarial' },
      { id: 'higienopolis', name: 'Higienópolis', region: 'Porto Alegre', group: 'poa', lat: -30.0185, lng: -51.1850, desc: 'Serviços especializados para condomínios e consultórios.', services: 'Limpeza de Condomínios • Zeladoria • Vidros' },
      { id: 'tresfigueiras', name: 'Três Figueiras', region: 'Porto Alegre', group: 'poa', lat: -30.0380, lng: -51.1680, desc: 'Condomínios residenciais e empresas de grande porte.', services: 'Limpeza de Condomínios • Zeladoria • Pós-Obra' },
      { id: 'zonasul', name: 'Zona Sul (Tristeza / Ipanema)', region: 'Porto Alegre', group: 'poa', lat: -30.1200, lng: -51.2400, desc: 'Condomínios horizontais, verticais e estabelecimentos comerciais.', services: 'Limpeza de Condomínios • Zeladoria' },
      { id: 'zonanorte', name: 'Zona Norte (São Geraldo / Sarandi)', region: 'Porto Alegre', group: 'poa', lat: -29.9980, lng: -51.1600, desc: 'Empresas, galpões, indústrias e condomínios.', services: 'Limpeza Empresarial • Pós-Obra • Zeladoria' },
      { id: 'zonaleste', name: 'Zona Leste (Partenon / Jardim Botânico)', region: 'Porto Alegre', group: 'poa', lat: -30.0580, lng: -51.1750, desc: 'Edifícios residenciais e centros comerciais.', services: 'Limpeza de Condomínios • Zeladoria' },

      // Região Metropolitana & Vale dos Sinos
      { id: 'canoas', name: 'Canoas', region: 'Região Metropolitana', group: 'metro', lat: -29.9180, lng: -51.1790, desc: 'Cobertura integral para condomínios, centros logísticos e empresas.', services: 'Limpeza Empresarial • Condomínios • Zeladoria' },
      { id: 'gravatai', name: 'Gravataí', region: 'Região Metropolitana', group: 'metro', lat: -29.9430, lng: -50.9920, desc: 'Atendimento corporativo e residencial com cronograma fixo.', services: 'Limpeza Empresarial • Zeladoria • Pós-Obra' },
      { id: 'cachoeirinha', name: 'Cachoeirinha', region: 'Região Metropolitana', group: 'metro', lat: -29.9510, lng: -51.0930, desc: 'Rotinas completas de limpeza para comércio e condomínios.', services: 'Limpeza de Condomínios • Empresarial' },
      { id: 'esteio', name: 'Esteio', region: 'Região Metropolitana', group: 'metro', lat: -29.8580, lng: -51.1810, desc: 'Equipes preparadas para condomínios e estabelecimentos.', services: 'Limpeza de Condomínios • Zeladoria' },
      { id: 'sapucaia', name: 'Sapucaia do Sul', region: 'Região Metropolitana', group: 'metro', lat: -29.8320, lng: -51.1460, desc: 'Serviços de conservação predial e zeladoria.', services: 'Limpeza e Conservação • Zeladoria' },
      { id: 'saoleopoldo', name: 'São Leopoldo', region: 'Vale dos Sinos', group: 'metro', lat: -29.7580, lng: -51.1480, desc: 'Atendimento a empresas do polo tecnológico e condomínios.', services: 'Limpeza Empresarial • Condomínios • Vidros' },
      { id: 'novohamburgo', name: 'Novo Hamburgo', region: 'Vale dos Sinos', group: 'metro', lat: -29.6880, lng: -51.1310, desc: 'Prestação de serviços para edifícios, escritórios e fábricas.', services: 'Limpeza Empresarial • Zeladoria • Pós-Obra' },
      { id: 'viamao', name: 'Viamão', region: 'Região Metropolitana', group: 'metro', lat: -30.0810, lng: -51.0230, desc: 'Condomínios fechados, residenciais e comércio.', services: 'Limpeza de Condomínios • Zeladoria' },
      { id: 'alvorada', name: 'Alvorada', region: 'Região Metropolitana', group: 'metro', lat: -30.0020, lng: -51.0820, desc: 'Empresas e estabelecimentos comerciais da região.', services: 'Limpeza Comercial • Pós-Obra' },
      { id: 'guaiba', name: 'Guaíba', region: 'Região Metropolitana', group: 'metro', lat: -30.1140, lng: -51.3250, desc: 'Atendimento industrial e condomínios na margem do Guaíba.', services: 'Limpeza Empresarial • Zeladoria' }
    ];

    // Initialize Leaflet Map centered on Porto Alegre
    const map = L.map('coverageMap', {
      center: [-29.98, -51.16],
      zoom: 11,
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Clean, free OpenStreetMap tiles without any watermark
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Custom Map Pin DivIcon
    const pinIcon = L.divIcon({
      className: 'custom-map-pin',
      html: '<div class="custom-map-pin__inner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Create markers and map them
    const markersMap = new Map();
    const markersGroup = L.featureGroup().addTo(map);

    function createPopupContent(loc) {
      return `
        <div class="map-popup-card">
          <div class="map-popup-card__header">
            <h4 class="map-popup-card__title">${loc.name}</h4>
            <span class="map-popup-card__badge">Ativo ✅</span>
          </div>
          <p class="map-popup-card__desc">${loc.desc}</p>
          <div class="map-popup-card__services">
            <strong>Serviços Disponíveis:</strong>
            ${loc.services}
          </div>
          <button type="button" class="map-popup-card__btn" onclick="selectRegionForQuote('${loc.name}')">
            Solicitar Orçamento nesta Região
          </button>
        </div>
      `;
    }

    LOCATIONS.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], { icon: pinIcon });
      marker.bindPopup(createPopupContent(loc), { maxWidth: 300 });
      marker.addTo(markersGroup);
      markersMap.set(loc.id, { marker, data: loc });
    });

    // Render list items in sidebar
    const listEl = document.getElementById('mapLocationsList');
    const countEl = document.getElementById('locationCount');
    let currentFilter = 'all';
    let searchQuery = '';

    function renderList() {
      if (!listEl) return;
      listEl.innerHTML = '';

      const filtered = LOCATIONS.filter(loc => {
        const matchesFilter = (currentFilter === 'all') || (loc.group === currentFilter);
        const matchesSearch = !searchQuery || loc.name.toLowerCase().includes(searchQuery) || loc.region.toLowerCase().includes(searchQuery);
        return matchesFilter && matchesSearch;
      });

      if (countEl) {
        countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'local' : 'locais'}`;
      }

      if (filtered.length === 0) {
        listEl.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--gray-500); font-size: 13px;">Nenhum local encontrado para a busca.</div>';
        return;
      }

      filtered.forEach(loc => {
        const item = document.createElement('div');
        item.className = 'map-loc-item';
        item.dataset.id = loc.id;
        item.innerHTML = `
          <div class="map-loc-item__left">
            <div class="map-loc-item__icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <strong class="map-loc-item__name">${loc.name}</strong>
              <span class="map-loc-item__sub">${loc.region}</span>
            </div>
          </div>
          <span class="map-loc-item__tag">Ativo</span>
        `;

        item.addEventListener('click', () => {
          document.querySelectorAll('.map-loc-item').forEach(el => el.classList.remove('selected'));
          item.classList.add('selected');

          const entry = markersMap.get(loc.id);
          if (entry) {
            map.flyTo([loc.lat, loc.lng], 14, { duration: 1 });
            setTimeout(() => entry.marker.openPopup(), 600);
          }
        });

        listEl.appendChild(item);
      });
    }

    renderList();

    // Filter Buttons logic
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.map-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'all';

        // Update markers visibility
        const visibleMarkers = [];
        LOCATIONS.forEach(loc => {
          const entry = markersMap.get(loc.id);
          if (!entry) return;
          const isVisible = (currentFilter === 'all') || (loc.group === currentFilter);
          if (isVisible) {
            if (!map.hasLayer(entry.marker)) map.addLayer(entry.marker);
            visibleMarkers.push(entry.marker);
          } else {
            if (map.hasLayer(entry.marker)) map.removeLayer(entry.marker);
          }
        });

        renderList();

        if (visibleMarkers.length > 0) {
          const group = L.featureGroup(visibleMarkers);
          map.fitBounds(group.getBounds().pad(0.12), { animate: true, duration: 1 });
        }
      });
    });

    // Live search input
    const searchInput = document.getElementById('mapSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').trim().toLowerCase();
        renderList();
      });
    }

    // Reset Map View button
    const resetBtn = document.getElementById('mapResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        map.fitBounds(markersGroup.getBounds().pad(0.1), { animate: true, duration: 1 });
      });
    }

    // Initial fit bounds
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(markersGroup.getBounds().pad(0.08));
    }, 400);

    // Global helper for popup CTA button
    window.selectRegionForQuote = function(regionName) {
      const form = document.getElementById('orcamentoForm');
      const orcSection = document.getElementById('orcamento');
      if (orcSection) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
        const top = orcSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }

      if (form) {
        const cidadeInput = form.querySelector('#cidade');
        if (cidadeInput && (!cidadeInput.value || cidadeInput.value === 'Sua cidade')) {
          cidadeInput.value = regionName;
          cidadeInput.classList.remove('error');
        }
        const nomeInput = form.querySelector('#nome');
        if (nomeInput) nomeInput.focus();
      }
    };
  }

  // ---- ATENDIMENTO VIRTUAL HUMANIZADO 24H (CONSULTORA MARIANA HRC) ----
  function initChatbot() {
    const toggleBtn  = document.getElementById('chatbotToggleBtn');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeBtn   = document.getElementById('chatbotCloseBtn');
    const form       = document.getElementById('chatbotForm');
    const input      = document.getElementById('chatbotInput');
    const body       = document.getElementById('chatbotBody');
    const typing     = document.getElementById('chatTyping');
    const badge      = document.getElementById('chatbotUnreadBadge');
    const imgAvatar  = toggleBtn?.querySelector('.chatbot-float__img');
    const onlineInd  = toggleBtn?.querySelector('.chatbot-float__online-indicator');
    const closeIcon  = toggleBtn?.querySelector('.chatbot-float__close-icon');

    if (!toggleBtn || !chatWindow || !form || !body) return;

    let isOpen = false;

    // Estado da Conversa Humanizada
    const chatState = {
      userName: null,
      askedName: true,
      lastTopic: null,
      turnCount: 0
    };

    function openChat() {
      isOpen = true;
      chatWindow.style.display = 'flex';
      if (badge) badge.style.display = 'none';
      if (imgAvatar) imgAvatar.style.display = 'none';
      if (onlineInd) onlineInd.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'flex';
      setTimeout(() => {
        if (input) input.focus();
        body.scrollTop = body.scrollHeight;
      }, 100);
    }

    function closeChat() {
      isOpen = false;
      chatWindow.style.display = 'none';
      if (imgAvatar) imgAvatar.style.display = 'block';
      if (onlineInd) onlineInd.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }

    toggleBtn.addEventListener('click', () => {
      isOpen ? closeChat() : openChat();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeChat);
    }

    function appendUserMessage(text) {
      const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg--user';
      msgDiv.innerHTML = `
        <div class="chat-msg__bubble">
          <p>${escapeHtml(text)}</p>
        </div>
        <span class="chat-msg__time">${timeStr}</span>
      `;
      body.appendChild(msgDiv);
      body.scrollTop = body.scrollHeight;
    }

    function appendBotMessage(htmlContent) {
      const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-msg chat-msg--bot';
      msgDiv.innerHTML = `
        <div class="chat-msg__avatar-mini">
          <img src="atendente-hrc.jpg" alt="Mariana" />
        </div>
        <div class="chat-msg__content-wrap">
          <div class="chat-msg__bubble">
            ${htmlContent}
          </div>
          <span class="chat-msg__time">${timeStr}</span>
        </div>
      `;
      body.appendChild(msgDiv);
      body.scrollTop = body.scrollHeight;
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    // Extrator Inteligente de Nome
    function extractName(text) {
      const clean = text.trim();
      const blacklist = [
        'oi', 'ola', 'olá', 'opa', 'hey', 'orcamento', 'orçamento', 'preco', 'preço', 'valor',
        'limpeza', 'condominio', 'condomínio', 'empresa', 'zelador', 'zeladoria', 'vidro',
        'obra', 'sim', 'nao', 'não', 'bom', 'boa', 'dia', 'tarde', 'noite', 'quero', 'tudo',
        'bem', 'ajuda', 'contato', 'whatsapp', 'whats', 'obrigado', 'obrigada', 'valeu', 'quanto',
        'gostaria', 'preciso', 'favor', 'como', 'funciona', 'onde', 'atende', 'solicitar'
      ];

      // Regex para frases como "meu nome é fulano", "me chamo fulano", "sou o fulano"
      const phrasePatterns = [
        /(?:meu nome [eé]|me chamo|pode me chamar de|sou [oa]|aqui [eé] [oa]|chamo-me)\s+([a-zA-ZÀ-ÿ]{2,20})/i,
        /^sou\s+([a-zA-ZÀ-ÿ]{2,20})/i
      ];

      for (const pat of phrasePatterns) {
        const m = clean.match(pat);
        if (m && m[1]) {
          const cand = m[1].trim().toLowerCase();
          if (!blacklist.includes(cand)) {
            return m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
          }
        }
      }

      // Se foi digitado apenas 1 ou 2 palavras (ex: "Henrique" ou "Henrique Rocha")
      const words = clean.split(/\s+/).map(w => w.replace(/[^\wÀ-ÿ]/g, ''));
      if (words.length >= 1 && words.length <= 3) {
        const first = words[0].toLowerCase();
        if (!blacklist.includes(first) && first.length >= 2 && !/[0-9]/.test(first)) {
          return words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();
        }
      }

      return null;
    }

    // Gerador de Resposta Humanizada e Conversacional
    function getBotResponse(rawText) {
      const text = rawText.trim();
      const q = text.toLowerCase();
      const waUrl = getWhatsAppUrl();
      chatState.turnCount++;

      // 1. Verificar se o usuário informou o nome
      if (!chatState.userName) {
        const detectedName = extractName(text);
        if (detectedName) {
          chatState.userName = detectedName;
          if (input) input.placeholder = `Digite sua mensagem, ${detectedName}...`;

          return `
            <p>Muito prazer em te conhecer, <strong>${detectedName}</strong>! É uma satisfação falar com você! 🤝</p>
            <p>Me conte um pouquinho: você procura soluções de limpeza para <strong>seu condomínio</strong>, <strong>sua empresa ou escritório</strong>, <strong>uma limpeza pós-obra</strong> ou gostaria de tirar alguma dúvida específica?</p>
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:10px;">
              <button type="button" class="chat-chip" data-query="condominios">🏢 Meu Condomínio</button>
              <button type="button" class="chat-chip" data-query="empresas">💼 Minha Empresa</button>
              <button type="button" class="chat-chip" data-query="zeladoria">🛡️ Zeladoria</button>
              <button type="button" class="chat-chip" data-query="pos-obra">🔨 Pós-Obra</button>
              <button type="button" class="chat-chip" data-query="orcamento">📝 Fazer Orçamento</button>
              <button type="button" class="chat-chip" data-query="whatsapp">💬 Falar no WhatsApp</button>
            </div>
          `;
        }
      }

      // Montar saudação personalizada com o nome (se já soubermos)
      const uName = chatState.userName ? `, <strong>${chatState.userName}</strong>` : '';
      const askNameReminder = !chatState.userName ? `
        <p style="margin-top:10px; font-size:12.5px; color:var(--blue-dark); background:#eff6ff; padding:8px 12px; border-radius:10px; border-left:3px solid var(--blue);">
          💬 <em>Aliás, ainda não me disse o seu nome... Como posso te chamar para te atender com mais carinho?</em>
        </p>
      ` : '';

      // 2. Intent: Agradecimentos / Despedidas
      if (q.includes('obrigad') || q.includes('valeu') || q.includes('show') || q.includes('perfeito') || q.includes('excelente') || q.includes('ótimo') || q.includes('otimo') || q.includes('tchau') || q.includes('ate logo') || q.includes('abraço')) {
        return `
          <p>Por nada${uName}! Fico imensamente feliz em ajudar! ✨</p>
          <p>Se você quiser agendar uma visita técnica sem compromisso ou receber uma proposta detalhada, nós estamos sempre por aqui.</p>
          <p>Tenha um dia maravilhoso!</p>
          ${waUrl !== '#' ? `
          <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
            💬 Salvar nosso WhatsApp
          </a>` : ''}
        `;
      }

      // 3. Intent: Cumprimentos / Saudações isoladas ("oi", "tudo bem", etc.)
      if (/^(oi|ola|olá|opa|hey|bom dia|boa tarde|boa noite|tudo bem|tudo bom|salve)/i.test(q) && q.length < 25) {
        if (chatState.userName) {
          return `
            <p>Olá${uName}! Tudo ótimo por aqui! 😊</p>
            <p>Em que posso te ajudar hoje? Deseja uma proposta para <strong>condomínio</strong>, <strong>empresa</strong>, <strong>zeladoria</strong> ou <strong>pós-obra</strong>?</p>
          `;
        }
      }

      // 4. Intent: Condomínios / Prédios / Síndicos
      if (q.includes('condominio') || q.includes('condomínio') || q.includes('sindico') || q.includes('síndico') || q.includes('predio') || q.includes('prédio') || q.includes('residencial') || q.includes('portaria')) {
        chatState.lastTopic = 'condominio';
        return `
          <p>Excelente escolha${uName}! Nós somos especialistas em terceirização para condomínios residenciais e comerciais em Porto Alegre e Região Metropolitana. 🏢</p>
          <p>Cuidamos de tudo: <strong>halls de entrada, escadas, elevadores, garagens, salão de festas e áreas de lazer</strong> com rotinas organizadas.</p>
          <p>O maior benefício para o síndico é a <strong>tranquilidade total</strong>: nossa equipe é 100% registrada e uniformizada, e em caso de falta ou férias, nós garantimos a <strong>reposição imediata</strong> do colaborador sem custos adicionais!</p>
          <p>O seu condomínio é residencial ou comercial? Em qual bairro ou cidade ele fica?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#condominios');">
              📄 Conhecer Proposta para Condomínios
            </button>
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Falar com Especialista no WhatsApp
            </a>` : ''}
          </div>
          ${askNameReminder}
        `;
      }

      // 5. Intent: Empresas / Escritórios / Lojas / Clínicas
      if (q.includes('empresa') || q.includes('escritorio') || q.includes('escritório') || q.includes('loja') || q.includes('clinica') || q.includes('clínica') || q.includes('comercial') || q.includes('corporativ') || q.includes('sala')) {
        chatState.lastTopic = 'empresa';
        return `
          <p>Com certeza${uName}! Para empresas e clínicas, sabemos o quanto a primeira impressão e a higienização impecável impactam clientes e colaboradores. 💼</p>
          <p>Nós trabalhamos com <strong>horários totalmente flexíveis</strong> (matutino, noturno ou finais de semana) para manter tudo limpo e organizado sem interromper o expediente de trabalho de vocês.</p>
          <p>Qual é o tipo do seu negócio e com que frequência você gostaria da equipe (diária, dias alternados ou semanal)?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#empresas');">
              🏢 Ver Soluções para Empresas
            </button>
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Solicitar no WhatsApp
            </a>` : ''}
          </div>
          ${askNameReminder}
        `;
      }

      // 6. Intent: Zeladoria / Zelador
      if (q.includes('zelador') || q.includes('zeladoria')) {
        chatState.lastTopic = 'zeladoria';
        return `
          <p>O serviço de zeladoria é essencial${uName}! O zelador da HRC atua como o braço direito do síndico e dos gestores no dia a dia. 🛡️</p>
          <p>Ele acompanha o funcionamento geral do condomínio, inspeciona instalações elétricas e hidráulicas básicas, recebe prestadores de serviço e garante a conservação das áreas compartilhadas.</p>
          <p>Você gostaria de contratar a zeladoria junto com a equipe de limpeza ou precisa apenas do serviço de zelador?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#orcamento');">
              📝 Solicitar Proposta de Zeladoria
            </button>
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Tirar Dúvidas no WhatsApp
            </a>` : ''}
          </div>
          ${askNameReminder}
        `;
      }

      // 7. Intent: Pós-Obra / Reforma / Construção
      if (q.includes('pos-obra') || q.includes('pós obra') || q.includes('pos obra') || q.includes('pós-obra') || q.includes('obra') || q.includes('reforma') || q.includes('pintura')) {
        chatState.lastTopic = 'pos_obra';
        return `
          <p>A limpeza pós-obra é uma das nossas grandes especialidades${uName}! 🔨✨</p>
          <p>Nossa equipe entra com maquinário e produtos profissionais para retirar todo o pó fino de gesso, respingos de tinta, restos de cimento e rejuntes em pisos, vidraças, rodapés e sanitários, deixando o ambiente <strong>100% pronto para moradia imediata ou inauguração comercial</strong>.</p>
          <p>O seu espaço é residencial ou comercial? Quantos metros quadrados tem aproximadamente?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#orcamento');">
              📝 Orçamento para Pós-Obra
            </button>
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Falar no WhatsApp
            </a>` : ''}
          </div>
          ${askNameReminder}
        `;
      }

      // 8. Intent: Limpeza de Vidros
      if (q.includes('vidro') || q.includes('vidros') || q.includes('janela') || q.includes('fachada') || q.includes('vitrine')) {
        chatState.lastTopic = 'vidros';
        return `
          <p>Cuidamos sim${uName}! Fazemos a limpeza técnica de superfícies envidraçadas, vitrines, janelas e divisórias internas com produtos específicos anti-manchas e equipamentos de segurança. ✨</p>
          <p>Você gostaria de incluir os vidros em um contrato contínuo ou precisa de um atendimento pontual?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#servicos');">
              🧹 Conhecer Nossos Serviços
            </button>
          </div>
          ${askNameReminder}
        `;
      }

      // 9. Intent: Regiões / Bairros / Cidades / Onde atendem
      if (q.includes('regiao') || q.includes('região') || q.includes('bairro') || q.includes('cidade') || q.includes('porto alegre') || q.includes('canoas') || q.includes('vale') || q.includes('onde') || q.includes('local') || q.includes('atendem')) {
        return `
          <p>Nós atendemos em <strong>todos os bairros de Porto Alegre</strong> (Zona Central, Moinhos de Vento, Bela Vista, Petrópolis, Menino Deus, Zona Sul, Zona Norte, etc.) e em toda a <strong>Região Metropolitana</strong>${uName}! 📍</p>
          <p>Cidades como: <strong>Canoas, Esteio, Sapucaia, São Leopoldo, Novo Hamburgo, Gravataí, Cachoeirinha, Viamão e Guaíba</strong>.</p>
          <p>Em qual cidade ou bairro fica o seu imóvel?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#regioes');">
              🗺️ Ver Mapa de Atendimento
            </button>
          </div>
          ${askNameReminder}
        `;
      }

      // 10. Intent: Orçamento / Preços / Valores / Quanto custa / Diária
      if (q.includes('orçamento') || q.includes('orcamento') || q.includes('preço') || q.includes('preco') || q.includes('valor') || q.includes('custo') || q.includes('quanto') || q.includes('tabela') || q.includes('diaria') || q.includes('diária')) {
        return `
          <p>Com maior prazer${uName}! Para que a gente consiga te passar o valor mais justo e vantajoso, nossa equipe avalia:</p>
          <ul>
            <li>O tamanho aproximado do espaço (ou número de andares/salas);</li>
            <li>A frequência necessária (diária, semanal, quinzenal ou pontual);</li>
            <li>O tipo de serviço (condomínio, empresarial, zeladoria, vidros ou pós-obra).</li>
          </ul>
          <p>Podemos calcular uma estimativa agora mesmo! Você prefere preencher nosso formulário rápido ou me chamar no WhatsApp?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#orcamento');">
              📝 Preencher Formulário
            </button>
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Falar no WhatsApp
            </a>` : ''}
          </div>
          ${askNameReminder}
        `;
      }

      // 11. Intent: WhatsApp / Atendente Humano / Telefone
      if (q.includes('whatsapp') || q.includes('whats') || q.includes('telefone') || q.includes('humano') || q.includes('falar') || q.includes('contato') || q.includes('ligar') || q.includes('celular') || q.includes('numero')) {
        return `
          <p>Com certeza${uName}! Nossa equipe humana de coordenação está prontinha no WhatsApp para tirar qualquer dúvida em tempo real e montar sua proposta. 📲</p>
          ${waUrl !== '#' ? `
          <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none; margin-top:6px;">
            💬 Abrir Conversa no WhatsApp
          </a>` : '<p>Nosso WhatsApp estará disponível em instantes.</p>'}
          ${askNameReminder}
        `;
      }

      // 12. Se o usuário respondeu dados como bairros, metragens, andares ou confirmações
      if (q.includes('porto alegre') || q.includes('canoas') || q.includes('gravatai') || q.includes('gravataí') || q.includes('moinhos') || q.includes('centro') || q.includes('bela vista') || q.includes('petropolis') || q.includes('andar') || q.includes('andares') || q.includes('bloco') || q.includes('m2') || q.includes('metros') || q.includes('diario') || q.includes('diário') || q.includes('semana') || q.includes('sim') || q.includes('residencial') || q.includes('comercial')) {
        return `
          <p>Perfeito${uName}! Já anotei esses detalhes aqui. 📝</p>
          <p>Nós atendemos espaços exatamente com essas características na sua região, com supervisão constante e garantia de reposição de equipe.</p>
          <p>Para te enviarmos a proposta formalizada ou agendarmos uma rápida visita técnica sem compromisso, você prefere me chamar no WhatsApp ou preencher o formulário?</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
            ${waUrl !== '#' ? `
            <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
              💬 Enviar no WhatsApp
            </a>` : ''}
            <button type="button" class="chat-action-btn" onclick="scrollToSection('#orcamento');">
              📝 Preencher Formulário
            </button>
          </div>
          ${askNameReminder}
        `;
      }

      // 13. Fallback Conversacional e Consultivo
      return `
        <p>Entendi perfeitamente${uName}! Como cada espaço tem particularidades únicas, nós elaboramos soluções sob medida para você.</p>
        <p>Como você prefere dar o próximo passo?</p>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
          <button type="button" class="chat-action-btn" onclick="scrollToSection('#orcamento');">
            📝 Solicitar Orçamento
          </button>
          ${waUrl !== '#' ? `
          <a href="${waUrl}" target="_blank" rel="noopener" class="chat-action-btn chat-action-btn--wa" style="display:inline-flex; text-decoration:none;">
            💬 Conversar no WhatsApp
          </a>` : ''}
        </div>
        ${askNameReminder}
      `;
    }

    function processUserInput(text) {
      if (!text || !text.trim()) return;
      appendUserMessage(text.trim());
      if (input) input.value = '';

      if (typing) typing.style.display = 'flex';
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        if (typing) typing.style.display = 'none';
        const botReply = getBotResponse(text);
        appendBotMessage(botReply);
      }, 550);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (input?.value || '').trim();
      if (val) processUserInput(val);
    });

    // Quick Action Chips listener
    body.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-chip');
      if (chip) {
        const query = chip.dataset.query || chip.textContent;
        processUserInput(chip.textContent.replace(/[^\w\sÀ-ÿ]/g, '').trim());
      }
    });

    // Helper to scroll smoothly to section from inside chat
    window.scrollToSection = function(selector) {
      const target = document.querySelector(selector);
      if (target) {
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };
  }

  // ---- Init ----
  function init() {
    populateConfig();
    initStickyHeader();
    initMobileMenu();
    initAnimations();
    initActiveNav();
    initInteractiveMap();
    initChatbot();
    initFaq();
    initForm();
    initSmoothScroll();
    initPhoneLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
