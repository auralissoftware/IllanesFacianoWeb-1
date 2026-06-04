type ContactBody = {
  service?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

type ApiRequest = {
  method?: string;
  body?: ContactBody;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => ApiResponse;
};

const CONTACT_TO_EMAIL = "illanesfaciano@gmail.com";

function buildEmailBody(payload: Required<ContactBody>) {
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

async function sendViaWeb3Forms(
  payload: Required<ContactBody>,
  accessKey: string,
): Promise<boolean> {
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
}

async function sendViaFormSubmit(payload: Required<ContactBody>): Promise<boolean> {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_TO_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        service: payload.service,
        message: buildEmailBody(payload),
        _subject: `Nueva consulta web — ${payload.service}`,
        _template: "table",
        _captcha: "false",
        _replyto: payload.email,
      }),
    },
  );

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: string | boolean };

  return data.success === true || data.success === "true";
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const body = request.body ?? {};
  const service = body.service?.trim() || "Sin motivo seleccionado";
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !phone || !email || !message) {
    return response.status(400).json({
      ok: false,
      error: "Completá todos los campos obligatorios.",
    });
  }

  const payload = { service, name, phone, email, message };
  const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY?.trim();

  let emailSent = false;

  if (web3FormsKey) {
    emailSent = await sendViaWeb3Forms(payload, web3FormsKey);
  }

  if (!emailSent) {
    emailSent = await sendViaFormSubmit(payload);
  }

  if (!emailSent) {
    return response.status(500).json({
      ok: false,
      error: "email_failed",
    });
  }

  return response.status(200).json({ ok: true });
}
