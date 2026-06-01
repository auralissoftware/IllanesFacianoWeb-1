import { LegalPageLayout, LegalSection } from "../components/legal/LegalPageLayout";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_EMAIL,
  LEGAL_JURISDICTION,
  LEGAL_LICENSE,
  LEGAL_OWNER_NAME,
  LEGAL_PHONE,
  LEGAL_PROFESSION,
} from "../lib/legalSiteInfo";

export function TermsPage() {
  return (
    <LegalPageLayout title="Términos y Condiciones">
      <LegalSection title="1. Titular del sitio">
        <p>
          El presente sitio web es operado por{" "}
          <strong>{LEGAL_OWNER_NAME}</strong>, en adelante &quot;el
          Titular&quot;, quien actúa en su carácter de {LEGAL_PROFESSION} (
          {LEGAL_LICENSE}), con domicilio en {LEGAL_JURISDICTION}.
        </p>
        <p>
          El acceso y uso del sitio implican la aceptación de estos Términos y
          Condiciones. Si no estás de acuerdo, te solicitamos que no utilices el
          sitio.
        </p>
      </LegalSection>

      <LegalSection title="2. Objeto del sitio">
        <p>
          <strong>{LEGAL_BUSINESS_NAME}</strong> es un sitio informativo que
          permite consultar propiedades, vehículos, activos y remates publicados
          por el Titular, así como contactarlo mediante formulario, teléfono,
          correo electrónico o WhatsApp.
        </p>
        <p>
          La información publicada tiene carácter orientativo y no constituye,
          por sí sola, oferta contractual vinculante. Las condiciones
          definitivas de cualquier operación serán acordadas directamente con el
          Titular conforme la normativa aplicable a cada actividad profesional.
        </p>
      </LegalSection>

      <LegalSection title="3. Uso permitido">
        <p>El usuario se compromete a utilizar el sitio de manera lícita y de buena fe, absteniéndose de:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Reproducir, copiar, distribuir o explotar comercialmente los
            contenidos sin autorización previa y por escrito del Titular.
          </li>
          <li>
            Introducir virus, realizar ataques o intentar acceder sin
            autorización a sistemas, cuentas o áreas restringidas del sitio.
          </li>
          <li>
            Utilizar los datos de contacto publicados para envío de spam,
            publicidad no solicitada o fines ajenos a una consulta genuina.
          </li>
          <li>
            Publicar o transmitir contenido falso, difamatorio, discriminatorio
            o contrario al orden público y la moral.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Propiedad intelectual">
        <p>
          Todos los contenidos del sitio —incluyendo, sin limitarse a, textos,
          fotografías, videos, logotipos, diseño gráfico, estructura,
          publicaciones del catálogo y demás materiales— son propiedad
          exclusiva del Titular o de terceros que hayan autorizado su uso, y se
          encuentran protegidos por la legislación argentina e internacional
          sobre propiedad intelectual.
        </p>
        <p>
          Queda expresamente prohibida su reproducción total o parcial,
          modificación, distribución, comunicación pública o cualquier otro uso
          no autorizado, salvo consentimiento previo y por escrito del Titular.
          El acceso al sitio no implica cesión de derechos de propiedad
          intelectual alguna.
        </p>
      </LegalSection>

      <LegalSection title="5. Exención de responsabilidad por interrupciones técnicas">
        <p>
          El Titular procurará mantener el sitio operativo y actualizado, pero{" "}
          <strong>
            no garantiza la disponibilidad continua, ininterrumpida o libre de
            errores
          </strong>{" "}
          del servicio. El sitio puede experimentar interrupciones, demoras,
          fallas técnicas, mantenimiento programado o situaciones ajenas al
          control razonable del Titular (incluyendo cortes de internet, fallas de
          hosting, servicios de terceros o fuerza mayor).
        </p>
        <p>
          En ningún caso el Titular será responsable por daños directos o
          indirectos derivados de la imposibilidad de acceder al sitio, de la
          pérdida de datos, de errores en la visualización de publicaciones o de
          decisiones tomadas exclusivamente con base en la información
          publicada, sin verificación directa con el Titular.
        </p>
      </LegalSection>

      <LegalSection title="6. Enlaces a terceros">
        <p>
          El sitio puede contener enlaces a servicios externos (por ejemplo,
          WhatsApp, correo electrónico o mapas). El Titular no controla ni es
          responsable por el contenido, políticas o prácticas de esos sitios
          ajenos. El acceso a los mismos es bajo tu exclusiva responsabilidad.
        </p>
      </LegalSection>

      <LegalSection title="7. Datos personales">
        <p>
          El tratamiento de datos personales se rige por la{" "}
          <a
            href="/privacidad"
            className="font-medium text-azul-francia hover:text-navy"
          >
            Política de Privacidad
          </a>
          , que forma parte integrante de estos Términos y Condiciones.
        </p>
      </LegalSection>

      <LegalSection title="8. Modificaciones">
        <p>
          El Titular podrá modificar estos Términos y Condiciones en cualquier
          momento. Las modificaciones entrarán en vigencia desde su publicación
          en esta página. El uso continuado del sitio después de dichos cambios
          implicará su aceptación.
        </p>
      </LegalSection>

      <LegalSection title="9. Ley aplicable y jurisdicción">
        <p>
          Estos Términos y Condiciones se rigen por las leyes de la República
          Argentina. Para cualquier controversia derivada del uso del sitio, las
          partes se someten a la jurisdicción de los tribunales ordinarios de{" "}
          {LEGAL_JURISDICTION}, renunciando a cualquier otro fuero que pudiera
          corresponder.
        </p>
      </LegalSection>

      <LegalSection title="10. Contacto">
        <p>
          Para consultas sobre estos Términos y Condiciones podés comunicarte
          con el Titular:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Email:{" "}
            <a
              href={`mailto:${LEGAL_EMAIL}`}
              className="font-medium text-azul-francia hover:text-navy"
            >
              {LEGAL_EMAIL}
            </a>
          </li>
          <li>Teléfono: {LEGAL_PHONE}</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  );
}
