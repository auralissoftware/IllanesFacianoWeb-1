import { Link } from "react-router-dom";

type NavbarProps = {
  compact?: boolean;
};

export function Navbar({ compact = false }: NavbarProps) {
  return (
    <header
      className={`absolute inset-x-0 top-0 z-30 px-4 sm:px-6 lg:px-10 ${
        compact ? "pt-3 sm:pt-5" : "pt-4 sm:pt-8 lg:pt-10"
      }`}
    >
      <div className="relative mx-auto flex max-w-7xl justify-center">
        <Link
          to="/"
          className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          aria-label="Illanes Faciano — Inicio"
        >
          <img
            src="/images/logo-light.png"
            alt="Illanes Faciano"
            className={`w-auto object-contain object-top ${
              compact
                ? "h-24 sm:h-32 md:h-36"
                : "h-28 sm:h-40 md:h-48 lg:h-56 xl:h-60"
            }`}
          />
        </Link>
      </div>
    </header>
  );
}
