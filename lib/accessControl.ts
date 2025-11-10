// lib/accessControl.ts
export function isAllowedEmail(email?: string | null): boolean {
  if (!email) return false;

  const allowed = process.env.ALLOWED_EMAILS ?? "";
  const list = allowed
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return list.includes(email.toLowerCase());
}
