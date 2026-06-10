export interface ProjectSession {
    projectId: string;
    projectTokenId: string;
    nickname: string;
    sessionToken: string;
    expiresAt: number;
}
export declare function loadProjectSession(projectId: string): ProjectSession | null;
export declare function saveProjectSession(session: ProjectSession): void;
export declare function clearProjectSession(projectId: string): void;
//# sourceMappingURL=storage.d.ts.map