(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UcretlendirmeAyarlari
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/context/ToastContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const MOD_SECENEKLERI = [
    {
        value: 'siparis_bazli',
        label: 'Sipariş Bazlı',
        desc: 'Sadece alınan ürünlerin tutarı hesaplanır. Oyun ücreti alınmaz.'
    },
    {
        value: 'oyun_parasi',
        label: 'Oyun Parası',
        desc: 'Saatlik oyun ücreti alınır. Siparişler ayrıca eklenir.'
    },
    {
        value: 'masa_limiti',
        label: 'Masa Limiti',
        desc: 'Masada minimum harcama zorunludur. Sipariş tutarı minimumun altında ise fark alınır.'
    }
];
function UcretlendirmeAyarlari({ onDirtyChange }) {
    _s();
    const [politika, setPolitika] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        mod: 'siparis_bazli'
    });
    const [originalPolitika, setOriginalPolitika] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        mod: 'siparis_bazli'
    });
    const [yukleniyor, setYukleniyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [kaydediliyor, setKaydediliyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UcretlendirmeAyarlari.useEffect": ()=>{
            fetch('/api/config').then({
                "UcretlendirmeAyarlari.useEffect": (r)=>r.json()
            }["UcretlendirmeAyarlari.useEffect"]).then({
                "UcretlendirmeAyarlari.useEffect": (data)=>{
                    if (data && data.mod) {
                        setPolitika(data);
                        setOriginalPolitika(JSON.parse(JSON.stringify(data)));
                    }
                    setYukleniyor(false);
                }
            }["UcretlendirmeAyarlari.useEffect"]).catch({
                "UcretlendirmeAyarlari.useEffect": ()=>setYukleniyor(false)
            }["UcretlendirmeAyarlari.useEffect"]);
        }
    }["UcretlendirmeAyarlari.useEffect"], []);
    const isDirty = JSON.stringify(politika) !== JSON.stringify(originalPolitika);
    // AyarlarClient'a değişiklik durumunu bildir
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UcretlendirmeAyarlari.useEffect": ()=>{
            onDirtyChange?.(isDirty);
        }
    }["UcretlendirmeAyarlari.useEffect"], [
        isDirty,
        onDirtyChange
    ]);
    async function handleKaydet() {
        setKaydediliyor(true);
        try {
            const res = await fetch('/api/config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(politika)
            });
            if (res.ok) {
                setOriginalPolitika(JSON.parse(JSON.stringify(politika)));
                showToast('Ücretlendirme ayarları başarıyla kaydedildi.', 'success');
            } else {
                showToast('Ayarlar kaydedilemedi.', 'error');
            }
        } catch  {
            showToast('Bağlantı hatası oluştu.', 'error');
        } finally{
            setKaydediliyor(false);
        }
    }
    if (yukleniyor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
            },
            children: [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        height: 80,
                        borderRadius: 'var(--radius-lg)'
                    }
                }, i, false, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                    lineNumber: 81,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            maxWidth: 640,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "form-label",
                        children: "Ücretlendirme Modu"
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    MOD_SECENEKLERI.map(({ value, label, desc })=>{
                        const secili = politika.mod === value;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: `mod-${value}`,
                            onClick: ()=>setPolitika((p)=>({
                                        ...p,
                                        mod: value
                                    })),
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-4)',
                                padding: 'var(--space-4) var(--space-5)',
                                background: secili ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                                border: `2px solid ${secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                borderRadius: 'var(--radius-lg)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all var(--transition-fast)',
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: 20,
                                        height: 20,
                                        borderRadius: '50%',
                                        border: `2px solid ${secili ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        background: secili ? 'var(--color-accent)' : 'transparent',
                                        flexShrink: 0,
                                        marginTop: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all var(--transition-fast)'
                                    },
                                    children: secili && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        width: "10",
                                        height: "8",
                                        viewBox: "0 0 10 8",
                                        fill: "none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            d: "M1 4l3 3 5-6",
                                            stroke: "#000",
                                            strokeWidth: "1.5",
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                            lineNumber: 131,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                        lineNumber: 130,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontWeight: 600,
                                                fontSize: 14,
                                                color: secili ? 'var(--color-accent)' : 'var(--color-text)',
                                                marginBottom: 4
                                            },
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 13,
                                                color: 'var(--color-text-muted)',
                                                lineHeight: 1.5
                                            },
                                            children: desc
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, value, true, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            politika.mod === 'oyun_parasi' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-4)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        },
                        children: "Oyun Parası Ayarları"
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "saatlik-ucret-aktif",
                                type: "checkbox",
                                checked: politika.saatlikUcretAktif ?? false,
                                onChange: (e)=>setPolitika((p)=>({
                                            ...p,
                                            saatlikUcretAktif: e.target.checked
                                        })),
                                style: {
                                    accentColor: 'var(--color-accent)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "saatlik-ucret-aktif",
                                style: {
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                },
                                children: "Saatlik Ücret Al"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    politika.saatlikUcretAktif ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "saatlik-ucret",
                                        className: "form-label",
                                        children: "Saatlik Ücret (₺)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "saatlik-ucret",
                                        type: "number",
                                        min: 0,
                                        step: 0.5,
                                        value: politika.saatlikUcret ?? '',
                                        onChange: (e)=>setPolitika((p)=>({
                                                    ...p,
                                                    saatlikUcret: parseFloat(e.target.value) || 0
                                                })),
                                        className: "form-input",
                                        placeholder: "ör. 50"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 170,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "kisi-basi",
                                        className: "form-label",
                                        children: "Ücret Türü"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                        lineNumber: 185,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "kisi-basi",
                                        value: politika.kisiBasiMi ? 'kisi' : 'masa',
                                        onChange: (e)=>setPolitika((p)=>({
                                                    ...p,
                                                    kisiBasiMi: e.target.value === 'kisi'
                                                })),
                                        className: "form-select",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "masa",
                                                children: "Masa Başı"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "kisi",
                                                children: "Kişi Başı"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                                lineNumber: 193,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                        lineNumber: 186,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "form-group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "sabit-ucret",
                                className: "form-label",
                                children: "Sabit Oyun Ücreti (₺)"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 199,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "sabit-ucret",
                                type: "number",
                                min: 0,
                                step: 0.5,
                                value: politika.sabitUcret ?? '',
                                onChange: (e)=>setPolitika((p)=>({
                                            ...p,
                                            sabitUcret: parseFloat(e.target.value) || 0
                                        })),
                                className: "form-input",
                                placeholder: "ör. 30"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                        lineNumber: 198,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                lineNumber: 150,
                columnNumber: 9
            }, this),
            politika.mod === 'masa_limiti' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "min-harcama",
                            className: "form-label",
                            children: "Minimum Harcama (₺)"
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "min-harcama",
                            type: "number",
                            min: 0,
                            step: 1,
                            value: politika.minimumHarcama ?? '',
                            onChange: (e)=>setPolitika((p)=>({
                                        ...p,
                                        minimumHarcama: parseFloat(e.target.value) || 0
                                    })),
                            className: "form-input",
                            placeholder: "ör. 100"
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                    lineNumber: 218,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleKaydet,
                    disabled: !isDirty || kaydediliyor,
                    className: "btn btn-primary",
                    id: "kaydet-ucretlendirme",
                    style: {
                        opacity: !isDirty || kaydediliyor ? 0.5 : 1
                    },
                    children: kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'
                }, void 0, false, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                    lineNumber: 236,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(UcretlendirmeAyarlari, "QlubpqXJSoA44T5IPEoasz8yqd0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = UcretlendirmeAyarlari;
var _c;
__turbopack_context__.k.register(_c, "UcretlendirmeAyarlari");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>YerlasimEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/context/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/armchair.mjs [app-client] (ecmascript) <export default as Armchair>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const CHIP_W = 100;
const CHIP_H = 80;
const CANVAS_W = 900 // Viewport Width
;
const CANVAS_H = 600 // Viewport Height
;
const VIRTUAL_W = 2000 // Virtual Layout Width
;
const VIRTUAL_H = 1500 // Virtual Layout Height
;
const GRID = 20;
function snap(v) {
    return Math.round(v / GRID) * GRID;
}
function yeniId() {
    return `masa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function YerlasimEditor({ onDirtyChange }) {
    _s();
    const [masalar, setMasalar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [originalMasalar, setOriginalMasalar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [yukleniyor, setYukleniyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [kaydediliyor, setKaydediliyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [secili, setSecili] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const draggingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "YerlasimEditor.useEffect": ()=>{
            fetch('/api/tables').then({
                "YerlasimEditor.useEffect": (r)=>r.json()
            }["YerlasimEditor.useEffect"]).then({
                "YerlasimEditor.useEffect": (data)=>{
                    const list = Array.isArray(data) ? data : [];
                    setMasalar(list);
                    setOriginalMasalar(JSON.parse(JSON.stringify(list)));
                    setYukleniyor(false);
                }
            }["YerlasimEditor.useEffect"]).catch({
                "YerlasimEditor.useEffect": ()=>setYukleniyor(false)
            }["YerlasimEditor.useEffect"]);
        }
    }["YerlasimEditor.useEffect"], []);
    const isDirty = JSON.stringify(masalar) !== JSON.stringify(originalMasalar);
    // AyarlarClient'a değişiklik durumunu bildir
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "YerlasimEditor.useEffect": ()=>{
            onDirtyChange?.(isDirty);
        }
    }["YerlasimEditor.useEffect"], [
        isDirty,
        onDirtyChange
    ]);
    // Sürükleme — pointer events kullanıyoruz
    const handlePointerDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "YerlasimEditor.useCallback[handlePointerDown]": (e, masaId)=>{
            e.preventDefault();
            const masa = masalar.find({
                "YerlasimEditor.useCallback[handlePointerDown].masa": (m)=>m.id === masaId
            }["YerlasimEditor.useCallback[handlePointerDown].masa"]);
            if (!masa) return;
            const rect = e.currentTarget.getBoundingClientRect();
            draggingRef.current = {
                id: masaId,
                offsetX: e.clientX - rect.left,
                offsetY: e.clientY - rect.top
            };
            setSecili(masaId);
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    }["YerlasimEditor.useCallback[handlePointerDown]"], [
        masalar
    ]);
    const handlePointerMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "YerlasimEditor.useCallback[handlePointerMove]": (e)=>{
            if (!draggingRef.current || !canvasRef.current) return;
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const { id, offsetX, offsetY } = draggingRef.current;
            // ClientX viewport'a göre + viewport scrollLeft offset'i - chip içindeki pointer kayması
            const rawX = e.clientX - canvasRect.left - offsetX + canvasRef.current.scrollLeft;
            const rawY = e.clientY - canvasRect.top - offsetY + canvasRef.current.scrollTop;
            const x = Math.max(0, Math.min(snap(rawX), VIRTUAL_W - CHIP_W));
            const y = Math.max(0, Math.min(snap(rawY), VIRTUAL_H - CHIP_H));
            setMasalar({
                "YerlasimEditor.useCallback[handlePointerMove]": (prev)=>prev.map({
                        "YerlasimEditor.useCallback[handlePointerMove]": (m)=>m.id === id ? {
                                ...m,
                                x,
                                y
                            } : m
                    }["YerlasimEditor.useCallback[handlePointerMove]"])
            }["YerlasimEditor.useCallback[handlePointerMove]"]);
        }
    }["YerlasimEditor.useCallback[handlePointerMove]"], []);
    const handlePointerUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "YerlasimEditor.useCallback[handlePointerUp]": ()=>{
            draggingRef.current = null;
        }
    }["YerlasimEditor.useCallback[handlePointerUp]"], []);
    function scrollCanvas(dx, dy) {
        if (canvasRef.current) {
            canvasRef.current.scrollBy({
                left: dx,
                top: dy,
                behavior: 'smooth'
            });
        }
    }
    function masaEkle() {
        // Görünür olan ekranın ortasında bir yerde ekle ya da scroll hizasına göre
        const scrollX = canvasRef.current ? canvasRef.current.scrollLeft : 0;
        const scrollY = canvasRef.current ? canvasRef.current.scrollTop : 0;
        const yeni = {
            id: yeniId(),
            ad: `Masa ${masalar.length + 1}`,
            x: snap(scrollX + 100 + masalar.length % 3 * 120),
            y: snap(scrollY + 100 + Math.floor(masalar.length % 9 / 3) * 120),
            kapasite: 4
        };
        setMasalar((prev)=>[
                ...prev,
                yeni
            ]);
        setSecili(yeni.id);
        showToast(`${yeni.ad} eklendi. Kaydetmeyi unutmayın.`, 'info');
    }
    function masaSil(id) {
        const silinen = masalar.find((m)=>m.id === id);
        const ad = silinen ? silinen.ad : 'Masa';
        setMasalar((prev)=>prev.filter((m)=>m.id !== id));
        if (secili === id) setSecili(null);
        showToast(`${ad} silindi. Kaydetmeyi unutmayın.`, 'info');
    }
    function masaGuncelle(id, alan, deger) {
        setMasalar((prev)=>prev.map((m)=>m.id === id ? {
                    ...m,
                    [alan]: deger
                } : m));
    }
    async function handleKaydet() {
        setKaydediliyor(true);
        try {
            const res = await fetch('/api/tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(masalar)
            });
            if (res.ok) {
                setOriginalMasalar(JSON.parse(JSON.stringify(masalar)));
                showToast('Yerleşim başarıyla kaydedildi.', 'success');
            } else {
                showToast('Yerleşim kaydedilemedi.', 'error');
            }
        } catch  {
            showToast('Bağlantı hatası oluştu.', 'error');
        } finally{
            setKaydediliyor(false);
        }
    }
    const seciliMasa = masalar.find((m)=>m.id === secili);
    if (yukleniyor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "skeleton",
            style: {
                height: 400,
                borderRadius: 'var(--radius-lg)'
            }
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
            lineNumber: 158,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "masa-ekle-btn",
                        onClick: masaEkle,
                        className: "btn btn-primary",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                size: 16
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            " Masa Ekle"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 13,
                            color: 'var(--color-text-muted)'
                        },
                        children: [
                            masalar.length,
                            " masa · Masaları kanvasta sürükleyerek yerleştirin · Ok tuşlarıyla kaydırın"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "kaydet-yerlasim",
                            onClick: handleKaydet,
                            disabled: !isDirty || kaydediliyor,
                            className: "btn btn-primary",
                            style: {
                                opacity: !isDirty || kaydediliyor ? 0.5 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            },
                            children: kaydediliyor ? 'Kaydediliyor…' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 180,
                                        columnNumber: 49
                                    }, this),
                                    " Kaydet"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                            lineNumber: 173,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                lineNumber: 165,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 'var(--space-4)',
                    alignItems: 'flex-start'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'relative',
                            width: CANVAS_W,
                            height: CANVAS_H,
                            maxWidth: '100%',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            flexShrink: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "canvas-arrow canvas-arrow--top",
                                onClick: ()=>scrollCanvas(0, -160),
                                title: "Yukarı Kaydır",
                                children: "▲"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "canvas-arrow canvas-arrow--bottom",
                                onClick: ()=>scrollCanvas(0, 160),
                                title: "Aşağı Kaydır",
                                children: "▼"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "canvas-arrow canvas-arrow--left",
                                onClick: ()=>scrollCanvas(-160, 0),
                                title: "Sola Kaydır",
                                children: "◀"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "canvas-arrow canvas-arrow--right",
                                onClick: ()=>scrollCanvas(160, 0),
                                title: "Sağa Kaydır",
                                children: "▶"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: canvasRef,
                                style: {
                                    position: 'absolute',
                                    inset: 0,
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "yerlasim-kanvas-inner",
                                    onPointerMove: handlePointerMove,
                                    onPointerUp: handlePointerUp,
                                    style: {
                                        position: 'absolute',
                                        width: VIRTUAL_W,
                                        height: VIRTUAL_H,
                                        background: 'var(--color-surface)',
                                        backgroundImage: `
                  linear-gradient(var(--color-border) 1px, transparent 1px),
                  linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
                `,
                                        backgroundSize: `${GRID * 2}px ${GRID * 2}px`,
                                        cursor: 'default',
                                        left: 0,
                                        top: 0
                                    },
                                    children: [
                                        masalar.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'absolute',
                                                inset: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                                gap: 'var(--space-3)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--color-text-muted)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__["Armchair"], {
                                                        size: 48
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                        lineNumber: 246,
                                                        columnNumber: 70
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: 14,
                                                        color: 'var(--color-text-muted)'
                                                    },
                                                    children: '"Masa Ekle" butonuna tıklayın'
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                            lineNumber: 237,
                                            columnNumber: 17
                                        }, this),
                                        masalar.map((masa)=>{
                                            const aktif = secili === masa.id;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onPointerDown: (e)=>handlePointerDown(e, masa.id),
                                                onClick: ()=>setSecili(masa.id),
                                                style: {
                                                    position: 'absolute',
                                                    left: masa.x,
                                                    top: masa.y,
                                                    width: CHIP_W,
                                                    height: CHIP_H,
                                                    background: aktif ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                                                    border: `2px solid ${aktif ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 4,
                                                    cursor: 'grab',
                                                    userSelect: 'none',
                                                    touchAction: 'none',
                                                    transition: 'border-color 0.15s, background 0.15s, box-shadow 0.15s',
                                                    boxShadow: aktif ? 'var(--shadow-accent)' : 'none'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: aktif ? 'var(--color-accent)' : 'var(--color-text-muted)'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$armchair$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Armchair$3e$__["Armchair"], {
                                                            size: 24
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 104
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11,
                                                            fontWeight: 700,
                                                            color: aktif ? 'var(--color-accent)' : 'var(--color-text)'
                                                        },
                                                        children: masa.ad
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                        lineNumber: 282,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 10,
                                                            color: 'var(--color-text-muted)'
                                                        },
                                                        children: [
                                                            masa.kapasite,
                                                            " kişi"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, masa.id, true, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    seciliMasa && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card",
                        style: {
                            minWidth: 220,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'var(--color-text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                },
                                children: "Masa Özellikleri"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "masa-ad",
                                        className: "form-label",
                                        children: "Ad"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 306,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "masa-ad",
                                        className: "form-input",
                                        value: seciliMasa.ad,
                                        onChange: (e)=>masaGuncelle(seciliMasa.id, 'ad', e.target.value)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "masa-kapasite",
                                        className: "form-label",
                                        children: "Kapasite"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "masa-kapasite",
                                        type: "number",
                                        min: 1,
                                        max: 20,
                                        className: "form-input",
                                        value: seciliMasa.kapasite,
                                        onChange: (e)=>masaGuncelle(seciliMasa.id, 'kapasite', parseInt(e.target.value) || 1)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: `masa-sil-${seciliMasa.id}`,
                                onClick: ()=>masaSil(seciliMasa.id),
                                className: "btn btn-danger btn-sm",
                                style: {
                                    width: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                        lineNumber: 334,
                                        columnNumber: 15
                                    }, this),
                                    " Masayı Sil"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s(YerlasimEditor, "l5MPxM4aMomR3fkvoxGwSiS0eD8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = YerlasimEditor;
var _c;
__turbopack_context__.k.register(_c, "YerlasimEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MenuEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/context/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript) <export default as List>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function MenuEditor({ onDirtyChange }) {
    _s();
    const [urunler, setUrunler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [originalUrunler, setOriginalUrunler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [kategoriler, setKategoriler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [yeniUrun, setYeniUrun] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        ad: '',
        fiyat: 0,
        kategori: ''
    });
    const [yukleniyor, setYukleniyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [kaydediliyor, setKaydediliyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filtre, setFiltre] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('tumu');
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuEditor.useEffect": ()=>{
            Promise.all([
                fetch('/api/menu').then({
                    "MenuEditor.useEffect": (r)=>r.json()
                }["MenuEditor.useEffect"]),
                fetch('/api/categories').then({
                    "MenuEditor.useEffect": (r)=>r.json()
                }["MenuEditor.useEffect"])
            ]).then({
                "MenuEditor.useEffect": ([menuData, catsData])=>{
                    const menu = Array.isArray(menuData) ? menuData : [];
                    const cats = Array.isArray(catsData) ? catsData : [];
                    setUrunler(menu);
                    setOriginalUrunler(JSON.parse(JSON.stringify(menu)));
                    setKategoriler(cats);
                    setYeniUrun({
                        ad: '',
                        fiyat: 0,
                        kategori: ''
                    });
                    setYukleniyor(false);
                }
            }["MenuEditor.useEffect"]).catch({
                "MenuEditor.useEffect": ()=>setYukleniyor(false)
            }["MenuEditor.useEffect"]);
        }
    }["MenuEditor.useEffect"], []);
    const isDirty = JSON.stringify(urunler) !== JSON.stringify(originalUrunler);
    // AyarlarClient'a değişiklik durumunu bildir
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MenuEditor.useEffect": ()=>{
            onDirtyChange?.(isDirty);
        }
    }["MenuEditor.useEffect"], [
        isDirty,
        onDirtyChange
    ]);
    function urunEkle() {
        if (!yeniUrun.ad.trim() || yeniUrun.fiyat <= 0 || !yeniUrun.kategori) return;
        const yeni = {
            id: `item-${Date.now()}`,
            ...yeniUrun,
            ad: yeniUrun.ad.trim()
        };
        setUrunler((prev)=>[
                ...prev,
                yeni
            ]);
        setYeniUrun({
            ad: '',
            fiyat: 0,
            kategori: ''
        });
        showToast('Ürün listeye eklendi. Kaydetmeyi unutmayın.', 'info');
    }
    function urunSil(id) {
        setUrunler((prev)=>prev.filter((u)=>u.id !== id));
        showToast('Ürün listeden kaldırıldı. Kaydetmeyi unutmayın.', 'info');
    }
    function fiyatGuncelle(id, yeniFiyat) {
        setUrunler((prev)=>prev.map((u)=>u.id === id ? {
                    ...u,
                    fiyat: yeniFiyat
                } : u));
    }
    async function handleKaydet() {
        setKaydediliyor(true);
        try {
            const res = await fetch('/api/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(urunler)
            });
            if (res.ok) {
                setOriginalUrunler(JSON.parse(JSON.stringify(urunler)));
                showToast('Menü başarıyla kaydedildi.', 'success');
            } else {
                showToast('Menü kaydedilemedi.', 'error');
            }
        } catch  {
            showToast('Bağlantı hatası oluştu.', 'error');
        } finally{
            setKaydediliyor(false);
        }
    }
    const hasDiger = urunler.some((u)=>u.kategori === 'diğer');
    const filtreliUrunler = filtre === 'tumu' ? urunler : urunler.filter((u)=>u.kategori === filtre);
    if (yukleniyor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
            },
            children: [
                1,
                2,
                3,
                4
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        height: 56,
                        borderRadius: 'var(--radius-md)'
                    }
                }, i, false, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                    lineNumber: 102,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
            maxWidth: 720
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: 'var(--space-4)'
                        },
                        children: "Yeni Ürün Ekle"
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 160px auto',
                            gap: 'var(--space-3)',
                            alignItems: 'end'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "urun-ad",
                                        className: "form-label",
                                        children: "Ürün Adı"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "urun-ad",
                                        className: "form-input",
                                        placeholder: "ör. Çay, Nescafé...",
                                        value: yeniUrun.ad,
                                        onChange: (e)=>setYeniUrun((p)=>({
                                                    ...p,
                                                    ad: e.target.value
                                                })),
                                        onKeyDown: (e)=>e.key === 'Enter' && urunEkle()
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 118,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "urun-fiyat",
                                        className: "form-label",
                                        children: "Fiyat (₺)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "urun-fiyat",
                                        type: "number",
                                        min: 0,
                                        step: 0.5,
                                        className: "form-input",
                                        placeholder: "0",
                                        value: yeniUrun.fiyat || '',
                                        onChange: (e)=>setYeniUrun((p)=>({
                                                    ...p,
                                                    fiyat: parseFloat(e.target.value) || 0
                                                })),
                                        style: {
                                            width: 100
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 132,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "urun-kategori",
                                        className: "form-label",
                                        children: "Kategori"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        id: "urun-kategori",
                                        className: "form-select",
                                        value: yeniUrun.kategori,
                                        onChange: (e)=>setYeniUrun((p)=>({
                                                    ...p,
                                                    kategori: e.target.value
                                                })),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                disabled: true,
                                                children: "Kategori Seçin"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this),
                                            kategoriler.map((kat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: kat.ad,
                                                    children: kat.ad
                                                }, kat.id, false, {
                                                    fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "diğer",
                                                children: "Diğer"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 157,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "urun-ekle-btn",
                                onClick: urunEkle,
                                className: "btn btn-primary",
                                disabled: !yeniUrun.ad.trim() || yeniUrun.fiyat <= 0 || !yeniUrun.kategori,
                                style: {
                                    marginBottom: 0,
                                    height: 42,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    " Ekle"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-4)',
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 'var(--space-1)',
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFiltre('tumu'),
                                        className: `btn btn-sm ${filtre === 'tumu' ? 'btn-primary' : 'btn-secondary'}`,
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 183,
                                                columnNumber: 15
                                            }, this),
                                            " Tümü"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 178,
                                        columnNumber: 13
                                    }, this),
                                    kategoriler.map((kat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setFiltre(kat.ad),
                                            className: `btn btn-sm ${filtre === kat.ad ? 'btn-primary' : 'btn-secondary'}`,
                                            children: [
                                                kat.icon || '🏷️',
                                                " ",
                                                kat.ad
                                            ]
                                        }, kat.id, true, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                            lineNumber: 186,
                                            columnNumber: 15
                                        }, this)),
                                    (hasDiger || kategoriler.length === 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFiltre('diğer'),
                                        className: `btn btn-sm ${filtre === 'diğer' ? 'btn-primary' : 'btn-secondary'}`,
                                        children: "📦 Diğer"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "kaydet-menu",
                                    onClick: handleKaydet,
                                    disabled: !isDirty || kaydediliyor,
                                    className: "btn btn-primary",
                                    style: {
                                        opacity: !isDirty || kaydediliyor ? 0.5 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    },
                                    children: kaydediliyor ? 'Kaydediliyor…' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 212,
                                                columnNumber: 51
                                            }, this),
                                            " Kaydet"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    filtreliUrunler.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        style: {
                            padding: 'var(--space-10)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state__icon",
                                style: {
                                    color: 'var(--color-text-muted)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                    size: 48
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                    lineNumber: 220,
                                    columnNumber: 93
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "empty-state__title",
                                style: {
                                    fontSize: 16
                                },
                                children: "Bu kategoride ürün yok"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)'
                        },
                        children: filtreliUrunler.map((urun)=>{
                            const kat = kategoriler.find((k)=>k.ad === urun.kategori);
                            const icon = urun.kategori === 'diğer' ? '📦' : kat?.icon || '🏷️';
                            const label = urun.kategori === 'diğer' ? 'Diğer' : urun.kategori;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    transition: 'border-color var(--transition-fast)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 18,
                                            flexShrink: 0
                                        },
                                        children: icon
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 243,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            flex: 1,
                                            fontSize: 14,
                                            fontWeight: 500
                                        },
                                        children: urun.ad
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 245,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)',
                                            background: 'var(--color-surface-2)',
                                            color: 'var(--color-text-muted)',
                                            fontWeight: 500
                                        },
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 247,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: 0,
                                                step: 0.5,
                                                value: urun.fiyat,
                                                onChange: (e)=>fiyatGuncelle(urun.id, parseFloat(e.target.value) || 0),
                                                style: {
                                                    width: 70,
                                                    background: 'var(--color-surface-2)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '4px 8px',
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: 'var(--color-accent)',
                                                    outline: 'none',
                                                    textAlign: 'right'
                                                },
                                                "aria-label": `${urun.ad} fiyatı`
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 260,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 12,
                                                    color: 'var(--color-text-muted)'
                                                },
                                                children: "₺"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                                lineNumber: 280,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 259,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>urunSil(urun.id),
                                        className: "btn btn-ghost btn-sm",
                                        "aria-label": `${urun.ad} sil`,
                                        style: {
                                            color: 'var(--color-active)',
                                            padding: '4px 8px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                            lineNumber: 289,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                        lineNumber: 283,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, urun.id, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                                lineNumber: 230,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                        lineNumber: 224,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s(MenuEditor, "akfDh5E37Ydi1B6d8nOGRInPkD4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = MenuEditor;
var _c;
__turbopack_context__.k.register(_c, "MenuEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>KategoriYonetimi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/context/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.mjs [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const VARSAYILAN_IKONLAR = [
    '☕',
    '🫖',
    '🍵',
    '🥤',
    '🍹',
    '🧃',
    '💧',
    '🍔',
    '🍕',
    '🌯',
    '🥪',
    '🍝',
    '🍟',
    '🍳',
    '🫓',
    '🥗',
    '🍉',
    '🥜',
    '🍰',
    '🧇',
    '💨',
    '🎲',
    '🃏',
    '🎱'
];
function KategoriYonetimi({ onDirtyChange }) {
    _s();
    const [kategoriler, setKategoriler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [originalKategoriler, setOriginalKategoriler] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [yeniAd, setYeniAd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [yeniIcon, setYeniIcon] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('🏷️');
    const [yukleniyor, setYukleniyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [kaydediliyor, setKaydediliyor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    // Emojipicker ve silme onay durumu
    const [activePickerId, setActivePickerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null) // 'yeni' veya kategori.id
    ;
    const [deleteConfirmId, setDeleteConfirmId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KategoriYonetimi.useEffect": ()=>{
            fetch('/api/categories').then({
                "KategoriYonetimi.useEffect": (r)=>r.json()
            }["KategoriYonetimi.useEffect"]).then({
                "KategoriYonetimi.useEffect": (data)=>{
                    const cats = Array.isArray(data) ? data : [];
                    setKategoriler(cats);
                    setOriginalKategoriler(JSON.parse(JSON.stringify(cats)));
                    setYukleniyor(false);
                }
            }["KategoriYonetimi.useEffect"]).catch({
                "KategoriYonetimi.useEffect": ()=>setYukleniyor(false)
            }["KategoriYonetimi.useEffect"]);
        }
    }["KategoriYonetimi.useEffect"], []);
    // Değişiklik olup olmadığını kontrol et (dirty state)
    const isDirty = JSON.stringify(kategoriler) !== JSON.stringify(originalKategoriler);
    const isDuplicate = kategoriler.some((c)=>c.ad.toLowerCase() === yeniAd.trim().toLowerCase());
    // AyarlarClient'a değişiklik durumunu bildir
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KategoriYonetimi.useEffect": ()=>{
            onDirtyChange?.(isDirty);
        }
    }["KategoriYonetimi.useEffect"], [
        isDirty,
        onDirtyChange
    ]);
    // Emoji Seçici Dış Tıklama Kapatma Listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "KategoriYonetimi.useEffect": ()=>{
            if (activePickerId === null) return;
            function handleOutsideClick(e) {
                const target = e.target;
                if (!target.closest('.emoji-picker-trigger') && !target.closest('.emoji-picker-popup')) {
                    setActivePickerId(null);
                }
            }
            document.addEventListener('click', handleOutsideClick);
            return ({
                "KategoriYonetimi.useEffect": ()=>{
                    document.removeEventListener('click', handleOutsideClick);
                }
            })["KategoriYonetimi.useEffect"];
        }
    }["KategoriYonetimi.useEffect"], [
        activePickerId
    ]);
    function kategoriEkle() {
        if (!yeniAd.trim()) return;
        const adTemiz = yeniAd.trim();
        const duplicate = kategoriler.some((c)=>c.ad.toLowerCase() === adTemiz.toLowerCase());
        if (duplicate) {
            showToast('Bu isimde bir kategori zaten mevcut!', 'error');
            return;
        }
        const yeni = {
            id: `cat-${Date.now()}`,
            ad: adTemiz,
            icon: yeniIcon.trim() || '🏷️'
        };
        setKategoriler((prev)=>[
                ...prev,
                yeni
            ]);
        setYeniAd('');
        setYeniIcon('🏷️');
        showToast('Kategori listeye eklendi. Kaydetmeyi unutmayın.', 'info');
    }
    function kategoriSil(id) {
        setKategoriler((prev)=>prev.filter((c)=>c.id !== id));
        showToast('Kategori listeden kaldırıldı. Kaydetmeyi unutmayın.', 'info');
    }
    function alanGuncelle(id, alan, deger) {
        setKategoriler((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    [alan]: deger
                } : c));
    }
    async function handleKaydet() {
        setKaydediliyor(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(kategoriler)
            });
            if (res.ok) {
                setOriginalKategoriler(JSON.parse(JSON.stringify(kategoriler)));
                showToast('Kategoriler başarıyla kaydedildi.', 'success');
            } else {
                showToast('Kategoriler kaydedilemedi.', 'error');
            }
        } catch  {
            showToast('Bağlantı hatası oluştu.', 'error');
        } finally{
            setKaydediliyor(false);
        }
    }
    if (yukleniyor) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)'
            },
            children: [
                1,
                2,
                3
            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "skeleton",
                    style: {
                        height: 56,
                        borderRadius: 'var(--radius-md)'
                    }
                }, i, false, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                    lineNumber: 145,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
            lineNumber: 143,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)',
            maxWidth: 720
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                style: {
                    position: 'relative'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            marginBottom: 'var(--space-4)'
                        },
                        children: "Yeni Kategori Ekle"
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '80px 1fr auto',
                            gap: 'var(--space-3)',
                            alignItems: 'end'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                style: {
                                    position: 'relative'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "kat-icon",
                                        className: "form-label",
                                        children: "İkon"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        id: "kat-icon",
                                        type: "button",
                                        className: "form-input emoji-picker-trigger",
                                        onClick: ()=>setActivePickerId(activePickerId === 'yeni' ? null : 'yeni'),
                                        style: {
                                            height: 42,
                                            fontSize: 20,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            background: 'var(--color-surface-2)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            width: '100%'
                                        },
                                        children: yeniIcon
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    activePickerId === 'yeni' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "emoji-picker-popup",
                                        style: {
                                            position: 'absolute',
                                            top: '100%',
                                            left: 0,
                                            background: 'var(--color-surface-3)',
                                            border: '1px solid var(--color-border-hover)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: 'var(--space-2)',
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            gap: 'var(--space-1)',
                                            zIndex: 200,
                                            boxShadow: 'var(--shadow-lg)',
                                            width: '210px',
                                            marginTop: '4px'
                                        },
                                        children: VARSAYILAN_IKONLAR.map((icon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setYeniIcon(icon);
                                                    setActivePickerId(null);
                                                },
                                                style: {
                                                    fontSize: 20,
                                                    padding: '6px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                className: "btn-ghost",
                                                children: icon
                                            }, icon, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 205,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 185,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        htmlFor: "kat-ad",
                                        className: "form-label",
                                        children: "Kategori Adı"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 231,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "kat-ad",
                                        className: "form-input",
                                        placeholder: "ör. Tatlılar, Sıcak İçecekler...",
                                        value: yeniAd,
                                        onChange: (e)=>setYeniAd(e.target.value),
                                        onKeyDown: (e)=>e.key === 'Enter' && kategoriEkle()
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 232,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "kat-ekle-btn",
                                onClick: kategoriEkle,
                                className: "btn btn-primary",
                                disabled: !yeniAd.trim() || isDuplicate,
                                style: {
                                    marginBottom: 0,
                                    height: 42,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this),
                                    " Ekle"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            marginBottom: 'var(--space-4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: 'var(--color-text-muted)'
                                },
                                children: [
                                    "Kategoriler (",
                                    kategoriler.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    id: "kaydet-categories",
                                    onClick: handleKaydet,
                                    disabled: !isDirty || kaydediliyor,
                                    className: "btn btn-primary",
                                    style: {
                                        opacity: !isDirty || kaydediliyor ? 0.5 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    },
                                    children: kaydediliyor ? 'Kaydediliyor…' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                size: 16
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 269,
                                                columnNumber: 51
                                            }, this),
                                            " Kaydet"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                    lineNumber: 262,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    kategoriler.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "empty-state",
                        style: {
                            padding: 'var(--space-10)',
                            border: '1px dashed var(--color-border)',
                            borderRadius: 'var(--radius-lg)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "empty-state__icon",
                                children: "🏷️"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "empty-state__title",
                                style: {
                                    fontSize: 16
                                },
                                children: "Henüz kategori oluşturulmadı"
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "empty-state__desc",
                                style: {
                                    fontSize: 13
                                },
                                children: "Menü ürünlerini sınıflandırmak için yukarıdan ilk kategorinizi ekleyin."
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 278,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-2)'
                        },
                        children: kategoriler.map((kat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-4)',
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    position: 'relative'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'relative'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "emoji-picker-trigger",
                                                onClick: ()=>setActivePickerId(activePickerId === kat.id ? null : kat.id),
                                                style: {
                                                    width: 50,
                                                    height: 42,
                                                    background: 'var(--color-surface-2)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 20,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                },
                                                children: kat.icon || '🏷️'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 298,
                                                columnNumber: 19
                                            }, this),
                                            activePickerId === kat.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "emoji-picker-popup",
                                                style: {
                                                    position: 'absolute',
                                                    top: '100%',
                                                    left: 0,
                                                    background: 'var(--color-surface-3)',
                                                    border: '1px solid var(--color-border-hover)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: 'var(--space-2)',
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                                    gap: 'var(--space-1)',
                                                    zIndex: 200,
                                                    boxShadow: 'var(--shadow-lg)',
                                                    width: '210px',
                                                    marginTop: '4px'
                                                },
                                                children: VARSAYILAN_IKONLAR.map((icon)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            alanGuncelle(kat.id, 'icon', icon);
                                                            setActivePickerId(null);
                                                        },
                                                        style: {
                                                            fontSize: 20,
                                                            padding: '6px',
                                                            borderRadius: 'var(--radius-sm)',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        },
                                                        className: "btn-ghost",
                                                        children: icon
                                                    }, icon, false, {
                                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 297,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: kat.ad,
                                        onChange: (e)=>alanGuncelle(kat.id, 'ad', e.target.value),
                                        style: {
                                            flex: 1,
                                            background: 'var(--color-surface-2)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '8px var(--space-3)',
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: 'var(--color-text)',
                                            outline: 'none'
                                        },
                                        "aria-label": `${kat.ad} adı`
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 365,
                                        columnNumber: 17
                                    }, this),
                                    deleteConfirmId === kat.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 'var(--space-2)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    kategoriSil(kat.id);
                                                    setDeleteConfirmId(null);
                                                },
                                                className: "btn btn-danger btn-sm",
                                                style: {
                                                    background: 'var(--color-active)',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    padding: '8px 12px',
                                                    fontSize: '12px',
                                                    borderRadius: 'var(--radius-md)'
                                                },
                                                children: "Silme İşlemini Tamamla"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 386,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setDeleteConfirmId(null),
                                                className: "btn btn-secondary btn-sm",
                                                style: {
                                                    padding: '8px 12px',
                                                    fontSize: '12px',
                                                    borderRadius: 'var(--radius-md)'
                                                },
                                                children: "Vazgeç"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                                lineNumber: 403,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 385,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setDeleteConfirmId(kat.id),
                                        className: "btn btn-ghost btn-sm",
                                        "aria-label": `${kat.ad} sil`,
                                        style: {
                                            color: 'var(--color-active)',
                                            padding: '4px 8px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                            lineNumber: 418,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                        lineNumber: 412,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, kat.id, true, {
                                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                                lineNumber: 283,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                        lineNumber: 281,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card",
                style: {
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 13,
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.6
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            size: 16,
                            style: {
                                display: 'inline',
                                verticalAlign: 'middle',
                                marginRight: '4px',
                                color: 'var(--color-accent)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                            lineNumber: 429,
                            columnNumber: 11
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Bilgi:"
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                            lineNumber: 429,
                            columnNumber: 135
                        }, this),
                        " Bir kategoriyi sildiğinizde, o kategoriye ait tüm menü ürünleri otomatik olarak ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: '"diğer"'
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                            lineNumber: 429,
                            columnNumber: 239
                        }, this),
                        " kategorisine taşınır. Bir kategorinin adını değiştirdiğinizde, tüm ürünlerin kategorisi yeni adla güncellenir."
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                    lineNumber: 428,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(KategoriYonetimi, "B1qBdMivJPoRS21x8gDK6Yj+5m4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$context$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = KategoriYonetimi;
var _c;
__turbopack_context__.k.register(_c, "KategoriYonetimi");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AyarlarClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/banknote.mjs [app-client] (ecmascript) <export default as Banknote>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map.mjs [app-client] (ecmascript) <export default as Map>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.mjs [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$UcretlendirmeAyarlari$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/components/ayarlar/UcretlendirmeAyarlari.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$YerlasimEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/components/ayarlar/YerlasimEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$MenuEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/components/ayarlar/MenuEditor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$KategoriYonetimi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/islek-app/components/ayarlar/KategoriYonetimi.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const TABS = [
    {
        id: 'ucretlendirme',
        label: 'Ücretlendirme Politikası',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__["Banknote"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
            lineNumber: 14,
            columnNumber: 67
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'yerlasim',
        label: 'Yerleşim & Masalar',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Map$3e$__["Map"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
            lineNumber: 15,
            columnNumber: 67
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'menu',
        label: 'Menü',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
            lineNumber: 16,
            columnNumber: 67
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'kategori',
        label: 'Ürün Kategori Yönetimi',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
            lineNumber: 17,
            columnNumber: 67
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function AyarlarClient() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const activeTab = searchParams.get('tab') ?? 'ucretlendirme';
    const [isCurrentTabDirty, setIsCurrentTabDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmModal, setShowConfirmModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingTab, setPendingTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Sekme değiştiğinde dirty state'i temizle
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AyarlarClient.useEffect": ()=>{
            setIsCurrentTabDirty(false);
        }
    }["AyarlarClient.useEffect"], [
        activeTab
    ]);
    function handleTabClick(tab) {
        if (activeTab === tab) return;
        if (isCurrentTabDirty) {
            setPendingTab(tab);
            setShowConfirmModal(true);
        } else {
            router.push(`/ayarlar?tab=${tab}`);
        }
    }
    function confirmTabSwitch() {
        if (pendingTab) {
            router.push(`/ayarlar?tab=${pendingTab}`);
        }
        setIsCurrentTabDirty(false);
        setShowConfirmModal(false);
        setPendingTab(null);
    }
    function cancelTabSwitch() {
        setShowConfirmModal(false);
        setPendingTab(null);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "settings-tabs",
                role: "tablist",
                "aria-label": "Ayarlar sekmeleri",
                children: TABS.map(({ id, label, icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: `tab-${id}`,
                        role: "tab",
                        "aria-selected": activeTab === id,
                        "aria-controls": `panel-${id}`,
                        className: `settings-tab${activeTab === id ? ' active' : ''}`,
                        onClick: ()=>handleTabClick(id),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": "true",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                children: icon
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this)
                        ]
                    }, id, true, {
                        fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: `panel-${activeTab}`,
                role: "tabpanel",
                "aria-labelledby": `tab-${activeTab}`,
                children: [
                    activeTab === 'ucretlendirme' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$UcretlendirmeAyarlari$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onDirtyChange: setIsCurrentTabDirty
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                        lineNumber: 82,
                        columnNumber: 43
                    }, this),
                    activeTab === 'yerlasim' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$YerlasimEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onDirtyChange: setIsCurrentTabDirty
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                        lineNumber: 83,
                        columnNumber: 43
                    }, this),
                    activeTab === 'menu' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$MenuEditor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onDirtyChange: setIsCurrentTabDirty
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                        lineNumber: 84,
                        columnNumber: 43
                    }, this),
                    activeTab === 'kategori' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$islek$2d$app$2f$components$2f$ayarlar$2f$KategoriYonetimi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onDirtyChange: setIsCurrentTabDirty
                    }, void 0, false, {
                        fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                        lineNumber: 85,
                        columnNumber: 43
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            showConfirmModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    padding: 'var(--space-4)'
                },
                onClick: (e)=>{
                    if (e.target === e.currentTarget) cancelTabSwitch();
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "card",
                    style: {
                        maxWidth: 420,
                        width: '100%',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-5)',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                color: 'var(--color-accent)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 48
                            }, void 0, false, {
                                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                lineNumber: 120,
                                columnNumber: 102
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: 18,
                                        fontWeight: 700,
                                        marginBottom: 'var(--space-2)'
                                    },
                                    children: "Kaydedilmemiş Değişiklikler Var!"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 14,
                                        color: 'var(--color-text-muted)',
                                        lineHeight: 1.6
                                    },
                                    children: "Yaptığınız değişiklikleri kaydetmediniz. Başka bir sekmeye geçerseniz bu değişiklikler kaybolacaktır."
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 'var(--space-3)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-secondary",
                                    style: {
                                        flex: 1
                                    },
                                    onClick: cancelTabSwitch,
                                    children: "Geri Dön"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                    lineNumber: 130,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-danger",
                                    style: {
                                        flex: 1,
                                        background: 'var(--color-active)',
                                        color: '#fff'
                                    },
                                    onClick: confirmTabSwitch,
                                    children: "Değişiklikleri At"
                                }, void 0, false, {
                                    fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/islek-app/app/ayarlar/AyarlarClient.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(AyarlarClient, "MsFEG8GNdtpE8cGXwjhZnRfrzww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AyarlarClient;
var _c;
__turbopack_context__.k.register(_c, "AyarlarClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_islek-app_0065pe8._.js.map