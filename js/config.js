/* ============================================================
   NOMĒ WEBSITE SETTINGS — the only file to edit for day-to-day changes
   ============================================================ */
window.NOME_CONFIG = {

  /* SALES MODE
     'preview' : no partner signed yet. Gift buttons say "Enquire about this gift" (WhatsApp). No orders taken.
     'partner' : gifting partner live. Buttons go to the partner's NOMĒ page. No orders taken here.
     'direct'  : NOT BUILT YET. Only switch after the exclusivity agreement has ended and been checked. */
  salesMode: 'preview',

  /* GIFTING PARTNER (used in 'partner' mode) */
  partner: {
    name: '',                       // e.g. 'Floward'
    url: '',                        // the partner's NOMĒ product page
    logo: '',                       // optional, e.g. 'images/partner-logo.png'
    passesPersonalisation: false    // true ONLY if the partner's page really accepts ?occasion=&name=&message=
  },

  /* PRICE (shown as recommended retail price) */
  rrp: 299,
  currency: 'AED',

  /* THE THREE GIFTS (one box, told apart by the clear lid sticker)
     status: short note shown on the gift, e.g. 'Coming 2027'. Empty = no note. */
  gifts: {
    him:  { name: 'For Him',       sticker: 'FOR HIM',       status: '' },
    her:  { name: 'For Her',       sticker: 'FOR HER',       status: 'Coming 2027' },
    both: { name: 'For Him & Her', sticker: 'FOR HIM & HER', status: 'Coming 2027' }
  },

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

  /* MAILING LIST ("Keep Me Updated")
     listEndpoint: the Brevo (or similar) form URL. Empty = sign-ups open WhatsApp instead,
     and nothing on the site claims automatic emails. */
  listEndpoint: '',
  acceptingPartners: false,         // false = /become-a-partner says new partnerships are not being accepted

  /* PERSONALISATION LIMITS (fit the band's printing space) */
  nameMax: 26,
  messageMax: 38,
  cardMax: 300,                     // message card inside the box
  signMax: 40,                      // card sign-off, e.g. 'With love, Your Family'
  cardTheme: 'white',               // 'white' (black text) or 'black' (silver text)

  /* ANALYTICS — loaded only after the visitor accepts cookies */
  ga4: '',                          // e.g. 'G-XXXXXXXXXX'
  metaPixel: ''                     // e.g. '1234567890'
};
