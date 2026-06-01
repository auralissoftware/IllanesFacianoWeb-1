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
      <WhatsAppIcon className="size-5 shrink-0 sm:size-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
