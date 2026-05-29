import { type CSSProperties, type ReactNode } from "react";
import { type InitOptions } from "./index.js";
export interface QuipierConfig {
    projectId: string;
    apiKey: string;
    /** Defaults to https://api.quipier.com */
    apiBase?: string;
    /** Defaults to https://passport.quipier.com */
    passportAppOrigin?: string;
    /** @deprecated Use `passportAppOrigin`. */
    walletAppOrigin?: string;
    /** Widget appearance — see init() options. Overridable per <QuipierComments>. */
    theme?: InitOptions["theme"];
    dateFormat?: InitOptions["dateFormat"];
    maxDepth?: InitOptions["maxDepth"];
    sort?: InitOptions["sort"];
}
export interface QuipierProviderProps {
    config: QuipierConfig;
    children: ReactNode;
}
export declare function QuipierProvider({ config, children }: QuipierProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<QuipierConfig | null>>;
export declare function useQuipierConfig(): QuipierConfig;
export interface QuipierCommentsProps {
    /** Logical page id this widget instance scopes comments to.
     *  Defaults to window.location.pathname inside the SDK. */
    pageId?: string;
    /** Per-widget overrides — only set when you want this instance to differ
     *  from the surrounding Provider. */
    apiKey?: string;
    projectId?: string;
    apiBase?: string;
    passportAppOrigin?: string;
    /** @deprecated Use `passportAppOrigin`. */
    walletAppOrigin?: string;
    theme?: InitOptions["theme"];
    dateFormat?: InitOptions["dateFormat"];
    maxDepth?: InitOptions["maxDepth"];
    sort?: InitOptions["sort"];
    onComment?: InitOptions["onComment"];
    className?: string;
    style?: CSSProperties;
}
export declare const QuipierComments: import("react").ForwardRefExoticComponent<QuipierCommentsProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=react.d.ts.map