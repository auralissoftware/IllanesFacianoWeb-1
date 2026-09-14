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

export function setCookieConsent(value: CookieConsent | null): boolean {
  try {
    if (value === null) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } else {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    }

    window.dispatchEvent(new Event("cookie-consent-updated"));
    return true;
  } catch {
    return false;
  }
}

export function needsCookieConsentPrompt(): boolean {
  return getCookieConsent() === null;
}
