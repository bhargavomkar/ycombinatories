import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSignup } from '../lib/signup-validation.js';
const valid = { fullName: 'Avery Example', email: 'AVERY@example.com', userType: 'individual', country: 'India', problemDescription: 'Help me understand a form.', consent: true };
test('accepts valid application and normalizes email', () => { const result = validateSignup(valid); assert.equal(result.data.email, 'avery@example.com'); });
test('rejects missing consent and invalid audience', () => { assert.ok(validateSignup({ ...valid, consent: false }).error); assert.ok(validateSignup({ ...valid, userType: 'government' }).error); });
test('rejects invalid email and oversized input', () => { assert.ok(validateSignup({ ...valid, email: 'not-an-email' }).error); assert.ok(validateSignup({ ...valid, fullName: 'x'.repeat(121) }).error); });
test('detects honeypot submissions', () => { assert.equal(validateSignup({ ...valid, website: 'spam' }).spam, true); });
