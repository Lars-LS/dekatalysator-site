// Contactformulier dekatalysator.nl: POST /api/contact (JSON) -> e-mail via Resend.
// Secret RESEND_API_KEY moet op de Worker "dekatalysator" staan (Settings, Variables and Secrets).
// Afzender gebruikt het al geverifieerde verzenddomein van onlinebrainspotting.nl; wordt dekatalysator.nl
// in Resend geverifieerd, dan kan VAN naar formulier@dekatalysator.nl.
const AAN = 'lars@dekatalysator.nl';
const VAN = 'De Katalysator <formulier@onlinebrainspotting.nl>';

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export async function handleContact(request, env) {
  if (request.method !== 'POST') return json({ fout: 'Alleen POST' }, 405);
  let d;
  try { d = await request.json(); } catch { return json({ fout: 'Ongeldige invoer' }, 400); }

  const naam = String(d.naam ?? '').trim().slice(0, 120);
  const email = String(d.email ?? '').trim().slice(0, 200);
  const bericht = String(d.bericht ?? '').trim().slice(0, 5000);
  const rol = d.rol === 'werkgever' ? 'werkgever, HR of casemanager' : 'cliënt';

  // Spamfilter: honingpot gevuld of binnen 3 seconden verstuurd -> stil "gelukt" teruggeven.
  if (String(d.website ?? '').trim() !== '' || Number(d.t ?? 0) < 3000) return json({ ok: true });
  if (!naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !bericht) return json({ fout: 'Velden ontbreken' }, 400);
  // Veel links in één bericht is vrijwel altijd spam.
  if ((bericht.match(/https?:\/\//g) || []).length > 3) return json({ ok: true });

  if (!env.RESEND_API_KEY) return json({ fout: 'Niet ingesteld' }, 500);

  const html = `<table style="font-family:sans-serif;font-size:14px">
<tr><td style="color:#666;padding:4px 12px 4px 0">Naam</td><td>${esc(naam)}</td></tr>
<tr><td style="color:#666;padding:4px 12px 4px 0">E-mail</td><td>${esc(email)}</td></tr>
<tr><td style="color:#666;padding:4px 12px 4px 0">Rol</td><td>${esc(rol)}</td></tr>
<tr><td style="color:#666;padding:4px 12px 4px 0;vertical-align:top">Bericht</td><td>${esc(bericht).replace(/\n/g, '<br>')}</td></tr>
</table>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: VAN, to: [AAN], reply_to: email, subject: `dekatalysator.nl: bericht van ${naam} (${rol})`, html }),
  });
  if (!res.ok) {
    console.error('Resend-fout', res.status, await res.text());
    return json({ fout: 'Versturen mislukt' }, 502);
  }
  return json({ ok: true });
}
