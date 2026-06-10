import type { Post, ReportReason } from "../types.js";
import { type Client } from "../client.js";
interface Props {
    post: Post;
    client: Client;
    projectId: string;
    ownAuthorId: string | null;
    canInteract: boolean;
    onConnect: () => void;
    onBack: () => void;
    onToggleLike: (id: string) => void;
    onDelete: (id: string) => void;
    onReport: (id: string, reason: ReportReason) => void;
    onEdit: (id: string, content: string) => Promise<void>;
    onReplyAdded: () => void;
    dateFormat: "relative" | "absolute";
    /** Canonical URL to share for this post. Omit to hide the share button. */
    shareUrl?: string;
}
/** Post detail / thread: the post in full, a reply composer, and the replies. */
export declare function PostDetail({ post, client, projectId, ownAuthorId, canInteract, onConnect, onBack, onToggleLike, onDelete, onReport, onEdit, onReplyAdded, dateFormat, shareUrl, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=PostDetail.d.ts.map