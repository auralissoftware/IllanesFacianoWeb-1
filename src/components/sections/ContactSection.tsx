import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { submitContactForm } from "../../lib/submitContactForm";

type ServiceId =
  | "tasacion"
  | "perito-parte"
  | "perito-consultor"
  | "consulta-inmobiliaria"
  | "remates-bienes";

type FormData = {
  services: ServiceId[];
  name: string;
  phone: string;
  email: string;
  message: string;
};

const services = [
  {
    id: "tasacion" as const,
    title: "Tasación Profesional de Propiedades",
    subtitle: "Inmuebles, terrenos, patrimonios",
  },
  {
    id: "perito-parte" as const,
    title: "Perito de Parte / Peritajes Judiciales",
    subtitle: "Asistencia técnica para juzgados y estudios jurídicos",
  },
  {
    id: "perito-consultor" as const,
    title: "Perito Consultor",
    subtitle: "Asesoramiento técnico y dictámenes oficiales",
  },
  {
    id: "consulta-inmobiliaria" as const,
    title: "Consulta Inmobiliaria / Compra-Venta",
    subtitle: "Asesoramiento en operaciones del mercado",
  },
  {
    id: "remates-bienes" as const,
    title: "Remates y Bienes Muebles",
    subtitle: "Subastas, vehículos y activos",
  },
] as const;

const initialForm: FormData = {
  services: [],
  name: "",
  phone: "",
  email: "",
  message: "",
};

function getSelectedServiceTitles(selectedIds: ServiceId[]): string {
  if (selectedIds.length === 0) {
    return "Sin motivo seleccionado";
  }

  return services
    .filter((service) => selectedIds.includes(service.id))
    .map((service) => service.title)
    .join(" · ");
}

export function ContactSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    const result = await submitContactForm({
      service: getSelectedServiceTitles(form.services),
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
  }

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    setSubmitError("");
  }

  function toggleService(id: ServiceId) {
    setForm((current) => ({
      ...current,
      services: current.services.includes(id)
        ? current.services.filter((serviceId) => serviceId !== id)
        : [...current.services, id],
    }));
    setSubmitted(false);
    setSubmitError("");
  }

  return (
    <section id="contacto" className="bg-white px-4 pb-16 sm:px-6 sm:pb-20 lg:px-10 lg:pb-24">
      <div className="relative mx-auto max-w-3xl">
        <div
          className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-celeste/30 via-transparent to-azul-francia/20 opacity-70 blur-sm"
          aria-hidden
        />

        <div className="surface-card relative px-5 py-10 sm:px-10 sm:py-14">
          <div className="text-center">
            <span className="section-badge">Contacto</span>
            <p className="mt-5 text-lg font-semibold tracking-tight text-navy sm:text-xl">
              Dejanos tu consulta y nos comunicamos con vos en el día
            </p>
          </div>

          <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
            <fieldset className="text-center">
              <legend className="mb-3 text-xs font-medium text-muted">
                Motivo de consulta{" "}
                <span className="text-muted/80">(opcional, podés elegir varios)</span>
              </legend>

              <div className="mx-auto grid max-w-xl gap-2 sm:grid-cols-2">
                {services.map(({ id, title, subtitle }) => {
                  const isSelected = form.services.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleService(id)}
                      className={`service-option ${
                        id === "remates-bienes"
                          ? "sm:col-span-2 sm:max-w-sm sm:justify-self-center sm:w-full"
                          : ""
                      } ${
                        isSelected
                          ? "service-option-active"
                          : "service-option-inactive"
                      }`}
                      aria-pressed={isSelected}
                    >
                      <span className="block text-[13px] font-medium leading-snug text-slate-deep">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                        {subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Nombre completo *"
              className="input-modern"
            />

            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Celular *"
              className="input-modern"
            />

            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email *"
              className="input-modern"
            />

            <textarea
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Mensaje que quieras dejar *"
              className="input-modern resize-none"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary group w-full gap-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar consulta"}
              <Send
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </button>

            {submitError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                {submitError}
              </p>
            )}

            {submitted && (
              <p className="rounded-2xl bg-celeste/15 px-4 py-3 text-center text-sm font-medium text-azul-francia">
                Consulta enviada. Nos comunicamos con vos a la brevedad.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export type { ServiceId, FormData as ContactFormData };
