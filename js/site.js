/* Shared behaviour for every NOMĒ page: buttons by sales mode, contact links, cookie consent, analytics. */
(function () {
  const C = window.NOME_CONFIG || {};
  const $$ = s => Array.from(document.querySelectorAll(s));
  const wa = t => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
  const partnerLive = C.salesMode === 'partner' && C.partner && C.partner.url;

  /* ---------- analytics (only after consent) ---------- */
  let consent = null;
  try { consent = localStorage.getItem('nome_consent'); } catch (e) {}
  function loadAnalytics() {
    if (C.ga4 && !window.gtag) {
      const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.ga4; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', C.ga4);
    }
    if (C.metaPixel && !window.fbq) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixel); fbq('track', 'PageView');
    }
  }
  window.nomeTrack = function (name, params) {
    try { if (window.gtag) gtag('event', name, params || {}); if (window.fbq) fbq('trackCustom', name, params || {}); } catch (e) {}
  };
  if ((C.ga4 || C.metaPixel)) {
    if (consent === 'yes') loadAnalytics();
    else if (consent !== 'no') {
      const bar = document.createElement('div'); bar.className = 'consent'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Cookie consent');
      bar.innerHTML = `<p>We use cookies to understand how visitors use our site. <a href="privacy.html">Privacy policy</a></p><div><button type="button" class="btn btn-line" data-c="no">Decline</button><button type="button" class="btn btn-fill" data-c="yes">Accept</button></div>`;
      document.body.appendChild(bar);
      bar.addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; try { localStorage.setItem('nome_consent', b.dataset.c); } catch (err) {} if (b.dataset.c === 'yes') loadAnalytics(); bar.remove(); });
    }
  }

  /* ---------- call-to-action buttons ----------
     data-cta="primary"  -> main purchase button
     data-cta="gift"     -> purchase button under the personalisation preview (uses window.nomeGift()) */
  function giftDetails() { return (window.nomeGift && window.nomeGift()) || null; }
  function setCTA(a) {
    const kind = a.dataset.cta;
    if (partnerLive) {
      a.textContent = kind === 'gift' ? 'Order this gift through our exclusive partner' : 'Shop NOMĒ at our exclusive gifting partner';
      let url = C.partner.url;
      const g = giftDetails();
      if (kind === 'gift' && g && C.partner.passesPersonalisation) {
        const u = new URL(url); u.searchParams.set('occasion', g.design); if (g.name) u.searchParams.set('name', g.name); if (g.message) u.searchParams.set('message', g.message); if (g.card) u.searchParams.set('card', g.card); if (g.card && g.sign) u.searchParams.set('signoff', g.sign); url = u.toString();
      }
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
    } else {
      const closed = C.release === 'closed';
      a.textContent = kind === 'gift' ? (closed ? 'Join the next release with this gift' : 'Join the Priority List with this gift') : (closed ? 'Join the Next Release' : 'Join the Priority List');
      const g = kind === 'gift' ? giftDetails() : null;
      const intro = closed ? "Hi NOMĒ, I'd like to join the next release." : "Hi NOMĒ, I'd like to join the Priority List.";
      const t = g ? (g.presentation === 'standard'
                  ? `${intro}\nGift: ${g.giftName || 'For Him'}\nPresentation: Standard (NOMĒ Signature band)\nBand: NOMĒ Signature`
                  : `${intro}\nGift: ${g.giftName || 'For Him'}\nPresentation: Personalised\nBand: ${g.designName}\nName: ${g.name || '-'}\nMessage: ${g.message || '-'}\nFrom: ${g.sign || '-'}\nCard: ${g.card || '-'}`)
                  : intro;
      a.href = wa(t); a.target = '_blank'; a.rel = 'noopener';
    }
  }
  window.nomeRefreshCTAs = () => $$('[data-cta]').forEach(setCTA);
  if (C.release === 'closed') $$('[data-priority-link],[data-priority-btn]').forEach(el => { el.textContent = 'Join the Next Release'; });
  $$('[data-cap]').forEach(el => { if (C.monthlyCap) el.textContent = Number(C.monthlyCap).toLocaleString('en-US'); });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-cta]'); if (!a) return;
    nomeTrack(partnerLive ? 'partner_click' : 'priority_list_click', { placement: a.dataset.placement || a.dataset.cta, partner: partnerLive ? C.partner.name : '' });
  });

  /* ---------- text that depends on settings ---------- */
  $$('[data-rrp]').forEach(el => el.textContent = `${C.currency} ${C.rrp}`);
  $$('[data-gift-status]').forEach(el => { const t = (C.gifts && C.gifts[el.dataset.giftStatus] || {}).status; el.textContent = t || ''; el.hidden = !t; });
  $$('[data-partner-note]').forEach(el => {
    if (partnerLive) el.textContent = C.partner.passesPersonalisation
      ? `Your chosen band, name, message and card will be sent to ${C.partner.name} with your order.`
      : `You'll enter your band choice, name, message and card on ${C.partner.name}'s website when you order.`;
    else el.textContent = 'NOMĒ is launching soon through our exclusive gifting partner. Register your interest and we will let you know first.';
  });
  $$('[data-partner-name]').forEach(el => el.textContent = partnerLive ? C.partner.name : 'our exclusive gifting partner');
  $$('[data-partner-logo]').forEach(el => { if (partnerLive && C.partner.logo) { el.src = C.partner.logo; el.alt = C.partner.name; el.hidden = false; } });
  $$('[data-delivery]').forEach(el => { if (C.deliveryNote) { el.textContent = C.deliveryNote; el.hidden = false; } });
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa || 'Hi NOMĒ'); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-email]').forEach(a => { a.href = 'mailto:' + C.email; if (!a.textContent.trim()) a.textContent = C.email; });
  $$('[data-instagram]').forEach(a => { if (C.instagram) { a.href = 'https://instagram.com/' + C.instagram; a.hidden = false; } else a.hidden = true; });
  $$('[data-tiktok]').forEach(a => { if (C.tiktok) { a.href = 'https://www.tiktok.com/@' + C.tiktok; a.hidden = false; } else a.hidden = true; });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  $$('[data-partners-closed]').forEach(el => el.hidden = !!C.acceptingPartners);

  /* ---------- enquiry forms (corporate / partner) ---------- */
  $$('form[data-enquiry]').forEach(f => {
    const status = f.querySelector('.form-status');
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const kind = f.dataset.enquiry, data = new FormData(f);
      nomeTrack(kind + '_enquiry');
      if (C.formEndpoint) {
        data.append('_subject', `NOMĒ ${kind} enquiry`);
        try {
          const r = await fetch(C.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
          if (!r.ok) throw new Error();
          f.reset(); status.textContent = kind === 'priority' ? 'Thank you. You are on the Priority List and we will let you know when the next release opens.' : 'Thank you. We have received your enquiry and will reply within 2 working days.';
        } catch (err) { status.textContent = 'Sorry, something went wrong. Please message us on WhatsApp instead.'; }
        return;
      }
      const lines = [kind === 'priority' ? 'Hi NOMĒ, please add me to the Priority List.' : `NOMĒ ${kind} enquiry`];
      for (const [k, v] of data.entries()) if (typeof v === 'string' && v.trim()) { const lb = f.querySelector(`[name="${k}"]`).closest('label'); lines.push(`${lb.dataset.label || lb.firstChild.textContent.trim()}: ${v}`); }
      const hasFile = Array.from(data.values()).some(v => v instanceof File && v.size);
      if (hasFile) lines.push('(I will send our logo in this chat.)');
      window.open(wa(lines.join('\n')), '_blank');
      status.textContent = hasFile ? 'WhatsApp has opened with your enquiry. Please attach your logo in the chat.' : kind === 'priority' ? 'WhatsApp has opened. Send the message to join the Priority List.' : 'WhatsApp has opened with your enquiry.';
    });
  });

  window.nomeRefreshCTAs();
})();
