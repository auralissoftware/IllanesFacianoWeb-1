import { Reveal } from "../ui/Reveal";

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

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center sm:text-left" variant="up">
          <span className="section-badge">Respaldo profesional</span>

          <h2 className="text-balance mt-5 text-2xl leading-[1.12] font-semibold tracking-tight text-slate-deep sm:text-3xl lg:text-[2.65rem]">
            El respaldo profesional detrás de cada operación
          </h2>
        </Reveal>

        <div className="mt-8 flex items-start gap-5 sm:mt-10 sm:gap-8 lg:gap-12">
          <Reveal
            as="div"
            className="relative mx-auto shrink-0 sm:mx-0"
            delay={120}
            variant="scale"
          >
            <div
              className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-br from-celeste/30 to-azul-francia/10 blur-sm sm:-inset-3 sm:rounded-[1.75rem]"
              aria-hidden
            />
            <img
              src="/images/alberto-illanes.png"
              alt="Alberto Illanes Faciano en su puesto de martillero"
              className="relative aspect-[4/5] w-32 rounded-[1.15rem] object-cover object-top shadow-[0_20px_50px_rgba(27,38,59,0.15)] ring-1 ring-slate-200/80 sm:w-44 sm:rounded-[1.25rem] md:w-52"
            />
          </Reveal>

          <Reveal
            className="min-w-0 flex-1 pt-1"
            delay={100}
            variant="up"
          >
            <p className="text-left text-sm leading-[1.75] text-muted sm:text-base lg:text-lg">
              Más que publicaciones o simples operaciones, cada negocio necesita
              confianza, criterio y respaldo profesional. Alberto Illanes Faciano
              combina experiencia en el mercado inmobiliario, remates y
              tasaciones para ofrecer operaciones seguras, transparentes y
              respaldadas profesionalmente.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
              {roles.map((role, index) => (
                <Reveal
                  key={role}
                  as="li"
                  delay={220 + index * 90}
                  variant="fade"
                  className="rounded-full border border-celeste/35 bg-celeste/10 px-3 py-2 text-xs font-medium text-azul-francia sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  {role}
                </Reveal>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
