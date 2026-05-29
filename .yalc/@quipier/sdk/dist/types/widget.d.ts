import type { Comment } from "./types.js";
type SortKey = "top" | "newest";
interface WidgetProps {
    apiBase: string;
    apiKey: string;
    projectId: string;
    pageId: string;
    passportAppOrigin: string;
    onComment?: (comment: Comment) => void;
    theme?: "light" | "dark" | "auto";
    dateFormat?: "relative" | "absolute";
    maxDepth?: number;
    sort?: SortKey;
}
export declare function Widget(props: WidgetProps): import("preact").JSX.Element;
export {};
//# sourceMappingURL=widget.d.ts.map