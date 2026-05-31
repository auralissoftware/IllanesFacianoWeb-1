import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  getEmailUrl,
  getPhoneUrl,
} from "../../lib/contact";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-navy px-6 pt-8 pb-8 text-white sm:pb-10 lg:px-10 lg:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-10 text-center lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:text-left">
          <div className="max-w-lg">
            <p className="text-base font-semibold tracking-tight sm:text-lg">
              ILLANES FACIANO
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Martillero, Corredor Público y Perito Tasador
            </p>
            <p className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-celeste">
              Matrícula Profesional N° 169
            </p>
          </div>

          <div className="flex justify-center lg:min-w-[220px] lg:justify-end">
            <img
              src="/images/logo-light.png"
              alt="Illanes Faciano"
              className="h-20 w-auto object-contain sm:h-24 lg:h-28"
            />
          </div>
        </div>

        <div className="my-6 border-y border-white/10 py-3.5 sm:my-7 sm:py-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-1">
            <p className="text-xs font-semibold tracking-wide text-white uppercase sm:text-sm">
              Contacto
            </p>

            <a
              href={getPhoneUrl()}
              className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-celeste"
            >
              <Phone className="size-4 shrink-0" strokeWidth={2} />
              {CONTACT_PHONE_DISPLAY}
            </a>

            <a
              href={getEmailUrl()}
              className="inline-flex items-center gap-2 text-sm break-all text-white/80 transition hover:text-celeste sm:break-normal"
            >
              <Mail className="size-4 shrink-0" strokeWidth={2} />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mb-4 flex justify-center sm:mb-5">
          <Link
            to="/admin/login"
            className="text-xs text-white/45 transition hover:text-celeste"
          >
            ¿Sos administrador? Ingresá acá
          </Link>
        </div>

        <div className="flex flex-col items-center gap-3 pr-24 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:pr-36">
          <p className="shrink-0">© {year} Illanes Faciano</p>
          <p className="whitespace-nowrap text-center sm:text-right">
            Diseño y Desarrollo por{" "}
            <span className="text-white/75">Auralis Software</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
