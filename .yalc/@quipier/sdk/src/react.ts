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
import { destroy, init, type InitOptions } from "./index.js";

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
