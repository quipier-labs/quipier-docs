const PROJECT_SESSION_PREFIX = "quipier:session:";

export interface ProjectSession {
  projectId: string;
  projectTokenId: string;
  nickname: string;
  sessionToken: string;
  expiresAt: number; // ms epoch
}

export function loadProjectSession(projectId: string): ProjectSession | null {
  try {
    const raw = localStorage.getItem(PROJECT_SESSION_PREFIX + projectId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectSession;
    if (parsed.expiresAt > Date.now() + 10_000) return parsed;
    localStorage.removeItem(PROJECT_SESSION_PREFIX + projectId);
    return null;
  } catch {
    return null;
  }
}

export function saveProjectSession(session: ProjectSession): void {
  try {
    localStorage.setItem(
      PROJECT_SESSION_PREFIX + session.projectId,
      JSON.stringify(session),
    );
  } catch {
    // ignore (private mode, quota)
  }
}

export function clearProjectSession(projectId: string): void {
  try {
    localStorage.removeItem(PROJECT_SESSION_PREFIX + projectId);
  } catch {
    // ignore
  }
}

