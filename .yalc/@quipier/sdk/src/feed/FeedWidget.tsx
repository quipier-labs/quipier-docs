import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Post } from "../types.js";
import { ApiError, createClient, type Client } from "../client.js";
import {
  clearProjectSession,
  loadProjectSession,
  saveProjectSession,
  type ProjectSession,
} from "../storage.js";
import { Composer } from "../components/Composer.js";
import { PostItem } from "./PostItem.js";
import { PostDetail } from "./PostDetail.js";

interface FeedWidgetProps {
  apiBase: string;
  apiKey: string;
  projectId: string;
  passportAppOrigin: string;
  theme?: "light" | "dark" | "auto";
  dateFormat?: "relative" | "absolute";
  onPost?: (post: Post) => void;
  /** Reflect the open post in the URL via a query param (deep links / sharing).
   *  Only touches the query string — never the host page's path. Default true. */
  urlSync?: boolean;
  /** Query param name used when urlSync is on. Default "qp_post". */
  urlParam?: string;
  /** Share-button link target. A base URL → `${base}?<urlParam>=<id>`, or a
   *  function for full control. Omit → the current page URL with the post param
   *  (works when the feed lives on a shareable page). */
  shareUrl?: string | ((post: Post) => string);
}

const JOIN_MESSAGE_TYPE = "quipier:join:result";

/** Read the deep-link post id from the current URL's query string. */
function readPostParam(param: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(param);
  } catch {
    return null;
  }
}

/** Set/clear the deep-link query param without touching the path or other params. */
function writePostParam(param: string, value: string | null, push: boolean): void {
  try {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(param, value);
    else url.searchParams.delete(param);
    const method = push ? "pushState" : "replaceState";
    window.history[method](window.history.state, "", url.toString());
  } catch {
    // history may be unavailable (sandboxed iframe) — degrade silently.
  }
}

export function FeedWidget(props: FeedWidgetProps) {
  const urlSync = props.urlSync !== false;
  const urlParam = props.urlParam || "qp_post";

  /** Canonical share URL for a post. Base string → base + `?<param>=<id>`,
   *  function → as-is, unset → current page URL with the post param. */
  function getShareUrl(post: Post): string {
    const { shareUrl } = props;
    if (typeof shareUrl === "function") return shareUrl(post);
    const base = typeof shareUrl === "string" ? shareUrl : null;
    try {
      const u = new URL(base ?? window.location.href, window.location.href);
      u.searchParams.set(urlParam, post.id);
      return u.toString();
    } catch {
      const b = base ?? "";
      const sep = b.includes("?") ? "&" : "?";
      return `${b}${sep}${urlParam}=${encodeURIComponent(post.id)}`;
    }
  }

  const [session, setSession] = useState<ProjectSession | null>(() =>
    loadProjectSession(props.projectId),
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  // null = timeline (list); set = post detail / thread view. Seeded from the URL
  // so a shared link opens straight to the post.
  const [openPostId, setOpenPostId] = useState<string | null>(() =>
    urlSync ? readPostParam(urlParam) : null,
  );
  // A deep-linked post that isn't in the loaded timeline page (fetched by id).
  const [deepPost, setDeepPost] = useState<Post | null>(null);
  const skipNextUrlWrite = useRef(true); // first run reads from URL — don't re-push

  const client: Client = useMemo(
    () =>
      createClient({
        apiBase: props.apiBase,
        apiKey: props.apiKey,
        getToken: () => session?.sessionToken ?? null,
      }),
    [props.apiBase, props.apiKey, session?.sessionToken],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    client
      .listFeed({ project_id: props.projectId, limit: 30 })
      .then((res) => {
        if (cancelled) return;
        setPosts(res.posts);
        setCursor(res.next_cursor);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client, props.projectId]);

  // Deep link: if a post is open but not in the loaded timeline page, fetch it
  // by id so a shared URL resolves even when the post isn't on page 1.
  useEffect(() => {
    if (!openPostId || posts.some((p) => p.id === openPostId)) {
      setDeepPost(null);
      return;
    }
    let cancelled = false;
    client
      .getPost({ project_id: props.projectId, post_id: openPostId })
      .then((res) => {
        if (!cancelled) setDeepPost(res.post);
      })
      .catch(() => {
        if (cancelled) return;
        // Bad/expired link → fall back to the timeline + drop the param.
        setDeepPost(null);
        if (urlSync) writePostParam(urlParam, null, false);
        skipNextUrlWrite.current = true;
        setOpenPostId(null);
      });
    return () => {
      cancelled = true;
    };
  }, [openPostId, posts, client, props.projectId, urlSync, urlParam]);

  // Keep the URL query in sync with the open post (pushState so Back works).
  useEffect(() => {
    if (!urlSync) return;
    if (skipNextUrlWrite.current) {
      skipNextUrlWrite.current = false;
      return;
    }
    writePostParam(urlParam, openPostId, true);
  }, [openPostId, urlSync, urlParam]);

  // Browser back/forward → sync the open post from the URL (without re-pushing).
  useEffect(() => {
    if (!urlSync) return;
    function onPop() {
      skipNextUrlWrite.current = true;
      setOpenPostId(readPostParam(urlParam));
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [urlSync, urlParam]);

  // passport join popup → session (same protocol as the comments widget)
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data as { type?: string };
      if (!data || data.type !== JOIN_MESSAGE_TYPE) return;
      const msg = ev.data as {
        ok: boolean;
        project_id?: string;
        project_token_id?: string;
        nickname?: string;
        session_token?: string;
        expires_at?: string;
        message?: string;
      };
      setPopupOpen(false);
      if (!msg.ok) {
        setError(msg.message ?? "passport connect cancelled");
        return;
      }
      if (
        msg.project_id !== props.projectId ||
        !msg.project_token_id ||
        !msg.session_token ||
        !msg.expires_at
      ) {
        return;
      }
      const next: ProjectSession = {
        projectId: msg.project_id,
        projectTokenId: msg.project_token_id,
        nickname: msg.nickname ?? "",
        sessionToken: msg.session_token,
        expiresAt: new Date(msg.expires_at).getTime(),
      };
      saveProjectSession(next);
      setSession(next);
      setError(null);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [props.projectId]);

  function openJoinPopup() {
    const url = new URL(props.passportAppOrigin + "/join");
    url.searchParams.set("project_id", props.projectId);
    url.searchParams.set("return_origin", window.location.origin);
    const popup = window.open(url.toString(), "quipier-join", "width=480,height=760");
    if (popup) {
      setPopupOpen(true);
      const poll = setInterval(() => {
        if (popup.closed) {
          clearInterval(poll);
          setPopupOpen(false);
        }
      }, 500);
    } else {
      setError("팝업 차단을 해제해주세요");
    }
  }

  async function handleCreate(content: string, image?: string | null) {
    if (!session) {
      openJoinPopup();
      throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
    }
    const { post } = await client.createPost({
      project_id: props.projectId,
      content,
      image: image ?? undefined,
    });
    setPosts((prev) => [post, ...prev]);
    props.onPost?.(post);
  }

  function disconnect() {
    clearProjectSession(props.projectId);
    setSession(null);
  }

  async function toggleLike(id: string) {
    if (!session) {
      openJoinPopup();
      return;
    }
    let wasLiked = false;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        wasLiked = p.liked_by_me;
        return {
          ...p,
          liked_by_me: !p.liked_by_me,
          likes_count: p.likes_count + (p.liked_by_me ? -1 : 1),
        };
      }),
    );
    try {
      const result = wasLiked ? await client.unlikePost(id) : await client.likePost(id);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, likes_count: result.likes_count, liked_by_me: result.liked_by_me }
            : p,
        ),
      );
    } catch (err) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, liked_by_me: wasLiked, likes_count: p.likes_count + (wasLiked ? 1 : -1) }
            : p,
        ),
      );
      if (err instanceof ApiError && err.status === 401) {
        clearProjectSession(props.projectId);
        setSession(null);
      }
      setError(err instanceof Error ? err.message : "failed to like");
    }
  }

  async function handleDelete(id: string) {
    if (!session) return;
    try {
      await client.deletePost(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_deleted: true, content: "" } : p)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to delete");
    }
  }

  async function handleEdit(id: string, content: string) {
    await client.updatePost(id, content);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, content } : p)));
  }

  /** A reply was created on `id` (from the detail view) — bump the list count. */
  function handleReplyAdded(id: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reply_count: p.reply_count + 1 } : p)),
    );
  }

  async function handleReport(id: string, reason: Parameters<Client["reportPost"]>[1]) {
    if (!session) {
      openJoinPopup();
      return;
    }
    try {
      await client.reportPost(id, reason);
      window.alert("신고가 접수되었습니다. 검토 후 조치됩니다.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "신고에 실패했습니다");
    }
  }

  async function loadMore() {
    if (!cursor) return;
    try {
      const res = await client.listFeed({ project_id: props.projectId, cursor, limit: 30 });
      setPosts((prev) => [...prev, ...res.posts]);
      setCursor(res.next_cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load more");
    }
  }

  const composerSession = session
    ? { tokenId: session.projectTokenId, nickname: session.nickname }
    : null;
  const visible = posts.filter((p) => !p.is_deleted || p.reply_count > 0);
  const openPost = openPostId
    ? posts.find((p) => p.id === openPostId) ??
      (deepPost && deepPost.id === openPostId ? deepPost : null)
    : null;
  // A post is requested via URL but still resolving (timeline or getPost loading).
  const openPending = !!openPostId && !openPost;

  return (
    <div class="quipier-root quipier-feed" data-quipier-theme={props.theme ?? "light"} data-quipier-part="root">
      {error ? <div class="quipier-error">{error}</div> : null}

      {openPending ? (
        <div class="quipier-empty">Loading…</div>
      ) : openPost ? (
        <PostDetail
          post={openPost}
          client={client}
          projectId={props.projectId}
          ownAuthorId={session?.projectTokenId ?? null}
          canInteract={!!session}
          onConnect={openJoinPopup}
          onBack={() => setOpenPostId(null)}
          onToggleLike={toggleLike}
          onDelete={handleDelete}
          onReport={handleReport}
          onEdit={handleEdit}
          onReplyAdded={() => handleReplyAdded(openPost.id)}
          dateFormat={props.dateFormat ?? "relative"}
          shareUrl={getShareUrl(openPost)}
        />
      ) : (
        <>
          <Composer
            session={composerSession}
            onSubmit={handleCreate}
            onConnectRequest={() => {
              if (!popupOpen) openJoinPopup();
            }}
            onDisconnect={disconnect}
            manageUrl={props.passportAppOrigin + "/me"}
            placeholder="무슨 생각을 하고 있나요?"
            allowImage
          />

          {loading ? (
            <div class="quipier-empty">Loading…</div>
          ) : visible.length === 0 ? (
            <div class="quipier-empty">아직 포스트가 없어요. 첫 글을 남겨보세요.</div>
          ) : (
            <div class="quipier-feed-list" data-quipier-part="list">
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  ownAuthorId={session?.projectTokenId ?? null}
                  onOpen={() => setOpenPostId(post.id)}
                  onToggleLike={toggleLike}
                  onDelete={handleDelete}
                  onReport={handleReport}
                  onEdit={handleEdit}
                  dateFormat={props.dateFormat ?? "relative"}
                />
              ))}
            </div>
          )}
          {cursor ? (
            <button class="quipier-loadmore" onClick={loadMore}>
              더 보기
            </button>
          ) : null}
        </>
      )}
      <a class="quipier-badge" href="https://quipier.com" target="_blank" rel="noopener noreferrer">
        <span>powered by Quipier</span>
      </a>
    </div>
  );
}
