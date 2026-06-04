import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY } from "./contact";
import { supabase } from "./supabase";
import type { ContactFormPayload } from "./contactTypes";

export type { ContactFormPayload } from "./contactTypes";

type SubmitResult = { ok: true } | { ok: false; error: string };

async function saveContactInquiry(
  payload: ContactFormPayload,
): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("contact_inquiries").insert({
    service: payload.service,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  });

  return !error;
}

async function sendContactEmail(
  payload: ContactFormPayload,
): Promise<boolean> {
  try {
    const response = await fetch("/api/send-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as { ok?: boolean };

    return data.ok === true;
  } catch {
    return false;
  }
}

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<SubmitResult> {
  const normalized: ContactFormPayload = {
    service: payload.service.trim() || "Sin motivo seleccionado",
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  };

  if (!normalized.name || !normalized.phone || !normalized.email || !normalized.message) {
    return {
      ok: false,
      error: "Completá todos los campos obligatorios.",
    };
  }

  const [emailSent, savedInDatabase] = await Promise.all([
    sendContactEmail(normalized),
    saveContactInquiry(normalized),
  ]);

  if (emailSent || savedInDatabase) {
    return { ok: true };
  }

  return {
    ok: false,
    error: `No pudimos enviar la consulta. Escribinos a ${CONTACT_EMAIL} o al ${CONTACT_PHONE_DISPLAY}.`,
  };
}
