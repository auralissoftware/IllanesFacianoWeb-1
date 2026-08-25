import { requireSupabase, supabase } from "./supabase";

export type AuthResult = { ok: true } | { ok: false; error: string };

const STORAGE_KEY = "illanes-admin-auth-attempts";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

type AttemptRecord = {
  count: number;
  lockedUntil: number | null;
};

function readAttempts(): AttemptRecord {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { count: 0, lockedUntil: null };
    }

    return JSON.parse(raw) as AttemptRecord;
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function writeAttempts(record: AttemptRecord) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function getLockoutState(): {
  locked: boolean;
  remainingMs: number;
  attemptsLeft: number;
} {
  const record = readAttempts();
  const now = Date.now();

  if (record.lockedUntil && now < record.lockedUntil) {
    return {
      locked: true,
      remainingMs: record.lockedUntil - now,
      attemptsLeft: 0,
    };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    writeAttempts({ count: 0, lockedUntil: null });
  }

  return {
    locked: false,
    remainingMs: 0,
    attemptsLeft: MAX_ATTEMPTS - record.count,
  };
}

export function recordFailedAttempt() {
  const record = readAttempts();
  const nextCount = record.count + 1;

  if (nextCount >= MAX_ATTEMPTS) {
    writeAttempts({
      count: nextCount,
      lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
    });
    return;
  }

  writeAttempts({ count: nextCount, lockedUntil: null });
}

export function clearFailedAttempts() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "El email no está confirmado. En Supabase → Authentication → Users, abrí el usuario y marcá Confirm user, o creá uno nuevo con Auto Confirm User.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos. Verificá que el usuario exista en Supabase (Authentication → Users) y que la contraseña coincida exactamente.";
  }

  if (normalized.includes("user banned")) {
    return "Este usuario está bloqueado en Supabase. Revisá Authentication → Users.";
  }

  return message;
}

export async function adminLogin(
  email: string,
  password: string,
): Promise<AuthResult> {
  const lockout = getLockoutState();

  if (lockout.locked) {
    return {
      ok: false,
      error: "Demasiados intentos fallidos. Esperá unos minutos antes de reintentar.",
    };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  if (password.length < 8) {
    return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase no está configurado. Agregá las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    recordFailedAttempt();
    return {
      ok: false,
      error: mapAuthErrorMessage(error.message),
    };
  }

  clearFailedAttempts();
  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isValidEmail(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }

  if (!supabase) {
    return {
      ok: false,
      error:
        "Supabase no está configurado. Agregá las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    };
  }

  const redirectTo = `${window.location.origin}/admin/login`;

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  if (!supabase) {
    return;
  }

  await supabase.auth.signOut();
}

export function isJwtSessionError(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("jwt issued at future") ||
    normalized.includes("jwt expired") ||
    normalized.includes("invalid jwt") ||
    normalized.includes("session not found")
  );
}

export function mapSupabaseSessionError(message: string): string {
  if (message.toLowerCase().includes("jwt issued at future")) {
    return "La hora de tu dispositivo está adelantada. Sincronizá la fecha y hora del sistema, cerrá sesión e ingresá de nuevo.";
  }

  if (isJwtSessionError(message)) {
    return "Tu sesión expiró o dejó de ser válida. Volvé a iniciar sesión.";
  }

  return message;
}

export async function ensureAdminSession() {
  const client = requireSupabase();

  const { data: userData, error: userError } = await client.auth.getUser();

  if (!userError && userData.user) {
    return client;
  }

  const { data: refreshData, error: refreshError } =
    await client.auth.refreshSession();

  if (!refreshError && refreshData.session) {
    return client;
  }

  const message =
    refreshError?.message ??
    userError?.message ??
    "Tenés que iniciar sesión en el panel admin.";

  throw new Error(message);
}

export async function hasAdminSession(): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  try {
    await ensureAdminSession();
    return true;
  } catch {
    return false;
  }
}

export function formatLockoutTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export { supabase, requireSupabase };
