/* =====================================================================
   VOLTEDGE ENERGY — script.js
   Concept website designed by Local Edge. Vanilla JavaScript, no dependencies.

   CONFIGURATION: fill in the values below to switch features on.
   Leave a value empty ('') and that feature stays off, so the site never
   shows a contact route that does not exist.
   ===================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    // WhatsApp number: digits only, with country code, no + or spaces.
    // Example for a Zimbabwe number: '263771234567'. Empty = WhatsApp links are hidden.
    whatsappNumber: '',

    // Phone number for a tap-to-call link, same format. Empty = no phone link.
    phone: '',

    // Contact email. Empty = no email link.
    email: '',

    // Form service endpoint (for example a Formspree form URL such as
    // 'https://formspree.io/f/abcdwxyz'). Empty = the form runs in demo mode
    // (or opens WhatsApp when a WhatsApp number is set).
    formEndpoint: ''
  };

  /* ---------- Helpers ---------- */
  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var waNumber = digits(CONFIG.whatsappNumber);
  var hasWhatsApp = waNumber.length >= 8 && waNumber.length <= 15;
  var phoneDigits = digits(CONFIG.phone);
  var hasPhone = phoneDigits.length >= 8 && phoneDigits.length <= 15;
  var hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(CONFIG.email || '');
  var hasEndpoint = /^https:\/\//.test(CONFIG.formEndpoint || '');

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state ---------- */
  var header = $('#site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = $('.nav__toggle');
  var menu = $('#primary-nav');
  var toggleLabel = toggle ? $('[data-toggle-label]', toggle) : null;
  var desktop = window.matchMedia('(min-width: 900px)');

  function setMenu(open, returnFocus) {
    if (!toggle || !menu) return;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $all('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
    });
    var onBreakpoint = function () { if (desktop.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);
  }

  /* ---------- Scroll reveal (respects reduced motion) ---------- */
  var reveals = $all('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden if the observer is delayed.
    window.setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }, 4000);
  }

  /* ---------- Footer contact details and WhatsApp (only when configured) ---------- */
  var footerContact = $('#footer-contact');
  if (footerContact && (hasWhatsApp || hasPhone || hasEmail)) {
    footerContact.textContent = '';
    var addLink = function (label, href, external) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.textContent = label;
      a.href = href;
      if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      li.appendChild(a);
      footerContact.appendChild(li);
    };
    if (hasWhatsApp) addLink('WhatsApp us', 'https://wa.me/' + waNumber, true);
    if (hasPhone) addLink('Call +' + phoneDigits, 'tel:+' + phoneDigits);
    if (hasEmail) addLink(CONFIG.email, 'mailto:' + CONFIG.email);
  }

  var quoteAlt = $('#quote-alt');
  if (quoteAlt && hasWhatsApp) {
    quoteAlt.textContent = 'Prefer to chat? ';
    var altLink = document.createElement('a');
    altLink.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent('Hello VoltEdge Energy, I would like to ask about a quotation.');
    altLink.target = '_blank';
    altLink.rel = 'noopener noreferrer';
    altLink.textContent = 'Message us on WhatsApp';
    quoteAlt.appendChild(altLink);
    quoteAlt.hidden = false;
  }

  /* ---------- Quote form ---------- */
  var form = $('#quote-form');
  if (!form) return;

  var status = $('#form-status');
  var demoNote = $('#demo-note');
  var submitBtn = $('#submit-btn');
  var contactInput = $('#f-contact');
  var contactLabel = $('#l-contact');
  var needSelect = $('#f-need');

  // The demonstration notice is only shown when no real destination is configured.
  if (demoNote && (hasEndpoint || hasWhatsApp)) demoNote.hidden = true;

  var METHOD_UI = {
    'Phone call': { label: 'Phone number', mode: 'tel', auto: 'tel', ph: 'e.g. 077 123 4567' },
    'WhatsApp':   { label: 'WhatsApp number', mode: 'tel', auto: 'tel', ph: 'e.g. 077 123 4567' },
    'Email':      { label: 'Email address', mode: 'email', auto: 'email', ph: 'name@example.com' }
  };

  function selectedValue(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function applyMethodUI() {
    var ui = METHOD_UI[selectedValue('method')];
    if (!ui) return;
    contactLabel.textContent = ui.label;
    contactInput.setAttribute('inputmode', ui.mode);
    contactInput.setAttribute('autocomplete', ui.auto);
    contactInput.setAttribute('placeholder', ui.ph);
  }

  $all('input[name="method"]', form).forEach(function (r) {
    r.addEventListener('change', function () {
      applyMethodUI();
      clearError('contact');
      clearError('method');
    });
  });

  // CTAs elsewhere on the page can pre-select the enquiry type.
  $all('[data-prefill]').forEach(function (link) {
    link.addEventListener('click', function () {
      var kind = link.getAttribute('data-prefill');
      var typeValue = kind === 'commercial' ? 'Commercial' : 'Residential';
      var radio = form.querySelector('input[name="type"][value="' + typeValue + '"]');
      if (radio) { radio.checked = true; clearError('type'); }
      if (kind === 'backup' && needSelect) { needSelect.value = 'Backup power during outages'; clearError('need'); }
    });
  });

  /* Validation */
  var FIELD_MAP = {
    name:    { input: '#f-name',    error: '#e-name' },
    type:    { group: 'input[name="type"]',   error: '#e-type',   box: 'fieldset' },
    need:    { input: '#f-need',    error: '#e-need' },
    method:  { group: 'input[name="method"]', error: '#e-method', box: 'fieldset' },
    contact: { input: '#f-contact', error: '#e-contact' }
  };

  function setError(key, message) {
    var map = FIELD_MAP[key];
    var err = $(map.error);
    err.textContent = message;
    if (map.input) {
      var input = $(map.input);
      input.setAttribute('aria-invalid', 'true');
    } else {
      var first = form.querySelector(map.group);
      var box = first.closest('fieldset');
      if (box) box.setAttribute('data-invalid', 'true');
    }
  }

  function clearError(key) {
    var map = FIELD_MAP[key];
    $(map.error).textContent = '';
    if (map.input) {
      $(map.input).removeAttribute('aria-invalid');
    } else {
      var box = form.querySelector(map.group).closest('fieldset');
      if (box) box.removeAttribute('data-invalid');
    }
  }

  function validate() {
    var errors = {};
    var name = $('#f-name').value.trim();
    var contact = contactInput.value.trim();
    var method = selectedValue('method');

    if (name.length < 2) errors.name = 'Please enter your name.';
    if (!selectedValue('type')) errors.type = 'Please choose residential or commercial.';
    if (!needSelect.value) errors.need = 'Please choose your main energy requirement.';
    if (!method) errors.method = 'Please choose how you would like to be contacted.';

    if (!contact) {
      errors.contact = method === 'Email' ? 'Please enter your email address.' : 'Please enter a phone or WhatsApp number, or an email address.';
    } else if (method === 'Email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact)) errors.contact = 'Please enter a valid email address, for example name@example.com.';
    } else if (method) {
      var d = digits(contact);
      if (!/^[+\d][\d\s()+\-]*$/.test(contact) || d.length < 7 || d.length > 15) errors.contact = 'Please enter a phone number with 7 to 15 digits.';
    }
    return errors;
  }

  // Clear errors as the visitor corrects them.
  $('#f-name').addEventListener('input', function () { clearError('name'); });
  needSelect.addEventListener('change', function () { clearError('need'); });
  contactInput.addEventListener('input', function () { clearError('contact'); });
  $all('input[name="type"]', form).forEach(function (r) { r.addEventListener('change', function () { clearError('type'); }); });

  /* Status messages (built with textContent, never innerHTML) */
  function showStatus(kind, title, text, extra) {
    status.className = 'form__status is-' + kind;
    status.textContent = '';
    if (title) { var s = document.createElement('strong'); s.textContent = title; status.appendChild(s); }
    if (text) { var p = document.createElement('span'); p.textContent = text; status.appendChild(p); }
    if (extra) status.appendChild(extra);
    status.focus();
  }

  function summaryList(data) {
    var dl = document.createElement('dl');
    [['Name', data.name], ['Enquiry for', data.type], ['Main requirement', data.need],
     ['Preferred contact', data.method + ': ' + data.contact], ['Details', data.details || 'None given']]
      .forEach(function (row) {
        var dt = document.createElement('dt'); dt.textContent = row[0];
        var dd = document.createElement('dd'); dd.textContent = row[1];
        dl.appendChild(dt); dl.appendChild(dd);
      });
    return dl;
  }

  function whatsappMessage(data) {
    return [
      'Hello VoltEdge Energy, I would like a quotation.',
      'Name: ' + data.name,
      'Enquiry for: ' + data.type,
      'Main requirement: ' + data.need,
      'Preferred contact: ' + data.method + ' (' + data.contact + ')',
      data.details ? 'Details: ' + data.details : ''
    ].filter(Boolean).join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    Object.keys(FIELD_MAP).forEach(clearError);
    var errors = validate();
    var keys = Object.keys(errors);

    if (keys.length) {
      keys.forEach(function (k) { setError(k, errors[k]); });
      var firstKey = keys[0];
      var map = FIELD_MAP[firstKey];
      var focusEl = map.input ? $(map.input) : form.querySelector(map.group);
      if (focusEl) focusEl.focus();
      showStatus('error', 'Please check the form.', keys.length === 1 ? 'One field needs attention.' : keys.length + ' fields need attention.');
      // Keep focus on the first problem field rather than the summary.
      if (focusEl) focusEl.focus();
      return;
    }

    var data = {
      name: $('#f-name').value.trim(),
      type: selectedValue('type'),
      need: needSelect.value,
      method: selectedValue('method'),
      contact: contactInput.value.trim(),
      details: $('#f-details').value.trim()
    };

    // Honeypot: real visitors never fill this in.
    if (form.elements._gotcha && form.elements._gotcha.value) return;

    if (hasEndpoint) {
      submitBtn.disabled = true;
      showStatus('success', 'Sending your enquiry…', '');
      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        showStatus('success', 'Thank you. Your enquiry has been sent.', 'We will use your preferred contact method to follow up.');
      }).catch(function () {
        showStatus('error', 'Sorry, that did not go through.', hasWhatsApp ? 'Please try again, or message us on WhatsApp instead.' : 'Please try again in a moment.');
      }).then(function () { submitBtn.disabled = false; });
      return;
    }

    if (hasWhatsApp) {
      var url = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(whatsappMessage(data));
      var link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = 'open WhatsApp';
      var wrap = document.createElement('span');
      wrap.appendChild(document.createTextNode(' If it did not open, '));
      wrap.appendChild(link);
      wrap.appendChild(document.createTextNode('.'));
      window.open(url, '_blank', 'noopener');
      showStatus('success', 'Opening WhatsApp with your enquiry.', 'Send the message there to complete your request.', wrap);
      return;
    }

    // Demo mode: be honest that nothing is sent.
    showStatus('demo', 'Demonstration only. Nothing has been sent.',
      'On a live site this is where the enquiry would be delivered. Here is what would have been sent:',
      summaryList(data));
  });
})();
