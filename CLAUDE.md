# dekatalysator.nl — werkafspraken voor Claude

- Zakelijke one-pager voor werkgevers, HR, casemanagers en bedrijfsartsen. Een referentie, geen marketingsite.
- Cloudflare Worker, zelfde opzet als onlinebrainspotting.nl en norwayretreat.com: `public/` = pagina en assets,
  `src/index.js` = alleen redirects (oude WordPress-paden), `wrangler.jsonc` = config.
- Handgeschreven statische HTML in `public/index.html`; geen bouwstap, geen zoekindex, geen formulier, geen cookies.
  Daardoor is er ook geen cookiebanner en geen GTM nodig. Voeg je ooit analytics of embeds toe: dan wel
  CookieConsent zoals op de andere sites.
- Stijl in `public/assets/kat-vN.css`; bij wijziging N ophogen en de verwijzingen in index.html en 404.html aanpassen.
- Workernaam `dekatalysator` niet wijzigen zodra hij bestaat.
- Inhoudelijke grenzen: geen trauma- of therapieframing als hoofdboodschap, geen cliëntverhalen of testimonials,
  geen tarieven ("offerte op maat"), geen feiten over Lars die niet van hem komen.
- Nederlands, zonder em-dashes, actieve werkwoorden.
- Houd LEESMIJ.md bij met een korte changelog.
