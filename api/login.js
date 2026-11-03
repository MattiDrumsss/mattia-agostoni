const crypto = require('crypto');
const h = s => crypto.createHash('sha256').update(String(s)).digest();

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo non consentito' });
  const { ADMIN_PASSWORD, GH_TOKEN, GH_REPO } = process.env;
  if (!ADMIN_PASSWORD || !GH_TOKEN || !GH_REPO) return res.status(500).json({ error: 'variabili mancanti su Vercel' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const ok = crypto.timingSafeEqual(h((body && body.password) || ''), h(ADMIN_PASSWORD));
  if (!ok) {
    await new Promise(r => setTimeout(r, 1200));
    return res.status(401).json({ error: 'password errata' });
  }
  return res.status(200).json({ repo: GH_REPO, token: GH_TOKEN });
};
