(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/islek-app/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CafePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-client] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dices.mjs [app-client] (ecmascript) <export default as Dices>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt.mjs [app-client] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/armchair.mjs [app-client] (ecmascript) <export default as Armchair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.mjs [app-client] (ecmascript) <export default as ArrowRightLeft>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Süre formatlama (client-safe, lib/pricing'den bağımsız)
function hesaplaSureDk(acilisZamani) {
    return Math.floor((Date.now() - new Date(acilisZamani).getTime()) / 60000);
}
function formatSure(dakika) {
    const s = Math.floor(dakika / 60);
    const dk = dakika % 60;
    if (s === 0) return `${dk}dk`;
    return `${s}s ${dk}dk`;
}
function hesaplaToplamClient(session, politika) {
    const sipTotal = session.siparisler.reduce((t, s)=>t + s.fiyat * s.adet, 0);
    const odenenler = session.odemeler || [];
    let urunBazliOdenen = 0;
    let tutarBazliOdenen = 0;
    odenenler.forEach((o)=>{
        if (o.tip === 'tutar_bazli' || o.urunler?.some((u)=>u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme')) {
            tutarBazliOdenen += o.tutar;
        } else {
            urunBazliOdenen += o.tutar;
        }
    });
    let baseTotal = 0;
    switch(politika.mod){
        case 'siparis_bazli':
            baseTotal = sipTotal;
            break;
        case 'masa_limiti':
            baseTotal = Math.max(sipTotal + urunBazliOdenen, politika.minimumHarcama ?? 0) - urunBazliOdenen;
            break;
        case 'oyun_parasi':
            {
                let oyunUcreti = 0;
                if (politika.saatlikUcretAktif) {
                    const saat = (Date.now() - new Date(session.acilisZamani).getTime()) / 3_600_000;
                    const ceilSaat = Math.max(1, Math.ceil(saat));
                    if (politika.kisiBasiMi) {
                        oyunUcreti = ceilSaat * (politika.saatlikUcret ?? 0) * session.oyuncuSayisi;
                    } else {
                        oyunUcreti = ceilSaat * (politika.saatlikUcret ?? 0);
                    }
                } else {
                    oyunUcreti = politika.sabitUcret ?? 0;
                }
                let oyunUcretiOdenen = 0;
                odenenler.forEach((o)=>{
                    o.urunler?.forEach((u)=>{
                        if (u.menuItemId === 'game-fee') {
                            oyunUcretiOdenen += u.fiyat * u.adet;
                        }
                    });
                });
                oyunUcreti = Math.max(0, oyunUcreti - oyunUcretiOdenen);
                baseTotal = sipTotal + oyunUcreti;
                break;
            }
        default:
            baseTotal = sipTotal;
    }
    return Math.max(0, baseTotal - tutarBazliOdenen);
}
function CafePage() {
    _s();
    const [masalar, setMasalar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [politika, setPolitika] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        mod: 'siparis_bazli'
    });
    const [gorunum, setGorunum] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('harita');
    const [yukleniyor, setYukleniyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tick, setTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0) // zamanlayıcı için
    ;
    const [transferModuAcik, setTransferModuAcik] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [transferSourceMasa, setTransferSourceMasa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isTransferring, setIsTransferring] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const yukle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CafePage.useCallback[yukle]": async ()=>{
            try {
                const [tablesRes, sessionsRes, configRes] = await Promise.all([
                    fetch('/api/tables'),
                    fetch('/api/sessions'),
                    fetch('/api/config')
                ]);
                const tables = await tablesRes.json();
                const sessions = await sessionsRes.json();
                const policy = await configRes.json();
                setPolitika(policy);
                const sessionMap = new Map(sessions.map({
                    "CafePage.useCallback[yukle]": (s)=>[
                            s.masaId,
                            s
                        ]
                }["CafePage.useCallback[yukle]"]));
                setMasalar(tables.map({
                    "CafePage.useCallback[yukle]": (t)=>{
                        const session = sessionMap.get(t.id) ?? null;
                        let durum = 'bos';
                        if (session?.durum === 'hesap_istendi') durum = 'hesap_istendi';
                        else if (session) durum = 'acik';
                        return {
                            config: t,
                            session,
                            durum
                        };
                    }
                }["CafePage.useCallback[yukle]"]));
            } catch (err) {
                console.error('Masalar yüklenemedi', err);
            } finally{
                setYukleniyor(false);
            }
        }
    }["CafePage.useCallback[yukle]"], []);
    // İlk yükleme + 5 saniyede bir otomatik yenile
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CafePage.useEffect": ()=>{
            yukle();
            const interval = setInterval(yukle, 5000);
            return ({
                "CafePage.useEffect": ()=>clearInterval(interval)
            })["CafePage.useEffect"];
        }
    }["CafePage.useEffect"], [
        yukle
    ]);
    // Görünüm tercihi (mount olunca)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CafePage.useEffect": ()=>{
            const kayitliGorunum = localStorage.getItem('okeybill_gorunum');
            if (kayitliGorunum === 'liste' || kayitliGorunum === 'harita') {
                setGorunum(kayitliGorunum);
            }
        }
    }["CafePage.useEffect"], []);
    const handleGorunumDegistir = (yeni)=>{
        setGorunum(yeni);
        localStorage.setItem('okeybill_gorunum', yeni);
    };
    // Timer için (her dakika)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CafePage.useEffect": ()=>{
            const t = setInterval({
                "CafePage.useEffect.t": ()=>setTick({
                        "CafePage.useEffect.t": (n)=>n + 1
                    }["CafePage.useEffect.t"])
            }["CafePage.useEffect.t"], 60_000);
            return ({
                "CafePage.useEffect": ()=>clearInterval(t)
            })["CafePage.useEffect"];
        }
    }["CafePage.useEffect"], []);
    // Aktarma Modunu Aç
    const openTransferMode = (masa)=>{
        if (masa.durum === 'bos') return; // Boş masa aktarılamaz
        setTransferSourceMasa(masa);
        setTransferModuAcik(true);
    };
    // İptal
    const cancelTransferMode = ()=>{
        setTransferModuAcik(false);
        setTransferSourceMasa(null);
    };
    // Aktarma İşlemini Gerçekleştir
    const executeTransfer = async (targetMasaId)=>{
        if (!transferSourceMasa || !targetMasaId) return;
        setIsTransferring(true);
        try {
            const res = await fetch(`/api/sessions/${transferSourceMasa.config.id}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    targetMasaId
                })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Aktarma başarısız');
                return;
            }
            // Başarılı
            setTransferModuAcik(false);
            setTransferSourceMasa(null);
            await yukle(); // Masaları yenile
        } catch (err) {
            console.error(err);
            alert('Aktarma sırasında hata oluştu.');
        } finally{
            setIsTransferring(false);
        }
    };
    if (yukleniyor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "page-title",
                                    children: "Cafe"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "page-subtitle",
                                    children: "Yükleniyor…"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 199,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/islek-app/app/page.tsx",
                            lineNumber: 197,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 16,
                            flexWrap: 'wrap',
                            padding: '24px 0'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/logo-loading.png",
                                alt: "Loading",
                                style: {
                                    height: '64px',
                                    width: 'auto',
                                    marginBottom: '16px',
                                    animation: 'pulse 1.5s ease-in-out infinite'
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--color-text-muted)',
                                    fontSize: 15
                                },
                                children: "Masalar Yükleniyor..."
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 195,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/page.tsx",
            lineNumber: 194,
            columnNumber: 7
        }, this);
    }
    if (masalar.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "page-title",
                                        children: "Cafe"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "page-subtitle",
                                        children: "Masa yerleşimi ve aktif oturumlar"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: yukle,
                                className: "btn btn-ghost btn-sm",
                                children: "↻ Yenile"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state__icon",
                                children: "🪑"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 223,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "empty-state__title",
                                children: "Henüz masa eklenmedi"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "empty-state__desc",
                                children: "Kafenizin masa yerleşimini oluşturmak için Ayarlar > Yerleşim & Masalar bölümünü kullanın."
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/ayarlar?tab=yerlasim",
                                className: "btn btn-primary btn-lg",
                                children: "Masa Ekle"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 222,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/page.tsx",
            lineNumber: 213,
            columnNumber: 7
        }, this);
    }
    // Kanvas sınırlarını hesapla
    const PAD = 24;
    const CHIP_W = 110;
    const CHIP_H = 90;
    const maxX = Math.max(...masalar.map((m)=>m.config.x + CHIP_W)) + PAD;
    const maxY = Math.max(...masalar.map((m)=>m.config.y + CHIP_H)) + PAD;
    const canvasW = Math.max(maxX, 600);
    const canvasH = Math.max(maxY, 400);
    const aktifSayisi = masalar.filter((m)=>m.durum !== 'bos').length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "container page-container",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "page-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header__left",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "page-title",
                                children: "Cafe"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 253,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/app/page.tsx",
                            lineNumber: 252,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "page-header__actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 13,
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 500,
                                    paddingRight: 'var(--space-2)',
                                    borderRight: '1px solid var(--color-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--color-text)',
                                            fontWeight: 600
                                        },
                                        children: aktifSayisi
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this),
                                    " / ",
                                    masalar.length,
                                    " masa aktif"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'var(--space-4)',
                                    fontSize: 13,
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 500
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-empty)',
                                                    display: 'inline-block'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 17
                                            }, this),
                                            "Boş"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-active)',
                                                    display: 'inline-block'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 270,
                                                columnNumber: 17
                                            }, this),
                                            "Dolu"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    background: 'var(--color-bill)',
                                                    display: 'inline-block'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 274,
                                                columnNumber: 17
                                            }, this),
                                            "Hesap"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    background: 'var(--color-surface-2)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: 2,
                                    gap: 2
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleGorunumDegistir('harita'),
                                        className: "btn btn-sm",
                                        style: {
                                            padding: '6px 12px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            background: gorunum === 'harita' ? 'var(--color-accent)' : 'transparent',
                                            color: gorunum === 'harita' ? '#000' : 'var(--color-text-muted)',
                                            transition: 'all var(--transition-fast)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            " Harita"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 288,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleGorunumDegistir('liste'),
                                        className: "btn btn-sm",
                                        style: {
                                            padding: '6px 12px',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: 12,
                                            fontWeight: 600,
                                            background: gorunum === 'liste' ? 'var(--color-accent)' : 'transparent',
                                            color: gorunum === 'liste' ? '#000' : 'var(--color-text-muted)',
                                            transition: 'all var(--transition-fast)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 316,
                                                columnNumber: 17
                                            }, this),
                                            " Liste"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: yukle,
                                className: "btn btn-secondary btn-sm",
                                title: "Yenile",
                                style: {
                                    height: 34,
                                    width: 34,
                                    padding: 0,
                                    minWidth: 'auto'
                                },
                                children: "↻"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 250,
                columnNumber: 9
            }, this),
            transferModuAcik && transferSourceMasa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: '#3b82f6',
                    color: '#fff',
                    padding: 'var(--space-4) var(--space-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
                    animation: 'slideDown 0.3s ease-out'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 13,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                    opacity: 0.9,
                                    marginBottom: 4
                                },
                                children: "Transfer Modu"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 339,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 16,
                                    fontWeight: 500
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: transferSourceMasa.config.ad
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 17
                                    }, this),
                                    " masasını aktarmak için hedef ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "boş bir masaya"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 343,
                                        columnNumber: 94
                                    }, this),
                                    " dokunun."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 342,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 338,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: cancelTransferMode,
                        style: {
                            background: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            cursor: 'pointer'
                        },
                        children: "İptal Et"
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 346,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 326,
                columnNumber: 11
            }, this),
            gorunum === 'liste' ? /* Liste Görünümü */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-4)',
                    paddingBottom: 'var(--space-12)'
                },
                children: masalar.map(({ config, session, durum })=>{
                    const sure = session ? formatSure(hesaplaSureDk(session.acilisZamani)) : null;
                    const toplam = session ? hesaplaToplamClient(session, politika) : 0;
                    void tick;
                    let renkBadge = 'badge-green';
                    let durumText = 'Boş';
                    let cardBorder = '1px solid var(--color-border)';
                    if (durum === 'acik') {
                        renkBadge = 'badge-red';
                        durumText = 'Aktif';
                        cardBorder = '1px solid var(--color-active)';
                    } else if (durum === 'hesap_istendi') {
                        renkBadge = 'badge-yellow';
                        durumText = 'Hesap İstendi';
                        cardBorder = '1px solid var(--color-bill)';
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 'var(--space-4)',
                            transition: 'border-color 0.15s ease, transform 0.15s ease',
                            border: cardBorder
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: 16,
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-text)'
                                                },
                                                children: config.ad
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 398,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 12,
                                                    color: 'var(--color-text-muted)',
                                                    marginTop: 2
                                                },
                                                children: [
                                                    "Kapasite: ",
                                                    config.kapasite,
                                                    " Kişi"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 401,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 397,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `badge ${renkBadge}`,
                                        children: durumText
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 405,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 396,
                                columnNumber: 19
                            }, this),
                            session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                            color: 'var(--color-text-muted)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Açılış Süresi:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)',
                                                    fontVariantNumeric: 'tabular-nums'
                                                },
                                                children: sure
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 414,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 412,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                            color: 'var(--color-text-muted)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Oyuncu Sayısı:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 417,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)'
                                                },
                                                children: [
                                                    session.oyuncuSayisi,
                                                    " Kişi"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: 13,
                                            color: 'var(--color-text-muted)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Siparişler:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 421,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    color: 'var(--color-text)'
                                                },
                                                children: [
                                                    session.siparisler.reduce((t, s)=>t + s.adet, 0),
                                                    " Ürün"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 420,
                                        columnNumber: 23
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderTop: '1px dashed var(--color-border)',
                                            paddingTop: 8,
                                            marginTop: 4,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 600
                                                },
                                                children: "Güncel Tutar:"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 427,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 18,
                                                    fontWeight: 800,
                                                    color: 'var(--color-accent)'
                                                },
                                                children: [
                                                    "₺",
                                                    toplam.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 426,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 411,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 'var(--space-4) 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 13,
                                        color: 'var(--color-text-faint)'
                                    },
                                    children: "Masa Kullanımda Değil"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 435,
                                    columnNumber: 23
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 434,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'var(--space-2)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/masa/${config.id}`,
                                        className: "btn btn-secondary btn-sm",
                                        style: {
                                            flex: 1,
                                            justifyContent: 'center',
                                            opacity: transferModuAcik ? 0.5 : 1,
                                            pointerEvents: transferModuAcik ? 'none' : 'auto'
                                        },
                                        children: session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 36
                                                }, this),
                                                " Detay"
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__["Dices"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 71
                                                }, this),
                                                " Masayı Aç"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 440,
                                        columnNumber: 21
                                    }, this),
                                    session && !transferModuAcik && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>openTransferMode({
                                                config,
                                                session,
                                                durum
                                            }),
                                        className: "btn btn-secondary btn-sm",
                                        style: {
                                            width: 44,
                                            padding: 0,
                                            justifyContent: 'center'
                                        },
                                        title: "Masayı Aktar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__["ArrowRightLeft"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/app/page.tsx",
                                            lineNumber: 454,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 448,
                                        columnNumber: 23
                                    }, this),
                                    durum === 'bos' && transferModuAcik && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>executeTransfer(config.id),
                                        disabled: isTransferring,
                                        className: "btn btn-primary btn-sm",
                                        style: {
                                            flex: 1,
                                            justifyContent: 'center',
                                            background: '#3b82f6',
                                            color: '#fff',
                                            border: 'none'
                                        },
                                        children: "Buraya Aktar"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 458,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/app/page.tsx",
                                lineNumber: 439,
                                columnNumber: 19
                            }, this)
                        ]
                    }, config.id, true, {
                        fileName: "[project]/apps/islek-app/app/page.tsx",
                        lineNumber: 384,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 358,
                columnNumber: 11
            }, this) : /* Harita Görünümü */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    overflowX: 'auto',
                    overflowY: 'auto',
                    paddingBottom: 'var(--space-8)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "cafe-kanvas",
                    style: {
                        position: 'relative',
                        width: '100%',
                        minWidth: canvasW,
                        minHeight: Math.max(canvasH, 600),
                        backgroundColor: transferModuAcik ? 'rgba(59, 130, 246, 0.05)' : 'var(--color-surface)',
                        border: transferModuAcik ? '2px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-xl)',
                        backgroundImage: `
                  linear-gradient(var(--color-border) 1px, transparent 1px),
                  linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
                `,
                        backgroundSize: '40px 40px'
                    },
                    children: masalar.map(({ config, session, durum })=>{
                        const sure = session ? formatSure(hesaplaSureDk(session.acilisZamani)) : null;
                        void tick;
                        const renkMap = {
                            bos: {
                                bg: 'var(--color-empty-dim)',
                                border: 'var(--color-empty)',
                                shadow: 'rgba(34,197,94,0.15)',
                                textColor: 'var(--color-empty)'
                            },
                            acik: {
                                bg: 'var(--color-active-dim)',
                                border: 'var(--color-active)',
                                shadow: 'rgba(239,68,68,0.2)',
                                textColor: 'var(--color-active)'
                            },
                            hesap_istendi: {
                                bg: 'var(--color-bill-dim)',
                                border: 'var(--color-bill)',
                                shadow: 'rgba(234,179,8,0.2)',
                                textColor: 'var(--color-bill)'
                            }
                        };
                        const renk = renkMap[durum];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/masa/${config.id}`,
                            id: `masa-chip-${config.id}`,
                            style: {
                                position: 'absolute',
                                left: config.x,
                                top: config.y,
                                width: CHIP_W,
                                height: CHIP_H,
                                background: renk.bg,
                                border: `2px solid ${renk.border}`,
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: `0 0 20px ${renk.shadow}`,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                textDecoration: 'none',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                userSelect: 'none'
                            },
                            onContextMenu: (e)=>{
                                if (transferModuAcik) {
                                    e.preventDefault();
                                }
                            },
                            onClick: (e)=>{
                                if (transferModuAcik) {
                                    e.preventDefault(); // Linke gitme
                                    if (durum === 'bos') {
                                        executeTransfer(config.id);
                                    } else if (config.id === transferSourceMasa?.config?.id) {
                                        cancelTransferMode(); // Kendisine tıklarsa iptal
                                    }
                                }
                            },
                            onMouseEnter: (e)=>{
                                const el = e.currentTarget;
                                el.style.transform = 'scale(1.06)';
                                el.style.boxShadow = `0 0 32px ${renk.shadow}`;
                            },
                            onMouseLeave: (e)=>{
                                const el = e.currentTarget;
                                el.style.transform = 'scale(1)';
                                el.style.boxShadow = `0 0 20px ${renk.shadow}`;
                            },
                            children: [
                                durum !== 'bos' && !transferModuAcik && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    title: "Masayı Aktar",
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openTransferMode({
                                            config,
                                            session,
                                            durum
                                        });
                                    },
                                    style: {
                                        position: 'absolute',
                                        bottom: 6,
                                        left: 6,
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: 'var(--color-surface)',
                                        color: renk.textColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        transition: 'transform 0.2s ease',
                                        zIndex: 10
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.transform = 'scale(1.15)';
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.transform = 'scale(1)';
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__["ArrowRightLeft"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 603,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 571,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: durum === 'bos' ? 'var(--color-empty)' : durum === 'hesap_istendi' ? 'var(--color-bill)' : 'var(--color-active)'
                                    },
                                    children: durum === 'bos' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__["Armchair"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 42
                                    }, this) : durum === 'hesap_istendi' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 95
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dices$3e$__["Dices"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/app/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 119
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 608,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 12,
                                        fontWeight: 700,
                                        color: durum === 'bos' ? 'var(--color-text)' : renk.textColor,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.4px'
                                    },
                                    children: config.ad
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 613,
                                    columnNumber: 21
                                }, this),
                                durum === 'bos' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 10,
                                        color: 'var(--color-text-muted)'
                                    },
                                    children: [
                                        config.kapasite,
                                        " kişi"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 625,
                                    columnNumber: 23
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: renk.textColor,
                                        fontVariantNumeric: 'tabular-nums'
                                    },
                                    children: sure
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 629,
                                    columnNumber: 23
                                }, this),
                                session && session.siparisler.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        position: 'absolute',
                                        top: -6,
                                        right: -6,
                                        background: renk.border,
                                        color: '#000',
                                        fontSize: 10,
                                        fontWeight: 800,
                                        borderRadius: '50%',
                                        width: 18,
                                        height: 18,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: session.siparisler.reduce((t, s)=>t + s.adet, 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/page.tsx",
                                    lineNumber: 636,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, config.id, true, {
                            fileName: "[project]/apps/islek-app/app/page.tsx",
                            lineNumber: 519,
                            columnNumber: 19
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/apps/islek-app/app/page.tsx",
                    lineNumber: 475,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/app/page.tsx",
                lineNumber: 474,
                columnNumber: 11
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/islek-app/app/page.tsx",
        lineNumber: 249,
        columnNumber: 5
    }, this);
}
_s(CafePage, "hdzU0PwOVqbE4tZOrRSYlKvIv/s=");
_c = CafePage;
var _c;
__turbopack_context__.k.register(_c, "CafePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Map
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
            key: "169xi5"
        }
    ],
    [
        "path",
        {
            d: "M15 5.764v15",
            key: "1pn4in"
        }
    ],
    [
        "path",
        {
            d: "M9 3.236v15",
            key: "1uimfh"
        }
    ]
];
const Map = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("map", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-client] (ecmascript) <export default as Map>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Map",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>List
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 5h.01",
            key: "18ugdj"
        }
    ],
    [
        "path",
        {
            d: "M3 12h.01",
            key: "nlz23k"
        }
    ],
    [
        "path",
        {
            d: "M3 19h.01",
            key: "noohij"
        }
    ],
    [
        "path",
        {
            d: "M8 5h13",
            key: "1pao27"
        }
    ],
    [
        "path",
        {
            d: "M8 12h13",
            key: "1za7za"
        }
    ],
    [
        "path",
        {
            d: "M8 19h13",
            key: "m83p4d"
        }
    ]
];
const List = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("list", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript) <export default as List>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "List",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dices.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Dices
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "12",
            height: "12",
            x: "2",
            y: "10",
            rx: "2",
            ry: "2",
            key: "6agr2n"
        }
    ],
    [
        "path",
        {
            d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",
            key: "1o487t"
        }
    ],
    [
        "path",
        {
            d: "M6 18h.01",
            key: "uhywen"
        }
    ],
    [
        "path",
        {
            d: "M10 14h.01",
            key: "ssrbsk"
        }
    ],
    [
        "path",
        {
            d: "M15 6h.01",
            key: "cblpky"
        }
    ],
    [
        "path",
        {
            d: "M18 9h.01",
            key: "2061c0"
        }
    ]
];
const Dices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("dices", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dices.mjs [app-client] (ecmascript) <export default as Dices>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dices",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dices$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dices.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/receipt.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Receipt
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 17V7",
            key: "pyj7ub"
        }
    ],
    [
        "path",
        {
            d: "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8",
            key: "1elt7d"
        }
    ],
    [
        "path",
        {
            d: "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",
            key: "ycz6yz"
        }
    ]
];
const Receipt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("receipt", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/receipt.mjs [app-client] (ecmascript) <export default as Receipt>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Receipt",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/armchair.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Armchair
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3",
            key: "irtipd"
        }
    ],
    [
        "path",
        {
            d: "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
            key: "1qyhux"
        }
    ],
    [
        "path",
        {
            d: "M5 18v2",
            key: "ppbyun"
        }
    ],
    [
        "path",
        {
            d: "M19 18v2",
            key: "gy7782"
        }
    ]
];
const Armchair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("armchair", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/armchair.mjs [app-client] (ecmascript) <export default as Armchair>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Armchair",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/armchair.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ArrowRightLeft
]);
/**
 * @license lucide-react v1.17.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m16 3 4 4-4 4",
            key: "1x1c3m"
        }
    ],
    [
        "path",
        {
            d: "M20 7H4",
            key: "zbl0bi"
        }
    ],
    [
        "path",
        {
            d: "m8 21-4-4 4-4",
            key: "h9nckh"
        }
    ],
    [
        "path",
        {
            d: "M4 17h16",
            key: "g4d7ey"
        }
    ]
];
const ArrowRightLeft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("arrow-right-left", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.mjs [app-client] (ecmascript) <export default as ArrowRightLeft>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArrowRightLeft",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.mjs [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_0u9m~69._.js.map