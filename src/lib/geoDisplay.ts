const COUNTRY_LABELS: Record<string, string> = {
  AR: "Argentina",
  US: "Estados Unidos",
  BR: "Brasil",
  CL: "Chile",
  UY: "Uruguay",
  PY: "Paraguay",
  BO: "Bolivia",
  ES: "España",
  IT: "Italia",
  MX: "México",
  XX: "Sin país",
};

export function countryCodeToFlag(countryCode: string | null | undefined): string {
  const code = countryCode?.trim().toUpperCase();

  if (!code || code.length !== 2 || code === "XX") {
    return "🌍";
  }

  const points = [...code].map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...points);
}

export function formatCountryLabel(
  countryCode: string | null | undefined,
  countryName: string | null | undefined,
): string {
  const code = countryCode?.trim().toUpperCase();
  const name = countryName?.trim();

  if (name) {
    return name;
  }

  if (code && COUNTRY_LABELS[code]) {
    return COUNTRY_LABELS[code];
  }

  return code ?? "Sin país";
}

export function formatRelativeTimeEs(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "recién";
  }

  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return "hace un momento";
  }

  if (minutes < 60) {
    return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `hace ${days} ${days === 1 ? "día" : "días"}`;
  }

  return date.toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
