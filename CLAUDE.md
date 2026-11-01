# dekatalysator.nl — werkafspraken voor Claude

- One-pager voor wie coaching zoekt bij stress en veerkracht in het werk (je-vorm, geen therapie als hoofdboodschap),
  met een eigen sectie "Via je werkgever" (#werkgevers) voor HR, casemanagers en bedrijfsartsen die de coach
  willen nagaan en een traject willen vergoeden. Sinds v2.0 (01-11-2026); daarvoor was de pagina aan werkgevers gericht.
- Cloudflare Worker, zelfde opzet als onlinebrainspotting.nl en norwayretreat.com: `public/` = pagina en assets,
  `src/index.js` = alleen redirects (oude WordPress-paden), `wrangler.jsonc` = config.
- Handgeschreven statische HTML in `public/index.html`; geen bouwstap, geen zoekindex, geen formulier, geen cookies.
  Daardoor is er ook geen cookiebanner en geen GTM nodig. Voeg je ooit analytics of embeds toe: dan wel
  CookieConsent zoals op de andere sites.
- Stijl in `public/assets/kat-vN.css`; bij wijziging N ophogen en de verwijzingen in index.html en 404.html aanpassen.
- Workernaam `dekatalysator` niet wijzigen zodra hij bestaat.
- Inhoudelijke grenzen: geen trauma- of therapieframing als hoofdboodschap, geen cliëntverhalen behalve de
  ervaringen die Lars zelf aanlevert (met naam en foto, letterlijk), voorlopig geen tarieven ("offerte op maat"),
  geen feiten over Lars die niet van hem komen. Teksten van de oude WordPress-site mogen worden hergebruikt.
- Nederlands, zonder em-dashes, actieve werkwoorden.
- Houd LEESMIJ.md bij met een korte changelog.
