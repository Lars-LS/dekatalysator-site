// dekatalysator.nl: statische one-pager. De Worker doet alleen redirects;
// al het andere komt uit public/ (ASSETS).

// Pagina's van de oude WordPress-site gaan naar de one-pager.
const NAAR_HOME = new Set([
  '/over-lars', '/over-lars-2', '/werkwijze', '/voor-wie', '/mijn-aanbod', '/contact',
  '/schrijf-je-in-op-mijn-nieuwsbrief', '/privacy-statement-de-katalysator-coaching',
]);

// Oude blogberichten en het blogoverzicht gaan naar de Substack.
const SUBSTACK = 'https://lars.lutjeschipholt.nl/';
const OUDE_BLOGS = new Set([
  '/blogs', '/category/blog', '/feed',
  '/de-angst-onder-onze-wereldcrisis', '/waarom-ik-om-8-uur-mijn-kussen-pak',
  '/kun-je-trauma-helen-met-ai-of-online-trainingen', '/trump-begrijpen-dat-is-precies-het-probleem',
  '/de-sleutel-tot-een-vrijer-leven', '/van-denken-naar-voelen',
  '/de-laag-van-bewustzijn-die-ai-wel-begrijpt-en-wij-vaak-niet', '/handleiding-bewust-werken-met-ai',
  '/berg-in-de-storm-zijn', '/de-kracht-van-bezield-realisme', '/is-jouw-jaar-ook-voorbij-gevlogen',
  '/wat-doet-ai-met-je-eigenheid', '/de-kracht-van-de-woestijn',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }
    const pad = url.pathname.replace(/\/+$/, '') || '/';
    if (NAAR_HOME.has(pad)) return Response.redirect(url.origin + '/', 301);
    if (OUDE_BLOGS.has(pad) || pad.startsWith('/blogs/') || pad.startsWith('/category/')) {
      return Response.redirect(SUBSTACK, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
