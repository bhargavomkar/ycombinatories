CREATE TABLE IF NOT EXISTS early_access_signups (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  user_type varchar(20) NOT NULL CHECK (user_type IN ('individual', 'business')),
  country varchar(100) NOT NULL,
  company_name varchar(160),
  problem_description varchar(2000) NOT NULL,
  additional_context varchar(2000),
  consent boolean NOT NULL CHECK (consent = true),
  status varchar(24) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS early_access_signups_email_unique ON early_access_signups (lower(email));
CREATE TABLE IF NOT EXISTS early_access_rate_limits (
  ip_hash char(64) NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL CHECK (request_count > 0),
  PRIMARY KEY (ip_hash, window_start)
);
-- Periodically remove old hashed rate-limit buckets (e.g. with a scheduled database job).
