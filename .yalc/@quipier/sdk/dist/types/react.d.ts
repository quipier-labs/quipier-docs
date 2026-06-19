import { type CSSProperties, type ReactNode } from "react";
import { type FeedInitOptions, type InitOptions } from "./index.js";
export { useQuipierConfig, useQuipierSession, type QuipierSessionState, } from "./react/context.js";
export { useQuipierFeed, type UseQuipierFeedOptions, type UseQuipierFeedResult, } from "./react/useQuipierFeed.js";
export { useQuipierChat, type UseQuipierChatOptions, type UseQuipierChatResult, } from "./react/useQuipierChat.js";
export { QuipierChat, type QuipierChatProps } from "./react/QuipierChat.js";
export type { ChatRoom, ChatPeer, ChatMessage, ChatRoomKind, ChatUser, CreateOpenRoomInput, } from "./types.js";
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
    /** Theme tokens. See init() `appearance`. */
    appearance?: InitOptions["appearance"];
    /** Feature toggles. See init() `features`. */
    features?: InitOptions["features"];
    /** Per-part render overrides. See init() `slots`. */
    slots?: InitOptions["slots"];
}
export interface QuipierProviderProps {
    config: QuipierConfig;
    children: ReactNode;
}
export declare function QuipierProvider({ config, children }: QuipierProviderProps): import("react").FunctionComponentElement<import("react").ProviderProps<QuipierConfig | null>>;
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
    appearance?: InitOptions["appearance"];
    features?: InitOptions["features"];
    slots?: InitOptions["slots"];
    onComment?: InitOptions["onComment"];
    className?: string;
    style?: CSSProperties;
}
export declare const QuipierComments: import("react").ForwardRefExoticComponent<QuipierCommentsProps & import("react").RefAttributes<HTMLDivElement>>;
export interface QuipierFeedProps {
    apiKey?: string;
    projectId?: string;
    apiBase?: string;
    passportAppOrigin?: string;
    theme?: FeedInitOptions["theme"];
    dateFormat?: FeedInitOptions["dateFormat"];
    onPost?: FeedInitOptions["onPost"];
    urlSync?: FeedInitOptions["urlSync"];
    urlParam?: FeedInitOptions["urlParam"];
    shareUrl?: FeedInitOptions["shareUrl"];
    appearance?: FeedInitOptions["appearance"];
    className?: string;
    style?: CSSProperties;
}
/** Project-global feed (Feed module). Reads connection config from the
 *  surrounding <QuipierProvider>; per-instance props override it. */
export declare const QuipierFeed: import("react").ForwardRefExoticComponent<QuipierFeedProps & import("react").RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=react.d.ts.map