import type { ContactFormPayload } from "./contactTypes";

function buildEmailBody(payload: ContactFormPayload): string {
  return [
    `Motivo: ${payload.service}`,
    `Nombre: ${payload.name}`,
    `Celular: ${payload.phone}`,
    `Email: ${payload.email}`,
    "",
    "Mensaje:",
    payload.message,
  ].join("\n");
}

export function isContactEmailConfigured(): boolean {
  return Boolean(import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim());
}

export async function sendContactEmail(
  payload: ContactFormPayload,
): Promise<boolean> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim();

  if (!accessKey) {
    return false;
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Nueva consulta web — ${payload.service}`,
        from_name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        message: buildEmailBody(payload),
        replyto: payload.email,
      }),
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { success?: boolean };

    return data.success === true;
  } catch {
    return false;
  }
}
