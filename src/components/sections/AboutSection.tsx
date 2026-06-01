export function AboutSection() {
  const roles = [
    "Martillero Público",
    "Perito Tasador",
    "Corredor Público Nacional",
  ] as const;

  return (
    <section
      id="servicios"
      className="relative overflow-hidden bg-white px-4 pt-12 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-10 lg:pt-16 lg:pb-24"
    >
      <div
        className="pointer-events-none absolute top-32 right-0 h-72 w-72 rounded-full bg-celeste/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 sm:gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="text-center sm:text-left">
          <span className="section-badge">Respaldo profesional</span>

          <h2 className="text-balance mt-5 text-2xl leading-[1.12] font-semibold tracking-tight text-slate-deep sm:text-3xl lg:text-[2.65rem]">
            El respaldo profesional detrás de cada operación
          </h2>

          <div className="relative mx-auto mt-8 inline-block sm:mx-0 sm:mt-10">
            <div
              className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-celeste/30 to-azul-francia/10 blur-sm"
              aria-hidden
            />
            <img
              src="/images/alberto-illanes.png"
              alt="Alberto Illanes Faciano en su puesto de martillero"
              className="relative aspect-[4/5] w-40 rounded-[1.25rem] object-cover object-top shadow-[0_20px_50px_rgba(27,38,59,0.15)] ring-1 ring-slate-200/80 sm:w-48 md:w-52"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-base leading-[1.75] text-muted sm:text-lg">
            Más que publicaciones o simples operaciones, cada negocio necesita
            confianza, criterio y respaldo profesional. Alberto Illanes Faciano
            combina experiencia en el mercado inmobiliario, remates y
            tasaciones para ofrecer operaciones seguras, transparentes y
            respaldadas profesionalmente.
          </p>

          <ul className="mt-10 flex flex-wrap gap-3">
            {roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-celeste/35 bg-celeste/10 px-4 py-2.5 text-sm font-medium text-azul-francia"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
