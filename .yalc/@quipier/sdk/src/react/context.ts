import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { ProjectSession } from "../storage.js";
import type { QuipierConfig } from "../react.js";

export interface QuipierSessionState {
  session: ProjectSession | null;
  loading: boolean;
  connecting: boolean;
  error: string | null;
  connect(): void;
  disconnect(): void;
  clearError(): void;
}

export const QuipierConfigContext = createContext<QuipierConfig | null>(null);
export const QuipierSessionContext = createContext<QuipierSessionState | null>(null);

export function useQuipierConfig(): QuipierConfig {
  const context = useContext(QuipierConfigContext);
  if (!context) {
    throw new Error(
      "useQuipierConfig must be used inside <QuipierProvider>",
    );
  }
  return context;
}

export function useQuipierSession(): QuipierSessionState {
  const context = useContext(QuipierSessionContext);
  if (!context) {
    throw new Error(
      "useQuipierSession must be used inside <QuipierProvider>",
    );
  }
  return context;
}

export interface SessionSetters {
  setSession: Dispatch<SetStateAction<ProjectSession | null>>;
  setConnecting: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string | null>>;
}
