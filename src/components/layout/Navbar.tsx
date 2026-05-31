import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-6 pt-8 lg:px-10 lg:pt-10">
      <div className="relative mx-auto flex max-w-7xl justify-center">
        <Link
          to="/"
          className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          aria-label="Illanes Faciano — Inicio"
        >
          <img
            src="/images/logo-light.png"
            alt="Illanes Faciano"
            className="h-48 w-auto object-contain object-top sm:h-56 lg:h-60"
          />
        </Link>
      </div>
    </header>
  );
}
