/*
 * magic-actions service worker.
 *
 * Manages local settings, the options page, the YouTube integration,
 * and the repository link exposed through the extension context menu.
 */
try {
    let settings;
    const logInfo = function (a) { console.info(a); }, globalScope = self, queuedRuntimeMessages = [], n = logInfo.call, { navigator: X, Object: Na, Date: Y, parseInt: y, setTimeout: J, JSON: { stringify: P, parse: ia }, Math: { random: K, floor: Oa }, chrome: { runtime: ja, runtime: { setUninstallURL: Pa, onMessage: ka, onStartup: la, onInstalled: ma }, scripting: { executeScript: na }, tabs: { query: L, create: Q, update: R, move: Qa, sendMessage: oa, onRemoved: S }, windows: { getAll: Ra, create: pa, update: Sa, getLastFocused: Ta }, contextMenus: { removeAll: Ua, create: M, onClicked: qa }, storage: { local: C }, i18n: { getMessage: Va }, management: { getSelf: Wa } } } = globalScope, Xa = ka.addListener.bind(ka), Ya = la.addListener.bind(la), Za = ma.addListener.bind(ma), ra = S.addListener.bind(S), $a = S.removeListener.bind(S), ab = qa.addListener.bind(qa), bb = C.set.bind(C), cb = C.get.bind(C);
    C.clear.bind(C);
    const db = globalScope.fetch.bind(globalScope), D = n.bind(Number.prototype.toString), sa = n.bind("".charCodeAt), x = n.bind("".slice), ta = n.bind("".split), ua = n.bind("".indexOf), eb = n.bind("".match), va = n.bind("".startsWith);
    n.bind("".endsWith);
    const E = n.bind("".replace);
    n.bind("".trim);
    const wa = n.bind("".charAt), fb = n.bind("".toLowerCase), gb = n.bind(queuedRuntimeMessages.push), xa = n.bind(queuedRuntimeMessages.join);
    n.bind(queuedRuntimeMessages.indexOf);
    n.bind(queuedRuntimeMessages.map);
    n.bind(queuedRuntimeMessages.reduce);
    const hb = n.bind(queuedRuntimeMessages.includes);
    n.bind(Y.prototype.getDay);
    const ya = String.fromCharCode, T = Y.now, z = ja.getURL(""), U = T(), jb = /Win/.test(X.platform), broadcastSettingsToYouTubeTabs = async function () {
        try {
            let a = await L({ windowType: "normal", url: "*://*.youtube.com/*", status: "complete" });
            for (let b = 0, c = a.length; b < c; b++)
                await oa(a[b].id, P(settings));
        }
        catch (a) {
            logInfo(a);
        }
    }, resolveActionUrl = function (action) {
        // Navigation is restricted to the local settings page and the project repository.
        if (action === 200 || action === 300)
            return z + "eopt30.html";
        if (action === 101 || action === "https://github.com/deadsway/magic-actions-chrome-extension")
            return "https://github.com/deadsway/magic-actions-chrome-extension";
        return "";
    }, openCaptureHelperPage = async function () {
        // Snapshot capture is handled directly by the page content script.
    }, findNormalBrowserWindow = async function () {
        let a;
        try {
            let b = await Ta();
            if (b && "normal" == b.type)
                a = b;
            else {
                b = await Ra();
                for (let c = 0, d = b.length; c < d; c++)
                    if ("normal" == b[c].type) {
                        a = b[c];
                        break;
                    }
            }
        }
        catch (b) {
            logInfo(b);
        }
        return a;
    }, focusTab = async function (a) {
        try {
            await Sa(a.windowId, { focused: !0 }), await R(a.id, { active: !0 });
        }
        catch (b) {
            logInfo(b);
        }
        return a;
    }, openOrFocusTab = async function (a) {
        let b;
        try {
            let c = { url: a.q || a.u };
            a.t && (c.title = a.t);
            let d = await L(c);
            d && 0 < d.length ? (b = d[0], a.a && await focusTab(b)) : b = await Q({ url: a.u, active: a.a ? !0 :
                    !1 });
        }
        catch (c) {
            logInfo(c);
        }
        return b;
    }, openOrFocusTabWindows = async function (a) {
        let b;
        try {
            let c = { url: a.q || a.u };
            a.t && (c.title = a.t);
            let d = await L(c);
            if (d && 0 < d.length)
                b = d[0];
            else {
                let g = await findNormalBrowserWindow(), h = g ? g.id : null, p = await pa({ url: a.u, type: "normal", state: h ? "minimized" : "maximized" });
                d = await L({ windowId: p.id });
                b = d[0];
                h && (b = await Qa(b.id, { index: -1, windowId: h }));
            }
            a.a && await focusTab(b);
        }
        catch (c) {
            logInfo(c);
        }
        return b;
    }, openActionUrl = function (action, active) {
        const url = resolveActionUrl(action);
        if (!url)
            return;
        jb ? openOrFocusTabWindows({ u: url, a: active }) : openOrFocusTab({ u: url, a: active });
    }, handleContextMenuClick = function (info) {
        if (info && info.menuItemId == 9757)
            openActionUrl(101, !0);
    }, rebuildContextMenus = function () {
        Ua().then(() => {
            let reportError = () => {
                let error = ja.lastError;
                error && logInfo(error);
            };
            M({ id: "9757", title: "New Version", contexts: ["action"] }, reportError);
        });
    }, generateUuid = function () {
        let a = D(4294967296 * K() >>> 0, 16), b = D((4294967296 * K() & 4294922239 | 16384) >>> 0, 16), c = D((4294967296 * K() & 3221225471 | 2147483648) >>> 0, 16), d = D(4294967296 * K() >>> 0, 16);
        8 > a.length && (a = x("0000000" + a, -8));
        8 > b.length && (b = x("0000000" + b, -8));
        8 > c.length && (c = x("0000000" + c, -8));
        8 > d.length && (d = x("0000000" + d, -8));
        return xa([a, x(b, 0, 4), x(b, 4), x(c, 0, 4), x(c, 4) + d], "-");
    }, /* Builds the canonical first-run/default settings object. */ createDefaultSettings = function () {
        return { ver: "", extURL: "", ai: 0, au: 0, uf: 0, bn: "", mc: 0, md: 0, mt: 0, ms: 0, ma: 0, ml: 1, uid: "", mwvc: !0, color: "white", mwvcm: !0, mwvcs: !1, mwvct: !1, mwvcr: !1, mwvci: 1, gap: 5, hq: !0, hqi: "large", pause: !1, plist: !1, buf: !1, buf1: !1, loop: !1, anns: !0, cin: !0, cina: !1, cine: !1, cini: 2, cinf: !1, cinc: 0, cint: 1, cinl: !1, h0: !1, h1: !1, h2: !1, h3: !1, h4: !1, h5: !1, h6: !1, h7: !1, h8: !1, h9: !1, h10: !1, h11: !1, h12: !1, h13: !1, h14: !1, a0: !0, a2: !1, a3: !0, a4: !0, a5: !1, a6: !1, a8: !1, a9: !1, ui: 0,
            c0: !1, c1: !1, c2: !1, c3: !1, c4: !1, f0: !0, b0: !0, b1: !0, b2: !0, b3: !1, mrl: !0, ps: !1, psi: 100, wd: "" };
    }, encodeSettingsString = function (a) {
        let b = "", c = [3, 0, 0, -3], d;
        for (let g = 0, h = a.length; g < h; g++)
            d = c[g % 4], b = g + d < h ? b + D(sa(a, g + d), 16) : b + D(sa(a, g), 16);
        return b;
    }, decodeSettingsString = function (a) {
        a = eb(a, /.{1,2}/g);
        let b = [3, 0, 0, -3], c, d = "";
        for (let g = 0, h = a.length; g < h; g++)
            c = b[g % 4], d = g + c < h ? d + ya(y(a[g + c], 16)) : d + ya(y(a[g], 16));
        return d;
    }, serializeSettings = function (a) { return encodeSettingsString(P(a)); }, deserializeSettings = function (a) {
        let b;
        try {
            "{" != wa(a, 0) && (a = decodeSettingsString(a)), b = ia(a);
        }
        catch (c) {
            b = void 0;
        }
        return b.constructor ===
            Na ? b : void 0;
    }, normalizeSettings = function (a) {
        const b = createDefaultSettings();
        for (let c in a)
            c in b ? typeof a[c] !== typeof b[c] && (a[c] = b[c]) : delete a[c];
        for (let c in b)
            c in a || (a[c] = b[c]);
        return a;
    }, persistSettings = async function () {
        let a;
        try {
            if (settings) {
                settings.ver = "7.9.5.6";
                let b = serializeSettings(settings);
                await bb({ pfs: b });
            }
        }
        catch (b) {
            logInfo(b), a = b;
        }
        return a;
    }, applySettingsPatch = async function (a, b) {
        for (var c of "ver extURL".split(" "))
            delete a[c];
        c = createDefaultSettings();
        for (let d in a)
            d in c && typeof a[d] == typeof c[d] && (settings[d] = a[d]);
        b && rebuildContextMenus();
        broadcastSettingsToYouTubeTabs();
        persistSettings();
    }, createInitialSettings = function () {
        let a = createDefaultSettings();
        a.ver =
            "7.9.5.6";
        a.ai = U;
        a.uid = generateUuid();
        return a;
    }, /* Installs the page-context bridge used to invoke YouTube player APIs. */ installMainWorldYouTubeHooks = function (a, b) {
        let c = self.ytplayer || {}, d, g, h, p, l, w;
        const r = self, t = r.document, u = t.documentElement;
        var m = Function.prototype.call;
        const G = m.bind(r.addEventListener), Db = t.createElement.bind(t), H = t.querySelector.bind(t);
        m.bind(u.querySelector);
        const Eb = m.bind(u.appendChild);
        m.bind(u.getAttribute);
        const Ga = m.bind(u.setAttribute), Fb = m.bind(u.removeAttribute);
        m.bind(t.dispatchEvent);
        const Gb = m.bind(Event.prototype.stopPropagation);
        m.bind(u.remove);
        const W = Function.prototype.apply.bind(HTMLMediaElement.prototype.play), Ha = m.bind(String.prototype.indexOf), Hb = JSON.parse, Ia = m.bind(DOMTokenList.prototype.contains), Ib = m.bind(DOMTokenList.prototype.add), ca = m.bind(Object.getOwnPropertyDescriptor(Element.prototype, "classList").get), Jb = m.bind(Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set), N = m.bind(Object.getOwnPropertyDescriptor(Node.prototype, "parentElement").get), Ja = function (f) {
            let k = H("#player-container video") || H("#player video") || H("#movie_player video") || H('video [src^="b"]');
            return k ? f ? N(N(k)) :
                k : null;
        };
        var da = function (f, k) { "dark" == f && b.a0 && b.a4 ? b.a4 = !0 : Fb(u, f); };
        const Kb = function (f, k) { "dark" == f && b.a0 && b.a4 ? b.a4 = !0 : Ga(u, f, k || ""); };
        m = function (f) {
            var k = Hb(f.detail);
            f = k.f;
            k = k.a;
            if ("opt" == f)
                b.a0 = k.a0, b.a4 = k.a4, b.b0 = k.b0, b.b1 = k.b1, b.b2 = k.b2, b.pause = k.pause, b.plist = k.plist;
            else if ("vol" == f)
                l = l || Ja(!0), l.isMuted() && l.unMute(), f = l.getVolume(), f += k, 0 > f ? f = 0 : 100 < f && (f = 100), l.setVolume(f, 1), (w = w || H("canvas.__vol")) && Ga(w, "data-vol", f);
            else if ((l = l || Ja(!0)) && f in l)
                l[f](k);
        };
        const ea = function () {
            let f = 0 <
                Ha(r.location.search, "list=") ? !0 : !1;
            g = b.pause ? f ? b.plist ? 1 : 0 : 0 : 1;
        }, Lb = function (f) { f instanceof Event && f.isTrusted && (g = 1); }, Ka = function (f) { f && Ia(ca(f), "ad-showing") && (p && (clearTimeout(p), p = 0), f.cancelPlayback && (f.skipped_by_user = !0, f.cancelPlayback(), g && f.playVideo())); }, Mb = function (f) { f instanceof Event && f.isTrusted && (Ka(N(this)), Gb(f)); }, Nb = function () {
            let f = N(N(this));
            if (f) {
                if (f.skipped_by_user)
                    return delete f.skipped_by_user, h && f.unMute(), W(this, arguments);
                if (Ia(ca(f), "ad-showing")) {
                    if (b.b0) {
                        b.b2 && 0 ==
                            f.isMuted() && (h = !0, f.mute());
                        if (b.b1) {
                            let k = H(".__magic-skip");
                            k || (k = Db("button"), Jb(k, "Magic Skip"), Ib(ca(k), "__magic-skip"), Eb(f, k), G(k, "click", Mb, !0));
                        }
                        b.b3 && (p || (p = setTimeout(Ka, 6E4, f)));
                    }
                    return W(this, arguments);
                }
                h && f.unMute();
                if (g)
                    return W(this, arguments);
                if ("pauseVideo" in f)
                    return f.pauseVideo(), this.currentTime = .1, Promise.resolve();
            }
            return W(this, arguments);
        };
        if (r) {
            try {
                Object.defineProperty(r, "ytplayer", { get: function () {
                        if (c && c.config && c.config.args && !d) {
                            d = !0;
                            let f = c.config.args;
                            b.hq && (f.suggestedQuality =
                                f.vq = b.hqi);
                            b.anns && (f.iv_load_policy = 3);
                        }
                        return c;
                    }, set: function (f) { c = f; }, configurable: !1, enumerable: !0 });
            }
            catch (f) { }
            try {
                Object.defineProperty(HTMLMediaElement.prototype, "play", { configurable: !1, writable: !1, value: Nb });
            }
            catch (f) { }
            u.removeAttribute = da;
            u.setAttribute = Kb;
            da = 0 < Ha(r.location.search, "list=") ? !0 : !1;
            g = b.pause ? da ? b.plist ? 1 : 0 : 0 : 1;
            G(r, "popstate", ea, !1);
            G(t, "yt-navigate", ea, !1);
            G(t, "spfrequest", ea, !1);
            G(t, "click", Lb, !0);
            G(t, "t" + a, m, !0);
        }
    }, getLocalizedMessage = function (a) { return Va(a) || ""; }, runFirstInstallFlow = function () {
        // Installation does not open any external page.
    }, runUpgradeFlow = function () {
        settings && persistSettings();
    }, /* Central runtime message router; protocol IDs are listed in README.md. */ handleRuntimeMessage = function (a, b, c) {
        if ("number" == typeof a)
            -1 < (b?.tab?.index ??
                -1) && (b = b?.tab?.id ?? -1, -1 < b && (na({ target: { tabId: b }, func: installMainWorldYouTubeHooks, args: [a, settings], injectImmediately: !0, world: "MAIN" }), na({ target: { tabId: b }, func: (d, g) => { document[d] = g; }, args: [a, settings], injectImmediately: !0 }))), c();
        else {
            try {
                a = ia(a);
            }
            catch (d) {
                a = { id: 404 };
            }
            0 == a.id ? c(P(settings)) :
                2 == a.id ? (openActionUrl(a.u, a.a), c()) :
                3 == a.id ? (applySettingsPatch(a.opt, !1), c()) :
                4 == a.id ? (b = {}, b[a.name] = a.value, applySettingsPatch(b, a.ctx || !1), c()) :
                5 == a.id ? c({ value: settings[a.name] }) :
                c();
        }
    };
    Xa((a, b, c) => { settings ? handleRuntimeMessage(a, b, c) : gb(queuedRuntimeMessages, [a, b, c]); return !0; });
    Ya(() => { });
    Za(a => { const b = "object" == typeof a && a.reason || ""; "install" === b ? runFirstInstallFlow() : "update" === b && "7.9.5.6" !== a.previousVersion && runUpgradeFlow(a.previousVersion || "7.9.5.3"); });
    (async function () {
        let a;
        try {
            let { pfs: b } = await cb(["pfs"]);
            if ("string" == typeof b) {
                let c = deserializeSettings(b);
                "object" == typeof c && (a = normalizeSettings(c));
            }
            a && (a.extURL =
                z);
        }
        catch (b) {
            logInfo(b);
        }
        return a || createInitialSettings();
    })().then(a => {
        settings = a;
        for (let b = 0, c = queuedRuntimeMessages.length; b < c; b++)
            handleRuntimeMessage.apply(globalScope, queuedRuntimeMessages[b]);
        rebuildContextMenus();
        ab(handleContextMenuClick);
    });
}
catch (error) {
    console.info(error);
}
;
