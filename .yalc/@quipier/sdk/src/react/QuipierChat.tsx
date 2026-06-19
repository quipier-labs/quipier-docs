// Default, drop-in chat UI on top of the headless `useQuipierChat` hook —
// `<QuipierProvider><QuipierChat /></QuipierProvider>` gives a full messenger
// (room list + 1:1 DM + open rooms + explore) without writing any UI. Power
// users keep using the hook directly.
//
// Uses React.createElement (no JSX) like the other React adapters so the SDK's
// global JSX runtime can stay targeted at Preact. All hooks live at the top of
// `QuipierChat`; the render helpers are pure (no hooks) — so conditional panes
// never break the rules of hooks.
import {
  createElement as h,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import type { ChatMessage, ChatRoom, ChatUser } from "../types.js";
import { useQuipierConfig, useQuipierSession } from "./context.js";
import { useQuipierChat } from "./useQuipierChat.js";

export interface QuipierChatProps {
  /** Container height (default 600). */
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface Palette {
  bg: string; panel: string; border: string; fg: string; muted: string;
  accent: string; mine: string; bubble: string; tint: string;
}
function palette(dark: boolean): Palette {
  return dark
    ? { bg: "#0b0f19", panel: "#0e1320", border: "#222a3d", fg: "#e7ecf5", muted: "#8a93a6", accent: "#8b5cf6", mine: "linear-gradient(135deg,#8b5cf6,#6366f1)", bubble: "#161d2f", tint: "#141b2b" }
    : { bg: "#ffffff", panel: "#f8fafc", border: "#e2e8f0", fg: "#0f172a", muted: "#64748b", accent: "#7c3aed", mine: "linear-gradient(135deg,#7c3aed,#6366f1)", bubble: "#f1f5f9", tint: "#f1f5f9" };
}

function useDark(theme: "light" | "dark" | "auto" | undefined): boolean {
  const [dark, setDark] = useState(theme !== "light");
  useEffect(() => {
    if (theme === "light") { setDark(false); return; }
    if (theme === "dark") { setDark(true); return; }
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = () => setDark(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [theme]);
  return dark;
}
function useMobile(): boolean {
  const [m, setM] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const fn = () => setM(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return m;
}

export function QuipierChat(props: QuipierChatProps): ReactNode {
  const config = useQuipierConfig();
  const session = useQuipierSession();
  const chat = useQuipierChat();
  const dark = useDark(config.theme as "light" | "dark" | "auto" | undefined);
  const mobile = useMobile();
  const c = palette(dark);

  const [pane, setPane] = useState<"rooms" | "explore">("rooms");
  const [overlay, setOverlay] = useState<"none" | "newdm" | "create">("none");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ChatUser[]>([]);
  const [createName, setCreateName] = useState("");
  const [createBusy, setCreateBusy] = useState(false);
  const [exploreList, setExploreList] = useState<ChatRoom[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const connected = !!session.session;
  const room = chat.rooms.find((r) => r.id === chat.activeRoomId) ?? null;
  const showThread = !!chat.activeRoomId;

  // stable hook callbacks (useCallback-backed) for effect deps
  const exploreRoomsFn = chat.exploreRooms;
  const searchUsersFn = chat.searchUsers;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat.messages.length]);

  useEffect(() => {
    if (!connected || pane !== "explore") return;
    setExploreList(null);
    void exploreRoomsFn().then(setExploreList);
  }, [connected, pane, exploreRoomsFn]);

  useEffect(() => {
    const q = query.trim();
    if (overlay !== "newdm" || !q) { setResults([]); return; }
    let cancelled = false;
    const t = setTimeout(() => {
      void searchUsersFn(q).then((u) => { if (!cancelled) setResults(u); });
    }, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, overlay, searchUsersFn]);

  const send = () => {
    const t = draft.trim();
    if (!t || chat.sending) return;
    setDraft("");
    void chat.sendMessage(t).catch(() => undefined);
  };
  const create = () => {
    const n = createName.trim();
    if (!n || createBusy) return;
    setCreateBusy(true);
    void chat.createOpenRoom({ name: n })
      .then((r) => { setOverlay("none"); setCreateName(""); chat.selectRoom(r.id); })
      .catch(() => undefined)
      .finally(() => setCreateBusy(false));
  };

  // ── connect gate ──
  if (!connected) {
    return frame(c, props, h("div", { key: "g", style: { flex: 1, display: "grid", placeItems: "center", padding: 32 } },
      h("div", { style: { textAlign: "center", maxWidth: 280 } },
        h("div", { style: { fontWeight: 700, fontSize: 18, color: c.fg, marginBottom: 8 } }, "채팅에 연결"),
        h("p", { style: { fontSize: 14, color: c.muted, lineHeight: 1.6, marginTop: 0 } }, "패스포트로 연결하면 1:1 대화와 오픈 채팅방을 쓸 수 있어요."),
        h("button", { onClick: session.connect, style: btn(c, "primary") }, "패스포트 연결"),
        session.error ? h("div", { style: { color: "#ef4444", fontSize: 12, marginTop: 10 } }, session.error) : null,
      )));
  }

  // ── list pane ──
  const listBody: ReactNode = pane === "rooms"
    ? (chat.loadingRooms && chat.rooms.length === 0
        ? empty(c, "불러오는 중…")
        : chat.rooms.length === 0
          ? empty(c, "아직 대화가 없어요. ‘+ 새 대화’로 시작하세요.")
          : chat.rooms.map((r) => roomRow(c, r, () => chat.selectRoom(r.id), r.id === chat.activeRoomId)))
    : (exploreList === null
        ? empty(c, "불러오는 중…")
        : exploreList.length === 0
          ? empty(c, "열린 오픈방이 없어요.")
          : exploreList.map((r) => exploreRow(c, r, () => void chat.joinRoom(r.id).then((x) => chat.selectRoom(x.id)).catch(() => undefined))));

  const list = h("div", {
    key: "list",
    style: {
      display: mobile && showThread ? "none" : "flex", flexDirection: "column",
      width: mobile ? "100%" : 300, flexShrink: 0, borderRight: mobile ? "none" : `1px solid ${c.border}`,
      background: c.panel, minHeight: 0,
    },
  },
    h("div", { key: "h", style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: `1px solid ${c.border}` } },
      tab(c, "대화", pane === "rooms", () => setPane("rooms"), chat.totalUnread),
      tab(c, "탐색", pane === "explore", () => setPane("explore")),
      h("div", { key: "sp", style: { flex: 1 } }),
      h("button", {
        key: "act",
        onClick: () => setOverlay(pane === "rooms" ? "newdm" : "create"),
        style: { ...btn(c, "primary"), width: "auto", padding: "6px 10px", fontSize: 12 },
      }, pane === "rooms" ? "+ 새 대화" : "+ 방 만들기"),
    ),
    h("div", { key: "b", style: { flex: 1, overflowY: "auto", minHeight: 0 } }, listBody),
  );

  // ── thread pane ──
  const isOpen = room?.kind === "open";
  const title = isOpen ? room?.name || "오픈 채팅" : room?.peer?.nickname || "익명 패스포트";
  const avatarKey = isOpen ? room!.id : room?.peer?.author_id || room?.id || "";
  const thread = h("div", {
    key: "thread",
    style: { display: mobile && !showThread ? "none" : "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: 0, background: c.bg },
  }, showThread && room
    ? [
        h("div", { key: "th", style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: `1px solid ${c.border}` } },
          mobile ? h("button", { key: "bk", onClick: () => chat.selectRoom(null), style: { ...btn(c, "ghost"), width: "auto", padding: "4px 9px" } }, "←") : null,
          avatar(title, avatarKey, 34),
          h("div", { key: "t", style: { flex: 1, minWidth: 0 } },
            h("div", { style: { fontWeight: 700, fontSize: 14, color: c.fg } }, title),
            h("div", { style: { fontSize: 11, color: c.muted } }, chat.peerTyping ? "입력 중…" : isOpen ? `오픈 채팅 · 👥 ${room.member_count}` : "익명 1:1"),
          ),
          isOpen ? h("button", { key: "lv", onClick: () => void chat.leaveRoom(room.id).catch(() => undefined), style: { ...btn(c, "ghost"), width: "auto", padding: "5px 10px", fontSize: 12 } }, "나가기") : null,
        ),
        h("div", { key: "msgs", ref: scrollRef, style: { flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 6, minHeight: 0 } },
          chat.hasMore ? h("button", { key: "more", onClick: () => void chat.loadMore(), style: { ...btn(c, "ghost"), width: "auto", alignSelf: "center", fontSize: 12 } }, "이전 메시지") : null,
          chat.loadingMessages && chat.messages.length === 0
            ? empty(c, "메시지를 불러오는 중…")
            : chat.messages.length === 0
              ? empty(c, "첫 메시지를 보내보세요")
              : chat.messages.map((m, i) => bubble(c, m, !!isOpen, i)),
        ),
        h("div", { key: "cmp", style: { padding: 12, borderTop: `1px solid ${c.border}`, display: "flex", gap: 8 } },
          h("input", {
            value: draft,
            onChange: (e: ChangeEvent<HTMLInputElement>) => { setDraft(e.target.value); chat.notifyTyping(); },
            onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) send(); },
            placeholder: "메시지를 입력하세요",
            style: { flex: 1, padding: "10px 14px", borderRadius: 999, border: `1px solid ${c.border}`, background: c.panel, color: c.fg, fontSize: 14, outline: "none" },
          }),
          h("button", { onClick: send, disabled: !draft.trim() || chat.sending, style: { ...btn(c, "primary"), width: "auto", padding: "0 18px" } }, "전송"),
        ),
      ]
    : h("div", { key: "ph", style: { flex: 1, display: "grid", placeItems: "center", color: c.muted, fontSize: 14 } }, "왼쪽에서 대화를 선택하세요"));

  // ── overlays ──
  const overlayNode = overlay === "newdm"
    ? overlayFrame(c, "새 대화", () => setOverlay("none"),
        h("input", { key: "q", autoFocus: true, value: query, onChange: (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value), placeholder: "닉네임으로 검색…", style: inp(c) }),
        h("div", { key: "r", style: { marginTop: 10, maxHeight: 280, overflowY: "auto" } },
          results.length === 0
            ? empty(c, query.trim() ? "결과가 없어요" : "닉네임을 입력하세요")
            : results.map((u) => h("button", {
                key: u.author_id,
                onClick: () => { setOverlay("none"); setQuery(""); void chat.openDM(u.author_id).then((r) => chat.selectRoom(r.id)).catch(() => undefined); },
                style: row(c),
              }, avatar(u.nickname || "?", u.author_id, 34), h("span", { style: { fontWeight: 600, fontSize: 14, color: c.fg } }, u.nickname || "익명 패스포트"))),
        ),
      )
    : overlay === "create"
      ? overlayFrame(c, "오픈방 만들기", () => setOverlay("none"),
          h("input", { key: "n", autoFocus: true, value: createName, onChange: (e: ChangeEvent<HTMLInputElement>) => setCreateName(e.target.value), onKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) create(); }, placeholder: "방 이름", style: inp(c) }),
          h("button", { key: "c", onClick: create, disabled: !createName.trim() || createBusy, style: { ...btn(c, "primary"), marginTop: 12 } }, createBusy ? "만드는 중…" : "만들기"),
        )
      : null;

  return frame(c, props, list, thread, overlayNode);
}

// ── pure helpers (no hooks) ──

function seedHue(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash) % 360;
}
function avatar(name: string, key: string, size: number): ReactNode {
  const hue = seedHue(key || name);
  return h("div", {
    key: "av",
    style: {
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: `linear-gradient(135deg,hsl(${hue} 65% 55%),hsl(${(hue + 40) % 360} 65% 48%))`,
      display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.42,
    },
  }, (name || "?").trim().charAt(0).toUpperCase() || "?");
}
function timeLabel(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function roomRow(c: Palette, r: ChatRoom, onClick: () => void, active: boolean): ReactNode {
  const title = r.kind === "dm" ? r.peer?.nickname || "익명 패스포트" : r.name || "오픈 채팅";
  const key = r.kind === "dm" ? r.peer?.author_id || r.id : r.id;
  return h("button", { key: r.id, onClick, style: { ...row(c), background: active ? c.tint : "transparent" } },
    avatar(title, key, 38),
    h("div", { key: "x", style: { flex: 1, minWidth: 0, textAlign: "left" } },
      h("div", { style: { display: "flex", alignItems: "center", gap: 6 } },
        h("span", { style: { fontWeight: 600, fontSize: 14, color: c.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, title),
        r.kind === "open" ? h("span", { style: badge(c) }, "오픈") : null,
      ),
      h("div", { style: { fontSize: 12.5, color: c.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 } }, r.last_message_preview || "새 대화"),
    ),
    r.unread > 0 ? h("span", { key: "u", style: unreadDot(c) }, String(r.unread)) : null,
  );
}
function exploreRow(c: Palette, r: ChatRoom, onClick: () => void): ReactNode {
  return h("button", { key: r.id, onClick, style: row(c) },
    avatar(r.name || "방", r.id, 38),
    h("div", { key: "x", style: { flex: 1, minWidth: 0, textAlign: "left" } },
      h("div", { style: { fontWeight: 600, fontSize: 14, color: c.fg } }, r.name || "오픈 채팅"),
      h("div", { style: { fontSize: 12, color: c.muted, marginTop: 2 } }, `👥 ${r.member_count}${r.max_members ? `/${r.max_members}` : ""}${r.joined ? " · 참여중" : ""}`),
    ),
    h("span", { key: "j", style: { ...badge(c), background: c.accent, color: "#fff" } }, r.joined ? "열기" : "참여"),
  );
}
function bubble(c: Palette, m: ChatMessage, showSenders: boolean, i: number): ReactNode {
  const me = m.mine;
  return h("div", { key: m.id || i, style: { display: "flex", justifyContent: me ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 } },
    !me ? avatar(m.nickname || "?", m.author_id, 26) : null,
    h("div", { key: "col", style: { display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", maxWidth: "72%" } },
      !me && showSenders ? h("span", { style: { fontSize: 11, color: c.muted, marginBottom: 2, fontWeight: 600 } }, m.nickname || "익명") : null,
      h("div", { style: { padding: "8px 12px", borderRadius: 16, fontSize: 14, lineHeight: 1.4, wordBreak: "break-word", ...(me ? { background: c.mine, color: "#fff", borderBottomRightRadius: 5 } : { background: c.bubble, color: c.fg, borderBottomLeftRadius: 5 }) } }, m.is_deleted ? "삭제된 메시지" : m.content),
      h("span", { style: { fontSize: 10, color: c.muted, marginTop: 2 } }, timeLabel(m.created_at)),
    ),
  );
}
function frame(c: Palette, props: QuipierChatProps, ...children: ReactNode[]): ReactNode {
  return h("div", {
    className: props.className,
    style: { display: "flex", height: props.height ?? 600, width: "100%", boxSizing: "border-box", border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden", background: c.bg, color: c.fg, fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", ...props.style },
  }, ...children);
}
function overlayFrame(c: Palette, title: string, onClose: () => void, ...children: ReactNode[]): ReactNode {
  return h("div", { key: "ov", onClick: onClose, style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", padding: 20, zIndex: 10 } },
    h("div", { onClick: (e: ReactMouseEvent) => e.stopPropagation(), style: { width: "100%", maxWidth: 340, background: c.panel, border: `1px solid ${c.border}`, borderRadius: 16, padding: 16 } },
      h("div", { key: "th", style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } },
        h("span", { style: { fontWeight: 700, fontSize: 16, color: c.fg } }, title),
        h("button", { onClick: onClose, style: { ...btn(c, "ghost"), width: "auto", padding: "2px 9px" } }, "✕"),
      ),
      ...children,
    ),
  );
}
function row(c: Palette): CSSProperties {
  return { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", width: "100%", boxSizing: "border-box", border: "none", background: "transparent", cursor: "pointer", borderRadius: 10, color: c.fg };
}
function inp(c: Palette): CSSProperties {
  return { width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 10, border: `1px solid ${c.border}`, background: c.bg, color: c.fg, fontSize: 14, outline: "none" };
}
function btn(c: Palette, variant: "primary" | "ghost"): CSSProperties {
  const base: CSSProperties = { cursor: "pointer", borderRadius: 10, fontWeight: 600, fontSize: 14, padding: "10px 14px", border: "none", width: "100%", boxSizing: "border-box" };
  return variant === "primary"
    ? { ...base, background: c.mine, color: "#fff" }
    : { ...base, background: "transparent", color: c.muted, border: `1px solid ${c.border}` };
}
function tab(c: Palette, label: string, active: boolean, onClick: () => void, count?: number): ReactNode {
  return h("button", { key: label, onClick, style: { cursor: "pointer", border: "none", background: "transparent", fontWeight: 700, fontSize: 14, color: active ? c.fg : c.muted, padding: "4px 2px", borderBottom: active ? `2px solid ${c.accent}` : "2px solid transparent" } },
    label,
    count && count > 0 ? h("span", { key: "ct", style: { ...unreadDot(c), marginLeft: 5, display: "inline-grid" } }, String(count)) : null);
}
function badge(c: Palette): CSSProperties {
  return { fontSize: 10, fontWeight: 700, color: c.accent, background: c.tint, padding: "1px 6px", borderRadius: 999, flexShrink: 0 };
}
function unreadDot(c: Palette): CSSProperties {
  return { minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: c.accent, color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0 };
}
function empty(c: Palette, text: string): ReactNode {
  return h("div", { key: "e", style: { color: c.muted, fontSize: 13, textAlign: "center", padding: "32px 16px", lineHeight: 1.6 } }, text);
}
