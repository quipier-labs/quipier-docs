// React adapter for @quipier/sdk.
// Wraps the imperative init/destroy in a Provider + Component pair so React
// consumers can do
//   <QuipierProvider config={...}>
//     <QuipierComments pageId={...} />
//   </QuipierProvider>
// instead of useEffect-with-ref.
//
// This file deliberately uses React.createElement (no JSX) so the SDK can keep
// its global JSX runtime targeted at Preact for the widget itself.

import {
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type ReactNode,
} from "react";
import {
  destroy,
  init,
  initFeed,
  type FeedInitOptions,
  type InitOptions,
} from "./index.js";
import {
  clearProjectSession,
  loadProjectSession,
  saveProjectSession,
  type ProjectSession,
} from "./storage.js";
import {
  QuipierConfigContext,
  QuipierSessionContext,
  useQuipierConfig,
  useQuipierSession,
  type QuipierSessionState,
} from "./react/context.js";
export {
  useQuipierConfig,
  useQuipierSession,
  type QuipierSessionState,
} from "./react/context.js";
export {
  useQuipierFeed,
  type UseQuipierFeedOptions,
  type UseQuipierFeedResult,
} from "./react/useQuipierFeed.js";
export {
  useQuipierChat,
  type UseQuipierChatOptions,
  type UseQuipierChatResult,
} from "./react/useQuipierChat.js";
export { QuipierChat, type QuipierChatProps } from "./react/QuipierChat.js";
export type {
  ChatRoom,
  ChatPeer,
  ChatMessage,
  ChatRoomKind,
  ChatUser,
  CreateOpenRoomInput,
} from "./types.js";

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

export function QuipierProvider({ config, children }: QuipierProviderProps) {
  const [session, setSession] = useState<ProjectSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passportAppOrigin =
    config.passportAppOrigin ??
    config.walletAppOrigin ??
    "https://passport.quipier.com";

  useEffect(() => {
    setSession(loadProjectSession(config.projectId));
    setLoading(false);
  }, [config.projectId]);

  useEffect(() => {
    const expectedOrigin = new URL(passportAppOrigin).origin;
    function onMessage(event: MessageEvent) {
      if (event.origin !== expectedOrigin) return;
      const message = event.data as {
        type?: string;
        ok?: boolean;
        project_id?: string;
        project_token_id?: string;
        nickname?: string;
        session_token?: string;
        expires_at?: string;
        message?: string;
      };
      if (message?.type !== "quipier:join:result") return;
      setConnecting(false);
      if (!message.ok) {
        setError(message.message ?? "패스포트 연결이 취소되었습니다");
        return;
      }
      if (
        message.project_id !== config.projectId ||
        !message.project_token_id ||
        !message.session_token ||
        !message.expires_at
      ) {
        setError("유효하지 않은 패스포트 연결 응답입니다");
        return;
      }
      const next: ProjectSession = {
        projectId: message.project_id,
        projectTokenId: message.project_token_id,
        nickname: message.nickname ?? "",
        sessionToken: message.session_token,
        expiresAt: new Date(message.expires_at).getTime(),
      };
      saveProjectSession(next);
      setSession(next);
      setError(null);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [config.projectId, passportAppOrigin]);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (connecting) return;
    const url = new URL(passportAppOrigin + "/join");
    url.searchParams.set("project_id", config.projectId);
    url.searchParams.set("return_origin", window.location.origin);
    const popup = window.open(
      url.toString(),
      "quipier-join",
      "width=480,height=760",
    );
    if (!popup) {
      setError("팝업 차단을 해제해주세요");
      return;
    }
    setConnecting(true);
    const poll = window.setInterval(() => {
      if (!popup.closed) return;
      window.clearInterval(poll);
      setConnecting(false);
    }, 500);
  }, [config.projectId, connecting, passportAppOrigin]);

  const disconnect = useCallback(() => {
    clearProjectSession(config.projectId);
    setSession(null);
    setConnecting(false);
  }, [config.projectId]);

  const sessionState = useMemo<QuipierSessionState>(
    () => ({
      session,
      loading,
      connecting,
      error,
      connect,
      disconnect,
      clearError: () => setError(null),
    }),
    [connect, connecting, disconnect, error, loading, session],
  );

  return createElement(
    QuipierConfigContext.Provider,
    { value: config },
    createElement(
      QuipierSessionContext.Provider,
      { value: sessionState },
      children,
    ),
  );
}

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

export const QuipierComments = forwardRef(function QuipierComments(
  props: QuipierCommentsProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const ctx = useQuipierConfig();
  const localRef = useRef<HTMLDivElement | null>(null);

  const projectId = props.projectId ?? ctx.projectId;
  const apiKey = props.apiKey ?? ctx.apiKey;
  const apiBase = props.apiBase ?? ctx.apiBase;
  const passportAppOrigin =
    props.passportAppOrigin ??
    props.walletAppOrigin ??
    ctx.passportAppOrigin ??
    ctx.walletAppOrigin;
  const theme = props.theme ?? ctx.theme;
  const dateFormat = props.dateFormat ?? ctx.dateFormat;
  const maxDepth = props.maxDepth ?? ctx.maxDepth;
  const sort = props.sort ?? ctx.sort;
  const appearance = props.appearance ?? ctx.appearance;
  const features = props.features ?? ctx.features;
  const slots = props.slots ?? ctx.slots;

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    init({
      container: el,
      projectId,
      apiKey,
      apiBase,
      passportAppOrigin,
      pageId: props.pageId,
      onComment: props.onComment,
      theme,
      dateFormat,
      maxDepth,
      sort,
      appearance,
      features,
      slots,
    });
    return () => destroy(el);
  }, [
    projectId,
    apiKey,
    apiBase,
    passportAppOrigin,
    props.pageId,
    props.onComment,
    theme,
    dateFormat,
    maxDepth,
    sort,
    appearance,
    features,
    slots,
  ]);

  return createElement("div", {
    ref: (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    className: props.className,
    style: props.style,
  });
});

// ── Feed module ──

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
export const QuipierFeed = forwardRef(function QuipierFeed(
  props: QuipierFeedProps,
  forwardedRef: ForwardedRef<HTMLDivElement>,
) {
  const ctx = useQuipierConfig();
  const localRef = useRef<HTMLDivElement | null>(null);

  const projectId = props.projectId ?? ctx.projectId;
  const apiKey = props.apiKey ?? ctx.apiKey;
  const apiBase = props.apiBase ?? ctx.apiBase;
  const passportAppOrigin =
    props.passportAppOrigin ?? ctx.passportAppOrigin ?? ctx.walletAppOrigin;
  const theme = props.theme ?? ctx.theme;
  const dateFormat = props.dateFormat ?? ctx.dateFormat;
  const appearance = props.appearance ?? ctx.appearance;

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    initFeed({
      container: el,
      projectId,
      apiKey,
      apiBase,
      passportAppOrigin,
      theme,
      dateFormat,
      onPost: props.onPost,
      urlSync: props.urlSync,
      urlParam: props.urlParam,
      shareUrl: props.shareUrl,
      appearance,
    });
    return () => destroy(el);
  }, [
    projectId,
    apiKey,
    apiBase,
    passportAppOrigin,
    theme,
    dateFormat,
    appearance,
    props.onPost,
    props.urlSync,
    props.urlParam,
    props.shareUrl,
  ]);

  return createElement("div", {
    ref: (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    className: props.className,
    style: props.style,
  });
});
