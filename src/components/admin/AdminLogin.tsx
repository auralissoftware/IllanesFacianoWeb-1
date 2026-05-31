import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminLogin,
  clearFailedAttempts,
  formatLockoutTime,
  getLockoutState,
  isValidEmail,
  requestPasswordReset,
} from "../../lib/adminAuth";

type ViewMode = "login" | "forgot-password";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function AdminLogin() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [hasAuthError, setHasAuthError] = useState(false);
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0);

  const isLocked = lockoutRemainingMs > 0;

  useEffect(() => {
    function syncLockout() {
      const { locked, remainingMs } = getLockoutState();
      setLockoutRemainingMs(locked ? remainingMs : 0);
    }

    syncLockout();
    const interval = window.setInterval(syncLockout, 1000);

    return () => window.clearInterval(interval);
  }, [isSubmitting, alertMessage]);

  function resetMessages() {
    setAlertMessage("");
    setSuccessMessage("");
    setFieldErrors({});
    setHasAuthError(false);
  }

  function switchView(nextView: ViewMode) {
    setView(nextView);
    resetMessages();
    setPassword("");
  }

  function validateLoginFields(): boolean {
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = "El email es obligatorio.";
    } else if (!isValidEmail(email)) {
      errors.email = "Ingresá un email válido.";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      errors.password = "Mínimo 8 caracteres.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateResetEmail(): boolean {
    if (!email.trim()) {
      setFieldErrors({ email: "El email es obligatorio." });
      return false;
    }

    if (!isValidEmail(email)) {
      setFieldErrors({ email: "Ingresá un email válido." });
      return false;
    }

    setFieldErrors({});
    return true;
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (isLocked) {
      setAlertMessage(
        `Acceso bloqueado temporalmente. Reintentá en ${formatLockoutTime(lockoutRemainingMs)}.`,
      );
      return;
    }

    if (!validateLoginFields()) {
      return;
    }

    setIsSubmitting(true);

    const result = await adminLogin(email.trim(), password);

    setIsSubmitting(false);

    if (!result.ok) {
      setHasAuthError(true);
      setAlertMessage(result.error);
      return;
    }

    clearFailedAttempts();
    navigate("/admin/dashboard", { replace: true });
  }

  async function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    resetMessages();

    if (!validateResetEmail()) {
      return;
    }

    setIsSubmitting(true);

    const result = await requestPasswordReset(email.trim());

    setIsSubmitting(false);

    if (!result.ok) {
      setHasAuthError(true);
      setAlertMessage(result.error);
      return;
    }

    setSuccessMessage(
      "Si el correo está registrado como administrador, recibirás un enlace seguro para restablecer tu contraseña.",
    );
  }

  return (
    <div className="admin-login-shell relative flex min-h-screen items-center justify-center px-6 py-10">
      <div className="admin-login-mesh pointer-events-none absolute inset-0" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        <div className="admin-login-card">
          <div className="mb-5 text-center">
            <img
              src="/images/logo.png"
              alt="Illanes Faciano"
              className="mx-auto -mb-1 h-24 w-auto object-contain sm:h-28"
            />

            <p className="mt-3 text-xs font-semibold tracking-[0.18em] text-azul-francia uppercase">
              Panel de administración
            </p>

            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-deep">
              {view === "login" ? "Inicio de sesión" : "Recuperar acceso"}
            </h1>

            <p className="mt-1 text-sm leading-snug text-muted">
              {view === "login"
                ? "Acceso exclusivo para el administrador del sitio"
                : "Te enviaremos un enlace seguro de restablecimiento a tu correo."}
            </p>
          </div>

          {alertMessage && (
            <div
              className="admin-login-alert mb-5"
              role="alert"
              aria-live="polite"
            >
              {alertMessage}
            </div>
          )}

          {successMessage && (
            <div
              className="admin-login-success mb-5"
              role="status"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          {isLocked && view === "login" && (
            <div className="admin-login-alert mb-5" role="alert">
              Demasiados intentos fallidos. Reintentá en{" "}
              <span className="font-semibold">
                {formatLockoutTime(lockoutRemainingMs)}
              </span>
              .
            </div>
          )}

          {view === "login" ? (
            <form className="space-y-3" onSubmit={handleLoginSubmit} noValidate>
              <div>
                <label htmlFor="admin-email" className="admin-login-label">
                  Email
                </label>
                <div className="relative mt-1.5">
                  <span className="admin-login-input-icon-wrap" aria-hidden>
                    <Mail className="size-4" strokeWidth={2} />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    inputMode="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      resetMessages();
                    }}
                    placeholder="admin@illanesfaciano.com"
                    className={`admin-login-input !pl-12 ${
                      fieldErrors.email || hasAuthError
                        ? "admin-login-input-error"
                        : ""
                    }`}
                    aria-invalid={Boolean(fieldErrors.email || hasAuthError)}
                    aria-describedby={
                      fieldErrors.email ? "admin-email-error" : undefined
                    }
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="admin-email-error" className="admin-login-field-error">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin-password" className="admin-login-label">
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <span className="admin-login-input-icon-wrap" aria-hidden>
                    <Lock className="size-4" strokeWidth={2} />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      resetMessages();
                    }}
                    placeholder="••••••••"
                    className={`admin-login-input !pl-12 !pr-12 ${
                      fieldErrors.password || hasAuthError
                        ? "admin-login-input-error"
                        : ""
                    }`}
                    aria-invalid={Boolean(fieldErrors.password || hasAuthError)}
                    aria-describedby={
                      fieldErrors.password ? "admin-password-error" : undefined
                    }
                    disabled={isSubmitting || isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:text-slate-deep"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    disabled={isSubmitting || isLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" strokeWidth={2} />
                    ) : (
                      <Eye className="size-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="admin-password-error" className="admin-login-field-error">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => switchView("forgot-password")}
                  className="admin-login-link"
                  disabled={isSubmitting || isLocked}
                >
                  Olvidé mi contraseña
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLocked}
                className="admin-login-submit mt-2 w-full"
              >
                {isSubmitting ? "Verificando..." : "Ingresar al panel"}
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={handleResetSubmit} noValidate>
              <div>
                <label htmlFor="reset-email" className="admin-login-label">
                  Email del administrador
                </label>
                <div className="relative mt-1.5">
                  <span className="admin-login-input-icon-wrap" aria-hidden>
                    <Mail className="size-4" strokeWidth={2} />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      resetMessages();
                    }}
                    placeholder="admin@illanesfaciano.com"
                    className={`admin-login-input !pl-12 ${
                      fieldErrors.email ? "admin-login-input-error" : ""
                    }`}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "reset-email-error" : undefined
                    }
                    disabled={isSubmitting}
                  />
                </div>
                {fieldErrors.email && (
                  <p id="reset-email-error" className="admin-login-field-error">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="admin-login-submit mt-2 w-full"
              >
                {isSubmitting ? "Enviando enlace..." : "Enviar enlace de restablecimiento"}
              </button>

              <button
                type="button"
                onClick={() => switchView("login")}
                className="admin-login-back mx-auto mt-2 flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
                Volver al inicio de sesión
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-[11px] leading-snug text-muted/80">
            Acceso restringido. Solo personal autorizado.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs font-medium text-celeste transition hover:text-white">
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  );
}
