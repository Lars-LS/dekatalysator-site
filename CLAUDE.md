# dekatalysator.nl — werkafspraken voor Claude

- Site voor wie coaching zoekt bij stress en veerkracht in het werk (je-vorm, geen therapie als hoofdboodschap).
  Pagina's: / (start), /werkwijze (de diepte), /over-mij, /plan-kennismaking (Proton Calendar-link), /contact (formulier) en /werkgevers (ook je-vorm, nooit 'u', voor HR, casemanagers en bedrijfsartsen:
  vergoeding, traject, offerte, facturatie, vertrouwelijkheid). Deze link kan op offertes en in de mailhandtekening.
- Cloudflare Worker, zelfde opzet als onlinebrainspotting.nl en norwayretreat.com: `public/` = pagina en assets,
  `src/index.js` = alleen redirects (oude WordPress-paden), `wrangler.jsonc` = config.
- Sinds v3.0 gebouwd zoals onlinebrainspotting.nl: bron in `bouw/paginas/*.html` (eerste regel JSON-metadata),
  kop, navigatie, afsluitend blok (`{{CONTACT}}`: knoppen naar kennismaking en contact), formulier (`{{FORMULIER}}`, alleen op /contact) en voet in `bouw/build.mjs`. Bouwen met `npm run bouw`.
  Bewerk nooit `public/**/index.html` direct. Commit bron én uitvoer; Cloudflare bouwt niets.
- Contactformulier: `public/assets/kat-vN.js` post naar `/api/contact`, afgehandeld in `src/contact.js`
  (honingpot, minimale invultijd, linkfilter) en verstuurd via een eigen Resend-account naar lars@dekatalysator.nl,
  afzender formulier@dekatalysator.nl. Vereist secret RESEND_API_KEY op de Worker `dekatalysator`.
- Het mailadres staat bewust nergens op de site (spam); contact loopt via formulier en kennismakingsagenda.
- Geen cookies, geen analytics, dus geen cookiebanner. Voeg je ooit analytics of embeds toe: dan wel
  CookieConsent zoals op de andere sites.
- Stijl in `public/assets/kat-vN.css`, gedrag in `kat-vN.js`; bij wijziging N ophogen en CSS/JS in `bouw/build.mjs` aanpassen.
- Workernaam `dekatalysator` niet wijzigen zodra hij bestaat.
- Inhoudelijke grenzen: geen trauma- of therapieframing als hoofdboodschap, geen cliëntverhalen behalve de
  ervaringen die Lars zelf aanlevert (met naam en foto, letterlijk), voorlopig geen tarieven ("offerte op maat"),
  geen feiten over Lars die niet van hem komen. Teksten van de oude WordPress-site mogen worden hergebruikt.
- Nederlands, zonder em-dashes, actieve werkwoorden.
- Houd LEESMIJ.md bij met een korte changelog.
