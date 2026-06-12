import type { Post } from "../types.js";
import type { Appearance } from "../customize.js";
interface FeedWidgetProps {
    apiBase: string;
    apiKey: string;
    projectId: string;
    passportAppOrigin: string;
    theme?: "light" | "dark" | "auto";
    dateFormat?: "relative" | "absolute";
    onPost?: (post: Post) => void;
    /** Reflect the open post in the URL via a query param (deep links / sharing).
     *  Only touches the query string — never the host page's path. Default true. */
    urlSync?: boolean;
    /** Query param name used when urlSync is on. Default "qp_post". */
    urlParam?: string;
    /** Share-button link target. A base URL → `${base}?<urlParam>=<id>`, or a
     *  function for full control. Omit → the current page URL with the post param
     *  (works when the feed lives on a shareable page). */
    shareUrl?: string | ((post: Post) => string);
    /** Theme tokens (colors, font, radius …) — same model as the comments widget. */
    appearance?: Appearance;
}
export declare function FeedWidget(props: FeedWidgetProps): import("preact").JSX.Element;
export {};
//# sourceMappingURL=FeedWidget.d.ts.map