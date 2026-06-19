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
/** A feed post. Top-level post has `parent_id: null`; a reply has it set.
 *  Mirrors Comment but with no external page_id + a `reply_count`. */
export interface Post {
    id: string;
    project_id: string;
    author_id: string;
    nickname: string | null;
    content: string;
    parent_id: string | null;
    is_deleted: boolean;
    deleted_by_type?: "passport" | "operator" | null;
    trashed_at?: string | null;
    purged_at?: string | null;
    is_hidden?: boolean;
    author_blocked?: boolean;
    created_at: string;
    likes_count: number;
    liked_by_me: boolean;
    reply_count: number;
    /** Absolute URL of an attached image, or null/absent for a text-only post. */
    image_url?: string | null;
}
export interface CreatePostBody {
    project_id: string;
    content: string;
    parent_id?: string;
    /** Optional image as a `data:image/...;base64,...` URL. */
    image?: string;
}
export interface ListPostsResponse {
    posts: Post[];
    next_cursor: string | null;
}
export type ChatRoomKind = "dm" | "open";
/** The other participant of a 1:1 DM, relative to the requester. */
export interface ChatPeer {
    author_id: string;
    nickname: string | null;
}
/** A chat room. `kind: "dm"` → has `peer`; `kind: "open"` → has `name`/etc. */
export interface ChatRoom {
    id: string;
    project_id: string;
    kind: ChatRoomKind;
    created_at: string;
    last_message_at: string | null;
    last_message_preview: string | null;
    /** DM only — the other participant. Null for open rooms. */
    peer: ChatPeer | null;
    /** Open room only — title. */
    name: string | null;
    /** Who created the room (project_token_id). */
    created_by: string;
    /** App-defined data, stored opaquely (timer/expiry, category, icon, …). */
    metadata: Record<string, unknown> | null;
    /** Member count (2 for a DM, N for open). */
    member_count: number;
    /** Open room only — capacity. Null = unlimited. */
    max_members: number | null;
    /** Unread messages for the requester. */
    unread: number;
    /** Whether the requester is a member (always true except explore listings). */
    joined: boolean;
}
export interface CreateOpenRoomInput {
    name: string;
    max_members?: number | null;
    /** App-defined data, stored opaquely (timer/expiry, category, …). */
    metadata?: Record<string, unknown> | null;
}
export interface ListOpenRoomsResponse {
    rooms: ChatRoom[];
}
/** A single chat message. `mine` is true when the requester is the sender. */
export interface ChatMessage {
    id: string;
    room_id: string;
    author_id: string;
    nickname: string | null;
    content: string;
    is_deleted: boolean;
    created_at: string;
    mine: boolean;
}
/** A discoverable end user, for the "new DM" picker. */
export interface ChatUser {
    author_id: string;
    nickname: string | null;
}
export interface ListRoomsResponse {
    rooms: ChatRoom[];
}
export interface SearchUsersResponse {
    users: ChatUser[];
}
export interface ListMessagesResponse {
    /** Oldest → newest. `next_cursor` pages further back in time. */
    messages: ChatMessage[];
    next_cursor: string | null;
}
//# sourceMappingURL=types.d.ts.map