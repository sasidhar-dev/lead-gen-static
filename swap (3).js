setTimeout(function(){
!function() {
    "use strict";
    var Wrappers = function() {
        function e() {}
        return e.documentReferrer = function() {
            return document.referrer
        }
        ,
        e.documentURL = function() {
            return document.URL
        }
        ,
        e.documentCookie = function(e) {
            return e ? document.cookie = e : document.cookie
        }
        ,
        e.isDebug = function() {
            return Debug._isDebug || !1
        }
        ,
        e.windowLocation = function() {
            return window.location
        }
        ,
        e
    }()
      , Debug = function() {
        function e() {}
        return e._debugEnabled = function() {
            return !!Wrappers.windowLocation().href.match(/crl?dbg/)
        }
        ,
        e.doneSwaps = {},
        e.foundTargets = [],
        e
    }()
      , Polyfills = function() {
        function r() {}
        return r.jsonify = function(e) {
            var t = Array.prototype.toJSON;
            if (!t)
                return JSON.stringify(e);
            delete Array.prototype.toJSON;
            var r = JSON.stringify(e);
            return Array.prototype.toJSON = t,
            r
        }
        ,
        r.contains = function(e, t) {
            return -1 < r.indexOf(e, t)
        }
        ,
        r.indexOf = function(e, t) {
            if (e.indexOf)
                return e.indexOf(t);
            for (var r = 0; r < e.length; r++)
                if (e[r] === t)
                    return r;
            return -1
        }
        ,
        r.isArray = function(e) {
            return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e)
        }
        ,
        r.documentReady = function(e) {
            "loading" !== document.readyState ? e() : document.addEventListener ? document.addEventListener("DOMContentLoaded", e) : document.attachEvent("onreadystatechange", function() {
                "loading" !== document.readyState && e()
            })
        }
        ,
        r.hasClass = function(e, t) {
            return e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)","gi").test(e.className)
        }
        ,
        r.isEmptyObject = function(e) {
            for (var t in e)
                return !1;
            return !0
        }
        ,
        r.assign = function(e, t) {
            for (var r in t)
                e[r] = t[r]
        }
        ,
        r
    }()
      , Storage = function() {
        function r() {}
        return r.hasCookie = function(e) {
            return null != Wrappers.documentCookie() && !(r.cookieValues(e).length < 1)
        }
        ,
        r.cookieValues = function(e) {
            for (var t = e + "=", r = Wrappers.documentCookie().split(";"), n = [], a = 0; a < r.length; a++) {
                for (var o = r[a]; " " === o.charAt(0); )
                    o = o.substring(1, o.length);
                0 === o.indexOf(t) && n.push(unescape(o.substring(t.length, o.length)))
            }
            return n
        }
        ,
        r.setItem = function(e, t) {
            return e = "calltrk-" + e,
            t === undefined ? window.localStorage.removeItem(e) : window.localStorage.setItem(e, Polyfills.jsonify(t)),
            r.getItem(e)
        }
        ,
        r.getItem = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            for (var r = 0; r < e.length; r++) {
                var n = "calltrk-" + e[r]
                  , a = window.localStorage.getItem(n);
                if (a)
                    return JSON.parse(a)
            }
            return null
        }
        ,
        r.removeItem = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            for (var r = 0; r < e.length; r++) {
                var n = "calltrk-" + e[r];
                window.localStorage.removeItem(n)
            }
            return null
        }
        ,
        r
    }()
      , Session = function() {
        function c() {}
        return c.generateUUID = function() {
            var r = window.crypto || window.msCrypto;
            return r && r.getRandomValues ? "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function(e) {
                var t = parseInt(e, 10);
                return (t ^ r.getRandomValues(new Uint8Array(1))[0] & 15 >> t / 4).toString(16)
            }) : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e) {
                var t = 16 * Math.random() | 0;
                return ("x" == e ? t : 3 & t | 8).toString(16)
            })
        }
        ,
        c.hasWordpressCookies = function() {
            return 1 <= window.crwpVer
        }
        ,
        c.wpProxy = function() {
            return 2 === window.crwpVer
        }
        ,
        c.proxyPath = function(e) {
            var t;
            try {
                t = new URL(e)
            } catch (r) {
                (t = document.createElement("a")).href = e
            }
            return "/index.php?rest_route=/calltrk/sessions" + t.pathname
        }
        ,
        c.crossSubdomain = function() {
            var ns = CallTrk.firstNamespace();
            return ns && ns.cross_subdomain
        }
        ,
        c.cookieDuration = function() {
            return CallTrk.firstNamespace().cookie_duration
        }
        ,
        c.isMulti = function() {
            return !!CallTrk.firstNamespace().multiswap_id
        }
        ,
        c.namespaceIds = function() {
            var e = [];
            return CallTrk.eachNamespace(function(ns) {
                return e.push(ns.id)
            }),
            e
        }
        ,
        c.nearestTLD = function() {
            if (CallTrkSwap._nearestTLD)
                return CallTrkSwap._nearestTLD;
            var e = Wrappers.documentCookie()
              , t = Wrappers.windowLocation().hostname
              , r = t.split(".");
            if ("" === t)
                return "";
            for (var n = r.length - 1; 0 <= n; --n) {
                var a = r.slice(n).join(".");
                if (c.createCookie("calltrk_nearest_tld", a, 3600, a),
                e !== Wrappers.documentCookie())
                    return c.eraseCookie("calltrk_nearest_tld", a),
                    CallTrkSwap._nearestTLD = a
            }
        }
        ,
        c.createCookie = function(e, t, r, n) {
            var a = "";
            if (null == r && (r = c.cookieDuration()),
            r) {
                var o = new Date;
                o.setTime(o.getTime() + 24 * r * 60 * 60 * 1e3),
                a = "; expires=" + o.toUTCString()
            }
            var i = e + "=" + escape(t) + a + "; path=/";
            c.crossSubdomain() && !1 !== n && !n && (n = c.nearestTLD()),
            n && (i += "; domain=" + n),
            i += "; samesite=Lax";
            var s = Storage.getItem(e);
            return s && s == t ? Wrappers.documentCookie(i) : Storage.hasCookie(i) ? Storage.setItem(e, t) : (Storage.setItem(e, t),
            Wrappers.documentCookie(i)),
            i
        }
        ,
        c.eraseCookie = function(e, t) {
            c.createCookie(e, "", -1, t),
            Storage.removeItem(e)
        }
        ,
        c.crDeleteOldCookies = function() {
            c.eraseCookie("calltrk_referrer"),
            c.eraseCookie("calltrk_landing"),
            c.eraseCookie("calltrk_session_id");
            var e = document.cookie.match(/calltrk_session_swap_numbers_(\d+)=/g);
            if (e)
                for (var t = 0; t < e.length; ++t) {
                    var r = /[0-9]+/g
                      , n = (e[t].match(r) || [])[0];
                    c.eraseCookie("calltrk_session_id_" + n),
                    c.eraseCookie("calltrk_session_swap_numbers_" + n)
                }
        }
        ,
        c.readCookie = function(e) {
            var t = Storage.getItem(e)
              , r = Storage.cookieValues(e);
            return r.length <= 1 && !t ? (Storage.setItem(e, r[0]),
            r[0] || null) : t ? (0 === r.length && c.createCookie(e, t),
            t) : (c.crossSubdomain() ? c.eraseCookie(e, !1) : c.eraseCookie(e, c.nearestTLD()),
            (r = Storage.cookieValues(e))[0] || null)
        }
        ,
        c.getSessionID = function(e) {
            if (!e) {
                if (CallTrkSwap._session_id)
                    return CallTrkSwap._session_id;
                e = "calltrk_session_id"
            }
            var t = c.readCookie(e);
            return t || CallTrk.eachNamespace(function(ns) {
                t || (t = c.readCookie("calltrk_session_id_" + ns.id.toString()))
            }),
            t || (t = c.generateUUID(),
            c.createCookie(e, t)),
            CallTrkSwap._session_id = t
        }
        ,
        c.getFormCaptureCookie = function(e) {
            if (!e) {
                if (c._fcid)
                    return c._fcid;
                e = "calltrk_fcid"
            }
            var t = c.readCookie(e);
            return t || (t = c.generateUUID()),
            c.createCookie(e, t),
            c._fcid = t
        }
        ,
        c
    }()
      , Urls = function() {
        function o() {}
        return o.getCurrentReferrer = function() {
            var e = o.getURLParameter("utm_referrer");
            return e || (e = Wrappers.documentReferrer()),
            e || (e = "direct"),
            e
        }
        ,
        o.getReferrerKey = function(e, t) {
            var r;
            e = e || "direct";
            var n = /utm_medium=([cp]pc|paid_social|paid|.*_ad.*)/i;
            if (t.match(/ndclid=/i))
                r = "nextdoor_paid";
            else if (e.match(/doubleclick/i) || t.match(/dclid=|wbraid=|gbraid=/i))
                r = "google_paid";
            else if (e.match(/google/i) && !e.match(/mail\.google\.com/i)) {
                if (t.match(/gclid=/i))
                    return "google_paid";
                r = e.match(/googleadservices/i) || t.match(/utm_(medium|source)=[cp]pc/i) || t.match(/(matchtype|adposition)=/i) ? "google_paid" : "google_organic"
            } else
                r = t.match(/gclid=/i) ? e.match(/(\/|\.)youtube\./i) || t.match(/utm_source=.*youtube.*/i) ? "youtube_paid" : t.match(/msclkid=/i) ? "bing_paid" : "google_paid" : t.match(/msclkid=/i) ? e.match(/(\/|\.)duckduckgo\./i) || t.match(/utm_source=.*duckduckgo.*/i) ? "duckduckgo_paid" : "bing_paid" : e.match(/(\/|\.)bing\./i) || t.match(/utm_source=.*bing.*/i) ? t.match(n) || t.match(/msclkid=/i) ? "bing_paid" : "bing_organic" : e.match(/msn\.com/i) ? "bing_paid" : e.match(/yahoo/i) && !e.match(/mail\.yahoo\.com/i) ? t.match(n) ? "yahoo_paid" : "yahoo_organic" : t.match(/fb_ad_id=/i) ? e.match(/(\/|\.)instagram\./i) || t.match(/utm_source=.*instagram.*/i) ? "instagram_paid" : "facebook_paid" : t.match(/(fbclid=)/i) && e.match(/(\/|\.)instagram\./i) ? t.match(n) ? "instagram_paid" : "instagram_organic" : e.match(/(\/|\.)facebook\./i) || t.match(/(fbclid=|utm_source=.*facebook.*)/i) ? t.match(n) ? "facebook_paid" : "facebook_organic" : e.match(/(\/|\.)instagram\./i) || t.match(/utm_source=.*instagram.*/i) ? t.match(n) ? "instagram_paid" : "instagram_organic" : e.match(/(\/|\.)duckduckgo\./i) || t.match(/utm_source=.*duckduckgo.*/i) ? t.match(n) ? "duckduckgo_paid" : "duckduckgo_organic" : e.match(/(\/|\.)nextdoor\./i) || t.match(/utm_source=.*nextdoor.*/i) ? t.match(n) ? "nextdoor_paid" : "nextdoor_organic" : e.match(/(\/|\.)linkedin\./i) || t.match(/utm_source=.*linkedin.*/i) ? t.match(n) ? "linkedin_paid" : "linkedin_organic" : e.match(/(\/|\.)twitter\./i) || t.match(/utm_source=.*twitter.*/i) ? t.match(n) ? "twitter_paid" : "twitter_organic" : e.match(/(\/|\.)pinterest\./i) || t.match(/utm_source=.*pinterest.*/i) ? t.match(n) ? "pinterest_paid" : "pinterest_organic" : e.match(/(\/|\.)spotify\./i) || t.match(/utm_source=.*spotify.*/i) ? t.match(n) ? "spotify_paid" : "spotify_organic" : e.match(/(\/|\.)yelp\./i) || t.match(/utm_source=.*yelp.*/i) ? t.match(n) || t.match(/utm_(medium|source|campaign)=yelp_ad/i) || t.match(/campaign_code=yelp_ad/i) ? "yelp_paid" : "yelp_organic" : e.match(/(\/|\.)youtube\./i) || t.match(/utm_source=.*youtube.*/i) ? t.match(n) ? "youtube_paid" : "youtube_organic" : "direct" === e ? t.match(n) && t.match(/utm_source=.*google.*/i) ? "google_paid" : "direct" : o.getReferrerDomain(e);
            return r
        }
        ,
        o.getReferrerDomain = function(e) {
            var t = e.split("/")[2]
              , r = t.split(".");
            return 2 < r.length ? r[r.length - 2] + "." + r[r.length - 1] : t
        }
        ,
        o.getHostnameAndPath = function() {
            var e = document.createElement("a");
            e.href = Wrappers.windowLocation().href;
            var t = e.pathname;
            return 0 !== t.indexOf("/") && (t = "/" + t),
            e.hostname + t
        }
        ,
        o.getURLParameter = function(e) {
            var t = new RegExp("[?|&]" + e + "=([^&;]+?)(&|#|;|$)").exec(Wrappers.windowLocation().search) || [null, ""];
            return decodeURIComponent(t[1].replace(/\+/g, "%20")) || null
        }
        ,
        o.urlContainsParam = function(e) {
            var t = "(\\?|&)" + e + "($|&|=)";
            return Wrappers.windowLocation().href.match(t)
        }
        ,
        o.param = function(e, t, r) {
            if ("string" == typeof e)
                return e;
            for (var n in t || (t = []),
            e) {
                var a = e[n];
                e.hasOwnProperty(n) && a && (r && (n = r + "[" + (Polyfills.isArray(e) && !Polyfills.isArray(e[0]) ? "" : n) + "]"),
                "object" != typeof a ? t.push(encodeURIComponent(n) + "=" + encodeURIComponent(a)) : o.param(a, t, n))
            }
            return r ? undefined : t.join("&")
        }
        ,
        o
    }()
      , Dom = function() {
        function c() {}
        return c.injectCss = function() {
            var e = document.documentElement
              , t = "crjs";
            e.classList ? e.classList.add(t) : e.className += " " + t;
            var r = document.createElement("style");
            r.setAttribute("type", "text/css");
            var n = ".crjs .phoneswap { visibility: hidden; }";
            r.textContent !== undefined && (r.textContent = n);
            var a = document.querySelector("head");
            a && a.appendChild(r)
        }
        ,
        c.domEach = function(e, t) {
            for (var r = document.querySelectorAll(e), n = 0; n < r.length; n++)
                t(r[n])
        }
        ,
        c.recurseDOM = function(e, t, r) {
            for (var n, a = r || e, o = 1; a; ) {
                var i = null;
                !1 === t(a) || a.nodeType !== o && !a.shadowRoot || (i = a.shadowRoot ? null === (n = a.shadowRoot) || void 0 === n ? void 0 : n.firstChild : a.firstChild),
                a.nextSibling && a !== e && c.recurseDOM(e, t, a.nextSibling),
                a = i
            }
        }
        ,
        c.traverseDOM = function(i, e) {
            var r = ["src", "srcset", "title", "phone"]
              , n = /(\bclk[ng]\/(sms|tel|imessage))|(^(sms|tel|imessage))/i
              , t = function(e, t, r) {
                var n, a = (n = "undefined" == typeof getComputedStyle ? e.currentStyle : getComputedStyle(e))[t] || r && n[r];
                if (a) {
                    var o = i(a);
                    null != o && (e.style[t] = o)
                }
            }
              , a = function(e, t) {
                var r = e.getAttribute(t);
                if (r) {
                    var n = i(r, t);
                    null != n && e.setAttribute(t, n)
                }
            }
              , o = function(e, t) {
                for (var r = 0; r < e.length; r++)
                    a(t, e[r])
            }
              , s = function(e) {
                var t = e.getAttribute("href");
                t && t.match(n) && a(e, "href")
            };
            c.domEach(".cr_image, .cr_image *", function(e) {
                t(e, "background"),
                t(e, "backgroundImage")
            }),
            c.recurseDOM(e, function(e) {
                switch (e.nodeType) {
                case 1:
                    if (["SCRIPT", "NOSCRIPT"].includes(e.tagName) || e.hasAttribute("data-calltrk-noswap"))
                        return !1;
                    o(r, e),
                    s(e);
                    break;
                case 3:
                    var t = i(e.nodeValue);
                    null != t && (Wrappers.isDebug() && (e.parentNode.className += " calltrk-swap-occurred"),
                    e.nodeValue = t)
                }
            })
        }
        ,
        c.makePhoneSwapVisible = function() {
            c.domEach(".phoneswap", function(e) {
                e.style.visibility = "visible"
            })
        }
        ,
        c.domTargets = function(e) {
            var r, n, a = [], o = /\D/g;
            return c.traverseDOM(function(e) {
                r = CallTrkSwap.stringTargets(e);
                for (var t = 0; t < r.length; t++)
                    10 < (n = r[t].replace(o, "")).length && (n = n.slice(n.length - 10)),
                    -1 === Polyfills.indexOf(a, n) && a.push(n);
                CallTrk.eachNamespace(function(ns) {
                    ns.exactTargetsIn(e, function(e) {
                        a.push(e)
                    })
                })
            }, e),
            a
        }
        ,
        c.startObserving = function() {
            c.observer || "undefined" == typeof MutationObserver || (c.observer = new MutationObserver(c.mutationCallback),
            c.observer.observe(document.body, {
                childList: !0,
                subtree: !0
            }))
        }
        ,
        c.stopObserving = function() {
            c.observer && (c.observer.disconnect(),
            c.observer = undefined)
        }
        ,
        c.mutationCallback = function(e) {
            for (var t = CallTrk.firstNamespace().session_observer, r = !1, n = 0; n < e.length; n++)
                for (var a = e[n], o = 0; o < a.addedNodes.length; o++) {
                    var i = a.addedNodes[o];
                    CallTrkSwap.startSourceSwap(i),
                    t && (r = r || 0 < c.domTargets(i).length)
                }
            t && r && CallTrkSwap.checkSessionSwap(!1)
        }
        ,
        c.visibleParent = function() {
            var e;
            try {
                if (window.self === window.parent || window.self.document === (null === (e = window.top) || void 0 === e ? void 0 : e.document))
                    return !1
            } catch (t) {
                return !1
            }
            return !0
        }
        ,
        c.waitingParent = function() {
            try {
                if ("loading" === window.parent.document.readyState)
                    return !0
            } catch (e) {
                return !1
            }
            return !1
        }
        ,
        c.iframeAwareReady = function(e) {
            c.readyRan = !1;
            var t = function() {
                c.readyRan || (c.readyRan = !0,
                Polyfills.documentReady(e))
            };
            if (!(c.visibleParent() && c.waitingParent()))
                return t();
            window.addEventListener("message", function(e) {
                "calltrkReady" === e.data && t()
            }),
            "loading" !== window.parent.document.readyState && t(),
            setTimeout(t, 2e3)
        }
        ,
        c.whenPageVisible = function(e) {
            "prerender" !== document.visibilityState ? e() : document.addEventListener && document.addEventListener("visibilitychange", e, !1)
        }
        ,
        c.iframeConflict = function(e) {
            if (!c.visibleParent())
                return !1;
            var t = window.top && window.top.CallTrk && window.top.CallTrk._namespaces;
            return t && 0 <= t.indexOf(e.toString())
        }
        ,
        c.broadcastReady = function() {
            var e = window.frames;
            if (0 !== e.length)
                for (var t = 0; t < e.length; t++)
                    e[t].postMessage("calltrkReady", "*")
        }
        ,
        c.getScript = function(e, t, r) {
            var n = document.createElement("script");
            n.type = "text/javascript",
            -1 !== e.indexOf("?") ? e += "&" : e += "?",
            e += "t=" + (new Date).getTime().toString(),
            e += "&" + Urls.param(t),
            Session.wpProxy() && r && (e = Session.proxyPath(e)),
            n.src = e,
            document.body.appendChild(n)
        }
        ,
        c
    }()
      , Helpers = function() {
        function a() {}
        return a.post = function(e) {
            var t = new XMLHttpRequest;
            return t.open("POST", e),
            t
        }
        ,
        a.postScript = function(e, t, r) {
            var n = a.post(e);
            n.setRequestHeader("Content-Type", "text/plain"),
            n.setRequestHeader("Accept", "application/json"),
            n.onload = function() {
                var e = JSON.parse(n.response);
                r(e)
            }
            ,
            n.send(Polyfills.jsonify(t))
        }
        ,
        a.postCookies = function(e, t, r) {
            var n = a.post(e);
            n.setRequestHeader("Content-Type", "application/json"),
            n.onload = function() {
                var e = n.status;
                r(e)
            }
            ,
            n.send(Polyfills.jsonify(t))
        }
        ,
        a.parseCookieResponse = function(e, t, r) {
            204 !== e && (window.crwpVer = 0,
            Session.createCookie("calltrk_referrer", t),
            Session.createCookie("calltrk_landing", r))
        }
        ,
        a.postWordpressCookies = function(t, r) {
            var e = "/index.php?rest_route=/Calltrk/v1/store"
              , n = {
                calltrk_referrer: t,
                calltrk_landing: r,
                calltrk_session_id: Session.getSessionID(),
                domain: Session.nearestTLD(),
                duration: CallTrk.firstNamespace().cookie_duration
            };
            a.postCookies(e, n, function(e) {
                a.parseCookieResponse(e, t, r)
            })
        }
        ,
        a
    }()
      , IntegrationData = function() {
        function IntegrationData() {}
        return IntegrationData.getGoogleContentExperimentCookies = function(e) {
            if (e.google_experiments !== undefined)
                return e.google_experiments;
            var t;
            if (t = Session.readCookie("calltrk_google_experiments") ? Session.readCookie("calltrk_google_experiments") : "",
            Urls.getURLParameter("utm_expid")) {
                var r = Urls.getURLParameter("utm_expid") + "," + Urls.getHostnameAndPath();
                t.indexOf(r) < 0 && (t = "" !== t ? t + "|" + r : r),
                Session.createCookie("calltrk_google_experiments", t)
            }
            return e.google_experiments = t
        }
        ,
        IntegrationData.getIntegrationData = function(t) {
            var r = {}
              , n = {};
            return CallTrk.eachNamespace(function(ns) {
                if (!t || -1 < Polyfills.indexOf(t, ns.id)) {
                    var e = ns.getIntegrationData(n);
                    Polyfills.assign(r, e)
                }
            }),
            r
        }
        ,
        IntegrationData.getInstanceIntegrationData = function(cookieCache, namespaceCookies, namespaceScripts) {
            var params = {
                google_content_cookies: IntegrationData.getGoogleContentExperimentCookies(cookieCache)
            };
            for (var reportName in namespaceCookies) {
                var cookie = namespaceCookies[reportName]
                  , value = void 0;
                cookieCache[cookie] !== undefined ? params[reportName] = cookieCache[cookie] : (value = Session.readCookie(cookie),
                cookieCache[cookie] = value,
                null !== value && (params[reportName] = value))
            }
            for (var reportAs in namespaceScripts) {
                var code = namespaceScripts[reportAs];
                try {
                    var rc = eval(code);
                    "object" != typeof rc || Polyfills.isArray(rc) || (rc = Urls.param(rc)),
                    params[reportAs] = rc
                } catch (e) {}
            }
            return params
        }
        ,
        IntegrationData.integrationRetry = function(e) {
            var t = IntegrationData.getIntegrationData(e)
              , r = CallTrk.firstNamespace();
            Polyfills.isEmptyObject(t) || (t.uuid = Session.getSessionID(),
            Session.isMulti() || (t.ids = e),
            Dom.getScript(r.icapURL(), t))
        }
        ,
        IntegrationData
    }()
      , Replacer = function() {
        function d() {}
        return d.standardReplace = function(e, t, r) {
            if (d._numberRegexCache || (d._numberRegexCache = {}),
            !d._numberRegexCache[t]) {
                var n = t.substring(0, 3)
                  , a = t.substring(3, 6)
                  , o = t.substring(6, 10)
                  , i = "(\\(?)" + n + "(\\))?" + d.CHAR_SEP + a + d.CHAR_SEP + o
                  , s = "$1" + r.substring(0, 3) + "$2$3" + r.substring(3, 6) + "$4" + r.substring(6, 10);
                d._numberRegexCache[t] = [o, new RegExp(i,"g"), s]
            }
            var c = d._numberRegexCache[t];
            if (-1 < e.indexOf(c[0])) {
                if (Debug._isDebug) {
                    var u = e.match(c[1]);
                    if (u) {
                        var l = u[0]
                          , p = l.replace(c[1], c[2]);
                        Debug.doneSwaps[l] = p
                    }
                }
                e = e.replace(c[1], c[2])
            }
            return e
        }
        ,
        d.replacementForPlainText = function(e, t) {
            var r = t.substring(0, 3)
              , n = t.substring(3, 6)
              , a = t.substring(6, 10)
              , o = "(" + r + ") " + n + "-" + a
              , i = r + "-" + n + "-" + a
              , s = r + "." + n + "." + a;
            return e = (e = (e = e.replace("###phone###", o)).replace("###phone-dashes###", i)).replace("###phone-dots###", s)
        }
        ,
        d.CHAR_SEP = "([-. " + String.fromCharCode(160) + "]?)",
        d.NUM_REGEX = new RegExp("(\\(?)\\d{3}(\\))?" + d.CHAR_SEP + "\\d{3}" + d.CHAR_SEP + "\\d{4}\\b","g"),
        d.INTL_NUM_REGEX = /[(+]?[(+]?(?:[\d][ \-.()\u202F\u00A0]{0,2}){8,21}[\d]/g,
        d
    }()
      , NumberSwap = function() {
        function e() {}
        return e.adjustExactFormat = function(e) {
            var t = {
                advanced: {},
                simple: {}
            };
            for (var r in e)
                if (-1 !== r.indexOf(",")) {
                    var n = r.split(",")
                      , a = decodeURIComponent(n[0])
                      , o = decodeURIComponent(n[1]);
                    if (Polyfills.isArray(e[r])) {
                        var i = Replacer.replacementForPlainText(o, e[r][0]);
                        t.advanced[i] = ["." === e[r][1][0] ? a : o, e[r][1]]
                    } else
                        t.advanced[a] = [o, e[r]]
                } else
                    t.simple[r] = e[r];
            return t
        }
        ,
        e
    }()
      , Performance = function() {
        function o() {}
        return o.perfData = function() {
            if (o._perfData)
                return o._perfData;
            if (o._perfData = {},
            window.performance)
                try {
                    var e = window.performance.getEntriesByType("resource").filter(function(e) {
                        return e.name.match(/swap\.js/)
                    })[0];
                    if (e) {
                        var t = 0 < e.encodedBodySize && 0 < e.transferSize && e.transferSize < e.encodedBodySize
                          , r = 0 === e.duration;
                        if (t || r)
                            return {};
                        var n = 0 < e.secureConnectionStart ? e.secureConnectionStart : e.connectEnd;
                        o._perfData = {
                            dns: e.domainLookupEnd - e.domainLookupStart,
                            conn: n - e.connectStart,
                            tls: e.connectEnd - n,
                            wait: e.responseStart - e.requestStart,
                            recv: e.responseEnd - e.responseStart
                        }
                    }
                } catch (a) {}
            return o._perfData
        }
        ,
        o.reset = function() {
            o._perfData = {}
        }
        ,
        o
    }()
      , PhoneNumbers = function() {
        function e() {}
        return e.defaultNumberFormat = function(e) {
            return "object" == typeof e && null !== e && (e = e.national_string),
            e
        }
        ,
        e
    }()
      , Poll = function() {
        function n() {}
        return n.pollSessionURL = function() {
            var ns = CallTrk.firstNamespace();
            return ns.buildURL("poll_session", {
                multiswap_id: ns.multiswap_id,
                host: ns.swap_session_host,
                uuid: Session.getSessionID(),
                multiswap_token: ns.multiswap_token
            })
        }
        ,
        n.pollSession = function() {
            n.pollUnwatch();
            var ns = CallTrk.firstNamespace()
              , e = {}
              , t = Date.now()
              , r = .9 * ns.session_poll_interval;
            setTimeout(n.pollWatch, ns.session_poll_interval),
            CallTrkSwap.lastPoll && t - CallTrkSwap.lastPoll < r || (CallTrkSwap.lastPoll = t,
            Session.isMulti() || (e.ids = Session.namespaceIds()),
            Dom.getScript(n.pollSessionURL(), e))
        }
        ,
        n.pollInit = function() {
            var e = CallTrk.firstNamespace().session_poll_interval;
            CallTrkSwap.pollInitted || (CallTrkSwap.pollInitted = !0,
            setTimeout(n.pollWatch, e))
        }
        ,
        n.pollWatch = function() {
            document.addEventListener("mousemove", n.pollSession),
            document.addEventListener("keypress", n.pollSession),
            window.addEventListener("focus", n.pollSession)
        }
        ,
        n.pollUnwatch = function() {
            document.removeEventListener("mousemove", n.pollSession),
            document.removeEventListener("keypress", n.pollSession),
            window.removeEventListener("focus", n.pollSession)
        }
        ,
        n
    }()
      , ScanString = function() {
        function l() {}
        return l.scan = function(o, a, i, e, n) {
            var t = e !== undefined
              , r = function(e, t) {
                var r = l.intlStringTargets(o ? o.trim() : o);
                if (0 < r.length) {
                    for (var n = "", a = 0; a < r.length; a++)
                        n = t(i, r[a]);
                    return n
                }
                return o
            }
              , s = function(e, t) {
                if ("^" !== a.charAt(0))
                    return Replacer.standardReplace(o, a, e.national_string);
                if ("href" === n)
                    return c(e.e164, t);
                var r = l.findFormat(t, e.formats);
                return c(null !== r ? r : e.national_string, t)
            }
              , c = function(e, t) {
                var r = t.replace(/\D/g, "");
                if (a.slice(1) === r.slice(r.length - 8)) {
                    var n = new RegExp(l.escapeRegExp(t),"g");
                    Debug._isDebug && (Debug.doneSwaps[o] = e),
                    o = o.replace(n, e)
                }
                return o
            };
            if (t || Polyfills.isArray(i)) {
                if (-1 < o.indexOf(a)) {
                    var u = Replacer.replacementForPlainText(t ? e : i[0], t ? i : i[1]);
                    Debug._isDebug && (Debug.doneSwaps[a] = u),
                    o = o.replace(a, u)
                }
            } else
                o = "object" == typeof i && null !== i ? r(i, s) : "^" === a.charAt(0) ? r(i, c) : Replacer.standardReplace(o, a, i);
            return o
        }
        ,
        l.stringTargets = function(e) {
            return e && e.match(Replacer.NUM_REGEX) || []
        }
        ,
        l.intlStringTargets = function(e) {
            return e && e.match(Replacer.INTL_NUM_REGEX) || []
        }
        ,
        l.escapeRegExp = function(e) {
            return e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
        }
        ,
        l.findFormat = function(e, t) {
            for (var r in t)
                if (l.isSameFormat(e, t[r]))
                    return r;
            return null
        }
        ,
        l.isSameFormat = function(e, t) {
            return new RegExp(t.slice(1, -1)).test(e)
        }
        ,
        l
    }()
      , CallTrkSwap = function() {
        function l(e) {
            Polyfills.assign(this, e),
            window.CallTrk.pushNamespace("namespace_" + this.id, this)
        }
        return Object.defineProperty(l.prototype, "_perfData", {
            get: function() {
                return Performance.perfData()
            },
            enumerable: !1,
            configurable: !0
        }),
        l.log = function(e, t) {
            Wrappers.isDebug() && (t || (t = e,
            e = "swap"),
            l._log.push(e.toString() + ": " + t))
        }
        ,
        l.prototype.log = function(e) {
            l.log(this.id, e)
        }
        ,
        l.prototype.hasFormsOrChat = function() {
            return this.chat_or_form_exists
        }
        ,
        l.prototype.run = function() {
            this.referrer = this.getReferrer(),
            this.landing = this.getLanding(),
            this.referrer_key = Urls.getReferrerKey(this.referrer, this.landing),
            this.createReferrerAndLandingCookies(),
            this.applyTrumpLandingPage(),
            this.applyTrumpSources(),
            this.getWidgetScripts()
        }
        ,
        l.prototype.applyTrumpSources = function() {
            if (this.trump_sources) {
                var e = Urls.getReferrerKey(Wrappers.documentReferrer(), Wrappers.documentURL());
                Polyfills.contains(["google_paid", "yahoo_paid", "bing_paid"], e) && (Session.crDeleteOldCookies(),
                delete l._referrer,
                delete l._landing,
                l._referrerAndLandingCookiesCreated = !1,
                this.referrer = Wrappers.documentReferrer(),
                this.landing = Wrappers.documentURL(),
                this.createReferrerAndLandingCookies(),
                this.referrer_key = e)
            }
        }
        ,
        l.prototype.applyTrumpLandingPage = function() {
            if (this.trump_landing_param) {
                var e = this.trump_landing_page_param;
                Urls.urlContainsParam(e) && (Session.crDeleteOldCookies(),
                delete l._referrer,
                delete l._landing,
                l._referrerAndLandingCookiesCreated = !1,
                this.referrer = Wrappers.documentReferrer(),
                this.landing = Wrappers.documentURL(),
                this.createReferrerAndLandingCookies(),
                this.referrer_key = Urls.getReferrerKey(this.referrer, this.landing))
            }
        }
        ,
        l.prototype.exactTargetsIn = function(e, t) {
            for (var r = 0; r < this.session_exact_targets.length; r++) {
                var n = this.session_exact_targets[r];
                0 <= e.indexOf(n) && t(this.session_exact_targets[r])
            }
        }
        ,
        l.swapCleanup = function() {
            delete Replacer._numberRegexCache,
            CallTrk.eachNamespace(function(ns) {
                ns._storedSwapCache = null
            })
        }
        ,
        l.mergeStoredSwaps = function(e) {
            var t = e.global;
            CallTrk.eachNamespace(function(ns) {
                t && ns.mergeStoredSwaps(t),
                e[ns.id] && ns.mergeStoredSwaps(e[ns.id])
            })
        }
        ,
        l.mergeUnassignedSwaps = function(e) {
            var t = e.global;
            CallTrk.eachNamespace(function(ns) {
                t && ns.mergeUnassignedSwaps(t),
                e[ns.id] && ns.mergeUnassignedSwaps(e[ns.id])
            })
        }
        ,
        l.prototype.mergeStoredSwaps = function(e) {
            var t = this.getStoredSwaps();
            for (var r in e)
                e[r] ? t[r] = e[r] : t[r] && delete t[r];
            this.assigns(t)
        }
        ,
        l.prototype.mergeUnassignedSwaps = function(e) {
            var t = this.getUnassignedSwaps();
            for (var r in e)
                if (e[r]) {
                    var n = t.indexOf(r);
                    -1 < n && t.splice(n, 1)
                } else
                    -1 === t.lastIndexOf(r) && t.push(r);
            this.unassigns(t)
        }
        ,
        l.prototype.getStoredSwaps = function() {
            var e = this.assigns();
            return e || {}
        }
        ,
        l.prototype.getUnassignedSwaps = function() {
            var e = this.unassigns();
            return e || []
        }
        ,
        l.prototype.unassigns = function(e) {
            return e ? l._unassigns = e : l._unassigns
        }
        ,
        l.prototype.assigns = function(e) {
            var t = this.id + "-assigns-" + Session.getSessionID();
            return e ? Storage.setItem(t, e) : Storage.getItem(t)
        }
        ,
        l.prototype.swapString = function(n, a) {
            var o = this;
            return this._storedSwapCache || (this._storedSwapCache = NumberSwap.adjustExactFormat(this.getStoredSwaps())),
            ["advanced", "simple"].forEach(function(e) {
                for (var t in o._storedSwapCache[e]) {
                    var r = o._storedSwapCache[e][t];
                    n = ScanString.scan(n, t, r, undefined, a)
                }
            }, this),
            n
        }
        ,
        l.startSourceSwap = function(e) {
            e = e || document.body;
            var u = l.matchingSourceTrackers()
              , t = function(e, t) {
                for (var r = e, n = 0; n < u.length; n++) {
                    var a = PhoneNumbers.defaultNumberFormat(u[n].number);
                    for (var o in u[n].advanced_swap_targets) {
                        var i = u[n].advanced_swap_targets[o];
                        r = ScanString.scan(r, o, a, i, t)
                    }
                    a = u[n].number;
                    for (var s = 0; s < u[n].swap_targets.length; s++) {
                        var c = u[n].swap_targets[s];
                        r = ScanString.scan(r, c, a, undefined, t)
                    }
                }
                if (r !== e)
                    return r
            };
            if (0 !== u.length) {
                var r = t(document.title);
                if (r && (document.title = r),
                Dom.traverseDOM(t, e),
                window.Cufon)
                    try {
                        window.Cufon.refresh()
                    } catch (n) {}
            }
        }
        ,
        l.startSessionSwap = function(e, t) {
            var a = this
              , o = ["advanced", "simple"]
              , i = NumberSwap.adjustExactFormat(e)
              , r = document.title;
            for (var n in t = t || document.body,
            o.forEach(function(e) {
                for (var t in i[e])
                    r = ScanString.scan(r, t, i[e][t])
            }, this),
            CallTrk._namespaceObjs)
                r = CallTrk._namespaceObjs[n].swapString(r);
            if (r !== document.title && (document.title = r),
            Dom.traverseDOM(function(e, r) {
                var n = e;
                for (var t in Debug._isDebug && Debug.foundTargets.push(e),
                o.forEach(function(e) {
                    for (var t in i[e])
                        n = ScanString.scan(n, t, i[e][t], undefined, r)
                }, a),
                CallTrk._namespaceObjs)
                    n = CallTrk._namespaceObjs[t].swapString(n, r);
                if (n !== e)
                    return n
            }, t),
            l.swapCleanup(),
            window.Cufon)
                try {
                    window.Cufon.refresh()
                } catch (s) {}
            CallTrk.firstNamespace().mutation_observer && Dom.startObserving(),
            Dom.makePhoneSwapVisible()
        }
        ,
        l.checkSessionSwap = function(e, t) {
            t = t || document.body;
            var r = {}
              , n = null
              , a = !1
              , o = !1;
            if (CallTrk.eachNamespace(function(ns) {
                ns.hasSessionTracker() && (o = !0,
                n = ns.session_poll_interval,
                a = a || ns.session_polling)
            }),
            o) {
                for (var i = Dom.domTargets(t), s = !1, c = e, u = 0; u < i.length; u++)
                    r[i[u]] = null,
                    Debug._isDebug && Debug.foundTargets.push(i[u]);
                CallTrk.eachNamespace(function(ns) {
                    var e = ns.checkSessionSwap(r);
                    s = s || e
                }),
                s && l.startSessionSwap({}, t),
                CallTrk.eachNamespace(function(ns) {
                    c = c || ns.checkUnassignedSwaps(r)
                }),
                c && (CallTrk.firstNamespace().getSecondScript(r, e),
                n && a && Poll.pollInit())
            }
            CallTrk.firstNamespace().mutation_observer && Dom.startObserving(),
            Polyfills.isEmptyObject(r) && Dom.makePhoneSwapVisible()
        }
        ,
        l.prototype.checkUnassignedSwaps = function(e) {
            for (var t = this.getUnassignedSwaps(), r = this.assigns() || {}, n = Object.keys(e), a = 0; a < n.length; a++) {
                var o = n[a];
                if (-1 === t.indexOf(o) && !(o in r))
                    return !0
            }
            return !1
        }
        ,
        l.checkFormsOrChat = function() {
            var e = !1
              , t = !1;
            CallTrk.eachNamespace(function(ns) {
                e = e || ns.hasSessionTracker(),
                t = t || ns.hasFormsOrChat()
            }),
            !e && t && CallTrk.firstNamespace().getSecondScript({}, !0)
        }
        ,
        l.prototype.checkSessionSwap = function(e) {
            var t = this.getStoredSwaps()
              , r = !1;
            for (var n in t) {
                var a = t[n];
                if (!e[n])
                    if (null === e[n])
                        e[n] = a,
                        r = !0;
                    else if (-1 !== n.indexOf(",")) {
                        var o = n.split(",")
                          , i = decodeURIComponent(o[0]);
                        null === e[i] && (delete e[i],
                        e[n] = a,
                        r = !0)
                    }
            }
            return r
        }
        ,
        l.prototype.youTubeMatch = function(e) {
            return "youtube_paid" === this.referrer_key && Polyfills.contains(e, "google_paid")
        }
        ,
        l.prototype.hasReferrerMatch = function(e) {
            if (this.youTubeMatch(e))
                return !0;
            if (Polyfills.contains(e, this.referrer_key))
                return !0;
            var t = !!this.referrer
              , r = "direct" === this.referrer || "" === this.referrer;
            if (!t || r)
                return !1;
            var n = Urls.getReferrerDomain(this.referrer);
            return Polyfills.contains(e, n)
        }
        ,
        l.matchingSourceTrackers = function() {
            var e = [];
            return CallTrk.eachNamespace(function(ns) {
                ns.is_bot || e.push.apply(e, ns.matchingSourceTrackers())
            }),
            e
        }
        ,
        l.prototype.matchingSourceTrackers = function() {
            for (var e = [], t = 0; t < this.source_trackers.length; t++) {
                var r = this.source_trackers[t];
                if ("all" !== r.referrer_tracking_source)
                    -1 !== r.referrer_tracking_source.indexOf("landing") && -1 !== this.landing.indexOf(r.landing_tracking_source) ? e.push(r) : this.hasReferrerMatch(r.referrer_keys) && e.push(r);
                else
                    e.push(r)
            }
            return e
        }
        ,
        l.prototype.domlessSessionSwap = function(e, t) {
            if (this.hasSessionTracker() && e && 0 !== e.length) {
                for (var r = {}, n = 0; n < e.length; n++)
                    r[e[n]] = null;
                l.swapCallback = t,
                this.getSecondScript(r, !1, !0)
            } else
                t({})
        }
        ,
        l.prototype.hasSessionTracker = function() {
            return this.session_number_target_exists || 0 < this.session_exact_targets.length
        }
        ,
        l.swapEntry = function() {
            var e = l;
            e.startSwaps(),
            window.Squarespace && window.Squarespace.onInitialize && window.Squarespace.onInitialize(window.Y, function() {
                e.startSwaps()
            })
        }
        ,
        l.startSwaps = function() {
            document.removeEventListener && document.removeEventListener("visibilitychange", l.swapEntry, !1),
            Dom.iframeAwareReady(function() {
                var e = l;
                Debug.doneSwaps = {},
                Debug.foundTargets = [],
                e.startSourceSwap(),
                e.checkSessionSwap(!0),
                e.checkFormsOrChat(),
                Dom.broadcastReady()
            })
        }
        ,
        l.prototype.buildURL = function(e, t) {
            var r = this.endpoints[e];
            for (var n in t)
                r = r.replace("$" + n, t[n]);
            return this.force_https && !r.match(/https:/) && (r = "https:" + r),
            Session.wpProxy() && (r = Session.proxyPath(r)),
            r && r.indexOf("app.calltrk") && r.indexOf("form_capture") && (r = r.replace("app.calltrk", "trk.calltrk")),
            r
        }
        ,
        l.prototype.getIntegrationData = function(e) {
            var t = this.data_collection_config.cookies
              , r = this.data_collection_config.scripts;
            return IntegrationData.getInstanceIntegrationData(e, t, r)
        }
        ,
        l.prototype.icapURL = function() {
            return this.buildURL("integration_retry", {
                multiswap_id: this.multiswap_id,
                multiswap_token: this.multiswap_token,
                version: "12",
                host: this.swap_session_host
            })
        }
        ,
        l.prototype.swapSessionURL = function() {
            return this.buildURL("multiswap_session", {
                multiswap_id: this.multiswap_id,
                host: this.swap_session_host,
                version: "12",
                multiswap_token: this.multiswap_token
            })
        }
        ,
        l.prototype.createReferrerAndLandingCookies = function() {
            l._referrerAndLandingCookiesCreated || (Session.hasWordpressCookies() ? Helpers.postWordpressCookies(this.referrer, this.landing) : (Session.createCookie("calltrk_referrer", this.referrer),
            Session.createCookie("calltrk_landing", this.landing)),
            l._referrerAndLandingCookiesCreated = !0)
        }
        ,
        l.prototype.getReferrer = function() {
            if (l._referrer)
                return l._referrer;
            var e = Session.readCookie("calltrk_referrer");
            return e || (e = Urls.getCurrentReferrer()),
            l._referrer = e
        }
        ,
        l.prototype.getLanding = function() {
            if (l._landing)
                return l._landing;
            var e = Session.readCookie("calltrk_landing");
            return e || (e = Wrappers.documentURL()),
            l._landing = e
        }
        ,
        l.prototype.getSecondScript = function(e, t, r) {
            var n = {
                cid: Urls.getURLParameter("cid"),
                uuid: Session.getSessionID(),
                ref: this.getCurrentReferrer(),
                landing: Wrappers.documentURL(),
                user_agent: navigator.userAgent,
                record_pageview: t && !Dom.iframeConflict(this.id),
                domless: r,
                swaps: [],
                all_formats: !0
            };
            Session.isMulti() || (n.ids = Session.namespaceIds());
            var a = IntegrationData.getIntegrationData();
            Polyfills.assign(n, a);
            var o = {};
            for (var i in e) {
                var s = e[i] || ""
                  , c = s;
                "object" == typeof s && (c = s.national_string),
                c || (o[i] = null),
                n.swaps.push(i + "=" + c)
            }
            if (Object.keys(o).length && this.mergeUnassignedSwaps(o),
            "withCredentials"in new XMLHttpRequest) {
                n.perf = Performance.perfData(),
                Performance.reset();
                var u = this.swapSessionURL().replace(/\.js$/, ".json");
                Helpers.postScript(u, n, function(e) {
                    l.parseSessionSwap(e)
                })
            } else
                Dom.getScript(this.swapSessionURL(), n)
        }
        ,
        l.parseSessionSwap = function(e) {
            !0 === e.domless ? l.swapCallback(e.a) : !0 === e.number_assignment && (l.mergeStoredSwaps(e.a),
            l.mergeUnassignedSwaps(e.a),
            l.startSessionSwap(e.r)),
            Dom.makePhoneSwapVisible(),
            !0 === e.integration_retry && IntegrationData.integrationRetry(e.integration_retries)
        }
        ,
        l.prototype.getWidgetScripts = function() {
            var t = this
              , e = function(e) {
                t.endpoints[e] && -1 === CallTrk.appendedScripts.indexOf(e) && (Dom.getScript(t.endpoints[e], {}, !0),
                CallTrk.appendedScripts.push(e))
            };
            Polyfills.documentReady(function() {
                t.endpoints.chat && Dom.getScript(t.endpoints.chat, {}, !0),
                t.endpoints.contact && !t.endpoints.chat && Dom.getScript(t.endpoints.contact, {}, !0),
                t.endpoints.external_chats && Dom.getScript(t.endpoints.external_chats, {}, !0),
                e("custom_forms"),
                e("external_forms")
            })
        }
        ,
        l.firstNamespace = function() {
            return CallTrk.firstNamespace()
        }
        ,
        l.generateUUID = function() {
            return Session.generateUUID()
        }
        ,
        l.getSessionID = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.getSessionID.apply(Session, e)
        }
        ,
        l.readCookie = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.readCookie.apply(Session, e)
        }
        ,
        l.createCookie = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.createCookie.apply(Session, e)
        }
        ,
        l.eraseCookie = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.eraseCookie.apply(Session, e)
        }
        ,
        l.getFormCaptureCookie = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.getFormCaptureCookie.apply(Session, e)
        }
        ,
        l.getReferrerKey = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Urls.getReferrerKey.apply(Urls, e)
        }
        ,
        l.isMulti = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Session.isMulti.apply(Session, e)
        }
        ,
        l.stringTargets = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return ScanString.stringTargets.apply(ScanString, e)
        }
        ,
        l.intlStringTargets = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return ScanString.intlStringTargets.apply(ScanString, e)
        }
        ,
        l.whenPageVisible = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Dom.whenPageVisible.apply(Dom, e)
        }
        ,
        l.prototype.iframeConflict = function() {
            return Dom.iframeConflict(this.id)
        }
        ,
        l.prototype.getCurrentReferrer = function() {
            return Urls.getCurrentReferrer()
        }
        ,
        l.prototype.getHostnameAndPath = function() {
            return Urls.getHostnameAndPath()
        }
        ,
        l.prototype.getURLParameter = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Urls.getURLParameter.apply(Urls, e)
        }
        ,
        l.prototype.getGoogleContentExperimentCookies = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return IntegrationData.getGoogleContentExperimentCookies.apply(IntegrationData, e)
        }
        ,
        l.prototype.postWordpressCookies = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return Helpers.postWordpressCookies.apply(Helpers, e)
        }
        ,
        Object.defineProperty(l, "_isDebug", {
            get: function() {
                return Debug._isDebug
            },
            set: function(e) {
                Debug._isDebug = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(l, "foundTargets", {
            get: function() {
                return Debug.foundTargets
            },
            set: function(e) {
                Debug.foundTargets = e
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(l, "doneSwaps", {
            get: function() {
                return Debug.doneSwaps
            },
            set: function(e) {
                Debug.doneSwaps = e
            },
            enumerable: !1,
            configurable: !0
        }),
        l.scanString = function() {
            for (var e = [], t = 0; t < arguments.length; t++)
                e[t] = arguments[t];
            return ScanString.scan.apply(ScanString, e)
        }
        ,
        l._log = [],
        l._unassigns = [],
        l.imports = {
            CallTrk: CallTrk,
            Debug: Debug,
            Dom: Dom,
            Helpers: Helpers,
            IntegrationData: IntegrationData,
            NumberSwap: NumberSwap,
            Performance: Performance,
            PhoneNumbers: PhoneNumbers,
            Poll: Poll,
            Polyfills: Polyfills,
            Replacer: Replacer,
            ScanString: ScanString,
            Session: Session,
            Storage: Storage,
            Urls: Urls,
            Wrappers: Wrappers
        },
        l
    }()
      , CallTrk = function() {
        function s() {}
        return s.pushNamespace = function(ns, e) {
            for (var t = s._namespaces, r = 0; r < t.length; ++r)
                if (t[r] === ns)
                    return;
            t.push(ns),
            e && (s._namespaceObjs[ns] = e)
        }
        ,
        s.eachNamespace = function(e) {
            for (var t = s._namespaces, r = 0; r < t.length; ++r) {
                var ns = t[r];
                e(s._namespaceObjs[ns])
            }
        }
        ,
        s.prototype.findNamespace = function(e) {
            for (var t = s._namespaces, r = 0; r < t.length; ++r) {
                var ns = t[r];
                if (e(s._namespaceObjs[ns]))
                    return ns
            }
            return null
        }
        ,
        s.firstNamespace = function() {
            return s._namespaceObjs[s._namespaces[0]]
        }
        ,
        s.swap = function(e) {
            Debug.doneSwaps = {},
            Debug.foundTargets = [],
            e = e || document.body,
            CallTrkSwap.startSourceSwap(e),
            CallTrkSwap.checkSessionSwap(!1, e)
        }
        ,
        s.getSwapNumbers = function(e, r) {
            Polyfills.isArray(e) || (e = [e]);
            for (var t = s.knownSwapAssignments(), n = s._namespaces[0], ns = s._namespaceObjs[n], a = {}, o = 0; o < e.length; o++) {
                var i = e[o];
                t[i] && (a[i] = PhoneNumbers.defaultNumberFormat(t[i]),
                e.splice(o--, 1))
            }
            return 0 === e.length ? r(a) : ns.domlessSessionSwap(e, function(e) {
                for (var t in e = e && e[ns.id] || {})
                    a[t] = PhoneNumbers.defaultNumberFormat(e[t]);
                r(a)
            }),
            a
        }
        ,
        s.knownSwapAssignments = function() {
            var r = {};
            s.eachNamespace(function(ns) {
                var e = ns.getStoredSwaps();
                for (var t in e)
                    r[t] = e[t]
            });
            for (var e = CallTrkSwap.matchingSourceTrackers(), t = 0; t < e.length; t++)
                for (var n = e[t], a = 0; a < n.swap_targets.length; a++) {
                    var o = n.swap_targets[a];
                    r[o] || (r[o] = n.number)
                }
            return r
        }
        ,
        s._namespaces = [],
        s._namespaceObjs = {},
        s.appendedScripts = [],
        s.typescript = !0,
        s
    }();
    Dom.injectCss(),
    Performance.perfData(),
    Debug._isDebug = Debug._debugEnabled(),
    window.CallTrkSwap = window.CallTrkSwap || CallTrkSwap,
    window.CallTrk = window.CallTrk || CallTrk
}();
new CallTrkSwap({
    id: 932895671,
    cookie_duration: 365,
    cross_subdomain: !0,
    session_poll_interval: 6e4,
    session_polling: !0,
    session_observer: !1,
    access_key: "8e287b798cca44316083",
    form_capture_config: {
        enabled: !1,
        url_scope: null,
        urls: [],
        source: null
    },
    trump_landing_param: !1,
    trump_landing_page_param: null,
    trump_sources: !1,
    mutation_observer: !0,
    is_bot: !1,
    force_https: !0,
    data_collection_config: {
        cookies: {
            Facebook__fbp: "_fbp",
            Facebook__fbc: "_fbc",
            ga: "_ga",
            utma: "__utma",
            utmb: "__utmb",
            utmc: "__utmc",
            utmv: "__utmv",
            utmx: "__utmx",
            utmz: "__utmz"
        },
        scripts: {}
    },
    source_trackers: [],
    endpoints: {
        multiswap_session: "//lhg-prod-v1-api.lhgcts.com/swap_session_lhg.json",
        integration_retry: "//lhg-prod-v1-api.lhgcts.com/icap.js",
        form_capture: "//lhg-prod-v1-api.lhgcts.com/form_capture.js",
        poll_session: "//lhg-prod-v1-api.lhgcts.com/$uuid/poll.js",
        cr_form: "//lhg-prod-v1-api.lhgcts.com/forms/$formid"
    },
    swap_session_host: "lhg-prod-v1-api.lhgcts.com",
    session_number_target_exists: !0,
    session_exact_targets: [],
    chat_or_form_exists: null
}).run(),
CallTrk.installed || (CallTrk.installed = !0,
CallTrkSwap.whenPageVisible(function() {
    CallTrkSwap.swapEntry()
}));
},1000)
