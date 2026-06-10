import { type ComponentChildren, type VNode } from "preact";
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
export declare function SlotHost({ name, result, children }: Props): import("preact").JSX.Element | VNode<{}>;
/** Render a Preact VNode into a detached DOM node — backs `ctx.defaultNode()`.
 *  The returned element is a one-shot snapshot (its own mini Preact root); it
 *  is meant for decoration/wrapping, not live state sync. */
export declare function renderToDetached(vnode: VNode): HTMLElement;
export {};
//# sourceMappingURL=SlotHost.d.ts.map