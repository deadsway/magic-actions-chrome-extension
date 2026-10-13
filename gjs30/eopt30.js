/*
 * magic-actions settings interface.
 *
 * Renders the complete local configuration UI and exchanges settings with
 * the service worker through runtime messages.
 */
(function () {
    var p, a;
    const M = function (e) { console.info(e); };
    var /* Requests runtime message id=0 and starts UI rendering. */ initializeOptions = function () { };
    const F = window, C = F.document, D = C.documentElement, r = M.call, { Event: E, JSON: { stringify: N, parse: O }, URL: { revokeObjectURL: V, createObjectURL: W }, Object: { defineProperty: X }, setTimeout: Y, parseInt: K, chrome: { runtime: { sendMessage: Z }, i18n: { getMessage: aa } } } = F, h = C.createElement.bind(C);
    (C.createTextNode || initializeOptions).bind(C);
    const ba = C.querySelector.bind(C), B = r.bind(DocumentFragment.prototype.querySelector), v = r.bind(D.setAttribute), ca = r.bind(D.attachShadow), k = r.bind(D.appendChild), P = r.bind(D.removeChild);
    r.bind(Event.prototype.stopPropagation);
    const x = r.bind(D.addEventListener);
    r.bind(D.dispatchEvent);
    r.bind(Array.prototype.push);
    r.bind(Array.prototype.join);
    r.bind("".slice);
    r.bind("".charCodeAt);
    const da = r.bind("".charAt), ea = r.bind("".indexOf), Q = r.bind(D.click), w = r.bind(Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set), sendBackgroundMessage = async function (e) { let b; try {
        b = await Z(N(e));
    }
    catch (c) {
        M(c), 0 < ea(c, "context") && window.location.reload();
    } return b; }, 
    /* Returns a localized string through chrome.i18n. */
    getMessage = function (e) { return aa(e) || ""; }, /* Sends runtime message id=4 for a single changed option. */ updateSingleSetting = function (e, b, c) { sendBackgroundMessage({ id: 4, name: e, value: b, ctx: c }); }, /* Updates the selected volume overlay color. */ selectVolumeColor = function (e) { e instanceof E && e.isTrusted && (B(p, "#" + a.color).className = "", a.color = this.id, this.className = "sel", updateSingleSetting("color", a.color, null)); }, /* Changes the selected volume indicator style. */ selectVolumeIndicator = function (e) { e instanceof E && e.isTrusted && (B(p, "#vc" + a.mwvci).checked = !1, a.mwvci = K(da(this.id || "  1", 2), 10), this.checked = !0, updateSingleSetting("mwvci", a.mwvci, null)); }, /* Changes the cinema-mode layout preset. */ selectCinemaMode = function (e) {
        e instanceof E && e.isTrusted && (B(p, "#ca" + a.cini).checked = !1, a.cini = K(this.id.charAt(2), 10), this.checked = !0, updateSingleSetting("cini", a.cini, null));
    }, /* Changes the preferred YouTube quality. */ selectPreferredQuality = function (e) { e instanceof E && e.isTrusted && (B(p, "#" + a.hqi).checked = !1, a.hqi = this.id, this.checked = !0, updateSingleSetting("hqi", a.hqi, null)); }, /* Generic checkbox handler, including dependent-option enabling/disabling. */ toggleBooleanOption = function (e) {
        if (e instanceof E && e.isTrusted) {
            var b = this.id;
            e = this.checked;
            a[b] = e ? !0 : !1;
            e && "cine" == b ? (B(p, "#cina").checked = a.cina = !1, sendBackgroundMessage({ id: 3, opt: { cina: !1, cine: !0 } })) : e && "cina" == b ? (B(p, "#cine").checked = a.cine = !1, sendBackgroundMessage({ id: 3, opt: { cine: !1, cina: !0 } })) : updateSingleSetting(b, e ? !0 : !1, "a0" == b || "a3" == b ? !0 : !1);
            b = this.parentElement;
            if ("opt" == b.className)
                for (b = b.nextElementSibling; b && ("sub" == b.className ||
                    "sub multi" == b.className);)
                    v(b, "disabled", !e), b = b.nextElementSibling;
        }
    }, /* Generic range/slider handler. */ updateRangeOption = function (e) { if (e instanceof E && e.isTrusted) {
        e = this.id;
        var b = this.value;
        w(this.nextElementSibling, "psi" === e ? b / 100 : b);
        b = K(b, 10);
        a[e] = b;
        updateSingleSetting(e, b, null);
    } }, /* DOM helper for one radio option. */ appendRadioOption = function (e, b, c, f, l) { var m = h("label"), n = h("input"); n.type = "radio"; n.id = b; f && (n.checked = !0); k(e, n); w(m, c); v(m, "for", b); k(e, m); x(n, "click", l, !1); }, /* DOM helper for one checkbox option. */ appendCheckboxOption = function (e, b, c, f, l, m, n, z) {
        var t = h("li"), A = h("label"), u = h("input");
        f && (t.title =
            f);
        w(A, c);
        v(A, "for", b);
        u.type = "checkbox";
        u.id = b;
        u.checked = l;
        k(t, u);
        k(t, A);
        m ? (t.className = "sub", v(t, "disabled", n)) : t.className = "opt";
        // Option descriptions and built-in tooltips are kept local to the extension.
        k(e, t);
        x(u, "click", toggleBooleanOption, !0);
    }, /* DOM helper for a row/group of checkboxes. */ appendMultiCheckboxGroup = function (e, b, c) {
        for (var f = h("li"), l, m, n = 0, z = b.length; n < z; n += 3)
            l = h("label"), m = h("input"), w(l, b[n + 1]), v(l, "for", b[n]), m.type = "checkbox", m.id = b[n], m.checked = b[n + 2], k(f, m), k(f, l), x(m, "click", toggleBooleanOption, !1);
        f.className = "sub multi";
        v(f, "disabled", c);
        k(e, f);
    }, /* DOM helper for one range slider. */ appendRangeOption = function (e, b, c, f, l, m, n, z) { var t = h("li"), A = h("label"), u = h("input"); w(A, c); v(A, "for", b); u.type = "range"; u.min = l; u.max = m; u.step = n; u.value = f; u.id = b; u.title = "Range: " + l + "-" + m; k(t, A); k(t, u); A = h("span"); w(A, "psi" === b ? f / 100 : f); k(t, A); t.className = "sub"; v(t, "disabled", z); k(e, t); x(u, "change", updateRangeOption, !0); }, /* Downloads the current settings as a JSON file. */ exportOptions = function () { var e = N(a); e = new Blob([e], { type: "application/json;charset=UTF-8" }); downloadBlob(e, "magic-actions-options.json"); }, /* Reads settings JSON, preserves the current version, and applies imported values. */ importOptions = function () {
        chooseOptionsFile(1E5, function (e) { try {
            var b = O(e);
        }
        catch (f) {
            b = null;
        } if (b) {
            e = a.ver;
            for (var c in b)
                void 0 != a[c] && (a[c] = b[c]);
            a.ver = e;
            for (sendBackgroundMessage({ id: 3, opt: a }); p.firstElementChild;)
                P(p, p.firstElementChild);
        } renderOptions(); });
    }, /* Creates a temporary hidden file input and reads one selected JSON file. */ chooseOptionsFile = function (e, b) { var c = B(p, "#openAs"); c && P(p, c); c = h("input"); c.id = "openAs"; c.style.display = "none"; c.type = "file"; k(p, c); x(c, "change", function (f) { if ((f = f.target.files) && 1 == f.length && f[0].size < e) {
        var l = new FileReader;
        l.onload = function (m) { b(m.target.result); };
        l.readAsText(f[0]);
    } }, !1); Q(c); }, /* Downloads a Blob through a temporary object URL. */ downloadBlob = function (e, b) {
        var c = h("a");
        c.href =
            W(e);
        v(c, "download", b);
        Q(c);
        Y(function () { V(c.href); }, 2E3);
    }, /* Builds the complete options UI from the current settings object. */ renderOptions = function () {
        p || (p = ca(ba("body"), { mode: "closed" }));
        const e = function () {
            var b = h("ul");
            b.className = "page";

            // Local options header. It is intentionally built from plain DOM nodes so the
            // settings page remains self-contained and does not require remote assets.
            var header = h("li");
            header.className = "options-header";
            var brand = h("div");
            brand.className = "options-brand";
            var brandMark = h("span");
            brandMark.className = "options-brand-mark";
            w(brandMark, "✦");
            k(brand, brandMark);
            var brandText = h("div");
            brandText.className = "options-brand-text";
            var title = h("strong");
            w(title, "magic-actions");
            k(brandText, title);
            var subtitle = h("span");
            w(subtitle, "Local player preferences");
            k(brandText, subtitle);
            k(brand, brandText);
            k(header, brand);
            var badge = h("span");
            badge.className = "options-badge";
            w(badge, "LOCAL");
            k(header, badge);
            k(b, header);

            appendCheckboxOption(b, "mwvc", getMessage("o8"), null, a.mwvc, null, null, { id: 2, u: 305, a: !0 });
            appendCheckboxOption(b, "mwvcm", getMessage("o82"), null, a.mwvcm, 1, !a.mwvc, null);
            appendCheckboxOption(b, "mwvcs", getMessage("o80"), null, a.mwvcs, 1, !a.mwvc, null);
            appendCheckboxOption(b, "mwvct", getMessage("o83"), null, a.mwvct, 1, !a.mwvc, null);
            appendCheckboxOption(b, "mwvcr", getMessage("o41"), null, a.mwvcr, 1, !a.mwvc, null);
            var c = "red LightPink orange lime GreenYellow yellow gold DodgerBlue aqua magenta DeepPink white".split(" "), f = h("li");
            var l = h("label");
            f.className = "sub";
            v(f, "disabled", !a.mwvc);
            f.id = "color";
            w(l, getMessage("o9"));
            k(f, l);
            for (var m = 0, n = c.length; m < n; m++) {
                var z = c[m];
                l = h("button");
                l.id = z;
                l.style.backgroundColor = z;
                a.color == z && (l.className = "sel");
                k(f, l);
                x(l, "click", selectVolumeColor, !1);
            }
            k(b, f);
            c = h("li");
            f = h("label");
            c.id = "mwvci";
            c.className = "sub";
            v(c, "disabled", !a.mwvc);
            w(f, getMessage("o23"));
            k(c, f);
            appendRadioOption(c, "vc0", getMessage("o85"), 0 == a.mwvci, selectVolumeIndicator);
            appendRadioOption(c, "vc1", getMessage("o24"), 1 == a.mwvci, selectVolumeIndicator);
            appendRadioOption(c, "vc2", getMessage("o25"), 2 == a.mwvci, selectVolumeIndicator);
            appendRadioOption(c, "vc3", getMessage("o26"), 3 == a.mwvci, selectVolumeIndicator);
            k(b, c);
            appendRangeOption(b, "gap", getMessage("o27"), a.gap, 1, 25, 1, !a.mwvc);
            appendCheckboxOption(b, "hq", getMessage("o90"), null, a.hq, null, null, { id: 2, u: 306, a: !0 });
            c = h("li");
            c.id = "hqi";
            c.className = "sub";
            v(c, "disabled", !a.hq);
            appendRadioOption(c, "highres", getMessage("o91"), "highres" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "hd2880", getMessage("o92"), "hd2880" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "hd2160", getMessage("o93"), "hd2160" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "hd1440", getMessage("o94"), "hd1440" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "hd1080", getMessage("o95"), "hd1080" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "hd720", getMessage("o96"), "hd720" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "large", getMessage("o97"), "large" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "medium", getMessage("o98"), "medium" == a.hqi, selectPreferredQuality);
            appendRadioOption(c, "small", getMessage("o99"), "small" ==
                a.hqi, selectPreferredQuality);
            appendRadioOption(c, "tiny", getMessage("o100"), "tiny" == a.hqi, selectPreferredQuality);
            k(b, c);
            appendCheckboxOption(b, "b0", getMessage("b0"), null, a.b0, null, null, { id: 2, u: 322, a: !0 });
            appendCheckboxOption(b, "b1", getMessage("b1"), null, a.b1, 1, !a.b0, null);
            appendCheckboxOption(b, "b2", getMessage("b2"), null, a.b2, 1, !a.b0, null);
            appendCheckboxOption(b, "b3", getMessage("b3"), null, a.b2, 1, !a.b0, null);
            appendCheckboxOption(b, "ps", getMessage("o72"), "Hotkeys to adjust playback speed: [SHIFT]+[,] or [SHIFT]+[.]", a.ps, null, null, null);
            appendRangeOption(b, "psi", getMessage("o73"), a.psi, 25, 200, 5, !a.ps);
            appendCheckboxOption(b, "mrl", getMessage("o44"), "Right-click on the timeline (seek/progress bar) to mark up one or several pieces of video and then play them in an endless loop. Right-click on a loop to remove it from the timeline.", a.mrl, null, null, { id: 2, u: 321, a: !0 });
            appendCheckboxOption(b, "cin", getMessage("o29"), null, a.cin, null, null, { id: 2, u: 302, a: !0 });
            c = h("li");
            f = h("label");
            c.id = "cini";
            c.className = "sub";
            v(c, "disabled", !a.cin);
            w(f, getMessage("o32"));
            k(c, f);
            appendRadioOption(c, "ca0", getMessage("o33"), 0 == a.cini, selectCinemaMode);
            appendRadioOption(c, "ca1", getMessage("o34"), 1 == a.cini, selectCinemaMode);
            appendRadioOption(c, "ca2", getMessage("o35"), 2 == a.cini, selectCinemaMode);
            k(b, c);
            appendCheckboxOption(b, "cina", getMessage("o30"), null, a.cina, 1, !a.cin, null);
            appendCheckboxOption(b, "cine", getMessage("o36"), null, a.cine, 1, !a.cin, null);
            appendCheckboxOption(b, "cinf", getMessage("o31"), null, a.cinf, 1, !a.cin, null);
            appendCheckboxOption(b, "cinl", getMessage("o65"), null, a.cinl, 1, !a.cin, null);
            appendCheckboxOption(b, "pause", getMessage("o17"), null, a.pause, 0, 0, { id: 2, u: 320, a: !0 });
            appendCheckboxOption(b, "plist", getMessage("o19"), null, a.plist, 1, !a.pause, null);
            appendCheckboxOption(b, "buf", getMessage("o18"), null, a.buf, null, null, null);
            appendCheckboxOption(b, "buf1", getMessage("o63"), null, a.buf1, 1, !a.buf, null);
            appendCheckboxOption(b, "loop", getMessage("o40"), null, a.loop, null, null, { id: 2, u: 321, a: !0 });
            appendCheckboxOption(b, "c0", getMessage("o70"), null, a.c0, 0, 0, { id: 2, u: 307, a: !0 });
            appendMultiCheckboxGroup(b, ["c1", getMessage("o71"), a.c1, "c4", getMessage("o86"), a.c4], !a.c0);
            appendCheckboxOption(b, "anns", getMessage("o42"), null, a.anns, null, null, null);
            appendCheckboxOption(b, "h0", getMessage("o50"), null, a.h0, null, null, null);
            appendMultiCheckboxGroup(b, ["h14", "Shorts", a.h14, "h2", getMessage("o52"), a.h2, "h13", getMessage("c8"), a.h13, "h9",
                getMessage("o66"), a.h9, "h12", getMessage("o43"), a.h12, "h10", getMessage("o67"), a.h10, "h8", getMessage("o57"), a.h8, "h11", getMessage("o68"), a.h11, "h7", getMessage("o56"), a.h7, "h5", getMessage("o55"), a.h5, "h1", getMessage("o51"), a.h1, "h6", getMessage("o64"), a.h6, "h4", getMessage("o54"), a.h4, "h3", getMessage("o53"), a.h3], !a.h0);
            appendCheckboxOption(b, "a0", getMessage("o60"), null, a.a0, 0, 0, { id: 2, u: 304, a: !0 });
            appendCheckboxOption(b, "a4", getMessage("o81"), null, a.a4, 1, !a.a0, null);
            appendCheckboxOption(b, "a6", getMessage("a6"), null, a.a6, 1, !a.a0, null);
            appendCheckboxOption(b, "a2", getMessage("o62"), null, a.a2, 1, !a.a0, null);
            appendCheckboxOption(b, "a3", getMessage("o84"), null, a.a3, 1, !a.a0, null);
            appendCheckboxOption(b, "a8", getMessage("a8"), null, a.a8, 1, !a.a0, null);
            appendCheckboxOption(b, "a9", getMessage("a9"), null, a.a9, 1, !a.a0, null);
            c = h("li");
            f = h("a");
            c.className = "opt";
            w(f, "Export Options …");
            f.className = "bttn";
            x(f, "click", exportOptions, !1);
            k(c, f);
            f = h("a");
            w(f, "Import Options …");
            f.className = "bttn";
            x(f, "click", importOptions, !1);
            k(c, f);

            // Opens the project repository in a browser tab.
            f = h("a");
            w(f, "New Version");
            f.className = "bttn";
            f.title = "Open the maintained GitHub repository";
            x(f, "click", function (event) {
                if (event instanceof E && event.isTrusted) {
                    sendBackgroundMessage({
                        id: 2,
                        u: "https://github.com/deadsway/magic-actions-chrome-extension",
                        a: !0
                    });
                }
            }, !1);
            k(c, f);
            k(b, c);
            k(p, b);
            b = h("sup");
            w(b, getMessage("m4"));
            b.style.color = "red";
            b.style.verticalAlign = "top";
            k(B(p, "#ps").nextElementSibling, b);
        };
        (function () { var b = h("link"); b.rel = "stylesheet"; b.type = "text/css"; b.href = "gcss30/eopt30.css"; x(b, "load", e, !1); k(p, b); })();
    };
    initializeOptions = function () {
        sendBackgroundMessage({ id: 0 }).then(e => { if ("string" == typeof e) {
            try {
                a = O(e);
            }
            catch (b) {
                a = null;
            }
            a && renderOptions();
        } });
    };
    // The same local settings page is used for the toolbar popup and the Chrome options page.
    x(F, "DOMContentLoaded", initializeOptions, !0);
})();
