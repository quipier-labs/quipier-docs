import type { ReportReason } from "../types.js";
interface Props {
    isOwn: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: (reason: ReportReason) => void;
}
export declare function CommentMenu({ isOwn, onEdit, onDelete, onReport }: Props): import("preact").JSX.Element;
export {};
//# sourceMappingURL=CommentMenu.d.ts.map