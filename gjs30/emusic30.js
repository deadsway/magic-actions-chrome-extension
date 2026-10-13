/*
 * magic-actions YouTube Music and embedded-player content script.
 *
 * Loads local settings, applies player behavior, and manages the volume overlay
 * for YouTube Music and embedded YouTube players.
 */
(function () {
    var G, g, B;
    const m = window, n = m.document;
    var k = n.documentElement;
    const f = Function.prototype.call, ka = function () { }, t = Event, { runtime: { sendMessage: S, onMessage: T } } = chrome, la = T.addListener.bind(T), ma = n.createElement.bind(n), x = n.querySelector.bind(n), na = f.bind(k.appendChild);
    f.bind(k.insertBefore);
    f.bind(k.removeChild);
    const u = f.bind(k.addEventListener), y = f.bind(k.removeEventListener), oa = f.bind(Event.prototype.preventDefault), pa = f.bind(Event.prototype.stopPropagation), qa = f.bind(Event.prototype.stopImmediatePropagation ||
        ka), ra = f.bind(k.setAttribute), U = f.bind(CSSStyleDeclaration.prototype.setProperty);
    f.bind(k.getBoundingClientRect);
    f.bind(HTMLCanvasElement.prototype.getContext);
    f.bind(CanvasRenderingContext2D.prototype.getImageData);
    f.bind(CanvasRenderingContext2D.prototype.drawImage);
    const sa = JSON.parse, V = clearTimeout, H = setTimeout, W = parseInt, X = (k = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "style") || Object.getOwnPropertyDescriptor(Element.prototype, "style")) && k.get ? f.bind(k.get) : null, /* Applies an inline style, normally with !important. */ setElementStyle = function (b, c, d, v) { U && X ? U(X(b), c, d, v ? "important" : null) : b.style.setProperty(c, d, v ? "important" : null); }, /* Stops propagation and optionally prevents the browser default. */ consumeTrustedEvent = function (b, c) { c && oa(b); pa(b); qa(b); }, /* Manages volume input methods and the on-screen volume indicator. */ VolumeOverlayController = function () {
        var b, c, d = 50, v, J, K, l, C, D, E, L, M, r, z, F = 0, N, e, w, O, P;
        const Y = function () { b && setElementStyle(b, "display", "none", !0); r = z = F = 0; N = !0; }, Q = function (a, h, A, p) {
            w ? (d = W(100.3 * w.volume), d = 3 > a ? 0 > h ? d - K : d + K : d + W(h / 2), 100 < d ? d = 100 : 0 > d && (d = 0), w.muted && (w.muted = !1), w.volume = d / 100, 0 < l && (P && ra(P, "value", d), O.contains(b) || na(O, b), a = A || 90, p = p || 90, 1 == l ? (a -= 23, p -= 43) : 2 == l ? (a -= 118, p -= 10) : (a -= 45, p -= 65), 1 > a && (a =
                1), 1 > p && (p = 1), setElementStyle(b, "left", a + "px", !0), setElementStyle(b, "top", p + "px", !0), N && (b && setElementStyle(b, "display", "block", !0), N = !1), 1 == l ? (c.clearRect(0, 0, 90, 48), c.fillText(d, 0, 21)) : 2 == l ? (c.fillStyle = "rgb(0,0,0)", c.fillRect(0, 0, 236, 20), c.rect(0, 0, 236, 20), c.stroke(), c.fillStyle = J, c.fillRect(0, 0, 2 * d, 20), c.fillText(d, 218, 10)) : 3 == l && (c.clearRect(0, 0, 90, 90), c.beginPath(), c.arc(45, 45, 40, 2.0944, 2.0944 + .0523599 * d, !1), c.stroke(), c.fillText(d, 45, 43)), v && V(v), v = H(Y, 1E3))) : (w = x("video"), P = x("#expand-volume-slider"));
        }, R = function (a) {
            a = a.target;
            var h = 1;
            if (a) {
                do
                    if ("video" == a.localName || a == b || "player" == a.id || "webgl" == a.className || "ytp-miniplayer-ui" == a.className) {
                        var A = !0;
                        break;
                    }
                    else if (h++, 5 > h)
                        a = a.parentElement;
                    else
                        break;
                while (a);
            }
            return A;
        }, Z = function (a) { a && a instanceof t && a.isTrusted && R(a) && (M = a.targetTouches[0].pageX - m.scrollX); }, aa = function (a) { if (a && a instanceof t && a.isTrusted && R(a)) {
            a = a.targetTouches[0].pageX - m.scrollX;
            var h = a - M;
            if (-43 > h || 43 < h)
                Q(2, h, 100, 100), M = a;
        } }, ba = function (a) {
            a && a instanceof t && a.isTrusted && (3 == a.which || 2 == a.buttons) && 0 !=
                a.movementX && (L = !0, r || (r = a.pageX - m.scrollX, z = a.pageY - m.scrollY, F = a.pageX), Q(3, a.pageX - F, r, z), F = a.pageX, consumeTrustedEvent(a, !0));
        }, ca = function (a) { a && a instanceof t && a.isTrusted && L && (L = !1, consumeTrustedEvent(a, !0)); }, da = function (a) { a && a instanceof t && a.isTrusted && R(a) && (r || (r = a.pageX - m.scrollX, z = a.pageY - m.scrollY), Q(1, a.wheelDelta || -1 * a.deltaY, r, z), consumeTrustedEvent(a, !0)); }, ea = function (a, h, A) {
            e = n;
            O = x("body");
            a && e ? C || (u(e, "wheel", da, { passive: !1 }), C = !0) : C && e && (y(e, "wheel", da, { passive: !1 }), C = !1);
            h && e ? D || (u(e, "touchstart", Z, { passive: !1 }), u(e, "touchmove", aa, { passive: !1 }), D = !0) : D && e && (y(e, "touchmove", aa, { passive: !1 }), y(e, "touchstart", Z, { passive: !1 }), D = !1);
            A && e ? E || (u(e, "mousemove", ba, { passive: !1, capture: !0 }), u(e, "contextmenu", ca, { passive: !1, capture: !0 }), E = !0) : E && e && (y(e, "contextmenu", ca, { passive: !1, capture: !0 }), y(e, "mousemove", ba, { passive: !1, capture: !0 }), E = !1);
        };
        this.optionsChanged = function () {
            g.mwvc ? (l = g.mwvci, K = g.gap, J = g.color, b || (b = ma("canvas"), c = b.getContext("2d")), 1 == l ? (b.width = 90, b.height = 48, c.font = "48px Segoe UI, Helvetica, Arial, sans-serif",
                c.textAlign = "left") : 2 == l ? (b.width = 236, b.height = 20, c.font = "700 14px Segoe UI, Helvetica, Arial, sans-serif", c.textAlign = "center", c.lineWidth = 1, c.setLineDash([])) : (b.width = 90, b.height = 90, c.font = "600 30px Segoe UI, Helvetica, Arial, sans-serif", c.textAlign = "center", c.lineWidth = 7, c.setLineDash([5, 1])), c.textBaseline = "middle", c.strokeStyle = c.fillStyle = J, c.shadowColor = "#000", c.shadowBlur = 5, Y(), setElementStyle(b, "cursor", "pointer", !0), setElementStyle(b, "position", "fixed", !0), setElementStyle(b, "z-index", 2147483647, !0), ea(g.mwvcm, g.mwvct, g.mwvcr)) :
                ea();
        };
    }, /* Polling loop that advances an ad-playing video to its end. */ runAdSkipLoop = function () { if (x("div.ad-showing")) {
        var b = x("video");
        b && (b.currentTime = 1E6);
    } B = H(runAdSkipLoop, 3E3); }, /* Parses a settings snapshot and applies volume/ad behavior. */ applyMusicSettings = function (b) { if (b && "string" == typeof b) {
        try {
            g = sa(b);
        }
        catch (c) {
            g = { mwvc: !0, mwvci: 1, mwvcm: !0, color: "yellow", gap: 5, b0: !1, b1: !1 };
        }
        G || (G = new VolumeOverlayController);
        G.optionsChanged();
        B && V(B);
        g.b0 && g.b1 && (B = H(runAdSkipLoop, 1E3));
    } }, /* Handles pushed settings or asks the service worker for id=0 settings. */ handleSettingsMessage = function (b) { b && "string" == typeof b ? applyMusicSettings(b) : S('{"id":0}', applyMusicSettings); }, /* Registers messaging and obtains the initial settings snapshot. */ initializeMusicScript = function () { la(handleSettingsMessage); S('{"id":0}', handleSettingsMessage); };
    "interactive" == n.readyState || "complete" == n.readyState ? initializeMusicScript() : u(m, "DOMContentLoaded", function (b) {
        b && b instanceof t &&
            b.isTrusted && initializeMusicScript();
    }, !1);
})();
