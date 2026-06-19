import { type Dispatch, type SetStateAction } from "react";
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
export declare const QuipierConfigContext: import("react").Context<QuipierConfig | null>;
export declare const QuipierSessionContext: import("react").Context<QuipierSessionState | null>;
export declare function useQuipierConfig(): QuipierConfig;
export declare function useQuipierSession(): QuipierSessionState;
export interface SessionSetters {
    setSession: Dispatch<SetStateAction<ProjectSession | null>>;
    setConnecting: Dispatch<SetStateAction<boolean>>;
    setError: Dispatch<SetStateAction<string | null>>;
}
//# sourceMappingURL=context.d.ts.map