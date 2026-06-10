import type { Post, ReportReason } from "../types.js";
interface Props {
    post: Post;
    ownAuthorId: string | null;
    onOpen: () => void;
    onToggleLike: (id: string) => void;
    onDelete: (id: string) => void;
    onReport: (id: string, reason: ReportReason) => void;
    onEdit: (id: string, content: string) => Promise<void>;
    dateFormat: "relative" | "absolute";
}
/** A single post in the timeline. Twitter-style: clicking the row opens the
 *  post's detail (thread) view; replies are NOT expanded inline. */
export declare function PostItem({ post, ownAuthorId, onOpen, onToggleLike, onDelete, onReport, onEdit, dateFormat, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=PostItem.d.ts.map