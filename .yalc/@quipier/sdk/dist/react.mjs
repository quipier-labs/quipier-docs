import { a as e, c as t, i as n, n as r, o as i, r as a, s as o, t as s } from "./src-CPoPOjUf.js";
import { createContext as c, createElement as l, forwardRef as u, useCallback as d, useContext as f, useEffect as p, useMemo as m, useRef as h, useState as g } from "react";
//#region src/react/context.ts
var _ = c(null), v = c(null);
function y() {
	let e = f(_);
	if (!e) throw Error("useQuipierConfig must be used inside <QuipierProvider>");
	return e;
}
function b() {
	let e = f(v);
	if (!e) throw Error("useQuipierSession must be used inside <QuipierProvider>");
	return e;
}
//#endregion
//#region src/react/useQuipierFeed.ts
function x(e, t) {
	return e instanceof Error ? e.message : t;
}
function S(e = {}) {
	let n = y(), r = b(), i = e.limit ?? 30, a = e.selectedPostId !== void 0, [s, c] = g([]), [l, u] = g(null), [f, h] = g(null), [_, v] = g(null), [S, C] = g([]), [w, T] = g(!0), [E, D] = g(!1), [O, k] = g(!1), [A, j] = g(!1), [M, N] = g(null), P = a ? e.selectedPostId ?? null : f, F = m(() => t({
		apiBase: n.apiBase ?? "https://api.quipier.com",
		apiKey: n.apiKey,
		getToken: () => r.session?.sessionToken ?? null
	}), [
		n.apiBase,
		n.apiKey,
		r.session?.sessionToken
	]), I = d((e, t) => {
		e instanceof o && e.status === 401 && r.disconnect(), N(x(e, t));
	}, [r]), L = d(async () => {
		T(!0), N(null);
		try {
			let e = await F.listFeed({
				project_id: n.projectId,
				limit: i
			});
			c(e.posts), u(e.next_cursor);
		} catch (e) {
			I(e, "피드를 불러오지 못했습니다");
		} finally {
			T(!1);
		}
	}, [
		F,
		n.projectId,
		I,
		i
	]);
	p(() => {
		L();
	}, [L]), p(() => {
		if (!P) {
			v(null), C([]);
			return;
		}
		let e = !1;
		return s.find((e) => e.id === P) ? v(null) : (D(!0), F.getPost({
			project_id: n.projectId,
			post_id: P
		}).then(({ post: t }) => {
			e || v(t);
		}).catch((t) => {
			e || I(t, "포스트를 불러오지 못했습니다");
		}).finally(() => {
			e || D(!1);
		})), k(!0), F.listReplies({
			project_id: n.projectId,
			post_id: P,
			limit: 100
		}).then((t) => {
			e || C(t.posts);
		}).catch((t) => {
			e || I(t, "답글을 불러오지 못했습니다");
		}).finally(() => {
			e || k(!1);
		}), () => {
			e = !0;
		};
	}, [
		F,
		n.projectId,
		I,
		s,
		P
	]);
	let R = d((t) => {
		a || h(t), e.onSelectedPostIdChange?.(t);
	}, [a, e]), z = d(() => {
		if (!r.session) throw r.connect(), new o(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
	}, [r]), B = d(async () => {
		if (!(!l || A)) {
			j(!0);
			try {
				let e = await F.listFeed({
					project_id: n.projectId,
					cursor: l,
					limit: i
				});
				c((t) => [...t, ...e.posts]), u(e.next_cursor);
			} catch (e) {
				I(e, "피드를 더 불러오지 못했습니다");
			} finally {
				j(!1);
			}
		}
	}, [
		F,
		n.projectId,
		l,
		I,
		i,
		A
	]), V = d(async (e, t) => {
		z();
		try {
			let r = await F.createPost({
				project_id: n.projectId,
				content: e,
				image: t ?? void 0
			});
			return c((e) => [r.post, ...e]), r.post;
		} catch (e) {
			throw I(e, "포스트를 작성하지 못했습니다"), e;
		}
	}, [
		F,
		n.projectId,
		I,
		z
	]), H = d(async (e, t, r) => {
		z();
		try {
			let i = await F.createPost({
				project_id: n.projectId,
				parent_id: e,
				content: t,
				image: r ?? void 0
			});
			return C((e) => [...e, i.post]), c((t) => t.map((t) => t.id === e ? {
				...t,
				reply_count: t.reply_count + 1
			} : t)), v((t) => t?.id === e ? {
				...t,
				reply_count: t.reply_count + 1
			} : t), i.post;
		} catch (e) {
			throw I(e, "답글을 작성하지 못했습니다"), e;
		}
	}, [
		F,
		n.projectId,
		I,
		z
	]), U = d(async (e, t) => {
		z();
		try {
			await F.updatePost(e, t), c((n) => n.map((n) => n.id === e ? {
				...n,
				content: t
			} : n)), C((n) => n.map((n) => n.id === e ? {
				...n,
				content: t
			} : n)), v((n) => n?.id === e ? {
				...n,
				content: t
			} : n);
		} catch (e) {
			throw I(e, "포스트를 수정하지 못했습니다"), e;
		}
	}, [
		F,
		I,
		z
	]), W = d(async (e) => {
		z();
		try {
			await F.deletePost(e);
			let t = (t) => t.id === e ? {
				...t,
				is_deleted: !0,
				content: "",
				image_url: null
			} : t;
			c((e) => e.map(t)), C((e) => e.map(t)), v((e) => e && t(e));
		} catch (e) {
			throw I(e, "포스트를 삭제하지 못했습니다"), e;
		}
	}, [
		F,
		I,
		z
	]), G = d(async (e) => {
		z();
		let t = s.find((t) => t.id === e) ?? S.find((t) => t.id === e) ?? (_?.id === e ? _ : null);
		if (!t) return;
		let n = {
			liked_by_me: t.liked_by_me,
			likes_count: t.likes_count
		}, r = (t) => t.id === e ? {
			...t,
			liked_by_me: !t.liked_by_me,
			likes_count: t.likes_count + (t.liked_by_me ? -1 : 1)
		} : t;
		c((e) => e.map(r)), C((e) => e.map(r)), v((e) => e && r(e));
		try {
			let t = n.liked_by_me ? await F.unlikePost(e) : await F.likePost(e), r = (n) => n.id === e ? {
				...n,
				...t
			} : n;
			c((e) => e.map(r)), C((e) => e.map(r)), v((e) => e && r(e));
		} catch (t) {
			let r = (t) => t.id === e ? {
				...t,
				...n
			} : t;
			c((e) => e.map(r)), C((e) => e.map(r)), v((e) => e && r(e)), I(t, "좋아요를 변경하지 못했습니다");
		}
	}, [
		F,
		_,
		I,
		s,
		S,
		z
	]), K = d(async (e, t) => {
		z();
		try {
			await F.reportPost(e, t);
		} catch (e) {
			throw I(e, "신고하지 못했습니다"), e;
		}
	}, [
		F,
		I,
		z
	]);
	return {
		posts: s,
		selectedPost: s.find((e) => e.id === P) ?? (_?.id === P ? _ : null),
		selectedPostId: P,
		replies: S,
		loading: w,
		detailLoading: E,
		repliesLoading: O,
		loadingMore: A,
		error: M,
		hasMore: l !== null,
		selectPost: R,
		refresh: L,
		loadMore: B,
		createPost: V,
		createReply: H,
		updatePost: U,
		deletePost: W,
		toggleLike: G,
		reportPost: K,
		clearError: () => N(null)
	};
}
//#endregion
//#region src/react/useQuipierChat.ts
function C(e, t) {
	return e instanceof Error ? e.message : t;
}
function w(e = {}) {
	let n = y(), r = b(), i = e.limit ?? 30, a = r.session?.sessionToken ?? null, s = r.session?.projectTokenId ?? null, [c, l] = g([]), [u, f] = g(!1), [_, v] = g(null), [x, S] = g([]), [w, T] = g(null), [E, D] = g(!1), [O, k] = g(!1), [A, j] = g(!1), [M, N] = g(null), [P, F] = g(!1), I = h(null), L = h(s);
	L.current = s;
	let R = h(_);
	R.current = _;
	let z = h(null), B = m(() => t({
		apiBase: n.apiBase ?? "https://api.quipier.com",
		apiKey: n.apiKey,
		getToken: () => a
	}), [
		n.apiBase,
		n.apiKey,
		a
	]), V = d((e, t) => {
		e instanceof o && e.status === 401 && r.disconnect(), N(C(e, t));
	}, [r]), H = d(() => {
		if (!r.session) throw r.connect(), new o(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
	}, [r]), U = d(async () => {
		if (!a) {
			l([]);
			return;
		}
		f(!0);
		try {
			l((await B.listRooms()).rooms);
		} catch (e) {
			V(e, "대화 목록을 불러오지 못했습니다");
		} finally {
			f(!1);
		}
	}, [
		B,
		V,
		a
	]);
	p(() => {
		U();
	}, [U]);
	let W = d(async (e) => {
		if (l((t) => t.map((t) => t.id === e ? {
			...t,
			unread: 0
		} : t)), a) try {
			await B.markRoomRead(e);
		} catch {}
	}, [B, a]), G = d(async (e) => {
		try {
			let t = await B.listMessages({
				room_id: e,
				limit: i
			});
			S((n) => {
				if (e !== R.current) return n;
				let r = new Set(n.map((e) => e.id)), i = n.slice();
				for (let e of t.messages) r.has(e.id) || i.push(e);
				return i.sort((e, t) => e.created_at < t.created_at ? -1 : +(e.created_at > t.created_at)), i;
			});
		} catch {}
	}, [B, i]);
	p(() => {
		if (!_ || !a) {
			S([]), T(null);
			return;
		}
		let e = !1;
		return D(!0), B.listMessages({
			room_id: _,
			limit: i
		}).then((t) => {
			e || (S(t.messages), T(t.next_cursor), W(_));
		}).catch((t) => {
			e || V(t, "메시지를 불러오지 못했습니다");
		}).finally(() => {
			e || D(!1);
		}), () => {
			e = !0;
		};
	}, [
		_,
		B,
		V,
		i,
		W,
		a
	]), p(() => {
		if (typeof WebSocket > "u" || !_ || !a) return;
		let e = (n.apiBase ?? "https://api.quipier.com").replace(/^http/i, "ws"), t = !1, r = 0, i, o, s = () => {
			if (t) return;
			let n = `${e}/v1/chat/rooms/${_}/ws?token=${encodeURIComponent(a)}`, c;
			try {
				c = new WebSocket(n);
			} catch {
				return;
			}
			I.current = c, c.onopen = () => {
				r = 0, o = setInterval(() => {
					try {
						c.send("ping");
					} catch {}
				}, 25e3), G(_);
			}, c.onmessage = (e) => {
				let t = e.data;
				if (t === "pong" || typeof t != "string") return;
				let n;
				try {
					n = JSON.parse(t);
				} catch {
					return;
				}
				if (n) if (n.type === "message" && n.message) {
					let e = n.message;
					if (e.room_id !== R.current) return;
					let t = e.author_id === L.current;
					S((n) => n.some((t) => t.id === e.id) ? n : [...n, {
						...e,
						mine: t
					}]), l((t) => t.map((t) => t.id === e.room_id ? {
						...t,
						last_message_at: e.created_at,
						last_message_preview: e.content,
						unread: 0
					} : t)), t || (F(!1), B.markRoomRead(e.room_id).catch(() => void 0));
				} else n.type === "typing" && n.author_id && n.author_id !== L.current && (F(!0), z.current && clearTimeout(z.current), z.current = setTimeout(() => F(!1), 3e3));
			}, c.onerror = () => {
				try {
					c.close();
				} catch {}
			}, c.onclose = () => {
				if (o && clearInterval(o), I.current === c && (I.current = null), t) return;
				r += 1;
				let e = Math.min(15e3, 500 * 2 ** Math.min(r, 5));
				i = setTimeout(s, e);
			};
		};
		return s(), () => {
			t = !0, i && clearTimeout(i), o && clearInterval(o), z.current && clearTimeout(z.current), F(!1);
			let e = I.current;
			if (I.current = null, e) try {
				e.close();
			} catch {}
		};
	}, [
		_,
		a,
		n.apiBase,
		G,
		B
	]);
	let K = d(() => {
		let e = I.current;
		if (e && e.readyState === 1) try {
			e.send(JSON.stringify({ type: "typing" }));
		} catch {}
	}, []), q = d((e) => {
		v(e);
	}, []), J = d(async (e) => {
		if (!r.session) return r.connect(), [];
		let t = e.trim();
		if (t.length < 1) return [];
		try {
			return (await B.searchUsers(t)).users;
		} catch (e) {
			return V(e, "사용자를 찾지 못했습니다"), [];
		}
	}, [
		B,
		V,
		r
	]), Y = d(async (e) => {
		H();
		try {
			let { room: t } = await B.openDm(e);
			return l((e) => [t, ...e.filter((e) => e.id !== t.id)]), v(t.id), t;
		} catch (e) {
			throw V(e, "대화를 시작하지 못했습니다"), e;
		}
	}, [
		B,
		V,
		H
	]), X = d(async (e) => {
		H();
		try {
			let { room: t } = await B.createOpenRoom(e);
			return l((e) => [t, ...e.filter((e) => e.id !== t.id)]), t;
		} catch (e) {
			throw V(e, "방을 만들지 못했습니다"), e;
		}
	}, [
		B,
		V,
		H
	]), Z = d(async () => {
		if (!r.session) return r.connect(), [];
		try {
			return (await B.exploreRooms()).rooms;
		} catch (e) {
			return V(e, "오픈방을 불러오지 못했습니다"), [];
		}
	}, [
		B,
		V,
		r
	]), ee = d(async (e) => {
		H();
		try {
			let { room: t } = await B.joinRoom(e);
			return l((e) => [t, ...e.filter((e) => e.id !== t.id)]), t;
		} catch (e) {
			throw V(e, "방에 참여하지 못했습니다"), e;
		}
	}, [
		B,
		V,
		H
	]), te = d(async (e) => {
		try {
			await B.leaveRoom(e), l((t) => t.filter((t) => t.id !== e)), v((t) => t === e ? null : t);
		} catch (e) {
			throw V(e, "방을 나가지 못했습니다"), e;
		}
	}, [B, V]), Q = d(async (e) => {
		try {
			await B.deleteRoom(e), l((t) => t.filter((t) => t.id !== e)), v((t) => t === e ? null : t);
		} catch (e) {
			throw V(e, "방을 삭제하지 못했습니다"), e;
		}
	}, [B, V]), $ = d(async (e) => {
		H();
		let t = _;
		if (!t) throw new o(400, "INVALID_REQUEST", "선택된 대화가 없습니다");
		j(!0);
		try {
			let { message: n } = await B.sendMessage(t, e);
			S((e) => e.some((e) => e.id === n.id) ? e : [...e, n]), l((e) => {
				let r = e.map((e) => e.id === t ? {
					...e,
					last_message_at: n.created_at,
					last_message_preview: n.content,
					unread: 0
				} : e);
				return r.sort((e, t) => {
					let n = e.last_message_at ?? e.created_at, r = t.last_message_at ?? t.created_at;
					return n < r ? 1 : n > r ? -1 : 0;
				}), r;
			});
		} catch (e) {
			throw V(e, "메시지를 보내지 못했습니다"), e;
		} finally {
			j(!1);
		}
	}, [
		_,
		B,
		V,
		H
	]), ne = d(async () => {
		if (!(!_ || !w || O)) {
			k(!0);
			try {
				let e = await B.listMessages({
					room_id: _,
					cursor: w,
					limit: i
				});
				S((t) => [...e.messages, ...t]), T(e.next_cursor);
			} catch (e) {
				V(e, "이전 메시지를 불러오지 못했습니다");
			} finally {
				k(!1);
			}
		}
	}, [
		_,
		B,
		w,
		V,
		i,
		O
	]);
	return {
		rooms: c,
		totalUnread: c.reduce((e, t) => e + t.unread, 0),
		loadingRooms: u,
		activeRoomId: _,
		messages: x,
		loadingMessages: E,
		loadingMore: O,
		sending: A,
		hasMore: w !== null,
		error: M,
		connected: !!r.session,
		selfAuthorId: s,
		peerTyping: P,
		selectRoom: q,
		searchUsers: J,
		openDM: Y,
		createOpenRoom: X,
		exploreRooms: Z,
		joinRoom: ee,
		leaveRoom: te,
		deleteRoom: Q,
		sendMessage: $,
		markRead: W,
		notifyTyping: K,
		refreshRooms: U,
		loadMore: ne,
		clearError: () => N(null)
	};
}
//#endregion
//#region src/react/QuipierChat.tsx
function T(e) {
	return e ? {
		bg: "#0b0f19",
		panel: "#0e1320",
		border: "#222a3d",
		fg: "#e7ecf5",
		muted: "#8a93a6",
		accent: "#8b5cf6",
		mine: "linear-gradient(135deg,#8b5cf6,#6366f1)",
		bubble: "#161d2f",
		tint: "#141b2b"
	} : {
		bg: "#ffffff",
		panel: "#f8fafc",
		border: "#e2e8f0",
		fg: "#0f172a",
		muted: "#64748b",
		accent: "#7c3aed",
		mine: "linear-gradient(135deg,#7c3aed,#6366f1)",
		bubble: "#f1f5f9",
		tint: "#f1f5f9"
	};
}
function E(e) {
	let [t, n] = g(e !== "light");
	return p(() => {
		if (e === "light") {
			n(!1);
			return;
		}
		if (e === "dark") {
			n(!0);
			return;
		}
		if (typeof window > "u") return;
		let t = window.matchMedia("(prefers-color-scheme: dark)"), r = () => n(t.matches);
		return r(), t.addEventListener("change", r), () => t.removeEventListener("change", r);
	}, [e]), t;
}
function D() {
	let [e, t] = g(!1);
	return p(() => {
		if (typeof window > "u") return;
		let e = window.matchMedia("(max-width: 640px)"), n = () => t(e.matches);
		return n(), e.addEventListener("change", n), () => e.removeEventListener("change", n);
	}, []), e;
}
function O(e) {
	let t = y(), n = b(), r = w(), i = E(t.theme), a = D(), o = T(i), [s, c] = g("rooms"), [u, d] = g("none"), [f, m] = g(""), [_, v] = g(""), [x, S] = g([]), [C, O] = g(""), [k, j] = g(!1), [V, H] = g(null), W = h(null), G = !!n.session, K = r.rooms.find((e) => e.id === r.activeRoomId) ?? null, q = !!r.activeRoomId, J = r.exploreRooms, Y = r.searchUsers;
	p(() => {
		W.current && (W.current.scrollTop = W.current.scrollHeight);
	}, [r.messages.length]), p(() => {
		!G || s !== "explore" || (H(null), J().then(H));
	}, [
		G,
		s,
		J
	]), p(() => {
		let e = _.trim();
		if (u !== "newdm" || !e) {
			S([]);
			return;
		}
		let t = !1, n = setTimeout(() => {
			Y(e).then((e) => {
				t || S(e);
			});
		}, 250);
		return () => {
			t = !0, clearTimeout(n);
		};
	}, [
		_,
		u,
		Y
	]);
	let X = () => {
		let e = f.trim();
		!e || r.sending || (m(""), r.sendMessage(e).catch(() => void 0));
	}, Z = () => {
		let e = C.trim();
		!e || k || (j(!0), r.createOpenRoom({ name: e }).then((e) => {
			d("none"), O(""), r.selectRoom(e.id);
		}).catch(() => void 0).finally(() => j(!1)));
	};
	if (!G) return F(o, e, l("div", {
		key: "g",
		style: {
			flex: 1,
			display: "grid",
			placeItems: "center",
			padding: 32
		}
	}, l("div", { style: {
		textAlign: "center",
		maxWidth: 280
	} }, l("div", { style: {
		fontWeight: 700,
		fontSize: 18,
		color: o.fg,
		marginBottom: 8
	} }, "채팅에 연결"), l("p", { style: {
		fontSize: 14,
		color: o.muted,
		lineHeight: 1.6,
		marginTop: 0
	} }, "패스포트로 연결하면 1:1 대화와 오픈 채팅방을 쓸 수 있어요."), l("button", {
		onClick: n.connect,
		style: z(o, "primary")
	}, "패스포트 연결"), n.error ? l("div", { style: {
		color: "#ef4444",
		fontSize: 12,
		marginTop: 10
	} }, n.error) : null)));
	let ee = s === "rooms" ? r.loadingRooms && r.rooms.length === 0 ? U(o, "불러오는 중…") : r.rooms.length === 0 ? U(o, "아직 대화가 없어요. ‘+ 새 대화’로 시작하세요.") : r.rooms.map((e) => M(o, e, () => r.selectRoom(e.id), e.id === r.activeRoomId)) : V === null ? U(o, "불러오는 중…") : V.length === 0 ? U(o, "열린 오픈방이 없어요.") : V.map((e) => N(o, e, () => void r.joinRoom(e.id).then((e) => r.selectRoom(e.id)).catch(() => void 0))), te = l("div", {
		key: "list",
		style: {
			display: a && q ? "none" : "flex",
			flexDirection: "column",
			width: a ? "100%" : 300,
			flexShrink: 0,
			borderRight: a ? "none" : `1px solid ${o.border}`,
			background: o.panel,
			minHeight: 0
		}
	}, l("div", {
		key: "h",
		style: {
			display: "flex",
			alignItems: "center",
			gap: 10,
			padding: "10px 12px",
			borderBottom: `1px solid ${o.border}`
		}
	}, B(o, "대화", s === "rooms", () => c("rooms"), r.totalUnread), B(o, "탐색", s === "explore", () => c("explore")), l("div", {
		key: "sp",
		style: { flex: 1 }
	}), l("button", {
		key: "act",
		onClick: () => d(s === "rooms" ? "newdm" : "create"),
		style: {
			...z(o, "primary"),
			width: "auto",
			padding: "6px 10px",
			fontSize: 12
		}
	}, s === "rooms" ? "+ 새 대화" : "+ 방 만들기")), l("div", {
		key: "b",
		style: {
			flex: 1,
			overflowY: "auto",
			minHeight: 0
		}
	}, ee)), Q = K?.kind === "open", $ = Q ? K?.name || "오픈 채팅" : K?.peer?.nickname || "익명 패스포트", ne = Q ? K.id : K?.peer?.author_id || K?.id || "";
	return F(o, e, te, l("div", {
		key: "thread",
		style: {
			display: a && !q ? "none" : "flex",
			flexDirection: "column",
			flex: 1,
			minWidth: 0,
			minHeight: 0,
			background: o.bg
		}
	}, q && K ? [
		l("div", {
			key: "th",
			style: {
				display: "flex",
				alignItems: "center",
				gap: 10,
				padding: "10px 14px",
				borderBottom: `1px solid ${o.border}`
			}
		}, a ? l("button", {
			key: "bk",
			onClick: () => r.selectRoom(null),
			style: {
				...z(o, "ghost"),
				width: "auto",
				padding: "4px 9px"
			}
		}, "←") : null, A($, ne, 34), l("div", {
			key: "t",
			style: {
				flex: 1,
				minWidth: 0
			}
		}, l("div", { style: {
			fontWeight: 700,
			fontSize: 14,
			color: o.fg
		} }, $), l("div", { style: {
			fontSize: 11,
			color: o.muted
		} }, r.peerTyping ? "입력 중…" : Q ? `오픈 채팅 · 👥 ${K.member_count}` : "익명 1:1")), Q ? l("button", {
			key: "lv",
			onClick: () => void r.leaveRoom(K.id).catch(() => void 0),
			style: {
				...z(o, "ghost"),
				width: "auto",
				padding: "5px 10px",
				fontSize: 12
			}
		}, "나가기") : null),
		l("div", {
			key: "msgs",
			ref: W,
			style: {
				flex: 1,
				overflowY: "auto",
				padding: 14,
				display: "flex",
				flexDirection: "column",
				gap: 6,
				minHeight: 0
			}
		}, r.hasMore ? l("button", {
			key: "more",
			onClick: () => void r.loadMore(),
			style: {
				...z(o, "ghost"),
				width: "auto",
				alignSelf: "center",
				fontSize: 12
			}
		}, "이전 메시지") : null, r.loadingMessages && r.messages.length === 0 ? U(o, "메시지를 불러오는 중…") : r.messages.length === 0 ? U(o, "첫 메시지를 보내보세요") : r.messages.map((e, t) => P(o, e, !!Q, t))),
		l("div", {
			key: "cmp",
			style: {
				padding: 12,
				borderTop: `1px solid ${o.border}`,
				display: "flex",
				gap: 8
			}
		}, l("input", {
			value: f,
			onChange: (e) => {
				m(e.target.value), r.notifyTyping();
			},
			onKeyDown: (e) => {
				e.key === "Enter" && !e.nativeEvent.isComposing && X();
			},
			placeholder: "메시지를 입력하세요",
			style: {
				flex: 1,
				padding: "10px 14px",
				borderRadius: 999,
				border: `1px solid ${o.border}`,
				background: o.panel,
				color: o.fg,
				fontSize: 14,
				outline: "none"
			}
		}), l("button", {
			onClick: X,
			disabled: !f.trim() || r.sending,
			style: {
				...z(o, "primary"),
				width: "auto",
				padding: "0 18px"
			}
		}, "전송"))
	] : l("div", {
		key: "ph",
		style: {
			flex: 1,
			display: "grid",
			placeItems: "center",
			color: o.muted,
			fontSize: 14
		}
	}, "왼쪽에서 대화를 선택하세요")), u === "newdm" ? I(o, "새 대화", () => d("none"), l("input", {
		key: "q",
		autoFocus: !0,
		value: _,
		onChange: (e) => v(e.target.value),
		placeholder: "닉네임으로 검색…",
		style: R(o)
	}), l("div", {
		key: "r",
		style: {
			marginTop: 10,
			maxHeight: 280,
			overflowY: "auto"
		}
	}, x.length === 0 ? U(o, _.trim() ? "결과가 없어요" : "닉네임을 입력하세요") : x.map((e) => l("button", {
		key: e.author_id,
		onClick: () => {
			d("none"), v(""), r.openDM(e.author_id).then((e) => r.selectRoom(e.id)).catch(() => void 0);
		},
		style: L(o)
	}, A(e.nickname || "?", e.author_id, 34), l("span", { style: {
		fontWeight: 600,
		fontSize: 14,
		color: o.fg
	} }, e.nickname || "익명 패스포트"))))) : u === "create" ? I(o, "오픈방 만들기", () => d("none"), l("input", {
		key: "n",
		autoFocus: !0,
		value: C,
		onChange: (e) => O(e.target.value),
		onKeyDown: (e) => {
			e.key === "Enter" && !e.nativeEvent.isComposing && Z();
		},
		placeholder: "방 이름",
		style: R(o)
	}), l("button", {
		key: "c",
		onClick: Z,
		disabled: !C.trim() || k,
		style: {
			...z(o, "primary"),
			marginTop: 12
		}
	}, k ? "만드는 중…" : "만들기")) : null);
}
function k(e) {
	let t = 0;
	for (let n = 0; n < e.length; n += 1) t = t * 31 + e.charCodeAt(n) | 0;
	return Math.abs(t) % 360;
}
function A(e, t, n) {
	let r = k(t || e);
	return l("div", {
		key: "av",
		style: {
			width: n,
			height: n,
			borderRadius: 999,
			flexShrink: 0,
			background: `linear-gradient(135deg,hsl(${r} 65% 55%),hsl(${(r + 40) % 360} 65% 48%))`,
			display: "grid",
			placeItems: "center",
			color: "#fff",
			fontWeight: 700,
			fontSize: n * .42
		}
	}, (e || "?").trim().charAt(0).toUpperCase() || "?");
}
function j(e) {
	let t = new Date(e);
	return `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
}
function M(e, t, n, r) {
	let i = t.kind === "dm" ? t.peer?.nickname || "익명 패스포트" : t.name || "오픈 채팅", a = t.kind === "dm" && t.peer?.author_id || t.id;
	return l("button", {
		key: t.id,
		onClick: n,
		style: {
			...L(e),
			background: r ? e.tint : "transparent"
		}
	}, A(i, a, 38), l("div", {
		key: "x",
		style: {
			flex: 1,
			minWidth: 0,
			textAlign: "left"
		}
	}, l("div", { style: {
		display: "flex",
		alignItems: "center",
		gap: 6
	} }, l("span", { style: {
		fontWeight: 600,
		fontSize: 14,
		color: e.fg,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	} }, i), t.kind === "open" ? l("span", { style: V(e) }, "오픈") : null), l("div", { style: {
		fontSize: 12.5,
		color: e.muted,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		marginTop: 2
	} }, t.last_message_preview || "새 대화")), t.unread > 0 ? l("span", {
		key: "u",
		style: H(e)
	}, String(t.unread)) : null);
}
function N(e, t, n) {
	return l("button", {
		key: t.id,
		onClick: n,
		style: L(e)
	}, A(t.name || "방", t.id, 38), l("div", {
		key: "x",
		style: {
			flex: 1,
			minWidth: 0,
			textAlign: "left"
		}
	}, l("div", { style: {
		fontWeight: 600,
		fontSize: 14,
		color: e.fg
	} }, t.name || "오픈 채팅"), l("div", { style: {
		fontSize: 12,
		color: e.muted,
		marginTop: 2
	} }, `👥 ${t.member_count}${t.max_members ? `/${t.max_members}` : ""}${t.joined ? " · 참여중" : ""}`)), l("span", {
		key: "j",
		style: {
			...V(e),
			background: e.accent,
			color: "#fff"
		}
	}, t.joined ? "열기" : "참여"));
}
function P(e, t, n, r) {
	let i = t.mine;
	return l("div", {
		key: t.id || r,
		style: {
			display: "flex",
			justifyContent: i ? "flex-end" : "flex-start",
			alignItems: "flex-end",
			gap: 6
		}
	}, i ? null : A(t.nickname || "?", t.author_id, 26), l("div", {
		key: "col",
		style: {
			display: "flex",
			flexDirection: "column",
			alignItems: i ? "flex-end" : "flex-start",
			maxWidth: "72%"
		}
	}, !i && n ? l("span", { style: {
		fontSize: 11,
		color: e.muted,
		marginBottom: 2,
		fontWeight: 600
	} }, t.nickname || "익명") : null, l("div", { style: {
		padding: "8px 12px",
		borderRadius: 16,
		fontSize: 14,
		lineHeight: 1.4,
		wordBreak: "break-word",
		...i ? {
			background: e.mine,
			color: "#fff",
			borderBottomRightRadius: 5
		} : {
			background: e.bubble,
			color: e.fg,
			borderBottomLeftRadius: 5
		}
	} }, t.is_deleted ? "삭제된 메시지" : t.content), l("span", { style: {
		fontSize: 10,
		color: e.muted,
		marginTop: 2
	} }, j(t.created_at))));
}
function F(e, t, ...n) {
	return l("div", {
		className: t.className,
		style: {
			display: "flex",
			height: t.height ?? 600,
			width: "100%",
			boxSizing: "border-box",
			border: `1px solid ${e.border}`,
			borderRadius: 14,
			overflow: "hidden",
			background: e.bg,
			color: e.fg,
			fontFamily: "system-ui, -apple-system, sans-serif",
			position: "relative",
			...t.style
		}
	}, ...n);
}
function I(e, t, n, ...r) {
	return l("div", {
		key: "ov",
		onClick: n,
		style: {
			position: "absolute",
			inset: 0,
			background: "rgba(0,0,0,0.45)",
			display: "grid",
			placeItems: "center",
			padding: 20,
			zIndex: 10
		}
	}, l("div", {
		onClick: (e) => e.stopPropagation(),
		style: {
			width: "100%",
			maxWidth: 340,
			background: e.panel,
			border: `1px solid ${e.border}`,
			borderRadius: 16,
			padding: 16
		}
	}, l("div", {
		key: "th",
		style: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 12
		}
	}, l("span", { style: {
		fontWeight: 700,
		fontSize: 16,
		color: e.fg
	} }, t), l("button", {
		onClick: n,
		style: {
			...z(e, "ghost"),
			width: "auto",
			padding: "2px 9px"
		}
	}, "✕")), ...r));
}
function L(e) {
	return {
		display: "flex",
		alignItems: "center",
		gap: 10,
		padding: "9px 12px",
		width: "100%",
		boxSizing: "border-box",
		border: "none",
		background: "transparent",
		cursor: "pointer",
		borderRadius: 10,
		color: e.fg
	};
}
function R(e) {
	return {
		width: "100%",
		boxSizing: "border-box",
		padding: "10px 14px",
		borderRadius: 10,
		border: `1px solid ${e.border}`,
		background: e.bg,
		color: e.fg,
		fontSize: 14,
		outline: "none"
	};
}
function z(e, t) {
	let n = {
		cursor: "pointer",
		borderRadius: 10,
		fontWeight: 600,
		fontSize: 14,
		padding: "10px 14px",
		border: "none",
		width: "100%",
		boxSizing: "border-box"
	};
	return t === "primary" ? {
		...n,
		background: e.mine,
		color: "#fff"
	} : {
		...n,
		background: "transparent",
		color: e.muted,
		border: `1px solid ${e.border}`
	};
}
function B(e, t, n, r, i) {
	return l("button", {
		key: t,
		onClick: r,
		style: {
			cursor: "pointer",
			border: "none",
			background: "transparent",
			fontWeight: 700,
			fontSize: 14,
			color: n ? e.fg : e.muted,
			padding: "4px 2px",
			borderBottom: n ? `2px solid ${e.accent}` : "2px solid transparent"
		}
	}, t, i && i > 0 ? l("span", {
		key: "ct",
		style: {
			...H(e),
			marginLeft: 5,
			display: "inline-grid"
		}
	}, String(i)) : null);
}
function V(e) {
	return {
		fontSize: 10,
		fontWeight: 700,
		color: e.accent,
		background: e.tint,
		padding: "1px 6px",
		borderRadius: 999,
		flexShrink: 0
	};
}
function H(e) {
	return {
		minWidth: 18,
		height: 18,
		padding: "0 5px",
		borderRadius: 999,
		background: e.accent,
		color: "#fff",
		fontSize: 10,
		fontWeight: 700,
		display: "grid",
		placeItems: "center",
		flexShrink: 0
	};
}
function U(e, t) {
	return l("div", {
		key: "e",
		style: {
			color: e.muted,
			fontSize: 13,
			textAlign: "center",
			padding: "32px 16px",
			lineHeight: 1.6
		}
	}, t);
}
//#endregion
//#region src/react.ts
function W({ config: t, children: r }) {
	let [a, o] = g(null), [s, c] = g(!0), [u, f] = g(!1), [h, y] = g(null), b = t.passportAppOrigin ?? t.walletAppOrigin ?? "https://passport.quipier.com";
	p(() => {
		o(e(t.projectId)), c(!1);
	}, [t.projectId]), p(() => {
		let e = new URL(b).origin;
		function n(n) {
			if (n.origin !== e) return;
			let r = n.data;
			if (r?.type !== "quipier:join:result") return;
			if (f(!1), !r.ok) {
				y(r.message ?? "패스포트 연결이 취소되었습니다");
				return;
			}
			if (r.project_id !== t.projectId || !r.project_token_id || !r.session_token || !r.expires_at) {
				y("유효하지 않은 패스포트 연결 응답입니다");
				return;
			}
			let a = {
				projectId: r.project_id,
				projectTokenId: r.project_token_id,
				nickname: r.nickname ?? "",
				sessionToken: r.session_token,
				expiresAt: new Date(r.expires_at).getTime()
			};
			i(a), o(a), y(null);
		}
		return window.addEventListener("message", n), () => window.removeEventListener("message", n);
	}, [t.projectId, b]);
	let x = d(() => {
		if (typeof window > "u" || u) return;
		let e = new URL(b + "/join");
		e.searchParams.set("project_id", t.projectId), e.searchParams.set("return_origin", window.location.origin);
		let n = window.open(e.toString(), "quipier-join", "width=480,height=760");
		if (!n) {
			y("팝업 차단을 해제해주세요");
			return;
		}
		f(!0);
		let r = window.setInterval(() => {
			n.closed && (window.clearInterval(r), f(!1));
		}, 500);
	}, [
		t.projectId,
		u,
		b
	]), S = d(() => {
		n(t.projectId), o(null), f(!1);
	}, [t.projectId]), C = m(() => ({
		session: a,
		loading: s,
		connecting: u,
		error: h,
		connect: x,
		disconnect: S,
		clearError: () => y(null)
	}), [
		x,
		u,
		S,
		h,
		s,
		a
	]);
	return l(_.Provider, { value: t }, l(v.Provider, { value: C }, r));
}
var G = u(function(e, t) {
	let n = y(), i = h(null), a = e.projectId ?? n.projectId, o = e.apiKey ?? n.apiKey, c = e.apiBase ?? n.apiBase, u = e.passportAppOrigin ?? e.walletAppOrigin ?? n.passportAppOrigin ?? n.walletAppOrigin, d = e.theme ?? n.theme, f = e.dateFormat ?? n.dateFormat, m = e.maxDepth ?? n.maxDepth, g = e.sort ?? n.sort, _ = e.appearance ?? n.appearance, v = e.features ?? n.features, b = e.slots ?? n.slots;
	return p(() => {
		let t = i.current;
		if (t) return r({
			container: t,
			projectId: a,
			apiKey: o,
			apiBase: c,
			passportAppOrigin: u,
			pageId: e.pageId,
			onComment: e.onComment,
			theme: d,
			dateFormat: f,
			maxDepth: m,
			sort: g,
			appearance: _,
			features: v,
			slots: b
		}), () => s(t);
	}, [
		a,
		o,
		c,
		u,
		e.pageId,
		e.onComment,
		d,
		f,
		m,
		g,
		_,
		v,
		b
	]), l("div", {
		ref: (e) => {
			i.current = e, typeof t == "function" ? t(e) : t && (t.current = e);
		},
		className: e.className,
		style: e.style
	});
}), K = u(function(e, t) {
	let n = y(), r = h(null), i = e.projectId ?? n.projectId, o = e.apiKey ?? n.apiKey, c = e.apiBase ?? n.apiBase, u = e.passportAppOrigin ?? n.passportAppOrigin ?? n.walletAppOrigin, d = e.theme ?? n.theme, f = e.dateFormat ?? n.dateFormat, m = e.appearance ?? n.appearance;
	return p(() => {
		let t = r.current;
		if (t) return a({
			container: t,
			projectId: i,
			apiKey: o,
			apiBase: c,
			passportAppOrigin: u,
			theme: d,
			dateFormat: f,
			onPost: e.onPost,
			urlSync: e.urlSync,
			urlParam: e.urlParam,
			shareUrl: e.shareUrl,
			appearance: m
		}), () => s(t);
	}, [
		i,
		o,
		c,
		u,
		d,
		f,
		m,
		e.onPost,
		e.urlSync,
		e.urlParam,
		e.shareUrl
	]), l("div", {
		ref: (e) => {
			r.current = e, typeof t == "function" ? t(e) : t && (t.current = e);
		},
		className: e.className,
		style: e.style
	});
});
//#endregion
export { O as QuipierChat, G as QuipierComments, K as QuipierFeed, W as QuipierProvider, w as useQuipierChat, y as useQuipierConfig, S as useQuipierFeed, b as useQuipierSession };

//# sourceMappingURL=react.mjs.map