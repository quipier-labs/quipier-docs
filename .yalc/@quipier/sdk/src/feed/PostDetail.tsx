import { useEffect, useState } from "preact/hooks";
import type { Post, ReportReason } from "../types.js";
import { ApiError, type Client } from "../client.js";
import { Avatar } from "../components/Avatar.js";
import { CommentForm } from "../components/CommentForm.js";
import { CommentMenu } from "../components/CommentMenu.js";
import { formatTime, HeartIcon } from "./util.js";
import { ShareMenu } from "./ShareMenu.js";

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
export function PostDetail({
  post,
  client,
  projectId,
  ownAuthorId,
  canInteract,
  onConnect,
  onBack,
  onToggleLike,
  onDelete,
  onReport,
  onEdit,
  onReplyAdded,
  dateFormat,
  shareUrl,
}: Props) {
  const [replies, setReplies] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const isOwn = !!ownAuthorId && post.author_id === ownAuthorId;
  const display = post.nickname || post.author_id.slice(0, 8);
  const deleted = post.is_deleted;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    client
      .listReplies({ project_id: projectId, post_id: post.id, limit: 100 })
      .then((res) => {
        if (!cancelled) setReplies(res.posts);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, projectId, post.id]);

  async function submitReply(text: string) {
    if (!canInteract) {
      onConnect();
      throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
    }
    const { post: reply } = await client.createPost({
      project_id: projectId,
      content: text,
      parent_id: post.id,
    });
    setReplies((prev) => [...prev, reply]);
    onReplyAdded();
  }

  async function submitEdit(text: string) {
    await onEdit(post.id, text);
    setEditing(false);
  }

  return (
    <div class="quipier-post-detail" data-quipier-part="post-detail">
      <button class="quipier-feed-back" type="button" onClick={onBack}>
        ← 피드
      </button>

      <div class="quipier-item quipier-post-main">
        <Avatar seed={post.author_id} label={post.nickname} size={44} />
        <div class="quipier-item-body">
          <div class="quipier-item-head">
            <span class="quipier-item-author">{display}</span>
            {post.author_blocked ? (
              <span class="quipier-author-badge quipier-author-blocked">차단</span>
            ) : null}
            <span class="quipier-item-dot">·</span>
            <span>{formatTime(post.created_at, dateFormat)}</span>
            {!deleted ? (
              <CommentMenu
                isOwn={isOwn}
                onEdit={() => setEditing(true)}
                onDelete={() => {
                  onDelete(post.id);
                  onBack();
                }}
                onReport={(reason) => onReport(post.id, reason)}
              />
            ) : null}
          </div>
          {editing ? (
            <div class="quipier-edit-form">
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
            <div class="quipier-post-main-content">{post.content}</div>
          )}
          {post.image_url && !deleted && !editing ? (
            <div class="quipier-post-image">
              <img src={post.image_url} alt="" />
            </div>
          ) : null}
          {!deleted && !editing ? (
            <div class="quipier-actions">
              <button
                class={`quipier-action${post.liked_by_me ? " is-active" : ""}`}
                onClick={() => onToggleLike(post.id)}
                aria-pressed={post.liked_by_me}
                aria-label={post.liked_by_me ? "Unlike" : "Like"}
              >
                <HeartIcon filled={post.liked_by_me} />
                <span>{post.likes_count}</span>
              </button>
              {shareUrl ? (
                <ShareMenu
                  url={shareUrl}
                  title={`${display}님의 포스트`}
                  text={post.content ? post.content.slice(0, 100) : undefined}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div class="quipier-post-reply-box">
        <CommentForm
          placeholder="답글을 작성하세요"
          submitLabel="답글"
          autoFocus={false}
          onSubmit={submitReply}
        />
      </div>

      <div class="quipier-list" data-quipier-part="replies">
        {loading ? (
          <div class="quipier-empty">Loading…</div>
        ) : replies.length === 0 ? (
          <div class="quipier-empty">첫 답글을 남겨보세요.</div>
        ) : (
          replies.map((reply) => (
            <ReplyRow
              key={reply.id}
              reply={reply}
              client={client}
              ownAuthorId={ownAuthorId}
              canInteract={canInteract}
              onConnect={onConnect}
              onReport={onReport}
              dateFormat={dateFormat}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ReplyRow({
  reply,
  client,
  ownAuthorId,
  canInteract,
  onConnect,
  onReport,
  dateFormat,
}: {
  reply: Post;
  client: Client;
  ownAuthorId: string | null;
  canInteract: boolean;
  onConnect: () => void;
  onReport: (id: string, reason: ReportReason) => void;
  dateFormat: "relative" | "absolute";
}) {
  const [liked, setLiked] = useState(reply.liked_by_me);
  const [likes, setLikes] = useState(reply.likes_count);
  const [deleted, setDeleted] = useState(reply.is_deleted);
  const isOwn = !!ownAuthorId && reply.author_id === ownAuthorId;
  const display = reply.nickname || reply.author_id.slice(0, 8);

  async function toggleLike() {
    if (!canInteract) return onConnect();
    const was = liked;
    setLiked(!was);
    setLikes((n) => n + (was ? -1 : 1));
    try {
      const r = was ? await client.unlikePost(reply.id) : await client.likePost(reply.id);
      setLiked(r.liked_by_me);
      setLikes(r.likes_count);
    } catch {
      setLiked(was);
      setLikes((n) => n + (was ? 1 : -1));
    }
  }

  return (
    <div class="quipier-thread">
      <div class="quipier-item">
        <Avatar seed={reply.author_id} label={reply.nickname} size={32} />
        <div class="quipier-item-body">
          <div class="quipier-item-head">
            <span class="quipier-item-author">{display}</span>
            <span class="quipier-item-dot">·</span>
            <span>{formatTime(reply.created_at, dateFormat)}</span>
            {!deleted ? (
              <CommentMenu
                isOwn={isOwn}
                onEdit={() => undefined}
                onDelete={() => {
                  void client.deletePost(reply.id).catch(() => undefined);
                  setDeleted(true);
                }}
                onReport={(reason) => onReport(reply.id, reason)}
              />
            ) : null}
          </div>
          {deleted ? (
            <div class="quipier-reply-bubble is-deleted">삭제된 답글입니다</div>
          ) : (
            <div class="quipier-reply-bubble">{reply.content}</div>
          )}
          {!deleted ? (
            <div class="quipier-actions">
              <button
                class={`quipier-action${liked ? " is-active" : ""}`}
                onClick={toggleLike}
                aria-pressed={liked}
              >
                <HeartIcon filled={liked} />
                <span>{likes}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
