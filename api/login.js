const crypto = require('crypto');
const h = s => crypto.createHash('sha256').update(String(s)).digest();

// Secondo controllo (facoltativo): serve la mail dell'amministratore confermata di recente con Firebase.
async function second(idToken, env) {
  const { FIREBASE_API_KEY, ADMIN_EMAIL } = env;
  if (!FIREBASE_API_KEY || !ADMIN_EMAIL) return { ok: true };
  if (!idToken) return { ok: false, email: ADMIN_EMAIL };
  try {
    const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(FIREBASE_API_KEY), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken })
    });
    if (!r.ok) return { ok: false, email: ADMIN_EMAIL };
    const u = ((await r.json()).users || [])[0] || {};
    const days = Number(env.TWOFA_DAYS || 30);
    const fresh = Date.now() - Number(u.lastLoginAt || 0) < days * 864e5;
    const same = String(u.email || '').toLowerCase() === String(ADMIN_EMAIL).toLowerCase();
    return { ok: same && u.emailVerified === true && fresh, email: ADMIN_EMAIL };
  } catch (e) { return { ok: false, email: ADMIN_EMAIL }; }
}

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
  const s = await second(body && body.idToken, process.env);
  if (!s.ok) return res.status(403).json({ need: 'mail', email: s.email });
  return res.status(200).json({ repo: GH_REPO, token: GH_TOKEN });
};
