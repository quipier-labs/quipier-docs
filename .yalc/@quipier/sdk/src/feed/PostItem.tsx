import { useState } from "preact/hooks";
import type { Post, ReportReason } from "../types.js";
import { Avatar } from "../components/Avatar.js";
import { CommentForm } from "../components/CommentForm.js";
import { CommentMenu } from "../components/CommentMenu.js";
import { formatTime, HeartIcon, ReplyIcon } from "./util.js";

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
export function PostItem({
  post,
  ownAuthorId,
  onOpen,
  onToggleLike,
  onDelete,
  onReport,
  onEdit,
  dateFormat,
}: Props) {
  const [editing, setEditing] = useState(false);
  const isOwn = !!ownAuthorId && post.author_id === ownAuthorId;
  const display = post.nickname || post.author_id.slice(0, 8);
  const deleted = post.is_deleted;

  async function submitEdit(text: string) {
    await onEdit(post.id, text);
    setEditing(false);
  }
  // Stop interactive controls from bubbling to the row's open-detail click.
  const stop = (e: Event) => e.stopPropagation();

  return (
    <div
      class="quipier-feed-post"
      data-quipier-part="post"
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!editing) onOpen();
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !editing) onOpen();
      }}
    >
      <div class="quipier-item">
        <Avatar seed={post.author_id} label={post.nickname} size={40} />
        <div class="quipier-item-body">
          <div class="quipier-item-head">
            <span class="quipier-item-author">{display}</span>
            {post.author_blocked ? (
              <span class="quipier-author-badge quipier-author-blocked">차단</span>
            ) : null}
            <span class="quipier-item-dot">·</span>
            <span>{formatTime(post.created_at, dateFormat)}</span>
            {!deleted ? (
              <span style="display: contents" onClick={stop}>
                <CommentMenu
                  isOwn={isOwn}
                  onEdit={() => setEditing(true)}
                  onDelete={() => onDelete(post.id)}
                  onReport={(reason) => onReport(post.id, reason)}
                />
              </span>
            ) : null}
          </div>
          {editing ? (
            <div class="quipier-edit-form" onClick={stop}>
              <CommentForm
                placeholder="포스트를 수정하세요"
                submitLabel="저장"
                initialValue={post.content}
                onCancel={() => setEditing(false)}
                onSubmit={submitEdit}
              />
            </div>
          ) : deleted ? (
            <div class="quipier-item-content is-deleted">삭제된 포스트입니다</div>
          ) : (
            <div class="quipier-item-content" data-quipier-part="content">
              {post.content}
            </div>
          )}
          {post.image_url && !deleted && !editing ? (
            <div class="quipier-post-thumb" data-quipier-part="image">
              <img src={post.image_url} alt="" loading="lazy" />
            </div>
          ) : null}
          {!deleted && !editing ? (
            <div class="quipier-actions" data-quipier-part="actions">
              <button
                class={`quipier-action${post.liked_by_me ? " is-active" : ""}`}
                onClick={(e) => {
                  stop(e);
                  onToggleLike(post.id);
                }}
                aria-pressed={post.liked_by_me}
                aria-label={post.liked_by_me ? "Unlike" : "Like"}
              >
                <HeartIcon filled={post.liked_by_me} />
                <span>{post.likes_count}</span>
              </button>
              <button
                class="quipier-action"
                onClick={(e) => {
                  stop(e);
                  onOpen();
                }}
              >
                <ReplyIcon />
                <span>답글{post.reply_count > 0 ? ` ${post.reply_count}` : ""}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
