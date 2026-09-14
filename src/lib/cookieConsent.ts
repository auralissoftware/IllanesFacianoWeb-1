export const COOKIE_CONSENT_KEY = "cookie_consent";

export type CookieConsent = "accepted" | "rejected";

export function getCookieConsent(): CookieConsent | null {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (value === "accepted" || value === "rejected") {
      return value;
    }
  } catch {
    // noop
  }

  return null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === "accepted";
}
