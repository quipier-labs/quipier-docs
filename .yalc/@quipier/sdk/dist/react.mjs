import { n as e, t } from "./src-DlLs_cSz.js";
import { createContext as n, createElement as r, forwardRef as i, useContext as a, useEffect as o, useRef as s } from "react";
//#region src/react.ts
var c = n(null);
function l({ config: e, children: t }) {
	return r(c.Provider, { value: e }, t);
}
function u() {
	let e = a(c);
	if (!e) throw Error("useQuipierConfig / QuipierComments must be used inside <QuipierProvider>");
	return e;
}
var d = i(function(n, i) {
	let a = u(), c = s(null), l = n.projectId ?? a.projectId, d = n.apiKey ?? a.apiKey, f = n.apiBase ?? a.apiBase, p = n.passportAppOrigin ?? n.walletAppOrigin ?? a.passportAppOrigin ?? a.walletAppOrigin, m = n.theme ?? a.theme, h = n.dateFormat ?? a.dateFormat, g = n.maxDepth ?? a.maxDepth, _ = n.sort ?? a.sort;
	return o(() => {
		let r = c.current;
		if (r) return e({
			container: r,
			projectId: l,
			apiKey: d,
			apiBase: f,
			passportAppOrigin: p,
			pageId: n.pageId,
			onComment: n.onComment,
			theme: m,
			dateFormat: h,
			maxDepth: g,
			sort: _
		}), () => t(r);
	}, [
		l,
		d,
		f,
		p,
		n.pageId,
		n.onComment,
		m,
		h,
		g,
		_
	]), r("div", {
		ref: (e) => {
			c.current = e, typeof i == "function" ? i(e) : i && (i.current = e);
		},
		className: n.className,
		style: n.style
	});
});
//#endregion
export { d as QuipierComments, l as QuipierProvider, u as useQuipierConfig };

//# sourceMappingURL=react.mjs.map