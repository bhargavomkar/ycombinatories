import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import { validateSignup } from '../lib/signup-validation.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 12000) return res.status(413).json({ error: 'The application is too large.' });
  const contentType = req.headers['content-type'] || '';
  if (!contentType.toLowerCase().includes('application/json')) return res.status(415).json({ error: 'Send the application as JSON.' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Enter a valid application.' }); } }
  const result = validateSignup(body);
  if (result.spam) return res.status(400).json({ error: 'Enter a valid application.' });
  if (result.error) return res.status(400).json({ error: result.error });
  const { DATABASE_URL, RATE_LIMIT_SALT } = process.env;
  if (!DATABASE_URL || !RATE_LIMIT_SALT) return res.status(503).json({ error: 'The application service is not configured yet. Your information was not stored.' });
  try {
    const sql = neon(DATABASE_URL);
    const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = forwarded || req.socket?.remoteAddress || 'unknown';
    const ipHash = createHash('sha256').update(`${RATE_LIMIT_SALT}:${ip}`).digest('hex');
    const rate = await sql`INSERT INTO early_access_rate_limits (ip_hash, window_start, request_count) VALUES (${ipHash}, date_trunc('hour', now()) + floor(date_part('minute', now()) / 10) * interval '10 minutes', 1) ON CONFLICT (ip_hash, window_start) DO UPDATE SET request_count = early_access_rate_limits.request_count + 1 RETURNING request_count`;
    if (Number(rate[0]?.request_count) > 5) return res.status(429).json({ error: 'Too many attempts. Please try again in a few minutes.' });
    const { fullName, email, userType, country, companyName, problemDescription, additionalContext } = result.data;
    const inserted = await sql`INSERT INTO early_access_signups (full_name, email, user_type, country, company_name, problem_description, additional_context, consent) VALUES (${fullName}, ${email}, ${userType}, ${country}, ${companyName || null}, ${problemDescription}, ${additionalContext || null}, true) ON CONFLICT DO NOTHING RETURNING id`;
    if (!inserted.length) return res.status(409).json({ error: 'This email already has an application.' });
    return res.status(201).json({ ok: true });
  } catch {
    return res.status(503).json({ error: 'We could not save your application right now. Please try again later.' });
  }
}
