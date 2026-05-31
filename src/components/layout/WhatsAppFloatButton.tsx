import { WhatsAppIcon } from "../icons/WhatsAppIcon";
import { getWhatsAppUrl } from "../../lib/contact";

export function WhatsAppFloatButton() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
