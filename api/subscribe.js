// Iscrizione alla newsletter tramite Brevo (piano gratuito).
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo non consentito' });
  const { BREVO_API_KEY, BREVO_LIST_ID, BREVO_DOI_TEMPLATE, SITE_URL } = process.env;
  if (!BREVO_API_KEY || !BREVO_LIST_ID) return res.status(500).json({ error: 'La newsletter non è ancora configurata.' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const email = String((b && b.email) || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return res.status(400).json({ error: 'La mail non sembra valida.' });
  const headers = { 'api-key': BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' };
  try {
    if (BREVO_DOI_TEMPLATE) {
      const r = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST', headers,
        body: JSON.stringify({ email, includeListIds: [Number(BREVO_LIST_ID)], templateId: Number(BREVO_DOI_TEMPLATE), redirectionUrl: SITE_URL || 'https://example.com' })
      });
      if (!r.ok && r.status !== 204) return res.status(502).json({ error: 'Servizio newsletter: ' + (await r.text()).slice(0, 120) });
      return res.status(200).json({ ok: true, doi: true });
    }
    const r = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST', headers, body: JSON.stringify({ email, listIds: [Number(BREVO_LIST_ID)], updateEnabled: true })
    });
    if (!r.ok && r.status !== 204) return res.status(502).json({ error: 'Servizio newsletter: ' + (await r.text()).slice(0, 120) });
    return res.status(200).json({ ok: true });
  } catch (e) { return res.status(502).json({ error: 'Non riesco a contattare il servizio newsletter.' }); }
};
