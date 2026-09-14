import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  getCookieConsent,
  needsCookieConsentPrompt,
  setCookieConsent,
  type CookieConsent,
} from "../../lib/cookieConsent";

export function CookieBanner() {
  const [visible, setVisible] = useState(() => needsCookieConsentPrompt());

  useEffect(() => {
    function syncVisibility() {
      setVisible(needsCookieConsentPrompt());
    }

    syncVisibility();
    window.addEventListener("cookie-consent-updated", syncVisibility);
    window.addEventListener("storage", syncVisibility);

    return () => {
      window.removeEventListener("cookie-consent-updated", syncVisibility);
      window.removeEventListener("storage", syncVisibility);
    };
  }, []);

  if (!visible) {
    return null;
  }

  function choose(value: CookieConsent) {
    setCookieConsent(value);
    setVisible(getCookieConsent() === null);
  }

  const banner = (
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

  if (typeof document === "undefined") {
    return banner;
  }

  return createPortal(banner, document.body);
}
