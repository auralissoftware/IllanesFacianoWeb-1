import { LegalPageLayout, LegalSection } from "../components/legal/LegalPageLayout";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_EMAIL,
  LEGAL_JURISDICTION,
  LEGAL_OWNER_NAME,
  LEGAL_PHONE,
  LEGAL_PROFESSION,
} from "../lib/legalSiteInfo";

export function PrivacyPage() {
  return (
    <LegalPageLayout title="Política de Privacidad">
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          El responsable del tratamiento de los datos personales recabados a
          través del sitio web de <strong>{LEGAL_BUSINESS_NAME}</strong> es{" "}
          <strong>{LEGAL_OWNER_NAME}</strong>, {LEGAL_PROFESSION}, con domicilio
          en {LEGAL_JURISDICTION}. Podés contactarlo en{" "}
          <a
            href={`mailto:${LEGAL_EMAIL}`}
            className="font-medium text-azul-francia hover:text-navy"
          >
            {LEGAL_EMAIL}
          </a>{" "}
          o al teléfono {LEGAL_PHONE}.
        </p>
        <p>
          El presente documento se rige por la Ley N° 25.326 de Protección de
          Datos Personales de la República Argentina y normas complementarias
          dictadas por la Agencia de Acceso a la Información Pública (AAIP).
        </p>
      </LegalSection>

      <LegalSection title="2. Datos que recopilamos">
        <p>
          Este sitio web es de consulta pública. Podés navegar por el catálogo de
          propiedades, vehículos, activos y remates sin registrarte ni
          proporcionar datos personales.
        </p>
        <p>
          Solo recopilamos datos personales cuando completás voluntariamente el
          formulario de contacto. En ese caso, podemos recibir:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Nombre y apellido</li>
          <li>Número de celular</li>
          <li>Dirección de correo electrónico</li>
          <li>Motivo de la consulta</li>
          <li>Contenido del mensaje</li>
        </ul>
        <p>
          El panel de administración del sitio utiliza credenciales de acceso
          gestionadas por el titular del servicio y no solicita datos personales
          a los visitantes del sitio público.
        </p>
      </LegalSection>

      <LegalSection title="3. Finalidad del tratamiento">
        <p>
          Los datos del formulario de contacto se utilizan{" "}
          <strong>exclusivamente para responder tu consulta</strong> o
          comunicarnos con vos en relación con el motivo indicado.
        </p>
        <p>
          No utilizamos esos datos con fines publicitarios, de prospección
          comercial masiva ni para elaborar perfiles. Tampoco los vendemos, los
          cedemos ni los compartimos con terceros con fines propios ajenos a la
          atención de tu solicitud.
        </p>
      </LegalSection>

      <LegalSection title="4. Base de legitimación">
        <p>
          El tratamiento se basa en tu consentimiento, otorgado al enviar el
          formulario de contacto de manera libre, expresa e informada. Podés
          retirarlo en cualquier momento solicitando la supresión de tus datos,
          sin perjuicio de las comunicaciones necesarias para atender consultas
          ya iniciadas.
        </p>
      </LegalSection>

      <LegalSection title="5. Conservación de los datos">
        <p>
          Conservaremos los datos el tiempo estrictamente necesario para
          responder tu consulta y, en su caso, dar seguimiento comercial o
          profesional vinculado a ella. Transcurrido un plazo razonable sin
          relación activa, procederemos a su eliminación o anonimización.
        </p>
      </LegalSection>

      <LegalSection title="6. Comunicación a terceros">
        <p>
          Para recibir las consultas del formulario utilizamos un servicio de
          envío de correo electrónico que actúa como encargado de tratamiento
          técnico, con la única finalidad de transmitir el mensaje a{" "}
          {LEGAL_EMAIL}. Ese proveedor no utiliza tus datos con fines propios
          distintos al envío solicitado.
        </p>
        <p>
          No compartimos datos personales del formulario con anunciantes,
          plataformas de marketing ni otras empresas. Solo podrán ser
          comunicados a autoridades competentes cuando exista una obligación
          legal o un requerimiento válido en los términos de la legislación
          vigente.
        </p>
      </LegalSection>

      <LegalSection title="7. Seguridad">
        <p>
          Adoptamos medidas técnicas y organizativas razonables para proteger
          los datos personales contra acceso no autorizado, pérdida, alteración
          o divulgación indebida. Ningún sistema de transmisión o almacenamiento
          en internet es absolutamente infalible; por ello, no podemos
          garantizar seguridad total, aunque trabajamos para mantener estándares
          adecuados.
        </p>
      </LegalSection>

      <LegalSection title="8. Derechos del titular de los datos">
        <p>
          Conforme la Ley N° 25.326, tenés derecho a acceder a tus datos
          personales, solicitar su rectificación, actualización o supresión
          cuando correspondan incompletos, inexactos o excesivos, y a oponerte
          al tratamiento en los supuestos previstos por la ley.
        </p>
        <p>
          Para ejercer estos derechos, escribinos a{" "}
          <a
            href={`mailto:${LEGAL_EMAIL}`}
            className="font-medium text-azul-francia hover:text-navy"
          >
            {LEGAL_EMAIL}
          </a>{" "}
          indicando tu nombre, medio de contacto y el pedido concreto. Responderemos
          en un plazo razonable.
        </p>
        <p>
          La Agencia de Acceso a la Información Pública, órgano de control de
          la Ley N° 25.326, tiene la atribución de atender denuncias y reclamos
          relacionados con el incumplimiento de las normas sobre protección de
          datos personales. Podés consultar información en{" "}
          <a
            href="https://www.argentina.gob.ar/aaip"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-azul-francia hover:text-navy"
          >
            www.argentina.gob.ar/aaip
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Cookies y datos técnicos">
        <p>
          El sitio puede utilizar cookies o tecnologías similares estrictamente
          necesarias para su funcionamiento y seguridad. No utilizamos cookies
          con fines publicitarios de terceros. Podés configurar tu navegador
          para rechazar cookies, aunque ello podría afectar algunas
          funcionalidades.
        </p>
        <p>
          Asimismo, los servidores y proveedores de hosting pueden registrar
          datos técnicos de conexión (como dirección IP, fecha y hora de acceso)
          con fines de seguridad y estadísticas agregadas.
        </p>
      </LegalSection>

      <LegalSection title="10. Menores de edad">
        <p>
          Este sitio no está dirigido a menores de 18 años. No solicitamos
          intencionalmente datos personales de menores. Si detectamos que se
          recopilaron sin consentimiento de quien ejerce la responsabilidad
          parental, procederemos a eliminarlos.
        </p>
      </LegalSection>

      <LegalSection title="11. Modificaciones">
        <p>
          Podemos actualizar esta Política de Privacidad para reflejar cambios
          legales o operativos. La versión vigente estará publicada en esta
          página con su fecha de última actualización. Te recomendamos revisarla
          periódicamente.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
