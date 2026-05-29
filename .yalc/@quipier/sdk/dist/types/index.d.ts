export interface InitOptions {
    container: string | HTMLElement;
    apiKey?: string;
    projectId?: string;
    pageId?: string;
    apiBase?: string;
    /** Origin of the Quipier passport popup. New name. */
    passportAppOrigin?: string;
    /** @deprecated Use `passportAppOrigin`. Old name, still accepted. */
    walletAppOrigin?: string;
    onComment?: (comment: unknown) => void;
    /** Color theme. Default "light" — embed widgets usually sit on light pages.
     *  "auto" follows the OS (prefers-color-scheme); "dark" forces dark. Colors
     *  can be overridden via CSS custom properties on the container
     *  (e.g. `--quipier-accent`). */
    theme?: "light" | "dark" | "auto";
    /** Timestamp style. Default "relative" ("3분 전"); "absolute" shows a date. */
    dateFormat?: "relative" | "absolute";
    /** Reply nesting: 2 = threaded (default), 1 = flat (no replies shown). */
    maxDepth?: 1 | 2;
    /** Default sort. Default "top". */
    sort?: "top" | "newest";
}
export declare function init(options: InitOptions): void;
export declare function destroy(target: string | HTMLElement): void;
//# sourceMappingURL=index.d.ts.map