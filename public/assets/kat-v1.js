// dekatalysator.nl: contactformulier. Verstuurt naar /api/contact (Worker, Resend).
document.addEventListener('DOMContentLoaded', () => {
  const start = Date.now();
  document.querySelectorAll('form.formulier').forEach((form) => {
    const melding = form.querySelector('.formulier__melding');
    const knop = form.querySelector('button[type=submit]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      melding.className = 'formulier__melding';
      const data = Object.fromEntries(new FormData(form));
      data.t = String(Date.now() - start);
      if (!data.naam.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.bericht.trim()) {
        melding.textContent = 'Vul je naam, een geldig e-mailadres en een bericht in.';
        melding.classList.add('fout');
        return;
      }
      knop.disabled = true;
      melding.textContent = 'Bezig met versturen…';
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        melding.textContent = 'Dank je wel. Je bericht is verstuurd, ik reageer meestal binnen twee werkdagen.';
        melding.classList.add('goed');
      } catch (err) {
        melding.innerHTML = 'Het versturen lukte niet. Mail me direct: <a href="mailto:lars@dekatalysator.nl">lars@dekatalysator.nl</a>.';
        melding.classList.add('fout');
      } finally {
        knop.disabled = false;
      }
    });
  });
});
