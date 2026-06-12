import { n as e, r as t, t as n } from "./src-DsN5U0C-.js";
import { createContext as r, createElement as i, forwardRef as a, useContext as o, useEffect as s, useRef as c } from "react";
//#region src/react.ts
var l = r(null);
function u({ config: e, children: t }) {
	return i(l.Provider, { value: e }, t);
}
function d() {
	let e = o(l);
	if (!e) throw Error("useQuipierConfig / QuipierComments must be used inside <QuipierProvider>");
	return e;
}
var f = a(function(t, r) {
	let a = d(), o = c(null), l = t.projectId ?? a.projectId, u = t.apiKey ?? a.apiKey, f = t.apiBase ?? a.apiBase, p = t.passportAppOrigin ?? t.walletAppOrigin ?? a.passportAppOrigin ?? a.walletAppOrigin, m = t.theme ?? a.theme, h = t.dateFormat ?? a.dateFormat, g = t.maxDepth ?? a.maxDepth, _ = t.sort ?? a.sort, v = t.appearance ?? a.appearance, y = t.features ?? a.features, b = t.slots ?? a.slots;
	return s(() => {
		let r = o.current;
		if (r) return e({
			container: r,
			projectId: l,
			apiKey: u,
			apiBase: f,
			passportAppOrigin: p,
			pageId: t.pageId,
			onComment: t.onComment,
			theme: m,
			dateFormat: h,
			maxDepth: g,
			sort: _,
			appearance: v,
			features: y,
			slots: b
		}), () => n(r);
	}, [
		l,
		u,
		f,
		p,
		t.pageId,
		t.onComment,
		m,
		h,
		g,
		_,
		v,
		y,
		b
	]), i("div", {
		ref: (e) => {
			o.current = e, typeof r == "function" ? r(e) : r && (r.current = e);
		},
		className: t.className,
		style: t.style
	});
}), p = a(function(e, r) {
	let a = d(), o = c(null), l = e.projectId ?? a.projectId, u = e.apiKey ?? a.apiKey, f = e.apiBase ?? a.apiBase, p = e.passportAppOrigin ?? a.passportAppOrigin ?? a.walletAppOrigin, m = e.theme ?? a.theme, h = e.dateFormat ?? a.dateFormat, g = e.appearance ?? a.appearance;
	return s(() => {
		let r = o.current;
		if (r) return t({
			container: r,
			projectId: l,
			apiKey: u,
			apiBase: f,
			passportAppOrigin: p,
			theme: m,
			dateFormat: h,
			onPost: e.onPost,
			urlSync: e.urlSync,
			urlParam: e.urlParam,
			shareUrl: e.shareUrl,
			appearance: g
		}), () => n(r);
	}, [
		l,
		u,
		f,
		p,
		m,
		h,
		g,
		e.onPost,
		e.urlSync,
		e.urlParam,
		e.shareUrl
	]), i("div", {
		ref: (e) => {
			o.current = e, typeof r == "function" ? r(e) : r && (r.current = e);
		},
		className: e.className,
		style: e.style
	});
});
//#endregion
export { f as QuipierComments, p as QuipierFeed, u as QuipierProvider, d as useQuipierConfig };

//# sourceMappingURL=react.mjs.map