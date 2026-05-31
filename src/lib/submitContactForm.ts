import { CONTACT_EMAIL } from "./contact";

export type ContactFormPayload = {
  service: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<SubmitResult> {
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Nueva consulta web — ${payload.service}`,
          _template: "table",
          _captcha: "false",
          Motivo: payload.service,
          Nombre: payload.name,
          Celular: payload.phone,
          Email: payload.email,
          Mensaje: payload.message,
        }),
      },
    );

    if (!response.ok) {
      return {
        ok: false,
        error: "No pudimos enviar la consulta. Intentá de nuevo en unos minutos.",
      };
    }

    const data = (await response.json()) as { success?: string };

    if (data.success !== "true") {
      return {
        ok: false,
        error: "No pudimos enviar la consulta. Intentá de nuevo en unos minutos.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Error de conexión. Revisá tu internet e intentá de nuevo.",
    };
  }
}
