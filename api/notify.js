// Invia una novità agli iscritti (campagna Brevo). Protetta dalla password dell'area riservata.
const crypto = require('crypto');
const h = s => crypto.createHash('sha256').update(String(s)).digest();
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo non consentito' });
  const { ADMIN_PASSWORD, BREVO_API_KEY, BREVO_LIST_ID, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } = process.env;
  if (!ADMIN_PASSWORD || !BREVO_API_KEY || !BREVO_LIST_ID || !BREVO_SENDER_EMAIL) return res.status(500).json({ error: 'Newsletter non configurata su Vercel.' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  if (!crypto.timingSafeEqual(h((b && b.password) || ''), h(ADMIN_PASSWORD))) {
    await new Promise(r => setTimeout(r, 1200));
    return res.status(401).json({ error: 'Password sbagliata.' });
  }
  const subject = String(b.subject || '').slice(0, 150), message = String(b.message || '').slice(0, 2000), link = /^https?:\/\//.test(b.link || '') ? b.link : '';
  if (!subject) return res.status(400).json({ error: 'Manca l\'oggetto.' });
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>${esc(subject)}</h2><p>${esc(message).replace(/\n/g, '<br>')}</p>${link ? `<p><a href="${esc(link)}" style="display:inline-block;padding:12px 22px;background:#000;color:#fff;border-radius:99px;text-decoration:none">Guarda il lavoro</a></p>` : ''}<hr><p style="font-size:12px;color:#777"><a href="{{ unsubscribe }}">Annulla l'iscrizione</a></p></div>`;
  const headers = { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' };
  try {
    const c = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST', headers,
      body: JSON.stringify({ name: 'Novità ' + new Date().toISOString(), subject, sender: { name: BREVO_SENDER_NAME || 'Mattia Agostoni', email: BREVO_SENDER_EMAIL }, type: 'classic', htmlContent: html, recipients: { listIds: [Number(BREVO_LIST_ID)] } })
    });
    const cj = await c.json().catch(() => ({}));
    if (!c.ok || !cj.id) return res.status(502).json({ error: 'Brevo: ' + JSON.stringify(cj).slice(0, 140) });
    const s = await fetch('https://api.brevo.com/v3/emailCampaigns/' + cj.id + '/sendNow', { method: 'POST', headers });
    if (!s.ok && s.status !== 204) return res.status(502).json({ error: 'Invio non riuscito: ' + (await s.text()).slice(0, 140) });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ error: 'Non riesco a contattare Brevo.' }); }
};
