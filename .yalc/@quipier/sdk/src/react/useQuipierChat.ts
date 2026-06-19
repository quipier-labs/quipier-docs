import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError, createClient } from "../client.js";
import type { ChatMessage, ChatRoom, ChatUser, CreateOpenRoomInput } from "../types.js";
import { useQuipierConfig, useQuipierSession } from "./context.js";

export interface UseQuipierChatOptions {
  /** Messages per page (history fetch + load-more). Default 30. */
  limit?: number;
}

export interface UseQuipierChatResult {
  /** The actor's DM rooms, most recent activity first. */
  rooms: ChatRoom[];
  totalUnread: number;
  loadingRooms: boolean;
  /** The currently open room id, or null. */
  activeRoomId: string | null;
  /** Messages of the active room, oldest → newest. */
  messages: ChatMessage[];
  loadingMessages: boolean;
  loadingMore: boolean;
  sending: boolean;
  /** True when older messages remain for the active room. */
  hasMore: boolean;
  error: string | null;
  /** True once a passport session is connected. */
  connected: boolean;
  /** The actor's own public author id (project_token_id), or null. */
  selfAuthorId: string | null;
  /** True while the peer is typing in the active room (auto-clears when idle). */
  peerTyping: boolean;
  selectRoom(roomId: string | null): void;
  /** Find people by nickname to start a new DM. Empty/short query → []. */
  searchUsers(query: string): Promise<ChatUser[]>;
  /** Open (or fetch) the 1:1 DM with `targetAuthorId`, then select it. */
  openDM(targetAuthorId: string): Promise<ChatRoom>;
  /** Create an open (multi-member) room and join it. */
  createOpenRoom(input: CreateOpenRoomInput): Promise<ChatRoom>;
  /** Discoverable open rooms — for an explore list (filter by metadata yourself). */
  exploreRooms(): Promise<ChatRoom[]>;
  /** Join an open room. */
  joinRoom(roomId: string): Promise<ChatRoom>;
  /** Leave a room (drops it from the list; clears it if active). */
  leaveRoom(roomId: string): Promise<void>;
  /** Delete a room — creator only (e.g. to enforce an app timer). */
  deleteRoom(roomId: string): Promise<void>;
  /** Send a message to the active room. */
  sendMessage(content: string): Promise<void>;
  markRead(roomId: string): Promise<void>;
  /** Signal that the local user is typing in the active room (throttle in the caller). */
  notifyTyping(): void;
  refreshRooms(): Promise<void>;
  loadMore(): Promise<void>;
  clearError(): void;
}

function message(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/** Headless 1:1 DM state. Pairs with `useQuipierSession` for passport identity;
 *  the app renders its own UI. Polling/realtime is the app's choice — call
 *  `refreshRooms()` / re-`selectRoom()` to repoll. */
export function useQuipierChat(
  options: UseQuipierChatOptions = {},
): UseQuipierChatResult {
  const config = useQuipierConfig();
  const sessionState = useQuipierSession();
  const limit = options.limit ?? 30;
  const token = sessionState.session?.sessionToken ?? null;
  const selfAuthorId = sessionState.session?.projectTokenId ?? null;

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [peerTyping, setPeerTyping] = useState(false);

  // Refs the WebSocket handlers read without re-subscribing on every change.
  const socketRef = useRef<WebSocket | null>(null);
  const selfRef = useRef<string | null>(selfAuthorId);
  selfRef.current = selfAuthorId;
  const activeRef = useRef<string | null>(activeRoomId);
  activeRef.current = activeRoomId;
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const client = useMemo(
    () =>
      createClient({
        apiBase: config.apiBase ?? "https://api.quipier.com",
        apiKey: config.apiKey,
        getToken: () => token,
      }),
    [config.apiBase, config.apiKey, token],
  );

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        sessionState.disconnect();
      }
      setError(message(err, fallback));
    },
    [sessionState],
  );

  const requireSession = useCallback(() => {
    if (sessionState.session) return;
    sessionState.connect();
    throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
  }, [sessionState]);

  const refreshRooms = useCallback(async () => {
    if (!token) {
      setRooms([]);
      return;
    }
    setLoadingRooms(true);
    try {
      const result = await client.listRooms();
      setRooms(result.rooms);
    } catch (err) {
      handleError(err, "대화 목록을 불러오지 못했습니다");
    } finally {
      setLoadingRooms(false);
    }
  }, [client, handleError, token]);

  // Load (and reload on login) the room list.
  useEffect(() => {
    void refreshRooms();
  }, [refreshRooms]);

  const markRead = useCallback(
    async (roomId: string) => {
      setRooms((current) =>
        current.map((room) =>
          room.id === roomId ? { ...room, unread: 0 } : room,
        ),
      );
      if (!token) return;
      try {
        await client.markRoomRead(roomId);
      } catch {
        // A failed read-receipt is non-fatal; the count reconciles on refresh.
      }
    },
    [client, token],
  );

  // Re-fetch the latest page and merge (dedup by id) — fills any gap created
  // while the WebSocket was disconnected.
  const backfill = useCallback(
    async (roomId: string) => {
      try {
        const result = await client.listMessages({ room_id: roomId, limit });
        setMessages((current) => {
          if (roomId !== activeRef.current) return current;
          const seen = new Set(current.map((m) => m.id));
          const merged = current.slice();
          for (const m of result.messages) if (!seen.has(m.id)) merged.push(m);
          merged.sort((a, b) =>
            a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0,
          );
          return merged;
        });
      } catch {
        /* best-effort */
      }
    },
    [client, limit],
  );

  // Load history whenever the active room changes.
  useEffect(() => {
    if (!activeRoomId || !token) {
      setMessages([]);
      setCursor(null);
      return;
    }
    let cancelled = false;
    setLoadingMessages(true);
    client
      .listMessages({ room_id: activeRoomId, limit })
      .then((result) => {
        if (cancelled) return;
        setMessages(result.messages);
        setCursor(result.next_cursor);
        void markRead(activeRoomId);
      })
      .catch((err) => {
        if (!cancelled) handleError(err, "메시지를 불러오지 못했습니다");
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeRoomId, client, handleError, limit, markRead, token]);

  // Realtime: subscribe to the active room's Durable Object over WebSocket.
  // Live messages arrive here; sends still go through REST (own echo is deduped).
  useEffect(() => {
    if (typeof WebSocket === "undefined" || !activeRoomId || !token) return;
    const base = (config.apiBase ?? "https://api.quipier.com").replace(/^http/i, "ws");
    let closed = false;
    let attempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let pingTimer: ReturnType<typeof setInterval> | undefined;

    const connect = () => {
      if (closed) return;
      const url = `${base}/v1/chat/rooms/${activeRoomId}/ws?token=${encodeURIComponent(token)}`;
      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch {
        return;
      }
      socketRef.current = socket;

      socket.onopen = () => {
        attempt = 0;
        pingTimer = setInterval(() => {
          try {
            socket.send("ping");
          } catch {
            /* ignore */
          }
        }, 25_000);
        void backfill(activeRoomId);
      };

      socket.onmessage = (event) => {
        const raw = event.data;
        if (raw === "pong" || typeof raw !== "string") return;
        let frame: { type?: string; message?: ChatMessage; author_id?: string } | null;
        try {
          frame = JSON.parse(raw);
        } catch {
          return;
        }
        if (!frame) return;

        if (frame.type === "message" && frame.message) {
          const msg = frame.message;
          if (msg.room_id !== activeRef.current) return;
          const mine = msg.author_id === selfRef.current;
          setMessages((current) =>
            current.some((m) => m.id === msg.id)
              ? current
              : [...current, { ...msg, mine }],
          );
          setRooms((current) =>
            current.map((room) =>
              room.id === msg.room_id
                ? {
                    ...room,
                    last_message_at: msg.created_at,
                    last_message_preview: msg.content,
                    unread: 0,
                  }
                : room,
            ),
          );
          if (!mine) {
            setPeerTyping(false);
            void client.markRoomRead(msg.room_id).catch(() => undefined);
          }
        } else if (frame.type === "typing") {
          if (frame.author_id && frame.author_id !== selfRef.current) {
            setPeerTyping(true);
            if (typingClearRef.current) clearTimeout(typingClearRef.current);
            typingClearRef.current = setTimeout(() => setPeerTyping(false), 3_000);
          }
        }
      };

      socket.onerror = () => {
        try {
          socket.close();
        } catch {
          /* ignore */
        }
      };

      socket.onclose = () => {
        if (pingTimer) clearInterval(pingTimer);
        if (socketRef.current === socket) socketRef.current = null;
        if (closed) return;
        attempt += 1;
        const delay = Math.min(15_000, 500 * 2 ** Math.min(attempt, 5));
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (pingTimer) clearInterval(pingTimer);
      if (typingClearRef.current) clearTimeout(typingClearRef.current);
      setPeerTyping(false);
      const s = socketRef.current;
      socketRef.current = null;
      if (s) {
        try {
          s.close();
        } catch {
          /* ignore */
        }
      }
    };
  }, [activeRoomId, token, config.apiBase, backfill, client]);

  const notifyTyping = useCallback(() => {
    const s = socketRef.current;
    if (s && s.readyState === 1) {
      try {
        s.send(JSON.stringify({ type: "typing" }));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const selectRoom = useCallback((roomId: string | null) => {
    setActiveRoomId(roomId);
  }, []);

  const searchUsers = useCallback(
    async (query: string): Promise<ChatUser[]> => {
      if (!sessionState.session) {
        sessionState.connect();
        return [];
      }
      const q = query.trim();
      if (q.length < 1) return [];
      try {
        const result = await client.searchUsers(q);
        return result.users;
      } catch (err) {
        handleError(err, "사용자를 찾지 못했습니다");
        return [];
      }
    },
    [client, handleError, sessionState],
  );

  const openDM = useCallback(
    async (targetAuthorId: string) => {
      requireSession();
      try {
        const { room } = await client.openDm(targetAuthorId);
        setRooms((current) => {
          const rest = current.filter((r) => r.id !== room.id);
          return [room, ...rest];
        });
        setActiveRoomId(room.id);
        return room;
      } catch (err) {
        handleError(err, "대화를 시작하지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const createOpenRoom = useCallback(
    async (input: CreateOpenRoomInput): Promise<ChatRoom> => {
      requireSession();
      try {
        const { room } = await client.createOpenRoom(input);
        setRooms((current) => [room, ...current.filter((r) => r.id !== room.id)]);
        return room;
      } catch (err) {
        handleError(err, "방을 만들지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const exploreRooms = useCallback(
    async (): Promise<ChatRoom[]> => {
      if (!sessionState.session) {
        sessionState.connect();
        return [];
      }
      try {
        const result = await client.exploreRooms();
        return result.rooms;
      } catch (err) {
        handleError(err, "오픈방을 불러오지 못했습니다");
        return [];
      }
    },
    [client, handleError, sessionState],
  );

  const joinRoom = useCallback(
    async (roomId: string): Promise<ChatRoom> => {
      requireSession();
      try {
        const { room } = await client.joinRoom(roomId);
        setRooms((current) => [room, ...current.filter((r) => r.id !== room.id)]);
        return room;
      } catch (err) {
        handleError(err, "방에 참여하지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const leaveRoom = useCallback(
    async (roomId: string): Promise<void> => {
      try {
        await client.leaveRoom(roomId);
        setRooms((current) => current.filter((r) => r.id !== roomId));
        setActiveRoomId((current) => (current === roomId ? null : current));
      } catch (err) {
        handleError(err, "방을 나가지 못했습니다");
        throw err;
      }
    },
    [client, handleError],
  );

  const deleteRoom = useCallback(
    async (roomId: string): Promise<void> => {
      try {
        await client.deleteRoom(roomId);
        setRooms((current) => current.filter((r) => r.id !== roomId));
        setActiveRoomId((current) => (current === roomId ? null : current));
      } catch (err) {
        handleError(err, "방을 삭제하지 못했습니다");
        throw err;
      }
    },
    [client, handleError],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      requireSession();
      const roomId = activeRoomId;
      if (!roomId) throw new ApiError(400, "INVALID_REQUEST", "선택된 대화가 없습니다");
      setSending(true);
      try {
        const { message: sent } = await client.sendMessage(roomId, content);
        // Dedup against the realtime echo: the room DO broadcasts this same
        // message back over the WebSocket, which can arrive before this REST
        // response resolves. Without the id check the sender sees it twice.
        setMessages((current) =>
          current.some((m) => m.id === sent.id) ? current : [...current, sent],
        );
        setRooms((current) => {
          const updated = current.map((room) =>
            room.id === roomId
              ? {
                  ...room,
                  last_message_at: sent.created_at,
                  last_message_preview: sent.content,
                  unread: 0,
                }
              : room,
          );
          // Bubble the active room to the top.
          updated.sort((a, b) => {
            const at = a.last_message_at ?? a.created_at;
            const bt = b.last_message_at ?? b.created_at;
            return at < bt ? 1 : at > bt ? -1 : 0;
          });
          return updated;
        });
      } catch (err) {
        handleError(err, "메시지를 보내지 못했습니다");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [activeRoomId, client, handleError, requireSession],
  );

  const loadMore = useCallback(async () => {
    if (!activeRoomId || !cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await client.listMessages({
        room_id: activeRoomId,
        cursor,
        limit,
      });
      // Older messages prepend (the page is itself oldest → newest).
      setMessages((current) => [...result.messages, ...current]);
      setCursor(result.next_cursor);
    } catch (err) {
      handleError(err, "이전 메시지를 불러오지 못했습니다");
    } finally {
      setLoadingMore(false);
    }
  }, [activeRoomId, client, cursor, handleError, limit, loadingMore]);

  const totalUnread = rooms.reduce((sum, room) => sum + room.unread, 0);

  return {
    rooms,
    totalUnread,
    loadingRooms,
    activeRoomId,
    messages,
    loadingMessages,
    loadingMore,
    sending,
    hasMore: cursor !== null,
    error,
    connected: !!sessionState.session,
    selfAuthorId,
    peerTyping,
    selectRoom,
    searchUsers,
    openDM,
    createOpenRoom,
    exploreRooms,
    joinRoom,
    leaveRoom,
    deleteRoom,
    sendMessage,
    markRead,
    notifyTyping,
    refreshRooms,
    loadMore,
    clearError: () => setError(null),
  };
}
