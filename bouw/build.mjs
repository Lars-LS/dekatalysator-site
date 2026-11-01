// dekatalysator.nl: bouwt public/<route>/index.html uit bouw/paginas/*.html.
// Eerste regel van elke bronpagina: <!--{"titel":…,"beschrijving":…,"actief":…,"route":…}-->
// Kop, navigatie, contactblok ({{CONTACT}}) en voet staan hieronder, op één plek.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(HIER, '..', 'public');
const CSS = '/assets/kat-v11.css';
const JS = '/assets/kat-v3.js';
const DOMEIN = 'https://dekatalysator.nl';

const NAV = [
  ['/werkwijze', 'Werkwijze', 'werkwijze'],
  ['/over-mij', 'Over mij', 'over'],
  ['/werkgevers', 'Voor werkgevers', 'werkgevers'],
  ['/contact', 'Contact', 'contact'],
];

const kop = (m) => `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${m.titel}</title>
<meta name="description" content="${m.beschrijving}">
${m.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${DOMEIN}${m.route}">`}
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:title" content="${m.titel}">
<meta property="og:description" content="${m.beschrijving}">
<meta property="og:url" content="${DOMEIN}${m.route}">
<meta property="og:image" content="${DOMEIN}${m.ogBeeld || '/optimized/kop-lars-1400w.jpg'}">
<link rel="icon" href="/favicon-48.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
${m.preload || ''}
<link rel="stylesheet" href="${CSS}">
<script src="${JS}" defer></script>
${m.jsonld ? `<script type="application/ld+json">${JSON.stringify(m.jsonld)}</script>` : ''}
</head>
<body>
<a class="overslaan" href="#inhoud">Naar de inhoud</a>

<header class="kop">
  <div class="wrap">
    <a class="merk" href="/"><picture><source type="image/webp" srcset="/optimized/logo-112.webp 1x, /optimized/logo-224.webp 2x"><img src="/optimized/logo-112.png" srcset="/optimized/logo-224.png 2x" width="96" height="112" alt=""></picture><span><b>De Katalysator</b><small>Coaching, Therapie &amp; Intervisie</small></span></a>
    <nav aria-label="Hoofdmenu">
${NAV.map(([href, label, id]) => `      <a href="${href}"${m.actief === id ? ' aria-current="page"' : ''}>${label}</a>`).join('\n')}
      <a class="knop knop--klein" href="/plan-kennismaking">Kennismaken</a>
    </nav>
  </div>
</header>

<main id="inhoud">
`;

const FORMULIER = `  <section class="paginakop contact" id="contact">
    <div class="wrap">
      <div class="contact__raster">
        <div>
          <p class="label">Contact</p>
          <h1>Neem contact op</h1>
          <p class="lead">Voor een vraag, een offerte of een kennismaking. Ik reageer meestal binnen een werkdag.</p>
          <p class="contact__kennismaking">Liever meteen een moment kiezen? <a class="verder" href="/plan-kennismaking">Plan een kennismaking</a></p>
          <p class="contact__werkgever">Werkgever, HR of casemanager? Op <a href="/werkgevers">Voor werkgevers</a> lees je hoe een traject via de werkgever loopt.</p>
        </div>
        <form class="formulier" action="/api/contact" method="post" novalidate>
          <label>Naam<input name="naam" autocomplete="name" required maxlength="120"></label>
          <label>E-mail<input name="email" type="email" autocomplete="email" required maxlength="200"></label>
          <fieldset>
            <legend>Ik ben</legend>
            <label class="keuze"><input type="radio" name="rol" value="cliënt" checked> op zoek naar coaching voor mezelf</label>
            <label class="keuze"><input type="radio" name="rol" value="werkgever"> werkgever, HR of casemanager</label>
          </fieldset>
          <label>Bericht<textarea name="bericht" rows="5" required maxlength="5000"></textarea></label>
          <label class="honing" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
          <input type="hidden" name="t" value="">
          <button class="knop" type="submit">Verstuur</button>
          <p class="formulier__melding" role="status" aria-live="polite"></p>
        </form>
      </div>
    </div>
  </section>
`;

const CONTACT = `  <section class="sectie sectie--band afsluiting" id="contact">
    <div class="wrap smal">
      <h2>Kennismaken of een vraag?</h2>
      <p>Plan een gratis kennismaking van een half uur via Zoom, of stel eerst je vraag.</p>
      <div class="knoppen"><a class="knop" href="/plan-kennismaking">Plan een kennismaking</a><a class="knop knop--rand" href="/contact">Stel een vraag</a></div>
    </div>
  </section>
`;

const VOET = `
</main>

<div class="streep" aria-hidden="true"></div>
<footer class="voet">
  <div class="wrap voet__raster">
    <div>
      <p>De Katalysator Coaching, Therapie &amp; Intervisie</p>
      <p>De Katalysator is een handelsnaam van Lars Lutje Schipholt</p>
      <p>Organisatienummer NO 931 822 632</p>
      <p>Stupulmyra 38, 3528 Hedalen, Noorwegen</p>
    </div>
    <nav aria-label="Voet">
      <a href="/">Home</a>
      <a href="/werkwijze">Werkwijze</a>
      <a href="/over-mij">Over mij</a>
      <a href="/werkgevers">Voor werkgevers</a>
      <a href="/plan-kennismaking">Plan een kennismaking</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
</footer>
</body>
</html>
`;

for (const naam of readdirSync(join(HIER, 'paginas')).filter((f) => f.endsWith('.html'))) {
  const bron = readFileSync(join(HIER, 'paginas', naam), 'utf8');
  const eerste = bron.indexOf('\n');
  const m = JSON.parse(bron.slice(4, eerste).replace(/-->\s*$/, ''));
  const contact = m.contactLicht ? CONTACT.replace('sectie sectie--band afsluiting', 'sectie afsluiting') : CONTACT;
  const inhoud = bron.slice(eerste + 1).replace('{{CONTACT}}', contact).replace('{{FORMULIER}}', FORMULIER);
  const html = kop(m) + inhoud + VOET;
  const doel = naam === 'index.html' ? join(PUBLIC, 'index.html')
    : naam === '404.html' ? join(PUBLIC, '404.html')
    : join(PUBLIC, naam.replace(/\.html$/, ''), 'index.html');
  mkdirSync(dirname(doel), { recursive: true });
  writeFileSync(doel, html);
  console.log('gebouwd:', doel.replace(PUBLIC, 'public'));
}
