export type UserRole = "passenger" | "controller";

const SESSION_KEY = "rail_drishti_session";

type Session = {
  role: UserRole;
  username: string;
  email: string;
  seatNumber?: string;
  coachNumber?: string;
  trainNumber?: string;
};

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (parsed.role === "passenger" || parsed.role === "controller") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSession(role: UserRole, username: string, email: string, seatNumber?: string, coachNumber?: string, trainNumber?: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ role, username, email, seatNumber, coachNumber, trainNumber }));
}

export function updateSessionData(data: Partial<Omit<Session, 'role' | 'username' | 'email'>>): void {
  const session = getSession();
  if (!session) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...session, ...data }));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
