import { useState } from "preact/hooks";
import type { Comment, ReportReason } from "../types.js";
import { Avatar } from "./Avatar.js";
import { CommentForm } from "./CommentForm.js";
import { CommentMenu } from "./CommentMenu.js";

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

const REPLY_BATCH = 10;

export function CommentItem({
  node,
  ownAuthorId,
  onToggleLike,
  onDelete,
  onEdit,
  onReply,
  onReport,
  canReply,
  dateFormat = "relative",
  maxDepth = 2,
  depth = 0,
  rootId,
}: Props) {
  const { comment, children } = node;
  const repliesEnabled = maxDepth >= 2;
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [revealHidden, setRevealHidden] = useState(false);
  const [shownCount, setShownCount] = useState(REPLY_BATCH);
  const isOwn = !!ownAuthorId && comment.author_id === ownAuthorId;
  const display = comment.nickname || comment.author_id.slice(0, 8);
  const liked = comment.liked_by_me;
  const likesCount = comment.likes_count;
  const avatarSize = depth === 0 ? 32 : 24;
  const effectiveRootId = rootId ?? comment.id;

  // Tombstone/hidden labels surfaced to the end-user. The server clears content
  // for either case; the widget renders a placeholder explaining who acted.
  const deletedNotice =
    comment.deleted_by_type === "operator"
      ? "운영자가 삭제한 댓글입니다"
      : comment.deleted_by_type === "passport"
        ? "사용자가 삭제한 댓글입니다"
        : "삭제된 댓글입니다";
  // Hidden = moderator hid it; widget user can opt to reveal. The server now
  // ships the original content for hidden comments, so revealing locally just
  // swaps the placeholder for the real content. Deleted comments stay wiped.
  const isHidden = !!comment.is_hidden;

  async function submitReply(content: string) {
    // Threads are 2-level: every reply attaches to the root, so replying from a
    // reply still adds a sibling instead of nesting deeper.
    await onReply(effectiveRootId, content);
    setReplying(false);
    // make sure the new reply is visible: expand and ensure the batch covers it.
    setExpanded(true);
    setShownCount(Math.max(REPLY_BATCH, children.length + 1));
  }

  async function submitEdit(content: string) {
    await onEdit(comment.id, content);
    setEditing(false);
  }

  const visibleChildren = expanded ? children.slice(0, shownCount) : [];
  const remaining = children.length - shownCount;
  const hasMore = expanded && remaining > 0;

  return (
    <div class="quipier-thread">
      <div class="quipier-item">
        <Avatar seed={comment.author_id} label={comment.nickname} size={avatarSize} />
        <div class="quipier-item-body">
          <div class="quipier-item-head">
            <span class="quipier-item-author">{display}</span>
            {comment.author_blocked ? (
              <span class="quipier-author-badge quipier-author-blocked">차단</span>
            ) : null}
            <span class="quipier-item-dot">·</span>
            <span>{formatTime(comment.created_at, dateFormat)}</span>
            {!comment.is_deleted && !isHidden ? (
              <CommentMenu
                isOwn={isOwn}
                onEdit={() => setEditing(true)}
                onDelete={() => onDelete(comment.id)}
                onReport={(reason) => onReport(comment.id, reason)}
              />
            ) : null}
          </div>
          {editing && !comment.is_deleted && !isHidden ? (
            <div class="quipier-edit-form">
              <CommentForm
                placeholder="댓글을 수정하세요"
                submitLabel="저장"
                initialValue={comment.content}
                onCancel={() => setEditing(false)}
                onSubmit={submitEdit}
              />
            </div>
          ) : comment.is_deleted ? (
            <div class="quipier-item-content is-deleted">{deletedNotice}</div>
          ) : isHidden ? (
            revealHidden ? (
              <>
                <div class="quipier-hidden-banner">
                  <span>운영자에 의해 숨겨진 댓글입니다.</span>
                  <button
                    type="button"
                    class="quipier-hidden-toggle"
                    onClick={() => setRevealHidden(false)}
                  >
                    다시 숨기기
                  </button>
                </div>
                <div class="quipier-item-content">{comment.content}</div>
              </>
            ) : (
              <div class="quipier-item-content is-hidden">
                <em>이 댓글은 운영자에 의해 숨겨졌습니다.</em>
                <button
                  type="button"
                  class="quipier-hidden-toggle"
                  onClick={() => setRevealHidden(true)}
                >
                  확인하기
                </button>
              </div>
            )
          ) : (
            <div class="quipier-item-content">{comment.content}</div>
          )}
          {!comment.is_deleted && !isHidden && !editing ? (
            <div class="quipier-actions">
              <button
                class={`quipier-action${liked ? " is-active" : ""}`}
                onClick={() => onToggleLike(comment.id)}
                aria-pressed={liked}
                aria-label={liked ? "Unlike" : "Like"}
              >
                <HeartIcon filled={liked} />
                <span>{likesCount}</span>
              </button>
              {canReply && repliesEnabled ? (
                <button
                  class="quipier-action"
                  onClick={() => setReplying((v) => !v)}
                >
                  <ReplyIcon />
                  <span>답글</span>
                </button>
              ) : null}
            </div>
          ) : null}
          {replying ? (
            <div class="quipier-reply-form">
              <CommentForm
                placeholder={`@${display}에게 답글…`}
                submitLabel="답글"
                initialValue={depth >= 1 ? `@${display} ` : ""}
                onCancel={() => setReplying(false)}
                onSubmit={submitReply}
              />
            </div>
          ) : null}
        </div>
      </div>
      {repliesEnabled && children.length > 0 ? (
        <div class="quipier-thread-children">
          {!expanded ? (
            <button
              class="quipier-thread-toggle"
              type="button"
              onClick={() => setExpanded(true)}
            >
              <ChevronIcon dir="down" />
              <span>답글 {children.length}개</span>
            </button>
          ) : (
            <>
              {visibleChildren.map((child) => (
                <CommentItem
                  key={child.comment.id}
                  node={child}
                  ownAuthorId={ownAuthorId}
                  onToggleLike={onToggleLike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onReply={onReply}
                  onReport={onReport}
                  canReply={canReply}
                  dateFormat={dateFormat}
                  maxDepth={maxDepth}
                  depth={depth + 1}
                  rootId={effectiveRootId}
                />
              ))}
              {hasMore ? (
                <button
                  class="quipier-thread-more"
                  type="button"
                  onClick={() =>
                    setShownCount((c) => c + REPLY_BATCH)
                  }
                >
                  답글 {Math.min(REPLY_BATCH, remaining)}개 더 보기
                </button>
              ) : null}
              <button
                class="quipier-thread-toggle"
                type="button"
                onClick={() => setExpanded(false)}
              >
                <ChevronIcon dir="up" />
                <span>답글 숨기기</span>
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

function formatTime(iso: string, format: "relative" | "absolute" = "relative"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (format === "absolute") return d.toLocaleString();
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return d.toLocaleDateString();
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "up" | "down" }) {
  const d = dir === "down" ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6";
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d={d} />
    </svg>
  );
}
