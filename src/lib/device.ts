// Client-side helper: stable per-browser device identifier and human label.
const DEVICE_ID_KEY = "onyx-device-id";

export function getDeviceHash(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function getDeviceLabel(): string {
  if (typeof window === "undefined") return "Unknown device";
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "Mac";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua)) browser = "Safari";

  return `${browser} on ${os}`;
}

export function verifiedCacheKey(userId: string) {
  return `onyx-device-verified-${userId}`;
}

export function markDeviceVerifiedInSession(userId: string) {
  try {
    sessionStorage.setItem(verifiedCacheKey(userId), "1");
  } catch {}
}

export function isDeviceVerifiedInSession(userId: string): boolean {
  try {
    return sessionStorage.getItem(verifiedCacheKey(userId)) === "1";
  } catch {
    return false;
  }
}

const REMEMBER_KEY = "onyx-remember-device";

export function setRememberDevice(remember: boolean) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {}
}

export function getRememberDevice(): boolean {
  try {
    // Default to true when unset (matches checkbox default).
    return localStorage.getItem(REMEMBER_KEY) !== "0";
  } catch {
    return true;
  }
}
