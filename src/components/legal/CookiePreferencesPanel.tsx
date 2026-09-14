import { useEffect, useState } from "react";
import {
  getCookieConsent,
  setCookieConsent,
  type CookieConsent,
} from "../../lib/cookieConsent";

const labels: Record<CookieConsent, string> = {
  accepted: "Aceptadas (analíticas activas)",
  rejected: "Rechazadas (solo cookies técnicas)",
};

export function CookiePreferencesPanel() {
  const [choice, setChoice] = useState<CookieConsent | null>(() => getCookieConsent());

  useEffect(() => {
    function sync() {
      setChoice(getCookieConsent());
    }

    sync();
    window.addEventListener("cookie-consent-updated", sync);
    return () => window.removeEventListener("cookie-consent-updated", sync);
  }, []);

  function update(value: CookieConsent) {
    setCookieConsent(value);
    setChoice(getCookieConsent());
  }

  function resetChoice() {
    setCookieConsent(null);
    setChoice(null);
  }

  return (
    <div className="rounded-2xl border border-azul-francia/25 bg-celeste/10 px-5 py-5 sm:px-6">
      <h3 className="text-base font-semibold text-navy">Tu preferencia actual</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-deep/90">
        {choice === null
          ? "Todavía no elegiste. El banner de cookies debería mostrarse en las páginas públicas del sitio."
          : labels[choice]}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="cookie-banner-btn cookie-banner-btn-primary"
          onClick={() => update("accepted")}
        >
          Aceptar analíticas
        </button>
        <button
          type="button"
          className="cookie-banner-btn cookie-banner-btn-secondary"
          onClick={() => update("rejected")}
        >
          Rechazar analíticas
        </button>
        <button
          type="button"
          className="cookie-banner-btn cookie-banner-btn-secondary"
          onClick={resetChoice}
        >
          Restablecer y volver a ver el banner
        </button>
      </div>
    </div>
  );
}
