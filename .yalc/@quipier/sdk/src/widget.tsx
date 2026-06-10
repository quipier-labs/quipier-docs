import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "preact/hooks";
import type { VNode } from "preact";
import type { Comment, ReportReason } from "./types.js";
import type { Appearance, BaseCtx, Features, Slots } from "./customize.js";
import { ApiError, createClient, type Client } from "./client.js";
import {
  clearProjectSession,
  loadProjectSession,
  saveProjectSession,
  type ProjectSession,
} from "./storage.js";
import { Composer } from "./components/Composer.js";
import { CommentItem, type CommentNode } from "./components/CommentItem.js";
import { SlotHost, renderToDetached } from "./components/SlotHost.js";
import {
  DEFAULT_FEATURES,
  DEFAULT_HELPERS,
  FeaturesContext,
  SlotsContext,
  type SlotEnv,
} from "./context.js";
import { mapAppearance } from "./appearance.js";

/** `--quipier-*` custom properties resolved from the root for ctx.theme. */
const TOKEN_NAMES = [
  "--quipier-fg",
  "--quipier-muted",
  "--quipier-surface",
  "--quipier-border",
  "--quipier-accent",
  "--quipier-accent-fg",
  "--quipier-link",
  "--quipier-like",
  "--quipier-danger",
  "--quipier-font",
  "--quipier-font-size",
  "--quipier-radius",
  "--quipier-radius-pill",
  "--quipier-avatar-radius",
  "--quipier-gap",
];

type SortKey = "top" | "newest";

interface WidgetProps {
  apiBase: string;
  apiKey: string;
  projectId: string;
  pageId: string;
  passportAppOrigin: string;
  onComment?: (comment: Comment) => void;
  theme?: "light" | "dark" | "auto";
  dateFormat?: "relative" | "absolute";
  maxDepth?: number;
  sort?: SortKey;
  appearance?: Appearance;
  features?: Features;
  slots?: Slots;
}

const JOIN_MESSAGE_TYPE = "quipier:join:result";

export function Widget(props: WidgetProps) {
  const [session, setSession] = useState<ProjectSession | null>(() =>
    loadProjectSession(props.projectId),
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>(props.sort ?? "top");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // ── customization ──
  const features = useMemo(
    () => ({ ...DEFAULT_FEATURES, ...(props.features ?? {}) }),
    [props.features],
  );
  const appearanceStyle = useMemo(
    () => mapAppearance(props.appearance),
    [props.appearance],
  );
  // replies:false collapses threading to flat (same as maxDepth 1).
  const effectiveMaxDepth = features.replies ? props.maxDepth ?? 2 : 1;

  const rootRef = useRef<HTMLDivElement>(null);
  const [themeTokens, setThemeTokens] = useState<Record<string, string>>({});
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || typeof getComputedStyle === "undefined") return;
    const cs = getComputedStyle(el);
    const out: Record<string, string> = {};
    for (const name of TOKEN_NAMES) {
      const v = cs.getPropertyValue(name).trim();
      if (v) out[name] = v;
    }
    setThemeTokens(out);
  }, [appearanceStyle, props.theme]);

  const slotEnv = useMemo<SlotEnv>(
    () => ({
      slots: props.slots ?? {},
      helpers: DEFAULT_HELPERS,
      theme: themeTokens,
    }),
    [props.slots, themeTokens],
  );

  /** Build a BaseCtx for a non-comment slot (header/composer/empty). */
  function baseCtx(defaultVNode: VNode): BaseCtx {
    return {
      defaultNode: () => renderToDetached(defaultVNode),
      theme: themeTokens,
      helpers: DEFAULT_HELPERS,
    };
  }

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
      .listComments({ project_id: props.projectId, page_id: props.pageId, limit: 50 })
      .then((res) => {
        if (cancelled) return;
        setComments(res.comments);
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
  }, [client, props.projectId, props.pageId]);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data as { type?: string };
      if (!data || data.type !== JOIN_MESSAGE_TYPE) return;
      const msg = ev.data as {
        type: string;
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
    const popup = window.open(
      url.toString(),
      "quipier-join",
      "width=480,height=760",
    );
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

  async function handleCreate(content: string) {
    if (!session) {
      openJoinPopup();
      throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
    }
    const { comment } = await client.createComment({
      project_id: props.projectId,
      page_id: props.pageId,
      content,
    });
    setComments((prev) => [comment, ...prev]);
    props.onComment?.(comment);
  }

  async function handleReply(parentId: string, content: string) {
    if (!session) {
      openJoinPopup();
      throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
    }
    const { comment } = await client.createComment({
      project_id: props.projectId,
      page_id: props.pageId,
      content,
      parent_id: parentId,
    });
    setComments((prev) => [...prev, comment]);
    props.onComment?.(comment);
  }

  async function handleEdit(id: string, content: string) {
    if (!session) {
      openJoinPopup();
      throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
    }
    await client.updateComment(id, content);
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content } : c)),
    );
  }

  async function handleReport(id: string, reason: ReportReason) {
    if (!session) {
      openJoinPopup();
      return;
    }
    try {
      await client.reportComment(id, reason);
      window.alert("신고가 접수되었습니다. 검토 후 조치됩니다.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearProjectSession(props.projectId);
        setSession(null);
      }
      setError(err instanceof Error ? err.message : "신고에 실패했습니다");
    }
  }

  async function handleDelete(id: string) {
    if (!session) return;
    try {
      await client.deleteComment(id);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_deleted: true, content: "" } : c)),
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearProjectSession(props.projectId);
        setSession(null);
      }
      setError(err instanceof Error ? err.message : "failed to delete");
    }
  }

  async function toggleLike(id: string) {
    if (!session) {
      openJoinPopup();
      return;
    }
    let wasLiked = false;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        wasLiked = c.liked_by_me;
        return {
          ...c,
          liked_by_me: !c.liked_by_me,
          likes_count: c.likes_count + (c.liked_by_me ? -1 : 1),
        };
      }),
    );
    try {
      const result = wasLiked
        ? await client.unlikeComment(id)
        : await client.likeComment(id);
      setComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, likes_count: result.likes_count, liked_by_me: result.liked_by_me }
            : c,
        ),
      );
    } catch (err) {
      // rollback on failure
      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          return {
            ...c,
            liked_by_me: wasLiked,
            likes_count: c.likes_count + (wasLiked ? 1 : -1),
          };
        }),
      );
      if (err instanceof ApiError && err.status === 401) {
        clearProjectSession(props.projectId);
        setSession(null);
      }
      setError(err instanceof Error ? err.message : "failed to like");
    }
  }

  function disconnect() {
    clearProjectSession(props.projectId);
    setSession(null);
  }

  async function loadMore() {
    if (!cursor) return;
    try {
      const res = await client.listComments({
        project_id: props.projectId,
        page_id: props.pageId,
        cursor,
        limit: 50,
      });
      setComments((prev) => [...prev, ...res.comments]);
      setCursor(res.next_cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to load more");
    }
  }

  const tree = useMemo(() => buildTree(comments, sort), [comments, sort]);
  const visibleCount = comments.filter((c) => !c.is_deleted).length;
  const composerSession = session
    ? { tokenId: session.projectTokenId, nickname: session.nickname }
    : null;

  const headerDefault = (
    <div class="quipier-header" data-quipier-part="header">
      <strong class="quipier-count" data-quipier-part="count">
        댓글 {visibleCount}개
      </strong>
      {features.sort ? (
        <div class="quipier-sort" data-quipier-part="sort">
          <button
            class="quipier-sort-button"
            type="button"
            onClick={() => setSortMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={sortMenuOpen}
          >
            <SortIcon />
            <span>정렬 기준</span>
          </button>
          {sortMenuOpen ? (
            <div class="quipier-menu quipier-sort-menu" role="menu">
              <button
                class={`quipier-menu-item${sort === "top" ? " is-active" : ""}`}
                role="menuitemradio"
                aria-checked={sort === "top"}
                onClick={() => {
                  setSort("top");
                  setSortMenuOpen(false);
                }}
              >
                인기순
              </button>
              <button
                class={`quipier-menu-item${sort === "newest" ? " is-active" : ""}`}
                role="menuitemradio"
                aria-checked={sort === "newest"}
                onClick={() => {
                  setSort("newest");
                  setSortMenuOpen(false);
                }}
              >
                최신순
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const composerDefault = (
    <Composer
      session={composerSession}
      onSubmit={handleCreate}
      onConnectRequest={() => {
        if (!popupOpen) openJoinPopup();
      }}
      onDisconnect={disconnect}
      manageUrl={props.passportAppOrigin + "/me"}
    />
  );

  const emptyDefault = (
    <div class="quipier-empty" data-quipier-part="empty">
      아직 댓글이 없어요. 가장 먼저 남겨보세요.
    </div>
  );

  return (
    <FeaturesContext.Provider value={features}>
      <SlotsContext.Provider value={slotEnv}>
        <div
          class="quipier-root"
          data-quipier-theme={props.theme ?? "light"}
          data-quipier-part="root"
          ref={rootRef}
          style={appearanceStyle}
        >
          <SlotHost name="header" result={props.slots?.header?.(baseCtx(headerDefault))}>
            {headerDefault}
          </SlotHost>

          {features.composer ? (
            <SlotHost
              name="composer"
              result={props.slots?.composer?.(baseCtx(composerDefault))}
            >
              {composerDefault}
            </SlotHost>
          ) : null}

          {error ? (
            <div class="quipier-error" data-quipier-part="error">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div class="quipier-empty">Loading…</div>
          ) : tree.length === 0 ? (
            <SlotHost name="empty" result={props.slots?.empty?.(baseCtx(emptyDefault))}>
              {emptyDefault}
            </SlotHost>
          ) : (
            <div class="quipier-list" data-quipier-part="list">
              {tree.map((node) => (
                <CommentItem
                  key={node.comment.id}
                  node={node}
                  ownAuthorId={session?.projectTokenId ?? null}
                  onToggleLike={toggleLike}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onReply={handleReply}
                  onReport={handleReport}
                  canReply={!!session}
                  dateFormat={props.dateFormat ?? "relative"}
                  maxDepth={effectiveMaxDepth}
                />
              ))}
            </div>
          )}
          {cursor ? (
            <button
              class="quipier-loadmore"
              data-quipier-part="loadmore"
              onClick={loadMore}
            >
              더 보기
            </button>
          ) : null}
          {features.badge ? <QuipierBadge /> : null}
        </div>
      </SlotsContext.Provider>
    </FeaturesContext.Provider>
  );
}

function buildTree(comments: Comment[], sort: SortKey): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  for (const c of comments) {
    byId.set(c.id, { comment: c, children: [] });
  }
  // YouTube-style: a comment is either a root (no parent) or a reply attached to its
  // root ancestor. Even if parent_id points at a depth-2+ comment (old data, or a
  // race), the reply is rendered as a sibling under the root.
  function findRootId(id: string): string {
    let cur = byId.get(id);
    const seen = new Set<string>();
    while (cur && cur.comment.parent_id && byId.has(cur.comment.parent_id)) {
      if (seen.has(cur.comment.id)) break; // cycle guard
      seen.add(cur.comment.id);
      cur = byId.get(cur.comment.parent_id);
    }
    return cur ? cur.comment.id : id;
  }

  const roots: CommentNode[] = [];
  for (const c of comments) {
    const node = byId.get(c.id)!;
    if (!c.parent_id) {
      roots.push(node);
      continue;
    }
    const rootId = findRootId(c.id);
    if (rootId === c.id) {
      roots.push(node);
    } else {
      byId.get(rootId)!.children.push(node);
    }
  }
  // Children oldest→newest so the conversation flows naturally.
  for (const node of byId.values()) {
    node.children.sort(
      (a, b) =>
        new Date(a.comment.created_at).getTime() -
        new Date(b.comment.created_at).getTime(),
    );
  }
  // Top-level follows user-selected sort.
  roots.sort((a, b) => {
    if (sort === "top") {
      const dl = b.comment.likes_count - a.comment.likes_count;
      if (dl !== 0) return dl;
    }
    return (
      new Date(b.comment.created_at).getTime() -
      new Date(a.comment.created_at).getTime()
    );
  });
  return roots;
}

function QuipierMark() {
  // Inline mark approximating the Quipier Q (rounded-square ring + dot + tail).
  return (
    <svg
      class="quipier-badge-mark"
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3.4" y="3.4" width="14.4" height="14.4" rx="5.4" stroke="currentColor" stroke-width="2.4" />
      <circle cx="10.6" cy="10.6" r="1.9" fill="currentColor" />
      <path d="M13.9 14.7 L18.7 19.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
    </svg>
  );
}

/** Thin "powered by" strip pinned to the bottom of the widget. */
function QuipierBadge() {
  return (
    <a
      class="quipier-badge"
      href="https://quipier.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      <QuipierMark />
      <span>powered by Quipier</span>
    </a>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="14" y2="12" />
      <line x1="4" y1="18" x2="9" y2="18" />
    </svg>
  );
}
