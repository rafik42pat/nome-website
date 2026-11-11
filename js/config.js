/* ============================================================
   NOMĒ WEBSITE SETTINGS — the only file to edit for day-to-day changes
   ============================================================ */
window.NOME_CONFIG = {

  /* SALES MODE
     'preview' : no partner signed yet. Buttons say "Register your interest" (WhatsApp). No orders taken.
     'partner' : exclusive gifting partner live. Buttons go to the partner's NOMĒ page. No orders taken here.
     'direct'  : NOT BUILT YET. Only switch after the exclusivity agreement has ended and been checked. */
  salesMode: 'preview',

  /* EXCLUSIVE GIFTING PARTNER (used in 'partner' mode) */
  partner: {
    name: '',                       // e.g. 'Floward'
    url: '',                        // the partner's NOMĒ product page
    logo: '',                       // optional, e.g. 'images/partner-logo.png'
    passesPersonalisation: false    // true ONLY if the partner's page really accepts ?occasion=&name=&message=
  },

  /* PRICE (shown as recommended retail price) */
  rrp: 299,
  currency: 'AED',

  /* DELIVERY LINE — leave empty until the partner's service is confirmed
     e.g. 'Personalised gifting available with 48-hour delivery in eligible areas.' */
  deliveryNote: '',

  /* CONTACT */
  whatsapp: '971553212583',
  email: 'info@nomeparfum.com',
  instagram: '',                    // e.g. 'nomeparfum'
  tiktok: '',

  /* CORPORATE & PARTNER ENQUIRIES
     formEndpoint: a Formspree (or similar) URL. Empty = enquiries open WhatsApp instead. */
  formEndpoint: '',
  acceptingPartners: false,         // false = /become-a-partner says new partnerships are not being accepted

  /* PERSONALISATION LIMITS (fit the band's printing space) */
  nameMax: 26,
  messageMax: 38,
  cardMax: 300,                     // message card inside the box

  /* ANALYTICS — loaded only after the visitor accepts cookies */
  ga4: '',                          // e.g. 'G-XXXXXXXXXX'
  metaPixel: ''                     // e.g. '1234567890'
};
