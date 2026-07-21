// Apple/Google sometimes hand us a private relay email or an opaque token
// instead of a real name. Use this to decide whether to trust it.
export function looksLikeRealName(v?: string | null): boolean {
  if (!v) return false;
  const s = v.trim();
  if (s.length < 2 || s.length > 40) return false;
  if (s.includes("@")) return false; // email address
  if (/^[0-9a-f]{8,}$/i.test(s)) return false; // hex / uuid-ish
  if (/[0-9]{6,}/.test(s)) return false; // long digit run
  if (/privaterelay|appleid/i.test(s)) return false;
  return /[a-zA-ZÀ-ÿ]/.test(s);
}
