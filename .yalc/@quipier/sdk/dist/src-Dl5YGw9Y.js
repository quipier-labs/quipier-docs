//#region node_modules/preact/dist/preact.module.js
var e, t, n, r, i, a, o, s, c, l, u, d, f, p, m = {}, h = [], g = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, _ = Array.isArray;
function v(e, t) {
	for (var n in t) e[n] = t[n];
	return e;
}
function y(e) {
	e && e.parentNode && e.parentNode.removeChild(e);
}
function b(t, n, r) {
	var i, a, o, s = {};
	for (o in n) o == "key" ? i = n[o] : o == "ref" ? a = n[o] : s[o] = n[o];
	if (arguments.length > 2 && (s.children = arguments.length > 3 ? e.call(arguments, 2) : r), typeof t == "function" && t.defaultProps != null) for (o in t.defaultProps) s[o] === void 0 && (s[o] = t.defaultProps[o]);
	return x(t, s, i, a, null);
}
function x(e, r, i, a, o) {
	var s = {
		type: e,
		props: r,
		key: i,
		ref: a,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: o ?? ++n,
		__i: -1,
		__u: 0
	};
	return o == null && t.vnode != null && t.vnode(s), s;
}
function S(e) {
	return e.children;
}
function C(e, t) {
	this.props = e, this.context = t;
}
function w(e, t) {
	if (t == null) return e.__ ? w(e.__, e.__i + 1) : null;
	for (var n; t < e.__k.length; t++) if ((n = e.__k[t]) != null && n.__e != null) return n.__e;
	return typeof e.type == "function" ? w(e) : null;
}
function T(e) {
	if (e.__P && e.__d) {
		var n = e.__v, r = n.__e, i = [], a = [], o = v({}, n);
		o.__v = n.__v + 1, t.vnode && t.vnode(o), F(e.__P, o, n, e.__n, e.__P.namespaceURI, 32 & n.__u ? [r] : null, i, r ?? w(n), !!(32 & n.__u), a), o.__v = n.__v, o.__.__k[o.__i] = o, L(i, o, a), n.__e = n.__ = null, o.__e != r && E(o);
	}
}
function E(e) {
	if ((e = e.__) != null && e.__c != null) return e.__e = e.__c.base = null, e.__k.some(function(t) {
		if (t != null && t.__e != null) return e.__e = e.__c.base = t.__e;
	}), E(e);
}
function D(e) {
	(!e.__d && (e.__d = !0) && r.push(e) && !O.__r++ || i != t.debounceRendering) && ((i = t.debounceRendering) || a)(O);
}
function O() {
	try {
		for (var e, t = 1; r.length;) r.length > t && r.sort(o), e = r.shift(), t = r.length, T(e);
	} finally {
		r.length = O.__r = 0;
	}
}
function k(e, t, n, r, i, a, o, s, c, l, u) {
	var d, f, p, g, _, v, y, b = r && r.__k || h, x = t.length;
	for (c = A(n, t, b, c, x), d = 0; d < x; d++) (p = n.__k[d]) != null && (f = p.__i != -1 && b[p.__i] || m, p.__i = d, v = F(e, p, f, i, a, o, s, c, l, u), g = p.__e, p.ref && f.ref != p.ref && (f.ref && R(f.ref, null, p), u.push(p.ref, p.__c || g, p)), _ == null && g != null && (_ = g), (y = !!(4 & p.__u)) || f.__k === p.__k ? (c = j(p, c, e, y), y && f.__e && (f.__e = null)) : typeof p.type == "function" && v !== void 0 ? c = v : g && (c = g.nextSibling), p.__u &= -7);
	return n.__e = _, c;
}
function A(e, t, n, r, i) {
	var a, o, s, c, l, u = n.length, d = u, f = 0;
	for (e.__k = Array(i), a = 0; a < i; a++) (o = t[a]) != null && typeof o != "boolean" && typeof o != "function" ? (typeof o == "string" || typeof o == "number" || typeof o == "bigint" || o.constructor == String ? o = e.__k[a] = x(null, o, null, null, null) : _(o) ? o = e.__k[a] = x(S, { children: o }, null, null, null) : o.constructor === void 0 && o.__b > 0 ? o = e.__k[a] = x(o.type, o.props, o.key, o.ref ? o.ref : null, o.__v) : e.__k[a] = o, c = a + f, o.__ = e, o.__b = e.__b + 1, s = null, (l = o.__i = M(o, n, c, d)) != -1 && (d--, (s = n[l]) && (s.__u |= 2)), s == null || s.__v == null ? (l == -1 && (i > u ? f-- : i < u && f++), typeof o.type != "function" && (o.__u |= 4)) : l != c && (l == c - 1 ? f-- : l == c + 1 ? f++ : (l > c ? f-- : f++, o.__u |= 4))) : e.__k[a] = null;
	if (d) for (a = 0; a < u; a++) (s = n[a]) != null && !(2 & s.__u) && (s.__e == r && (r = w(s)), re(s, s));
	return r;
}
function j(e, t, n, r) {
	var i, a;
	if (typeof e.type == "function") {
		for (i = e.__k, a = 0; i && a < i.length; a++) i[a] && (i[a].__ = e, t = j(i[a], t, n, r));
		return t;
	}
	e.__e != t && (r && (t && e.type && !t.parentNode && (t = w(e)), n.insertBefore(e.__e, t || null)), t = e.__e);
	do
		t = t && t.nextSibling;
	while (t != null && t.nodeType == 8);
	return t;
}
function M(e, t, n, r) {
	var i, a, o, s = e.key, c = e.type, l = t[n], u = l != null && (2 & l.__u) == 0;
	if (l === null && s == null || u && s == l.key && c == l.type) return n;
	if (r > +!!u) {
		for (i = n - 1, a = n + 1; i >= 0 || a < t.length;) if ((l = t[o = i >= 0 ? i-- : a++]) != null && !(2 & l.__u) && s == l.key && c == l.type) return o;
	}
	return -1;
}
function N(e, t, n) {
	t[0] == "-" ? e.setProperty(t, n ?? "") : e[t] = n == null ? "" : typeof n != "number" || g.test(t) ? n : n + "px";
}
function P(e, t, n, r, i) {
	var a, o;
	n: if (t == "style") if (typeof n == "string") e.style.cssText = n;
	else {
		if (typeof r == "string" && (e.style.cssText = r = ""), r) for (t in r) n && t in n || N(e.style, t, "");
		if (n) for (t in n) r && n[t] == r[t] || N(e.style, t, n[t]);
	}
	else if (t[0] == "o" && t[1] == "n") a = t != (t = t.replace(u, "$1")), o = t.toLowerCase(), t = o in e || t == "onFocusOut" || t == "onFocusIn" ? o.slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + a] = n, n ? r ? n[l] = r[l] : (n[l] = d, e.addEventListener(t, a ? p : f, a)) : e.removeEventListener(t, a ? p : f, a);
	else {
		if (i == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
		else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
			e[t] = n ?? "";
			break n;
		} catch {}
		typeof n == "function" || (n == null || !1 === n && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && n == 1 ? "" : n));
	}
}
function ee(e) {
	return function(n) {
		if (this.l) {
			var r = this.l[n.type + e];
			if (n[c] == null) n[c] = d++;
			else if (n[c] < r[l]) return;
			return r(t.event ? t.event(n) : n);
		}
	};
}
function F(e, n, r, i, a, o, s, c, l, u) {
	var d, f, p, m, g, b, x, w, T, E, D, O, A, j, M, N = n.type;
	if (n.constructor !== void 0) return null;
	128 & r.__u && (l = !!(32 & r.__u), o = [c = n.__e = r.__e]), (d = t.__b) && d(n);
	n: if (typeof N == "function") try {
		if (w = n.props, T = N.prototype && N.prototype.render, E = (d = N.contextType) && i[d.__c], D = d ? E ? E.props.value : d.__ : i, r.__c ? x = (f = n.__c = r.__c).__ = f.__E : (T ? n.__c = f = new N(w, D) : (n.__c = f = new C(w, D), f.constructor = N, f.render = ie), E && E.sub(f), f.state || (f.state = {}), f.__n = i, p = f.__d = !0, f.__h = [], f._sb = []), T && f.__s == null && (f.__s = f.state), T && N.getDerivedStateFromProps != null && (f.__s == f.state && (f.__s = v({}, f.__s)), v(f.__s, N.getDerivedStateFromProps(w, f.__s))), m = f.props, g = f.state, f.__v = n, p) T && N.getDerivedStateFromProps == null && f.componentWillMount != null && f.componentWillMount(), T && f.componentDidMount != null && f.__h.push(f.componentDidMount);
		else {
			if (T && N.getDerivedStateFromProps == null && w !== m && f.componentWillReceiveProps != null && f.componentWillReceiveProps(w, D), n.__v == r.__v || !f.__e && f.shouldComponentUpdate != null && !1 === f.shouldComponentUpdate(w, f.__s, D)) {
				n.__v != r.__v && (f.props = w, f.state = f.__s, f.__d = !1), n.__e = r.__e, n.__k = r.__k, n.__k.some(function(e) {
					e && (e.__ = n);
				}), h.push.apply(f.__h, f._sb), f._sb = [], f.__h.length && s.push(f);
				break n;
			}
			f.componentWillUpdate != null && f.componentWillUpdate(w, f.__s, D), T && f.componentDidUpdate != null && f.__h.push(function() {
				f.componentDidUpdate(m, g, b);
			});
		}
		if (f.context = D, f.props = w, f.__P = e, f.__e = !1, O = t.__r, A = 0, T) f.state = f.__s, f.__d = !1, O && O(n), d = f.render(f.props, f.state, f.context), h.push.apply(f.__h, f._sb), f._sb = [];
		else do
			f.__d = !1, O && O(n), d = f.render(f.props, f.state, f.context), f.state = f.__s;
		while (f.__d && ++A < 25);
		f.state = f.__s, f.getChildContext != null && (i = v(v({}, i), f.getChildContext())), T && !p && f.getSnapshotBeforeUpdate != null && (b = f.getSnapshotBeforeUpdate(m, g)), j = d != null && d.type === S && d.key == null ? te(d.props.children) : d, c = k(e, _(j) ? j : [j], n, r, i, a, o, s, c, l, u), f.base = n.__e, n.__u &= -161, f.__h.length && s.push(f), x && (f.__E = f.__ = null);
	} catch (e) {
		if (n.__v = null, l || o != null) if (e.then) {
			for (n.__u |= l ? 160 : 128; c && c.nodeType == 8 && c.nextSibling;) c = c.nextSibling;
			o[o.indexOf(c)] = null, n.__e = c;
		} else {
			for (M = o.length; M--;) y(o[M]);
			I(n);
		}
		else n.__e = r.__e, n.__k = r.__k, e.then || I(n);
		t.__e(e, n, r);
	}
	else o == null && n.__v == r.__v ? (n.__k = r.__k, n.__e = r.__e) : c = n.__e = ne(r.__e, n, r, i, a, o, s, l, u);
	return (d = t.diffed) && d(n), 128 & n.__u ? void 0 : c;
}
function I(e) {
	e && (e.__c && (e.__c.__e = !0), e.__k && e.__k.some(I));
}
function L(e, n, r) {
	for (var i = 0; i < r.length; i++) R(r[i], r[++i], r[++i]);
	t.__c && t.__c(n, e), e.some(function(n) {
		try {
			e = n.__h, n.__h = [], e.some(function(e) {
				e.call(n);
			});
		} catch (e) {
			t.__e(e, n.__v);
		}
	});
}
function te(e) {
	return typeof e != "object" || !e || e.__b > 0 ? e : _(e) ? e.map(te) : v({}, e);
}
function ne(n, r, i, a, o, s, c, l, u) {
	var d, f, p, h, g, v, b, x = i.props || m, S = r.props, C = r.type;
	if (C == "svg" ? o = "http://www.w3.org/2000/svg" : C == "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), s != null) {
		for (d = 0; d < s.length; d++) if ((g = s[d]) && "setAttribute" in g == !!C && (C ? g.localName == C : g.nodeType == 3)) {
			n = g, s[d] = null;
			break;
		}
	}
	if (n == null) {
		if (C == null) return document.createTextNode(S);
		n = document.createElementNS(o, C, S.is && S), l && (t.__m && t.__m(r, s), l = !1), s = null;
	}
	if (C == null) x === S || l && n.data == S || (n.data = S);
	else {
		if (s = s && e.call(n.childNodes), !l && s != null) for (x = {}, d = 0; d < n.attributes.length; d++) x[(g = n.attributes[d]).name] = g.value;
		for (d in x) g = x[d], d == "dangerouslySetInnerHTML" ? p = g : d == "children" || d in S || d == "value" && "defaultValue" in S || d == "checked" && "defaultChecked" in S || P(n, d, null, g, o);
		for (d in S) g = S[d], d == "children" ? h = g : d == "dangerouslySetInnerHTML" ? f = g : d == "value" ? v = g : d == "checked" ? b = g : l && typeof g != "function" || x[d] === g || P(n, d, g, x[d], o);
		if (f) l || p && (f.__html == p.__html || f.__html == n.innerHTML) || (n.innerHTML = f.__html), r.__k = [];
		else if (p && (n.innerHTML = ""), k(r.type == "template" ? n.content : n, _(h) ? h : [h], r, i, a, C == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, s, c, s ? s[0] : i.__k && w(i, 0), l, u), s != null) for (d = s.length; d--;) y(s[d]);
		l || (d = "value", C == "progress" && v == null ? n.removeAttribute("value") : v != null && (v !== n[d] || C == "progress" && !v || C == "option" && v != x[d]) && P(n, d, v, x[d], o), d = "checked", b != null && b != n[d] && P(n, d, b, x[d], o));
	}
	return n;
}
function R(e, n, r) {
	try {
		if (typeof e == "function") {
			var i = typeof e.__u == "function";
			i && e.__u(), i && n == null || (e.__u = e(n));
		} else e.current = n;
	} catch (e) {
		t.__e(e, r);
	}
}
function re(e, n, r) {
	var i, a;
	if (t.unmount && t.unmount(e), (i = e.ref) && (i.current && i.current != e.__e || R(i, null, n)), (i = e.__c) != null) {
		if (i.componentWillUnmount) try {
			i.componentWillUnmount();
		} catch (e) {
			t.__e(e, n);
		}
		i.base = i.__P = null;
	}
	if (i = e.__k) for (a = 0; a < i.length; a++) i[a] && re(i[a], n, r || typeof e.type != "function");
	r || y(e.__e), e.__c = e.__ = e.__e = void 0;
}
function ie(e, t, n) {
	return this.constructor(e, n);
}
function ae(n, r, i) {
	var a, o, s, c;
	r == document && (r = document.documentElement), t.__ && t.__(n, r), o = (a = typeof i == "function") ? null : i && i.__k || r.__k, s = [], c = [], F(r, n = (!a && i || r).__k = b(S, null, [n]), o || m, m, r.namespaceURI, !a && i ? [i] : o ? null : r.firstChild ? e.call(r.childNodes) : null, s, !a && i ? i : o ? o.__e : r.firstChild, a, c), L(s, n, c);
}
e = h.slice, t = { __e: function(e, t, n, r) {
	for (var i, a, o; t = t.__;) if ((i = t.__c) && !i.__) try {
		if ((a = i.constructor) && a.getDerivedStateFromError != null && (i.setState(a.getDerivedStateFromError(e)), o = i.__d), i.componentDidCatch != null && (i.componentDidCatch(e, r || {}), o = i.__d), o) return i.__E = i;
	} catch (t) {
		e = t;
	}
	throw e;
} }, n = 0, C.prototype.setState = function(e, t) {
	var n = this.__s != null && this.__s != this.state ? this.__s : this.__s = v({}, this.state);
	typeof e == "function" && (e = e(v({}, n), this.props)), e && v(n, e), e != null && this.__v && (t && this._sb.push(t), D(this));
}, C.prototype.forceUpdate = function(e) {
	this.__v && (this.__e = !0, e && this.__h.push(e), D(this));
}, C.prototype.render = S, r = [], a = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, o = function(e, t) {
	return e.__v.__b - t.__v.__b;
}, O.__r = 0, s = Math.random().toString(8), c = "__d" + s, l = "__a" + s, u = /(PointerCapture)$|Capture$/i, d = 0, f = ee(!1), p = ee(!0);
//#endregion
//#region node_modules/preact/hooks/dist/hooks.module.js
var z, B, oe, se, V = 0, ce = [], H = t, le = H.__b, ue = H.__r, de = H.diffed, fe = H.__c, pe = H.unmount, me = H.__;
function U(e, t) {
	H.__h && H.__h(B, e, V || t), V = 0;
	var n = B.__H || (B.__H = {
		__: [],
		__h: []
	});
	return e >= n.__.length && n.__.push({}), n.__[e];
}
function W(e) {
	return V = 1, he(Se, e);
}
function he(e, t, n) {
	var r = U(z++, 2);
	if (r.t = e, !r.__c && (r.__ = [n ? n(t) : Se(void 0, t), function(e) {
		var t = r.__N ? r.__N[0] : r.__[0], n = r.t(t, e);
		t !== n && (r.__N = [n, r.__[1]], r.__c.setState({}));
	}], r.__c = B, !B.__f)) {
		var i = function(e, t, n) {
			if (!r.__c.__H) return !0;
			var i = r.__c.__H.__.filter(function(e) {
				return e.__c;
			});
			if (i.every(function(e) {
				return !e.__N;
			})) return !a || a.call(this, e, t, n);
			var o = r.__c.props !== e;
			return i.some(function(e) {
				if (e.__N) {
					var t = e.__[0];
					e.__ = e.__N, e.__N = void 0, t !== e.__[0] && (o = !0);
				}
			}), a && a.call(this, e, t, n) || o;
		};
		B.__f = !0;
		var a = B.shouldComponentUpdate, o = B.componentWillUpdate;
		B.componentWillUpdate = function(e, t, n) {
			if (this.__e) {
				var r = a;
				a = void 0, i(e, t, n), a = r;
			}
			o && o.call(this, e, t, n);
		}, B.shouldComponentUpdate = i;
	}
	return r.__N || r.__;
}
function G(e, t) {
	var n = U(z++, 3);
	!H.__s && xe(n.__H, t) && (n.__ = e, n.u = t, B.__H.__h.push(n));
}
function K(e) {
	return V = 5, ge(function() {
		return { current: e };
	}, []);
}
function ge(e, t) {
	var n = U(z++, 7);
	return xe(n.__H, t) && (n.__ = e(), n.__H = t, n.__h = e), n.__;
}
function _e() {
	for (var e; e = ce.shift();) {
		var t = e.__H;
		if (e.__P && t) try {
			t.__h.some(q), t.__h.some(be), t.__h = [];
		} catch (n) {
			t.__h = [], H.__e(n, e.__v);
		}
	}
}
H.__b = function(e) {
	B = null, le && le(e);
}, H.__ = function(e, t) {
	e && t.__k && t.__k.__m && (e.__m = t.__k.__m), me && me(e, t);
}, H.__r = function(e) {
	ue && ue(e), z = 0;
	var t = (B = e.__c).__H;
	t && (oe === B ? (t.__h = [], B.__h = [], t.__.some(function(e) {
		e.__N && (e.__ = e.__N), e.u = e.__N = void 0;
	})) : (t.__h.some(q), t.__h.some(be), t.__h = [], z = 0)), oe = B;
}, H.diffed = function(e) {
	de && de(e);
	var t = e.__c;
	t && t.__H && (t.__H.__h.length && (ce.push(t) !== 1 && se === H.requestAnimationFrame || ((se = H.requestAnimationFrame) || ye)(_e)), t.__H.__.some(function(e) {
		e.u && (e.__H = e.u), e.u = void 0;
	})), oe = B = null;
}, H.__c = function(e, t) {
	t.some(function(e) {
		try {
			e.__h.some(q), e.__h = e.__h.filter(function(e) {
				return !e.__ || be(e);
			});
		} catch (n) {
			t.some(function(e) {
				e.__h && (e.__h = []);
			}), t = [], H.__e(n, e.__v);
		}
	}), fe && fe(e, t);
}, H.unmount = function(e) {
	pe && pe(e);
	var t, n = e.__c;
	n && n.__H && (n.__H.__.some(function(e) {
		try {
			q(e);
		} catch (e) {
			t = e;
		}
	}), n.__H = void 0, t && H.__e(t, n.__v));
};
var ve = typeof requestAnimationFrame == "function";
function ye(e) {
	var t, n = function() {
		clearTimeout(r), ve && cancelAnimationFrame(t), setTimeout(e);
	}, r = setTimeout(n, 35);
	ve && (t = requestAnimationFrame(n));
}
function q(e) {
	var t = B, n = e.__c;
	typeof n == "function" && (e.__c = void 0, n()), B = t;
}
function be(e) {
	var t = B;
	e.__c = e.__(), B = t;
}
function xe(e, t) {
	return !e || e.length !== t.length || t.some(function(t, n) {
		return t !== e[n];
	});
}
function Se(e, t) {
	return typeof t == "function" ? t(e) : t;
}
//#endregion
//#region src/constants.ts
var Ce = {
	COMMENT_CONTENT_MAX: 2e3,
	COMMENT_CONTENT_MIN: 1,
	NICKNAME_MAX: 32,
	LIST_COMMENTS_DEFAULT: 20,
	LIST_COMMENTS_MAX: 100
}, we = {
	API_KEY: "x-quipier-key",
	AUTHORIZATION: "authorization"
};
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/typeof.js
function J(e) {
	"@babel/helpers - typeof";
	return J = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, J(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPrimitive.js
function Te(e, t) {
	if (J(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (J(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPropertyKey.js
function Ee(e) {
	var t = Te(e, "string");
	return J(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/defineProperty.js
function De(e, t, n) {
	return (t = Ee(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/client.ts
var Y = class extends Error {
	constructor(e, t, n) {
		super(n), De(this, "code", void 0), De(this, "status", void 0), this.name = "ApiError", this.status = e, this.code = t;
	}
};
function Oe(e) {
	async function t(t, n, r, i = "anonymous") {
		let a = { [we.API_KEY]: e.apiKey };
		if (r !== void 0 && (a["content-type"] = "application/json"), i === "passport") {
			let t = e.getToken();
			if (!t) throw new Y(401, "UNAUTHORIZED", "no project session token");
			a[we.AUTHORIZATION] = `Bearer ${t}`;
		}
		let o = await fetch(e.apiBase + n, {
			method: t,
			headers: a,
			body: r === void 0 ? void 0 : JSON.stringify(r),
			credentials: "omit"
		});
		if (o.status === 204) return;
		let s = await o.json();
		if (!o.ok || !s.data) {
			let e = s.error?.code ?? "INTERNAL", t = s.error?.message ?? "request failed";
			throw new Y(o.status, e, t);
		}
		return s.data;
	}
	return {
		listComments(e) {
			let n = new URLSearchParams({
				project_id: e.project_id,
				page_id: e.page_id
			});
			return e.cursor && n.set("cursor", e.cursor), e.limit && n.set("limit", String(e.limit)), t("GET", `/v1/comments?${n.toString()}`);
		},
		createComment(e) {
			return t("POST", "/v1/comments", e, "passport");
		},
		deleteComment(e) {
			return t("DELETE", `/v1/comments/${e}`, void 0, "passport");
		},
		updateComment(e, n) {
			return t("PATCH", `/v1/comments/${e}`, { content: n }, "passport");
		},
		likeComment(e) {
			return t("POST", `/v1/comments/${e}/like`, void 0, "passport");
		},
		unlikeComment(e) {
			return t("DELETE", `/v1/comments/${e}/like`, void 0, "passport");
		},
		reportComment(e, n) {
			return t("POST", `/v1/comments/${e}/report`, { reason: n }, "passport");
		}
	};
}
//#endregion
//#region src/storage.ts
var X = "quipier:session:";
function ke(e) {
	try {
		let t = localStorage.getItem(X + e);
		if (!t) return null;
		let n = JSON.parse(t);
		return n.expiresAt > Date.now() + 1e4 ? n : (localStorage.removeItem(X + e), null);
	} catch {
		return null;
	}
}
function Ae(e) {
	try {
		localStorage.setItem(X + e.projectId, JSON.stringify(e));
	} catch {}
}
function Z(e) {
	try {
		localStorage.removeItem(X + e);
	} catch {}
}
//#endregion
//#region node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var je = 0;
Array.isArray;
function Q(e, n, r, i, a, o) {
	n || (n = {});
	var s, c, l = n;
	if ("ref" in l) for (c in l = {}, n) c == "ref" ? s = n[c] : l[c] = n[c];
	var u = {
		type: e,
		props: l,
		key: r,
		ref: s,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__c: null,
		constructor: void 0,
		__v: --je,
		__i: -1,
		__u: 0,
		__source: a,
		__self: o
	};
	if (typeof e == "function" && (s = e.defaultProps)) for (c in s) l[c] === void 0 && (l[c] = s[c]);
	return t.vnode && t.vnode(u), u;
}
//#endregion
//#region src/components/Avatar.tsx
var Me = [
	"#ff4500",
	"#ff8717",
	"#ffb000",
	"#46d160",
	"#24a0ed",
	"#7193ff",
	"#a55eea",
	"#ea4c89",
	"#3aa57c",
	"#d63a3a"
];
function Ne(e) {
	let t = 5381;
	for (let n = 0; n < e.length; n++) t = (t << 5) + t + e.charCodeAt(n) | 0;
	return Math.abs(t);
}
function Pe({ seed: e, label: t, size: n = 32 }) {
	let r = Me[Ne(e) % Me.length], i = (t || e || "?").trim().charAt(0).toUpperCase() || "?";
	return /* @__PURE__ */ Q("div", {
		class: "quipier-avatar",
		style: {
			backgroundColor: r,
			width: `${n}px`,
			height: `${n}px`,
			fontSize: `${Math.round(n * .45)}px`
		},
		"aria-hidden": "true",
		children: i
	});
}
//#endregion
//#region src/components/IdentityMenu.tsx
function Fe({ nickname: e, tokenId: t, manageUrl: n, onDisconnect: r, onClose: i }) {
	let a = K(null);
	return G(() => {
		function e(e) {
			a.current && !a.current.contains(e.target) && i();
		}
		function t(e) {
			e.key === "Escape" && i();
		}
		return document.addEventListener("mousedown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("keydown", t);
		};
	}, [i]), /* @__PURE__ */ Q("div", {
		ref: a,
		class: "quipier-menu",
		role: "menu",
		children: [
			/* @__PURE__ */ Q("div", {
				class: "quipier-menu-head",
				children: [/* @__PURE__ */ Q("strong", {
					class: "quipier-menu-nick",
					children: e || "(no nickname)"
				}), /* @__PURE__ */ Q("span", {
					class: "quipier-menu-token",
					children: Ie(t)
				})]
			}),
			/* @__PURE__ */ Q("div", { class: "quipier-menu-sep" }),
			/* @__PURE__ */ Q("a", {
				class: "quipier-menu-item",
				role: "menuitem",
				href: n,
				target: "_blank",
				rel: "noopener noreferrer",
				onClick: i,
				children: "패스포트 관리 ↗"
			}),
			/* @__PURE__ */ Q("button", {
				class: "quipier-menu-item",
				role: "menuitem",
				onClick: () => {
					r(), i();
				},
				children: "로그아웃"
			})
		]
	});
}
function Ie(e) {
	return e.length <= 12 ? e : e.slice(0, 6) + "…" + e.slice(-4);
}
//#endregion
//#region src/components/Composer.tsx
function Le({ session: e, onSubmit: t, onConnectRequest: n, onDisconnect: r, manageUrl: i, placeholder: a = "댓글 추가..." }) {
	let [o, s] = W(""), [c, l] = W(!1), [u, d] = W(!1), [f, p] = W(null), [m, h] = W(!1), g = K(null);
	G(() => {
		let e = g.current;
		e && (e.style.height = "auto", e.style.height = e.scrollHeight + "px");
	}, [o, c]);
	async function _(e) {
		e.preventDefault();
		let n = o.trim();
		if (!(n.length === 0 || u)) {
			d(!0), p(null);
			try {
				await t(n), s(""), l(!1), g.current?.blur();
			} catch (e) {
				let t = e instanceof Error ? e.message : "failed to post";
				p(/blocked from commenting/i.test(t) || /차단/.test(t) ? "이 패스포트는 운영자에 의해 차단되어 댓글을 작성할 수 없습니다." : /this IP is blocked/i.test(t) ? "이 위치(IP)에서는 일시적으로 댓글 작성이 차단됐어요. 잠시 후 다시 시도해주세요." : /quota exceeded/i.test(t) ? "이 프로젝트의 댓글 한도에 도달해 잠시 작성이 막혔습니다." : t);
			} finally {
				d(!1);
			}
		}
	}
	function v() {
		s(""), l(!1), p(null), g.current?.blur();
	}
	let y = c || o.length > 0, b = e?.tokenId ?? "guest", x = e?.nickname ?? null;
	return /* @__PURE__ */ Q("form", {
		class: "quipier-composer",
		onSubmit: _,
		children: [
			/* @__PURE__ */ Q("div", {
				class: "quipier-composer-row",
				children: [/* @__PURE__ */ Q("div", {
					class: "quipier-composer-avatar",
					children: [/* @__PURE__ */ Q("button", {
						type: "button",
						class: "quipier-avatar-button",
						onClick: () => e && h((e) => !e),
						"aria-haspopup": "menu",
						"aria-expanded": m,
						disabled: !e,
						children: /* @__PURE__ */ Q(Pe, {
							seed: b,
							label: x,
							size: 32
						})
					}), m && e ? /* @__PURE__ */ Q(Fe, {
						nickname: e.nickname,
						tokenId: e.tokenId,
						manageUrl: i,
						onDisconnect: r,
						onClose: () => h(!1)
					}) : null]
				}), /* @__PURE__ */ Q("div", {
					class: `quipier-composer-input${y ? " is-expanded" : ""}`,
					children: /* @__PURE__ */ Q("textarea", {
						ref: g,
						class: "quipier-composer-textarea",
						value: o,
						rows: 1,
						maxLength: Ce.COMMENT_CONTENT_MAX,
						placeholder: a,
						disabled: u,
						onClick: () => {
							e || n();
						},
						onFocus: () => {
							if (!e) {
								n(), g.current?.blur();
								return;
							}
							l(!0);
						},
						onInput: (e) => s(e.target.value),
						readOnly: !e
					})
				})]
			}),
			f ? /* @__PURE__ */ Q("div", {
				class: "quipier-error",
				children: f
			}) : null,
			y ? /* @__PURE__ */ Q("div", {
				class: "quipier-composer-actions",
				children: [/* @__PURE__ */ Q("button", {
					type: "button",
					class: "quipier-button-ghost",
					onClick: v,
					disabled: u,
					children: "취소"
				}), /* @__PURE__ */ Q("button", {
					type: "submit",
					class: "quipier-button",
					disabled: u || o.trim().length === 0,
					children: u ? "Posting…" : "Post"
				})]
			}) : null
		]
	});
}
//#endregion
//#region src/components/CommentForm.tsx
function Re({ disabled: e, placeholder: t = "댓글 추가...", submitLabel: n = "Post", initialValue: r = "", onSubmit: i, onCancel: a, autoFocus: o = !0 }) {
	let [s, c] = W(r), [l, u] = W(!1), [d, f] = W(null), p = K(null);
	G(() => {
		o && p.current?.focus();
	}, [o]), G(() => {
		let e = p.current;
		e && (e.style.height = "auto", e.style.height = e.scrollHeight + "px");
	}, [s]);
	async function m(e) {
		e.preventDefault();
		let t = s.trim();
		if (!(t.length === 0 || l)) {
			u(!0), f(null);
			try {
				await i(t), c("");
			} catch (e) {
				f(e instanceof Error ? e.message : "failed to post");
			} finally {
				u(!1);
			}
		}
	}
	return /* @__PURE__ */ Q("form", {
		class: "quipier-composer",
		onSubmit: m,
		children: [
			/* @__PURE__ */ Q("div", {
				class: "quipier-composer-input is-expanded",
				children: /* @__PURE__ */ Q("textarea", {
					ref: p,
					class: "quipier-composer-textarea",
					value: s,
					rows: 1,
					maxLength: Ce.COMMENT_CONTENT_MAX,
					placeholder: t,
					disabled: e || l,
					onInput: (e) => c(e.target.value)
				})
			}),
			d ? /* @__PURE__ */ Q("div", {
				class: "quipier-error",
				children: d
			}) : null,
			/* @__PURE__ */ Q("div", {
				class: "quipier-composer-actions",
				children: [a ? /* @__PURE__ */ Q("button", {
					type: "button",
					class: "quipier-button-ghost",
					onClick: a,
					disabled: l,
					children: "취소"
				}) : null, /* @__PURE__ */ Q("button", {
					type: "submit",
					class: "quipier-button",
					disabled: e || l || s.trim().length === 0,
					children: l ? "Posting…" : n
				})]
			})
		]
	});
}
//#endregion
//#region src/components/CommentMenu.tsx
var ze = [
	["spam", "스팸/광고"],
	["harassment", "욕설/혐오"],
	["adult", "음란물"],
	["privacy", "개인정보 노출"],
	["other", "기타"]
];
function Be({ isOwn: e, onEdit: t, onDelete: n, onReport: r }) {
	let [i, a] = W(!1), [o, s] = W(!1), c = K(null);
	G(() => {
		if (!i) {
			s(!1);
			return;
		}
		function e(e) {
			c.current && !c.current.contains(e.target) && a(!1);
		}
		function t(e) {
			e.key === "Escape" && a(!1);
		}
		return document.addEventListener("mousedown", e), document.addEventListener("keydown", t), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("keydown", t);
		};
	}, [i]);
	function l(e) {
		return () => {
			a(!1), e();
		};
	}
	return /* @__PURE__ */ Q("div", {
		class: "quipier-rowmenu",
		ref: c,
		children: [/* @__PURE__ */ Q("button", {
			type: "button",
			class: "quipier-rowmenu-trigger",
			"aria-haspopup": "menu",
			"aria-expanded": i,
			"aria-label": "더보기",
			onClick: () => a((e) => !e),
			children: /* @__PURE__ */ Q(Ve, {})
		}), i ? /* @__PURE__ */ Q("div", {
			class: "quipier-menu quipier-rowmenu-popover",
			role: "menu",
			children: e ? /* @__PURE__ */ Q(S, { children: [/* @__PURE__ */ Q("button", {
				class: "quipier-menu-item",
				role: "menuitem",
				onClick: l(t),
				children: "수정"
			}), /* @__PURE__ */ Q("button", {
				class: "quipier-menu-item is-danger",
				role: "menuitem",
				onClick: l(n),
				children: "삭제"
			})] }) : o ? /* @__PURE__ */ Q(S, { children: [/* @__PURE__ */ Q("div", {
				class: "quipier-menu-head",
				children: /* @__PURE__ */ Q("span", {
					class: "quipier-menu-nick",
					children: "신고 사유"
				})
			}), ze.map(([e, t]) => /* @__PURE__ */ Q("button", {
				class: "quipier-menu-item",
				role: "menuitem",
				onClick: l(() => r(e)),
				children: t
			}, e))] }) : /* @__PURE__ */ Q("button", {
				class: "quipier-menu-item",
				role: "menuitem",
				onClick: () => s(!0),
				children: "신고하기"
			})
		}) : null]
	});
}
function Ve() {
	return /* @__PURE__ */ Q("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "currentColor",
		children: [
			/* @__PURE__ */ Q("circle", {
				cx: "5",
				cy: "12",
				r: "1.8"
			}),
			/* @__PURE__ */ Q("circle", {
				cx: "12",
				cy: "12",
				r: "1.8"
			}),
			/* @__PURE__ */ Q("circle", {
				cx: "19",
				cy: "12",
				r: "1.8"
			})
		]
	});
}
//#endregion
//#region src/components/CommentItem.tsx
var $ = 10;
function He({ node: e, ownAuthorId: t, onToggleLike: n, onDelete: r, onEdit: i, onReply: a, onReport: o, canReply: s, dateFormat: c = "relative", maxDepth: l = 2, depth: u = 0, rootId: d }) {
	let { comment: f, children: p } = e, m = l >= 2, [h, g] = W(!1), [_, v] = W(!1), [y, b] = W(!1), [x, C] = W(!1), [w, T] = W($), E = !!t && f.author_id === t, D = f.nickname || f.author_id.slice(0, 8), O = f.liked_by_me, k = f.likes_count, A = u === 0 ? 32 : 24, j = d ?? f.id, M = f.deleted_by_type === "operator" ? "운영자가 삭제한 댓글입니다" : f.deleted_by_type === "passport" ? "사용자가 삭제한 댓글입니다" : "삭제된 댓글입니다", N = !!f.is_hidden;
	async function P(e) {
		await a(j, e), g(!1), b(!0), T(Math.max($, p.length + 1));
	}
	async function ee(e) {
		await i(f.id, e), v(!1);
	}
	let F = y ? p.slice(0, w) : [], I = p.length - w, L = y && I > 0;
	return /* @__PURE__ */ Q("div", {
		class: "quipier-thread",
		children: [/* @__PURE__ */ Q("div", {
			class: "quipier-item",
			children: [/* @__PURE__ */ Q(Pe, {
				seed: f.author_id,
				label: f.nickname,
				size: A
			}), /* @__PURE__ */ Q("div", {
				class: "quipier-item-body",
				children: [
					/* @__PURE__ */ Q("div", {
						class: "quipier-item-head",
						children: [
							/* @__PURE__ */ Q("span", {
								class: "quipier-item-author",
								children: D
							}),
							f.author_blocked ? /* @__PURE__ */ Q("span", {
								class: "quipier-author-badge quipier-author-blocked",
								children: "차단"
							}) : null,
							/* @__PURE__ */ Q("span", {
								class: "quipier-item-dot",
								children: "·"
							}),
							/* @__PURE__ */ Q("span", { children: Ue(f.created_at, c) }),
							!f.is_deleted && !N ? /* @__PURE__ */ Q(Be, {
								isOwn: E,
								onEdit: () => v(!0),
								onDelete: () => r(f.id),
								onReport: (e) => o(f.id, e)
							}) : null
						]
					}),
					_ && !f.is_deleted && !N ? /* @__PURE__ */ Q("div", {
						class: "quipier-edit-form",
						children: /* @__PURE__ */ Q(Re, {
							placeholder: "댓글을 수정하세요",
							submitLabel: "저장",
							initialValue: f.content,
							onCancel: () => v(!1),
							onSubmit: ee
						})
					}) : f.is_deleted ? /* @__PURE__ */ Q("div", {
						class: "quipier-item-content is-deleted",
						children: M
					}) : N ? x ? /* @__PURE__ */ Q(S, { children: [/* @__PURE__ */ Q("div", {
						class: "quipier-hidden-banner",
						children: [/* @__PURE__ */ Q("span", { children: "운영자에 의해 숨겨진 댓글입니다." }), /* @__PURE__ */ Q("button", {
							type: "button",
							class: "quipier-hidden-toggle",
							onClick: () => C(!1),
							children: "다시 숨기기"
						})]
					}), /* @__PURE__ */ Q("div", {
						class: "quipier-item-content",
						children: f.content
					})] }) : /* @__PURE__ */ Q("div", {
						class: "quipier-item-content is-hidden",
						children: [/* @__PURE__ */ Q("em", { children: "이 댓글은 운영자에 의해 숨겨졌습니다." }), /* @__PURE__ */ Q("button", {
							type: "button",
							class: "quipier-hidden-toggle",
							onClick: () => C(!0),
							children: "확인하기"
						})]
					}) : /* @__PURE__ */ Q("div", {
						class: "quipier-item-content",
						children: f.content
					}),
					!f.is_deleted && !N && !_ ? /* @__PURE__ */ Q("div", {
						class: "quipier-actions",
						children: [/* @__PURE__ */ Q("button", {
							class: `quipier-action${O ? " is-active" : ""}`,
							onClick: () => n(f.id),
							"aria-pressed": O,
							"aria-label": O ? "Unlike" : "Like",
							children: [/* @__PURE__ */ Q(We, { filled: O }), /* @__PURE__ */ Q("span", { children: k })]
						}), s && m ? /* @__PURE__ */ Q("button", {
							class: "quipier-action",
							onClick: () => g((e) => !e),
							children: [/* @__PURE__ */ Q(Ge, {}), /* @__PURE__ */ Q("span", { children: "답글" })]
						}) : null]
					}) : null,
					h ? /* @__PURE__ */ Q("div", {
						class: "quipier-reply-form",
						children: /* @__PURE__ */ Q(Re, {
							placeholder: `@${D}에게 답글…`,
							submitLabel: "답글",
							initialValue: u >= 1 ? `@${D} ` : "",
							onCancel: () => g(!1),
							onSubmit: P
						})
					}) : null
				]
			})]
		}), m && p.length > 0 ? /* @__PURE__ */ Q("div", {
			class: "quipier-thread-children",
			children: y ? /* @__PURE__ */ Q(S, { children: [
				F.map((e) => /* @__PURE__ */ Q(He, {
					node: e,
					ownAuthorId: t,
					onToggleLike: n,
					onDelete: r,
					onEdit: i,
					onReply: a,
					onReport: o,
					canReply: s,
					dateFormat: c,
					maxDepth: l,
					depth: u + 1,
					rootId: j
				}, e.comment.id)),
				L ? /* @__PURE__ */ Q("button", {
					class: "quipier-thread-more",
					type: "button",
					onClick: () => T((e) => e + $),
					children: [
						"답글 ",
						Math.min($, I),
						"개 더 보기"
					]
				}) : null,
				/* @__PURE__ */ Q("button", {
					class: "quipier-thread-toggle",
					type: "button",
					onClick: () => b(!1),
					children: [/* @__PURE__ */ Q(Ke, { dir: "up" }), /* @__PURE__ */ Q("span", { children: "답글 숨기기" })]
				})
			] }) : /* @__PURE__ */ Q("button", {
				class: "quipier-thread-toggle",
				type: "button",
				onClick: () => b(!0),
				children: [/* @__PURE__ */ Q(Ke, { dir: "down" }), /* @__PURE__ */ Q("span", { children: [
					"답글 ",
					p.length,
					"개"
				] })]
			})
		}) : null]
	});
}
function Ue(e, t = "relative") {
	let n = new Date(e);
	if (Number.isNaN(n.getTime())) return e;
	if (t === "absolute") return n.toLocaleString();
	let r = Date.now() - n.getTime(), i = Math.floor(r / 1e3);
	if (i < 60) return "방금 전";
	let a = Math.floor(i / 60);
	if (a < 60) return `${a}분 전`;
	let o = Math.floor(a / 60);
	if (o < 24) return `${o}시간 전`;
	let s = Math.floor(o / 24);
	return s < 7 ? `${s}일 전` : n.toLocaleDateString();
}
function We({ filled: e }) {
	return /* @__PURE__ */ Q("svg", {
		viewBox: "0 0 24 24",
		fill: e ? "currentColor" : "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		children: /* @__PURE__ */ Q("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
	});
}
function Ge() {
	return /* @__PURE__ */ Q("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		children: /* @__PURE__ */ Q("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })
	});
}
function Ke({ dir: e }) {
	return /* @__PURE__ */ Q("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		children: /* @__PURE__ */ Q("path", { d: e === "down" ? "M6 9l6 6 6-6" : "M6 15l6-6 6 6" })
	});
}
//#endregion
//#region src/widget.tsx
var qe = "quipier:join:result";
function Je(e) {
	let [t, n] = W(() => ke(e.projectId)), [r, i] = W([]), [a, o] = W(null), [s, c] = W(!0), [l, u] = W(null), [d, f] = W(!1), [p, m] = W(e.sort ?? "top"), [h, g] = W(!1), _ = ge(() => Oe({
		apiBase: e.apiBase,
		apiKey: e.apiKey,
		getToken: () => t?.sessionToken ?? null
	}), [
		e.apiBase,
		e.apiKey,
		t?.sessionToken
	]);
	G(() => {
		let t = !1;
		return c(!0), u(null), _.listComments({
			project_id: e.projectId,
			page_id: e.pageId,
			limit: 50
		}).then((e) => {
			t || (i(e.comments), o(e.next_cursor));
		}).catch((e) => {
			t || u(e instanceof Error ? e.message : "failed to load");
		}).finally(() => {
			t || c(!1);
		}), () => {
			t = !0;
		};
	}, [
		_,
		e.projectId,
		e.pageId
	]), G(() => {
		function t(t) {
			let r = t.data;
			if (!r || r.type !== qe) return;
			let i = t.data;
			if (f(!1), !i.ok) {
				u(i.message ?? "passport connect cancelled");
				return;
			}
			if (i.project_id !== e.projectId || !i.project_token_id || !i.session_token || !i.expires_at) return;
			let a = {
				projectId: i.project_id,
				projectTokenId: i.project_token_id,
				nickname: i.nickname ?? "",
				sessionToken: i.session_token,
				expiresAt: new Date(i.expires_at).getTime()
			};
			Ae(a), n(a), u(null);
		}
		return window.addEventListener("message", t), () => window.removeEventListener("message", t);
	}, [e.projectId]);
	function v() {
		let t = new URL(e.passportAppOrigin + "/join");
		t.searchParams.set("project_id", e.projectId), t.searchParams.set("return_origin", window.location.origin);
		let n = window.open(t.toString(), "quipier-join", "width=480,height=760");
		if (n) {
			f(!0);
			let e = setInterval(() => {
				n.closed && (clearInterval(e), f(!1));
			}, 500);
		} else u("팝업 차단을 해제해주세요");
	}
	async function y(n) {
		if (!t) throw v(), new Y(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
		let { comment: r } = await _.createComment({
			project_id: e.projectId,
			page_id: e.pageId,
			content: n
		});
		i((e) => [r, ...e]), e.onComment?.(r);
	}
	async function b(n, r) {
		if (!t) throw v(), new Y(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
		let { comment: a } = await _.createComment({
			project_id: e.projectId,
			page_id: e.pageId,
			content: r,
			parent_id: n
		});
		i((e) => [...e, a]), e.onComment?.(a);
	}
	async function x(e, n) {
		if (!t) throw v(), new Y(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
		await _.updateComment(e, n), i((t) => t.map((t) => t.id === e ? {
			...t,
			content: n
		} : t));
	}
	async function S(r, i) {
		if (!t) {
			v();
			return;
		}
		try {
			await _.reportComment(r, i), window.alert("신고가 접수되었습니다. 검토 후 조치됩니다.");
		} catch (t) {
			t instanceof Y && t.status === 401 && (Z(e.projectId), n(null)), u(t instanceof Error ? t.message : "신고에 실패했습니다");
		}
	}
	async function C(r) {
		if (t) try {
			await _.deleteComment(r), i((e) => e.map((e) => e.id === r ? {
				...e,
				is_deleted: !0,
				content: ""
			} : e));
		} catch (t) {
			t instanceof Y && t.status === 401 && (Z(e.projectId), n(null)), u(t instanceof Error ? t.message : "failed to delete");
		}
	}
	async function w(r) {
		if (!t) {
			v();
			return;
		}
		let a = !1;
		i((e) => e.map((e) => e.id === r ? (a = e.liked_by_me, {
			...e,
			liked_by_me: !e.liked_by_me,
			likes_count: e.likes_count + (e.liked_by_me ? -1 : 1)
		}) : e));
		try {
			let e = a ? await _.unlikeComment(r) : await _.likeComment(r);
			i((t) => t.map((t) => t.id === r ? {
				...t,
				likes_count: e.likes_count,
				liked_by_me: e.liked_by_me
			} : t));
		} catch (t) {
			i((e) => e.map((e) => e.id === r ? {
				...e,
				liked_by_me: a,
				likes_count: e.likes_count + (a ? 1 : -1)
			} : e)), t instanceof Y && t.status === 401 && (Z(e.projectId), n(null)), u(t instanceof Error ? t.message : "failed to like");
		}
	}
	function T() {
		Z(e.projectId), n(null);
	}
	async function E() {
		if (a) try {
			let t = await _.listComments({
				project_id: e.projectId,
				page_id: e.pageId,
				cursor: a,
				limit: 50
			});
			i((e) => [...e, ...t.comments]), o(t.next_cursor);
		} catch (e) {
			u(e instanceof Error ? e.message : "failed to load more");
		}
	}
	let D = ge(() => Ye(r, p), [r, p]), O = r.filter((e) => !e.is_deleted).length, k = t ? {
		tokenId: t.projectTokenId,
		nickname: t.nickname
	} : null;
	return /* @__PURE__ */ Q("div", {
		class: "quipier-root",
		"data-quipier-theme": e.theme ?? "light",
		children: [
			/* @__PURE__ */ Q("div", {
				class: "quipier-header",
				children: [/* @__PURE__ */ Q("strong", {
					class: "quipier-count",
					children: [
						"댓글 ",
						O,
						"개"
					]
				}), /* @__PURE__ */ Q("div", {
					class: "quipier-sort",
					children: [/* @__PURE__ */ Q("button", {
						class: "quipier-sort-button",
						type: "button",
						onClick: () => g((e) => !e),
						"aria-haspopup": "menu",
						"aria-expanded": h,
						children: [/* @__PURE__ */ Q(Qe, {}), /* @__PURE__ */ Q("span", { children: "정렬 기준" })]
					}), h ? /* @__PURE__ */ Q("div", {
						class: "quipier-menu quipier-sort-menu",
						role: "menu",
						children: [/* @__PURE__ */ Q("button", {
							class: `quipier-menu-item${p === "top" ? " is-active" : ""}`,
							role: "menuitemradio",
							"aria-checked": p === "top",
							onClick: () => {
								m("top"), g(!1);
							},
							children: "인기순"
						}), /* @__PURE__ */ Q("button", {
							class: `quipier-menu-item${p === "newest" ? " is-active" : ""}`,
							role: "menuitemradio",
							"aria-checked": p === "newest",
							onClick: () => {
								m("newest"), g(!1);
							},
							children: "최신순"
						})]
					}) : null]
				})]
			}),
			/* @__PURE__ */ Q(Le, {
				session: k,
				onSubmit: y,
				onConnectRequest: () => {
					d || v();
				},
				onDisconnect: T,
				manageUrl: e.passportAppOrigin + "/me"
			}),
			l ? /* @__PURE__ */ Q("div", {
				class: "quipier-error",
				children: l
			}) : null,
			s ? /* @__PURE__ */ Q("div", {
				class: "quipier-empty",
				children: "Loading…"
			}) : D.length === 0 ? /* @__PURE__ */ Q("div", {
				class: "quipier-empty",
				children: "아직 댓글이 없어요. 가장 먼저 남겨보세요."
			}) : /* @__PURE__ */ Q("div", {
				class: "quipier-list",
				children: D.map((n) => /* @__PURE__ */ Q(He, {
					node: n,
					ownAuthorId: t?.projectTokenId ?? null,
					onToggleLike: w,
					onDelete: C,
					onEdit: x,
					onReply: b,
					onReport: S,
					canReply: !!t,
					dateFormat: e.dateFormat ?? "relative",
					maxDepth: e.maxDepth ?? 2
				}, n.comment.id))
			}),
			a ? /* @__PURE__ */ Q("button", {
				class: "quipier-loadmore",
				onClick: E,
				children: "더 보기"
			}) : null,
			/* @__PURE__ */ Q(Ze, {})
		]
	});
}
function Ye(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.id, {
		comment: t,
		children: []
	});
	function r(e) {
		let t = n.get(e), r = /* @__PURE__ */ new Set();
		for (; t && t.comment.parent_id && n.has(t.comment.parent_id) && !r.has(t.comment.id);) r.add(t.comment.id), t = n.get(t.comment.parent_id);
		return t ? t.comment.id : e;
	}
	let i = [];
	for (let t of e) {
		let e = n.get(t.id);
		if (!t.parent_id) {
			i.push(e);
			continue;
		}
		let a = r(t.id);
		a === t.id ? i.push(e) : n.get(a).children.push(e);
	}
	for (let e of n.values()) e.children.sort((e, t) => new Date(e.comment.created_at).getTime() - new Date(t.comment.created_at).getTime());
	return i.sort((e, n) => {
		if (t === "top") {
			let t = n.comment.likes_count - e.comment.likes_count;
			if (t !== 0) return t;
		}
		return new Date(n.comment.created_at).getTime() - new Date(e.comment.created_at).getTime();
	}), i;
}
function Xe() {
	return /* @__PURE__ */ Q("svg", {
		class: "quipier-badge-mark",
		viewBox: "0 0 24 24",
		width: "13",
		height: "13",
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ Q("rect", {
				x: "3.4",
				y: "3.4",
				width: "14.4",
				height: "14.4",
				rx: "5.4",
				stroke: "currentColor",
				"stroke-width": "2.4"
			}),
			/* @__PURE__ */ Q("circle", {
				cx: "10.6",
				cy: "10.6",
				r: "1.9",
				fill: "currentColor"
			}),
			/* @__PURE__ */ Q("path", {
				d: "M13.9 14.7 L18.7 19.5",
				stroke: "currentColor",
				"stroke-width": "2.4",
				"stroke-linecap": "round"
			})
		]
	});
}
function Ze() {
	return /* @__PURE__ */ Q("a", {
		class: "quipier-badge",
		href: "https://quipier.com",
		target: "_blank",
		rel: "noopener noreferrer",
		children: [/* @__PURE__ */ Q(Xe, {}), /* @__PURE__ */ Q("span", { children: "Quipier" })]
	});
}
function Qe() {
	return /* @__PURE__ */ Q("svg", {
		viewBox: "0 0 24 24",
		width: "16",
		height: "16",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": "2",
		"stroke-linecap": "round",
		"stroke-linejoin": "round",
		children: [
			/* @__PURE__ */ Q("line", {
				x1: "4",
				y1: "6",
				x2: "20",
				y2: "6"
			}),
			/* @__PURE__ */ Q("line", {
				x1: "4",
				y1: "12",
				x2: "14",
				y2: "12"
			}),
			/* @__PURE__ */ Q("line", {
				x1: "4",
				y1: "18",
				x2: "9",
				y2: "18"
			})
		]
	});
}
//#endregion
//#region src/styles.ts
var $e = "\n/* Palette — overridable per-container via CSS custom properties\n   (e.g. .my-comments { --quipier-accent: #e11; }). */\n.quipier-root {\n  --quipier-fg: #1a1a1a;\n  --quipier-muted: #6a6c6f;\n  --quipier-faint: #888888;\n  --quipier-surface: #ffffff;\n  --quipier-border: #d7d9dc;\n  --quipier-border-soft: #ececec;\n  --quipier-hover: #f0f1f2;\n  --quipier-accent: #1a1a1a;\n  --quipier-accent-fg: #ffffff;\n  --quipier-link: #2667e6;\n  --quipier-link-hover: #eaf2ff;\n  --quipier-like: #ff4500;\n  --quipier-like-hover: #ffe9e0;\n  --quipier-danger: #bb0000;\n  --quipier-danger-hover: #fdecec;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  color: var(--quipier-fg);\n  font-size: 14px;\n}\n\n.quipier-root[data-quipier-theme=\"dark\"] {\n  --quipier-fg: #ededed;\n  --quipier-muted: #a0a0a0;\n  --quipier-faint: #8a8a8a;\n  --quipier-surface: #1f1f1f;\n  --quipier-border: #3a3a3a;\n  --quipier-border-soft: #2c2c2c;\n  --quipier-hover: #2a2a2a;\n  --quipier-accent: #ededed;\n  --quipier-accent-fg: #141414;\n  --quipier-link: #5b9bff;\n  --quipier-link-hover: rgba(91, 155, 255, 0.16);\n  --quipier-like: #ff6a3d;\n  --quipier-like-hover: rgba(255, 106, 61, 0.18);\n  --quipier-danger: #ff8080;\n  --quipier-danger-hover: rgba(255, 128, 128, 0.16);\n}\n@media (prefers-color-scheme: dark) {\n  .quipier-root[data-quipier-theme=\"auto\"] {\n    --quipier-fg: #ededed;\n    --quipier-muted: #a0a0a0;\n    --quipier-faint: #8a8a8a;\n    --quipier-surface: #1f1f1f;\n    --quipier-border: #3a3a3a;\n    --quipier-border-soft: #2c2c2c;\n    --quipier-hover: #2a2a2a;\n    --quipier-accent: #ededed;\n    --quipier-accent-fg: #141414;\n    --quipier-link: #5b9bff;\n    --quipier-link-hover: rgba(91, 155, 255, 0.16);\n    --quipier-like: #ff6a3d;\n    --quipier-like-hover: rgba(255, 106, 61, 0.18);\n    --quipier-danger: #ff8080;\n    --quipier-danger-hover: rgba(255, 128, 128, 0.16);\n  }\n}\n\n/* ---------- header ---------- */\n.quipier-header { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }\n.quipier-count { font-size: 16px; font-weight: 700; color: var(--quipier-fg); }\n.quipier-sort { position: relative; }\n.quipier-sort-button { display: inline-flex; align-items: center; gap: 8px; padding: 6px 8px; background: transparent; border: none; color: inherit; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; }\n.quipier-sort-button:hover { background: var(--quipier-hover); }\n.quipier-sort-menu { top: calc(100% + 4px); left: 0; }\n\n/* ---------- composer ---------- */\n.quipier-composer { margin-bottom: 24px; }\n.quipier-composer-row { display: flex; gap: 12px; align-items: flex-start; }\n.quipier-composer-avatar { position: relative; flex-shrink: 0; }\n.quipier-avatar-button { padding: 0; border: none; background: transparent; cursor: pointer; border-radius: 50%; }\n.quipier-avatar-button:disabled { cursor: default; }\n.quipier-avatar-button:not(:disabled):hover { opacity: 0.85; }\n.quipier-composer-input { flex: 1; min-width: 0; border-bottom: 1px solid var(--quipier-border); transition: border-color 0.15s; }\n.quipier-composer-input.is-expanded { border-bottom-color: var(--quipier-fg); border-bottom-width: 2px; }\n.quipier-composer-textarea { width: 100%; padding: 6px 0; border: none; outline: none; resize: none; font: inherit; background: transparent; color: inherit; line-height: 1.5; overflow: hidden; box-sizing: border-box; }\n.quipier-composer-textarea::placeholder { color: var(--quipier-muted); }\n.quipier-composer-textarea:disabled { background: transparent; cursor: not-allowed; }\n.quipier-composer-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }\n\n/* ---------- buttons ---------- */\n.quipier-button { padding: 7px 16px; border: none; border-radius: 999px; background: var(--quipier-accent); color: var(--quipier-accent-fg); cursor: pointer; font: inherit; font-weight: 600; font-size: 13px; }\n.quipier-button:disabled { opacity: 0.4; cursor: not-allowed; }\n.quipier-button-ghost { background: transparent; color: var(--quipier-fg); border: none; padding: 7px 14px; border-radius: 999px; cursor: pointer; font: inherit; font-weight: 600; font-size: 13px; }\n.quipier-button-ghost:hover:not(:disabled) { background: var(--quipier-hover); }\n.quipier-button-ghost:disabled { opacity: 0.4; cursor: not-allowed; }\n.quipier-loadmore { padding: 6px 14px; border: 1px solid var(--quipier-border); background: var(--quipier-surface); color: inherit; border-radius: 999px; cursor: pointer; font: inherit; font-size: 13px; align-self: center; margin-top: 12px; }\n\n/* ---------- avatar ---------- */\n.quipier-avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: #fff; font-weight: 700; flex-shrink: 0; user-select: none; line-height: 1; }\n\n/* ---------- overlay menu (shared by identity + sort + row 3-dot) ---------- */\n.quipier-menu { position: absolute; min-width: 160px; background: var(--quipier-surface); border: 1px solid var(--quipier-border); border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.18); padding: 6px; z-index: 20; }\n.quipier-composer-avatar .quipier-menu { top: calc(100% + 6px); left: 0; }\n.quipier-menu-head { padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }\n.quipier-menu-nick { color: var(--quipier-fg); font-size: 14px; font-weight: 700; }\n.quipier-menu-token { color: var(--quipier-muted); font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }\n.quipier-menu-sep { height: 1px; background: var(--quipier-border-soft); margin: 4px 0; }\n.quipier-menu-item { display: flex; width: 100%; align-items: center; padding: 8px 10px; background: transparent; border: none; cursor: pointer; font: inherit; font-size: 14px; color: var(--quipier-fg); border-radius: 6px; text-align: left; }\n.quipier-menu-item:hover { background: var(--quipier-hover); }\n.quipier-menu-item.is-active { font-weight: 700; }\n.quipier-menu-item.is-danger { color: var(--quipier-danger); }\n.quipier-menu-item.is-danger:hover { background: var(--quipier-danger-hover); }\n\n/* ---------- comment list / thread ---------- */\n.quipier-list { display: flex; flex-direction: column; gap: 20px; }\n.quipier-empty { color: var(--quipier-faint); padding: 16px 0; text-align: center; font-size: 14px; }\n.quipier-error { color: var(--quipier-danger); font-size: 13px; padding: 6px 0; }\n.quipier-thread { display: flex; flex-direction: column; }\n/* Replies: indented so the \"ㄴ\" connector emerges from parent avatar's center column. */\n.quipier-thread-children { margin-top: 8px; margin-left: 16px; padding-left: 28px; display: flex; flex-direction: column; gap: 16px; position: relative; overflow: hidden; }\n.quipier-thread-children > * { position: relative; }\n.quipier-thread-children > *::before { content: \"\"; position: absolute; top: -9999px; height: calc(9999px + 12px); left: -28px; width: 16px; border-left: 1px solid var(--quipier-border); border-bottom: 1px solid var(--quipier-border); border-bottom-left-radius: 12px; pointer-events: none; }\n.quipier-thread-children > .quipier-thread-toggle::before,\n.quipier-thread-children > .quipier-thread-more::before { display: none; }\n\n/* toggle / load-more buttons */\n.quipier-thread-toggle, .quipier-thread-more { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 4px 10px; background: transparent; border: none; cursor: pointer; font: inherit; font-size: 13px; font-weight: 700; color: var(--quipier-link); border-radius: 999px; }\n.quipier-thread-toggle:hover, .quipier-thread-more:hover { background: var(--quipier-link-hover); }\n.quipier-thread-more { color: var(--quipier-muted); font-weight: 600; }\n.quipier-thread-more:hover { background: var(--quipier-hover); color: var(--quipier-fg); }\n\n/* ---------- comment item ---------- */\n.quipier-item { display: flex; gap: 10px; align-items: flex-start; position: relative; }\n.quipier-item-body { flex: 1; min-width: 0; }\n.quipier-item-head { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--quipier-muted); margin-bottom: 4px; }\n.quipier-item-author { font-weight: 700; color: var(--quipier-fg); font-size: 13px; }\n.quipier-item-dot { color: var(--quipier-faint); }\n.quipier-item-content { white-space: pre-wrap; word-break: break-word; line-height: 1.5; color: var(--quipier-fg); }\n.quipier-item-content.is-deleted { color: var(--quipier-faint); font-style: italic; }\n.quipier-item-content.is-hidden { color: var(--quipier-faint); font-style: italic; display: flex; align-items: center; gap: 8px; }\n.quipier-hidden-banner {\n  display: flex; align-items: center; justify-content: space-between; gap: 8px;\n  padding: 4px 8px; margin-bottom: 4px;\n  background: var(--quipier-hover);\n  border-left: 2px solid var(--quipier-faint);\n  border-radius: 4px;\n  font-size: 12px; color: var(--quipier-muted);\n}\n.quipier-hidden-toggle {\n  border: none; background: transparent;\n  font: inherit; font-size: 12px; font-weight: 600;\n  color: var(--quipier-link, #6366f1);\n  cursor: pointer; padding: 2px 6px; border-radius: 4px;\n}\n.quipier-hidden-toggle:hover { background: var(--quipier-hover); }\n.quipier-author-badge {\n  font-size: 10px; font-weight: 700;\n  padding: 1px 6px; border-radius: 999px;\n  line-height: 1.4;\n}\n.quipier-author-blocked {\n  background: rgba(220, 38, 38, 0.1);\n  color: rgb(220, 38, 38);\n}\n\n/* row 3-dot menu, pinned to the right of the header line */\n.quipier-rowmenu { margin-left: auto; position: relative; }\n.quipier-rowmenu-trigger { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; border: none; background: transparent; color: var(--quipier-muted); cursor: pointer; border-radius: 50%; }\n.quipier-rowmenu-trigger:hover { background: var(--quipier-hover); color: var(--quipier-fg); }\n.quipier-rowmenu-popover { top: calc(100% + 4px); right: 0; }\n\n/* actions row */\n.quipier-actions { display: flex; align-items: center; gap: 4px; margin-top: 6px; margin-left: -8px; }\n.quipier-action { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border: none; background: transparent; border-radius: 999px; color: var(--quipier-muted); cursor: pointer; font: inherit; font-size: 12px; font-weight: 600; }\n.quipier-action:hover { background: var(--quipier-hover); color: var(--quipier-fg); }\n.quipier-action.is-active { color: var(--quipier-like); }\n.quipier-action.is-active:hover { background: var(--quipier-like-hover); }\n.quipier-action svg { width: 14px; height: 14px; }\n\n/* ---------- reply / edit form (inside item) ---------- */\n.quipier-reply-form, .quipier-edit-form { margin-top: 8px; }\n\n/* ---------- powered-by badge (thin bottom strip) ---------- */\n.quipier-badge {\n  display: flex; align-items: center; justify-content: center; gap: 5px;\n  margin-top: 20px; padding-top: 12px;\n  border-top: 1px solid var(--quipier-border-soft);\n  font-size: 11px; font-weight: 600; letter-spacing: 0.01em;\n  color: var(--quipier-faint); text-decoration: none;\n  transition: color 0.15s;\n}\n.quipier-badge:hover { color: var(--quipier-muted); }\n.quipier-badge-mark { flex-shrink: 0; }\n.quipier-badge > span { line-height: 1; }\n", et = !1;
function tt() {
	if (et) return;
	et = !0;
	let e = document.createElement("style");
	e.setAttribute("data-quipier", ""), e.textContent = $e, document.head.appendChild(e);
}
//#endregion
//#region src/index.ts
var nt = "https://api.quipier.com", rt = "https://passport.quipier.com";
function it(e) {
	return typeof e == "string" ? document.querySelector(e) : e;
}
function at(e) {
	let t = it(e.container);
	if (!t) throw Error(`Quipier: container not found: ${String(e.container)}`);
	let n = e.apiKey ?? t.dataset.quipierApiKey, r = e.projectId ?? t.dataset.quipierProjectId;
	if (!n) throw Error("Quipier: apiKey is required (or data-quipier-api-key)");
	if (!r) throw Error("Quipier: projectId is required (or data-quipier-project-id)");
	let i = e.pageId ?? t.dataset.quipierPageId ?? window.location.pathname, a = e.apiBase ?? nt, o = e.passportAppOrigin ?? e.walletAppOrigin ?? t.dataset.quipierPassportApp ?? t.dataset.quipierWalletApp ?? rt, s = e.theme ?? t.dataset.quipierTheme ?? "light", c = e.dateFormat ?? "relative", l = e.maxDepth ?? 2, u = e.sort ?? "top";
	tt(), ae(null, t), ae(b(Je, {
		apiBase: a,
		apiKey: n,
		projectId: r,
		pageId: i,
		passportAppOrigin: o,
		onComment: e.onComment,
		theme: s,
		dateFormat: c,
		maxDepth: l,
		sort: u
	}), t);
}
function ot(e) {
	let t = it(e);
	t && ae(null, t);
}
//#endregion
export { at as n, ot as t };

//# sourceMappingURL=src-Dl5YGw9Y.js.map