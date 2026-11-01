import { handleContact } from './contact.js';

// dekatalysator.nl: statische one-pager. De Worker doet alleen redirects;
// al het andere komt uit public/ (ASSETS).

// Pagina's van de oude WordPress-site gaan naar de one-pager.
const NAAR_HOME = new Set([
  '/voor-wie', '/mijn-aanbod', '/contact',
  '/schrijf-je-in-op-mijn-nieuwsbrief', '/privacy-statement-de-katalysator-coaching',
  '/mijn-aanbod/je-lichaam-en-intuitie-als-kompas', '/mijn-aanbod/begeleide-intervisie',
]);

// Oude blogberichten gaan naar hetzelfde bericht op de Substack (/p/<slug>),
// het blogoverzicht naar de Substack zelf. De Bulk Redirect-lijst dekatalysatorredirects
// in Cloudflare doet voor een deel van deze paden hetzelfde en draait vóór de Worker.
const SUBSTACK = 'https://lars.lutjeschipholt.nl/';
const BLOGOVERZICHT = new Set(['/blogs', '/category/blog', '/feed']);
const OUDE_BLOGS = new Set([
  'de-angst-onder-onze-wereldcrisis', 'de-beste-reactie-op-exponentiele-versnelling',
  'de-kracht-van-bezield-realisme', 'de-kracht-van-congruentie', 'de-kracht-van-de-woestijn',
  'de-laag-van-bewustzijn-die-ai-wel-begrijpt-en-wij-vaak-niet', 'de-sleutel-tot-een-vrijer-leven',
  'de-vier-richtingen-waarin-we-onszelf-beschermen', 'handleiding-bewust-werken-met-ai',
  'in-5-stappen-meer-jezelf', 'is-jouw-jaar-ook-voorbij-gevlogen',
  'je-lijf-onthoudt-wat-je-hoofd-allang-vergeten-is', 'kun-je-trauma-helen-met-ai-of-online-trainingen',
  'trump-begrijpen-dat-is-precies-het-probleem', 'tussen-verlangen-en-werkelijkheid',
  'van-denken-naar-voelen', 'van-spiegel-naar-bondgenoot', 'waarom-ik-om-8-uur-mijn-kussen-pak',
  'wat-doet-ai-met-je-eigenheid', 'berg-in-de-storm-zijn',
]);

const NAAR_OVER = new Set(['/over-lars', '/over-lars-2']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') return handleContact(request, env);
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    const pad = url.pathname.replace(/\/+$/, '') || '/';
    if (NAAR_OVER.has(pad)) return Response.redirect(url.origin + '/over-mij', 301);
    if (NAAR_HOME.has(pad)) return Response.redirect(url.origin + '/', 301);
    const slug = pad.slice(1);
    if (OUDE_BLOGS.has(slug)) return Response.redirect(SUBSTACK + 'p/' + slug, 301);
    if (BLOGOVERZICHT.has(pad) || pad.startsWith('/blogs/') || pad.startsWith('/category/')) {
      return Response.redirect(SUBSTACK, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
