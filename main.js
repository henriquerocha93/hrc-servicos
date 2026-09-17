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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

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

  // ---- Init ----
  function init() {
    populateConfig();
    initStickyHeader();
    initMobileMenu();
    initAnimations();
    initActiveNav();
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
