const limits = { fullName: 120, email: 254, userType: 20, country: 100, companyName: 160, problemDescription: 2000, additionalContext: 2000 };
const clean = value => typeof value === 'string' ? value.trim() : '';
export function validateSignup(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Enter a valid application.' };
  if (clean(input.website)) return { spam: true };
  const data = Object.fromEntries(Object.entries(limits).map(([key, max]) => [key, clean(input[key]).slice(0, max)]));
  data.email = data.email.toLowerCase();
  if (!data.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !['individual', 'business'].includes(data.userType) || !data.country || !data.problemDescription || input.consent !== true) return { error: 'Check the required fields and privacy consent.' };
  for (const [key, max] of Object.entries(limits)) if (typeof input[key] === 'string' && input[key].trim().length > max) return { error: 'One or more fields are too long.' };
  return { data };
}
