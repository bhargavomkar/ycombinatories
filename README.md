# Veriidia website

Static HTML/CSS/JavaScript site with a Vercel Node serverless API at `/api/early-access`. PostgreSQL storage uses Neon’s serverless driver and parameterized tagged-template queries.

## Configure storage

1. Create a Neon PostgreSQL database and run [`db/schema.sql`](db/schema.sql) in its SQL editor. This creates the signup table, case-insensitive unique email index, and rate-limit buckets.
2. In Vercel Project Settings → Environment Variables, set `DATABASE_URL` to the Neon connection string and `RATE_LIMIT_SALT` to a long random secret. Add both to Production and any Preview/Development environments where the form should work. Neither variable is safe to expose in client-side code.
3. Redeploy the project after adding or changing variables.
4. For local development, copy `.env.example` to `.env.local`, add real values, run `npm install`, and start Vercel’s local runtime with `npx vercel dev`. Without credentials, the API intentionally responds with HTTP 503 and the form says nothing was stored.

The endpoint accepts JSON `POST` requests only. It validates all required fields, limits field lengths, rejects a honeypot, limits each salted client-IP hash to five requests per ten-minute bucket, and inserts with a case-insensitive unique email constraint. Duplicate email returns HTTP 409; confirmed insert returns HTTP 201. The API does not send email notifications. Database errors are not returned or logged with form contents. Rate-limit rows contain salted hashes, not raw IP addresses; schedule periodic cleanup of old rows if the database is used long-term.

The privacy page documents the current early-stage collection and limitations. Update it before activating the service if your provider, retention, contact process, or actual practices differ.

## Checks

- `npm test` runs input validation tests.
- `node --check app.js` and `node --check api/early-access.js` check JavaScript syntax.
