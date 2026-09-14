import { Link } from "react-router-dom";
import { LegalPageLayout, LegalSection } from "../components/legal/LegalPageLayout";
import {
  LEGAL_BUSINESS_NAME,
  LEGAL_EMAIL,
  LEGAL_JURISDICTION,
  LEGAL_LICENSE,
  LEGAL_OWNER_NAME,
  LEGAL_PHONE,
} from "../lib/legalSiteInfo";

export function CookiesPage() {
  return (
    <LegalPageLayout title="Política de Cookies">
      <div className="rounded-2xl border border-slate-deep/10 bg-off-white/50 px-5 py-5 text-sm leading-7 text-slate-deep/90 sm:text-base">
        <p>
          La presente Política de Cookies regula el uso de tecnologías de
          almacenamiento local y cookies en el sitio web de{" "}
          <strong>{LEGAL_BUSINESS_NAME}</strong>, de titularidad de{" "}
          <strong>{LEGAL_OWNER_NAME}</strong>, Martillero Público, Perito
          Tasador y Corredor Inmobiliario, {LEGAL_LICENSE}, con domicilio en{" "}
          {LEGAL_JURISDICTION}. El objetivo es brindar información clara,
          veraz y suficiente sobre qué datos se almacenan en su dispositivo y
          con qué finalidad.
        </p>
      </div>

      <LegalSection title="1. ¿Qué son las cookies?">
        <p>
          Las cookies son pequeños archivos de texto que el navegador de internet
          descarga y almacena en el dispositivo del usuario (computadora,
          teléfono móvil, tableta u otro terminal) cuando accede a un sitio web.
          Permiten, entre otras funciones, recordar preferencias de navegación,
          mantener sesiones activas y recopilar información estadística de uso de
          forma agregada.
        </p>
        <p>
          Además de las cookies propiamente dichas, este sitio puede utilizar
          tecnologías similares de almacenamiento local del navegador (por
          ejemplo, <code className="text-sm">localStorage</code> o{" "}
          <code className="text-sm">sessionStorage</code>) para finalidades
          técnicas o, con su consentimiento previo, analíticas.
        </p>
      </LegalSection>

      <LegalSection title="2. Tipos de cookies que utiliza este sitio web">
        <h3 className="text-base font-semibold text-navy">
          2.1. Cookies técnicas y funcionales (necesarias)
        </h3>
        <p>
          Son imprescindibles para la navegación, la seguridad y el correcto
          funcionamiento del sitio. Incluyen, a título enunciativo:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Gestión de la sesión del panel de administración (usuarios
            autorizados).
          </li>
          <li>
            Registro de la decisión del usuario respecto de cookies analíticas
            (clave <code className="text-sm">cookie_consent</code> en{" "}
            <code className="text-sm">localStorage</code>).
          </li>
          <li>
            Preferencias técnicas de la sesión de consulta del catálogo
            inmobiliario (por ejemplo, evitar conteos duplicados de
            visualización en una misma visita).
          </li>
        </ul>
        <p>
          Estas cookies no requieren consentimiento previo por resultar
          estrictamente necesarias para la prestación del servicio solicitado por
          el usuario.
        </p>

        <h3 className="mt-6 text-base font-semibold text-navy">
          2.2. Cookies analíticas y de métricas (opcionales)
        </h3>
        <p>
          Solo se activan cuando el usuario hace clic en &quot;Aceptar&quot; en
          el banner de cookies. Permiten registrar, de manera agregada:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Visualizaciones de publicaciones del catálogo inmobiliario (propiedades,
            bienes muebles y remates).
          </li>
          <li>
            Estadísticas internas de consulta para el titular del sitio (por
            ejemplo, total de visitas y distribución aproximada por provincia
            dentro de la República Argentina, cuando la geolocalización por IP
            esté disponible).
          </li>
        </ul>
        <p>
          Estos datos no se comercializan ni se ceden a terceros con fines
          publicitarios. Se utilizan exclusivamente para mejorar la información
          del catálogo y la gestión profesional del servicio inmobiliario y de
          remates.
        </p>
      </LegalSection>

      <LegalSection title="3. Consentimiento del usuario y revocación">
        <p>
          Al ingresar por primera vez al sitio, se muestra un banner informativo
          mediante el cual el usuario puede <strong>aceptar</strong> o{" "}
          <strong>rechazar</strong> las cookies analíticas. La elección se
          almacena en el dispositivo bajo la clave{" "}
          <code className="text-sm">cookie_consent</code>, con valores{" "}
          <code className="text-sm">accepted</code> o{" "}
          <code className="text-sm">rejected</code>.
        </p>
        <p>
          El consentimiento puede revocarse en cualquier momento eliminando los
          datos del sitio desde la configuración del navegador o borrando el
          almacenamiento local asociado a este dominio. Tras la revocación, el
          banner volverá a exhibirse en una visita posterior para que el usuario
          pueda manifestar nuevamente su voluntad.
        </p>
        <p>
          La negativa o revocación del consentimiento para cookies analíticas no
          impide la navegación general del sitio ni el acceso al catálogo
          público, salvo las limitaciones propias de no registrar métricas de
          visualización.
        </p>
      </LegalSection>

      <LegalSection title="4. Cómo deshabilitar o eliminar cookies en los navegadores principales">
        <p>
          El usuario puede configurar su navegador para bloquear, limitar o
          eliminar cookies y datos almacenados localmente. A continuación, se
          indican las rutas habituales de configuración (pueden variar según la
          versión del navegador):
        </p>

        <h3 className="text-base font-semibold text-navy">Google Chrome</h3>
        <p>
          Menú <strong>Configuración</strong> → <strong>Privacidad y seguridad</strong>{" "}
          → <strong>Borrar datos de navegación</strong> /{" "}
          <strong>Cookies y otros datos de sitios</strong>.
        </p>

        <h3 className="mt-4 text-base font-semibold text-navy">Microsoft Edge</h3>
        <p>
          Menú <strong>Configuración</strong> → <strong>Privacidad, búsqueda y servicios</strong>{" "}
          → <strong>Borrar datos de exploración</strong> /{" "}
          <strong>Cookies y permisos del sitio</strong>.
        </p>

        <h3 className="mt-4 text-base font-semibold text-navy">Safari (macOS / iOS)</h3>
        <p>
          <strong>Ajustes</strong> → <strong>Safari</strong> →{" "}
          <strong>Privacidad y seguridad</strong> → gestionar{" "}
          <strong>Cookies</strong> o <strong>Borrar historial y datos</strong>.
        </p>

        <h3 className="mt-4 text-base font-semibold text-navy">Mozilla Firefox</h3>
        <p>
          Menú <strong>Configuración</strong> → <strong>Privacidad y seguridad</strong>{" "}
          → <strong>Cookies y datos del sitio</strong> →{" "}
          <strong>Limpiar datos</strong> o gestionar excepciones por sitio.
        </p>

        <p>
          La desactivación total de cookies técnicas puede afectar el correcto
          funcionamiento de algunas funciones del sitio.
        </p>
      </LegalSection>

      <LegalSection title="5. Marco legal aplicable">
        <p>
          El tratamiento de datos vinculado al uso de cookies y tecnologías
          afines se realiza conforme a la{" "}
          <strong>
            Ley N° 25.326 de Protección de Datos Personales
          </strong>{" "}
          de la República Argentina, su normativa complementaria y las
          disposiciones de la{" "}
          <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>,
          organismo de control de la citada ley.
        </p>
        <p>
          Asimismo, resultan de aplicación los principios de licitud, calidad,
          finalidad, proporcionalidad, transparencia y seguridad de los datos
          personales, en la medida en que la información recabada mediante
          cookies analíticas pueda vincularse o asociarse a un usuario o
          dispositivo identificable.
        </p>
        <p>
          Para mayor información sobre el tratamiento general de datos
          personales, el usuario puede consultar la{" "}
          <Link
            to="/privacidad"
            className="font-medium text-azul-francia hover:text-navy"
          >
            Política de Privacidad
          </Link>{" "}
          de este sitio web.
        </p>
      </LegalSection>

      <LegalSection title="6. Vías de contacto para consultas de privacidad">
        <p>
          Para ejercer derechos de acceso, rectificación, supresión u oposición,
          o para formular consultas vinculadas a cookies y protección de datos
          personales, el usuario puede contactar al titular del sitio por los
          siguientes medios:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Correo electrónico:{" "}
            <a
              href={`mailto:${LEGAL_EMAIL}`}
              className="font-medium text-azul-francia hover:text-navy"
            >
              {LEGAL_EMAIL}
            </a>
          </li>
          <li>
            Teléfono: {LEGAL_PHONE}
          </li>
          <li>
            Formulario de contacto disponible en la{" "}
            <Link
              to="/#contacto"
              className="font-medium text-azul-francia hover:text-navy"
            >
              página principal del sitio
            </Link>
            .
          </li>
        </ul>
        <p>
          {LEGAL_OWNER_NAME} atenderá las solicitudes dentro de los plazos y
          condiciones previstos por la normativa vigente.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
