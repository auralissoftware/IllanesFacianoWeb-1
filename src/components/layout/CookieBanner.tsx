import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  COOKIE_CONSENT_KEY,
  getCookieConsent,
  type CookieConsent,
} from "../../lib/cookieConsent";

function storeConsent(value: CookieConsent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // noop
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
  }, []);

  if (!visible) {
    return null;
  }

  function choose(value: CookieConsent) {
    storeConsent(value);
    setVisible(false);
    window.dispatchEvent(new Event("cookie-consent-updated"));
  }

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Preferencias de cookies"
    >
      <p className="cookie-banner-text">
        Usamos cookies técnicas y, si las aceptás, cookies analíticas para
        mejorar la experiencia del sitio. Podés leer más en nuestra{" "}
        <Link to="/cookies" className="cookie-banner-link">
          Política de Cookies
        </Link>
        .
      </p>

      <div className="cookie-banner-actions">
        <button
          type="button"
          className="cookie-banner-btn cookie-banner-btn-secondary"
          onClick={() => choose("rejected")}
        >
          Rechazar
        </button>
        <button
          type="button"
          className="cookie-banner-btn cookie-banner-btn-primary"
          onClick={() => choose("accepted")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
