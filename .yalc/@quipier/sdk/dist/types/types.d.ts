export interface Comment {
    id: string;
    project_id: string;
    /** Public per-project author id (project_token_id for new comments). */
    author_id: string;
    /** Per-project nickname chosen at join. Null for legacy guest comments. */
    nickname: string | null;
    page_id: string;
    content: string;
    parent_id: string | null;
    /** Comment was deleted (trashed or purged). Server clears content + nickname
     *  before send; widget renders as a tombstone. */
    is_deleted: boolean;
    /** Set when is_deleted is true. `passport` = author self-delete; `operator`
     *  = moderator delete. */
    deleted_by_type?: "passport" | "operator" | null;
    /** When the comment was moved to the trash (soft delete). `null` for live
     *  comments. The widget can use this to differentiate "휴지통 보관" from
     *  "영구 삭제" though both render as tombstones. */
    trashed_at?: string | null;
    /** When the comment was permanently purged (content wiped, row kept as a
     *  reply anchor). Implies `is_deleted=true` and `trashed_at` is set too. */
    purged_at?: string | null;
    /** Operator hid this comment. Widget receives empty content + reveal toggle. */
    is_hidden?: boolean;
    /** True if the requester's passport is blocked from this project. The widget
     *  uses this to render a "you are blocked" badge next to the author id. */
    author_blocked?: boolean;
    created_at: string;
    likes_count: number;
    liked_by_me: boolean;
}
export interface CreateCommentBody {
    project_id: string;
    page_id: string;
    content: string;
    parent_id?: string;
}
export interface ListCommentsResponse {
    comments: Comment[];
    next_cursor: string | null;
}
/** Why a comment was reported. Must match the server's accepted reasons. */
export type ReportReason = "spam" | "harassment" | "adult" | "privacy" | "other";
//# sourceMappingURL=types.d.ts.map