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
  createContext,
  createElement,
  forwardRef,
  useContext,
  useEffect,
  useRef,
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

const QuipierContext = createContext<QuipierConfig | null>(null);

export interface QuipierProviderProps {
  config: QuipierConfig;
  children: ReactNode;
}

export function QuipierProvider({ config, children }: QuipierProviderProps) {
  return createElement(QuipierContext.Provider, { value: config }, children);
}

export function useQuipierConfig(): QuipierConfig {
  const ctx = useContext(QuipierContext);
  if (!ctx) {
    throw new Error(
      "useQuipierConfig / QuipierComments must be used inside <QuipierProvider>",
    );
  }
  return ctx;
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
    });
    return () => destroy(el);
  }, [
    projectId,
    apiKey,
    apiBase,
    passportAppOrigin,
    theme,
    dateFormat,
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
