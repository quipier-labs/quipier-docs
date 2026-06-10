import {
  type ComponentChildren,
  type VNode,
  isValidElement,
  render,
} from "preact";
import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import type { SlotResult } from "../customize.js";

interface Props {
  /** Stable part name → emitted as data-quipier-slot for CSS/debugging. */
  name: string;
  /** The result of calling the user's slot function (already invoked by the
   *  caller, so per-comment args/ctx live at the call site). `undefined` when
   *  no slot is registered. */
  result: SlotResult;
  /** Default rendering, used when the slot returns null/undefined. */
  children: ComponentChildren;
}

/** Hosts whatever a slot function returned inside the Preact tree:
 *   - undefined / null      → render the default `children`
 *   - VNode (preact h(...)) → render inline
 *   - string                → set as innerHTML (host app's own trusted markup)
 *   - HTMLElement           → mounted into a ref'd container via appendChild
 *  Anything else falls back to the default. */
export function SlotHost({ name, result, children }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  const kind: "default" | "vnode" | "html" | "element" = useMemo(() => {
    if (result === null || result === undefined) return "default";
    if (typeof result === "string") return "html";
    if (typeof HTMLElement !== "undefined" && result instanceof HTMLElement) {
      return "element";
    }
    if (isValidElement(result as VNode)) return "vnode";
    return "default";
  }, [result]);

  useLayoutEffect(() => {
    if (kind !== "element") return;
    const host = hostRef.current;
    if (!host) return;
    host.replaceChildren(result as HTMLElement);
    return () => {
      host.replaceChildren();
    };
  }, [kind, result]);

  if (kind === "default") return <>{children}</>;
  if (kind === "vnode") return result as VNode;
  if (kind === "html") {
    return (
      <div
        data-quipier-slot={name}
        // The host application supplies this markup itself; it is not
        // attacker-controlled comment content.
        dangerouslySetInnerHTML={{ __html: result as string }}
      />
    );
  }
  // element
  return <div data-quipier-slot={name} ref={hostRef} />;
}

/** Render a Preact VNode into a detached DOM node — backs `ctx.defaultNode()`.
 *  The returned element is a one-shot snapshot (its own mini Preact root); it
 *  is meant for decoration/wrapping, not live state sync. */
export function renderToDetached(vnode: VNode): HTMLElement {
  const host = document.createElement("div");
  host.setAttribute("data-quipier-default", "");
  render(vnode, host);
  return host;
}
