import type { ChatMessage, ChatRoom, ChatUser, CreateOpenRoomInput } from "../types.js";
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
/** Headless 1:1 DM state. Pairs with `useQuipierSession` for passport identity;
 *  the app renders its own UI. Polling/realtime is the app's choice — call
 *  `refreshRooms()` / re-`selectRoom()` to repoll. */
export declare function useQuipierChat(options?: UseQuipierChatOptions): UseQuipierChatResult;
//# sourceMappingURL=useQuipierChat.d.ts.map