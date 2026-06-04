import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  getEmailUrl,
  getPhoneUrl,
} from "../../lib/contact";
import { LEGAL_BUSINESS_NAME } from "../../lib/legalSiteInfo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-shell border-t border-white/5 bg-navy px-4 pt-6 text-white sm:px-6 sm:pt-7 lg:px-10">
      <div className="footer-inner">
        <div className="footer-identity">
          <p className="footer-brand-name">ILLANES FACIANO</p>
          <p className="footer-profession">
            Martillero Público, Corredor Público y Perito Tasador
          </p>
          <div className="footer-badges">
            <span className="footer-badge">Matrícula Profesional N° 169</span>
            <span className="footer-badge">Socio CAIR N° 407</span>
          </div>
        </div>

        <div className="footer-logo-row">
          <div className="footer-logo-cell footer-logo-cell-left">
            <img
              src="/images/logo-colegio-martilleros-tucuman.png"
              alt="Colegio Profesional de Martilleros y Corredores de Tucumán"
              className="footer-logo-institutional"
            />
          </div>

          <div className="footer-logo-cell footer-logo-cell-center">
            <img
              src="/images/logo-light.png"
              alt="Illanes Faciano"
              className="footer-logo-main"
            />
          </div>

          <div className="footer-logo-cell footer-logo-cell-right">
            <img
              src="/images/logo-cair.png"
              alt="CAIR — Cámara Argentina de Inmobiliarias Rurales"
              className="footer-logo-institutional"
            />
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-contact-row">
            <a href={getPhoneUrl()} className="footer-contact-link">
              <Phone className="size-3.5 shrink-0" strokeWidth={2} />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a href={getEmailUrl()} className="footer-contact-link">
              <Mail className="size-3.5 shrink-0" strokeWidth={2} />
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="footer-legal-links">
            <Link to="/terminos">Términos y Condiciones</Link>
            <span aria-hidden>·</span>
            <Link to="/privacidad">Política de Privacidad</Link>
            <span aria-hidden>·</span>
            <Link to="/admin/login">Administración</Link>
          </div>

          <p className="footer-copyright">
            © {year} {LEGAL_BUSINESS_NAME}. Todos los derechos reservados.{" "}
            <span className="text-white/35">Desarrollado por</span>{" "}
            <a
              href="https://auralissoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 transition hover:text-celeste"
            >
              Auralis Software
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
