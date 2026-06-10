import type { Comment, ReportReason } from "../types.js";
export interface CommentNode {
    comment: Comment;
    children: CommentNode[];
}
interface Props {
    node: CommentNode;
    ownAuthorId: string | null;
    onToggleLike: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, content: string) => Promise<void>;
    onReply: (parentId: string, content: string) => Promise<void>;
    onReport: (id: string, reason: ReportReason) => void;
    canReply: boolean;
    dateFormat?: "relative" | "absolute";
    /** Reply nesting: >=2 shows/allows replies, 1 = flat. */
    maxDepth?: number;
    depth?: number;
    /** Id of the root-of-thread ancestor. All replies attach here so threads stay 2 levels deep. */
    rootId?: string;
}
export declare function CommentItem({ node, ownAuthorId, onToggleLike, onDelete, onEdit, onReply, onReport, canReply, dateFormat, maxDepth, depth, rootId, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=CommentItem.d.ts.map