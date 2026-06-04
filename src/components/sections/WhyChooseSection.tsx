import { BarChart3, Handshake, Scale } from "lucide-react";
import { Reveal } from "../ui/Reveal";

const features = [
  {
    icon: Scale,
    title: "Seguridad Jurídica",
    description:
      "Operaciones inmobiliarias y subastas respaldadas legalmente bajo matrícula oficial.",
  },
  {
    icon: BarChart3,
    title: "Tasaciones Oficiales",
    description:
      "Valores de mercado precisos y peritajes reales para resguardar tu patrimonio.",
  },
  {
    icon: Handshake,
    title: "Trato Directo",
    description:
      "Atención personalizada y transparente, directo con el profesional a cargo, sin intermediarios.",
  },
] as const;

export function WhyChooseSection() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 sm:pb-24 lg:px-10 lg:pb-32">
      <div className="relative mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-navy px-5 py-10 shadow-[0_24px_60px_-16px_rgba(44,71,104,0.35)] sm:rounded-[2rem] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <Reveal className="relative text-center" variant="fade">
            <span className="section-badge border-white/15 bg-white/10 text-celeste">
              Ventajas
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              ¿Por qué elegirme?
            </h2>
          </Reveal>

          <div className="relative mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:mt-14">
            {features.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                as="article"
                delay={140 + index * 110}
                variant="up"
                className="glass-panel-dark group rounded-2xl px-5 py-7 text-center transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 sm:px-7 sm:py-10"
              >
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/10 transition duration-300 group-hover:from-celeste/20 group-hover:to-azul-francia/10">
                  <Icon className="size-6 text-celeste" strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  {description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
