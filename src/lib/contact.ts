export const CONTACT_PHONE = "3816784758";
export const CONTACT_PHONE_DISPLAY = "381 678-4758";
export const CONTACT_EMAIL = "illanesfaciano@gmail.com";

/** Número en formato internacional sin + ni espacios (549 + 3816784758). */
export const WHATSAPP_NUMBER = "5493816784758";

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;

  if (!message?.trim()) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function getPhoneUrl(): string {
  return `tel:+${WHATSAPP_NUMBER}`;
}

export function getEmailUrl(): string {
  return `mailto:${CONTACT_EMAIL}`;
}

export type ContactInquiryFields = {
  service: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function buildContactInquiryWhatsAppMessage(
  fields: ContactInquiryFields,
): string {
  return [
    "Consulta desde la web — Illanes Faciano",
    "",
    `Motivo: ${fields.service}`,
    `Nombre: ${fields.name}`,
    `Celular: ${fields.phone}`,
    `Email: ${fields.email}`,
    "",
    "Mensaje:",
    fields.message,
  ].join("\n");
}
