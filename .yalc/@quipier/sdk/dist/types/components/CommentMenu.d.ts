import type { ReportReason } from "../types.js";
interface Props {
    isOwn: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: (reason: ReportReason) => void;
    /** Show the report path for non-own comments. Default true. */
    canReport?: boolean;
}
export declare function CommentMenu({ isOwn, onEdit, onDelete, onReport, canReport, }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=CommentMenu.d.ts.map