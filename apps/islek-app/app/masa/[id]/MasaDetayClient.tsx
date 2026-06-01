'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Armchair, Dices, Receipt, AlertTriangle, Plus, Minus, Check } from 'lucide-react'
import type { TableConfig, TableSession, MenuItem, PricingPolicy, Siparis, Kategori } from '@islek/db'

// ─── Client-safe yardımcılar ──────────────────────────────
function hesaplaSureDk(acilis: string) {
  return Math.floor((Date.now() - new Date(acilis).getTime()) / 60000)
}
function formatSure(dk: number) {
  const s = Math.floor(dk / 60)
  const m = dk % 60
  return s === 0 ? `${m}dk` : `${s}s ${m}dk`
}
function hesaplaToplamClient(session: TableSession, politika: PricingPolicy): number {
  const sipTotal = session.siparisler.reduce((t, s) => t + s.fiyat * s.adet, 0)
  const odenenler = session.odemeler || []
  let urunBazliOdenen = 0
  let tutarBazliOdenen = 0
  
  odenenler.forEach((o: any) => {
    if (o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme')) {
      tutarBazliOdenen += o.tutar
    } else {
      urunBazliOdenen += o.tutar
    }
  })

  let baseTotal = 0
  switch (politika.mod) {
    case 'siparis_bazli':
      baseTotal = sipTotal
      break
    case 'masa_limiti':
      baseTotal = Math.max(sipTotal + urunBazliOdenen, politika.minimumHarcama ?? 0) - urunBazliOdenen
      break
    case 'oyun_parasi': {
      let oyunUcreti = 0
      if (politika.saatlikUcretAktif) {
        const saat = (Date.now() - new Date(session.acilisZamani).getTime()) / 3_600_000
        const ceilSaat = Math.max(1, Math.ceil(saat))
        if (politika.kisiBasiMi) {
          oyunUcreti = ceilSaat * (politika.saatlikUcret ?? 0) * session.oyuncuSayisi
        } else {
          oyunUcreti = ceilSaat * (politika.saatlikUcret ?? 0)
        }
      } else {
        oyunUcreti = politika.sabitUcret ?? 0
      }

      let oyunUcretiOdenen = 0
      odenenler.forEach((o: any) => {
        o.urunler?.forEach((u: any) => {
          if (u.menuItemId === 'game-fee') {
            oyunUcretiOdenen += u.fiyat * u.adet
          }
        })
      })

      oyunUcreti = Math.max(0, oyunUcreti - oyunUcretiOdenen)
      baseTotal = sipTotal + oyunUcreti
      break
    }
    default:
      baseTotal = sipTotal
  }
  return Math.max(0, baseTotal - tutarBazliOdenen)
}
function yeniId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}



// ─── Props ───────────────────────────────────────────────
interface Props { masaId: string }

export default function MasaDetayClient({ masaId }: Props) {
  const router = useRouter()

  const [masaConfig, setMasaConfig]   = useState<TableConfig | null>(null)
  const [session, setSession]         = useState<TableSession | null>(null)
  const [menu, setMenu]               = useState<MenuItem[]>([])
  const [categories, setCategories]   = useState<Kategori[]>([])
  const [politika, setPolitika]       = useState<PricingPolicy>({ mod: 'siparis_bazli' })
  const [yukleniyor, setYukleniyor]   = useState(true)
  const [aktifKat, setAktifKat]       = useState<string>('diğer')
  const [oyuncuSayisi, setOyuncuSayisi] = useState(4)
  const [aciliyor, setAciliyor]       = useState(false)
  const [kapatiliyor, setKapatiliyor] = useState(false)
  const [tick, setTick]               = useState(0)
  const [onayModal, setOnayModal]     = useState(false)
  const [azaltmaOnayId, setAzaltmaOnayId] = useState<string | null>(null)

  // Dakikada bir yenile (timer için)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  const yukle = useCallback(async () => {
    try {
      const [tablesRes, sessionRes, menuRes, configRes, categoriesRes] = await Promise.all([
        fetch('/api/tables'),
        fetch(`/api/sessions/${masaId}`),
        fetch('/api/menu'),
        fetch('/api/config'),
        fetch('/api/categories'),
      ])
      const tables: TableConfig[] = await tablesRes.json()
      const masa = tables.find((t) => t.id === masaId) ?? null
      setMasaConfig(masa)

      const menuData = await menuRes.json()
      setMenu(Array.isArray(menuData) ? menuData : [])
      setPolitika(await configRes.json())

      const catsData = await categoriesRes.json()
      const cats: Kategori[] = Array.isArray(catsData) ? catsData : []
      setCategories(cats)

      if (cats.length > 0) {
        setAktifKat(cats[0].ad)
      } else {
        setAktifKat('diğer')
      }

      if (sessionRes.ok) {
        setSession(await sessionRes.json())
      } else {
        setSession(null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setYukleniyor(false)
    }
  }, [masaId])

  useEffect(() => { yukle() }, [yukle])

  // ─── Masayı Aç ──────────────────────────────────────────
  async function masayiAc() {
    setAciliyor(true)
    const yeniSession: TableSession = {
      masaId,
      acilisZamani: new Date().toISOString(),
      oyuncuSayisi,
      siparisler: [],
      durum: 'acik',
    }
    const res = await fetch(`/api/sessions/${masaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(yeniSession),
    })
    if (res.ok) setSession(yeniSession)
    setAciliyor(false)
  }

  // ─── Sipariş Ekle ───────────────────────────────────────
  async function siparisEkle(item: MenuItem) {
    if (!session) return
    const mevcut = session.siparisler.find((s) => s.menuItemId === item.id)
    let guncel: Siparis[]
    if (mevcut) {
      guncel = session.siparisler.map((s) =>
        s.menuItemId === item.id ? { ...s, adet: s.adet + 1 } : s
      )
    } else {
      guncel = [
        ...session.siparisler,
        { id: yeniId(), menuItemId: item.id, ad: item.ad, fiyat: item.fiyat, adet: 1, zamani: new Date().toISOString() },
      ]
    }
    const updated = { ...session, siparisler: guncel }
    setSession(updated)
    await fetch(`/api/sessions/${masaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  // ─── Sipariş Azalt / Kaldır ─────────────────────────────
  async function siparisAzalt(menuItemId: string) {
    if (!session) return
    const mevcut = session.siparisler.find((s) => s.menuItemId === menuItemId)
    if (!mevcut) return
    const guncel = mevcut.adet <= 1
      ? session.siparisler.filter((s) => s.menuItemId !== menuItemId)
      : session.siparisler.map((s) => s.menuItemId === menuItemId ? { ...s, adet: s.adet - 1 } : s)
    const updated = { ...session, siparisler: guncel }
    setSession(updated)
    await fetch(`/api/sessions/${masaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  // ─── Masayı Kapat ────────────────────────────────────────
  async function masayiKapat() {
    setKapatiliyor(true)
    await fetch(`/api/sessions/${masaId}`, { method: 'DELETE' })
    setOnayModal(false)
    router.push('/')
  }

  // ─── Render ──────────────────────────────────────────────
  if (yukleniyor) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <img src="/logo-islek.svg" alt="Loading" style={{ height: '64px', width: 'auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Masa Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!masaConfig) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: 'var(--space-12)' }}>
          <div className="empty-state__icon"><AlertTriangle size={56} /></div>
          <h2 className="empty-state__title">Masa bulunamadı</h2>
          <Link href="/" className="btn btn-primary">← Cafe'ye Dön</Link>
        </div>
      </div>
    )
  }

  const sure = session ? formatSure(hesaplaSureDk(session.acilisZamani)) : null
  const toplam = session ? hesaplaToplamClient(session, politika) : 0
  void tick // timer tetikleyici

  const menuCategories = categories.map((c) => c.ad)
  const hasDiger = menu.some((m) => m.kategori === 'diğer')
  const availableCategories = hasDiger || categories.length === 0 ? [...menuCategories, 'diğer'] : menuCategories

  const currentAktifKat = availableCategories.includes(aktifKat)
    ? aktifKat
    : (availableCategories[0] || 'diğer')
  const filtreliMenu = menu.filter((m) => m.kategori === currentAktifKat)
  const odenenUrunler = new Map<string, { adet: number; toplamFiyat: number }>()
  const tutarOdemeleri: { yontem: string; tutar: number; zamani: string }[] = []
  if (session?.odemeler) {
    session.odemeler.forEach((odeme) => {
      if (odeme.tip === 'tutar_bazli') {
        tutarOdemeleri.push({
          yontem: odeme.yontem,
          tutar: odeme.tutar,
          zamani: odeme.zamani,
        })
      } else {
        odeme.urunler?.forEach((u) => {
          if (u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme') {
            tutarOdemeleri.push({
              yontem: odeme.yontem,
              tutar: u.fiyat * u.adet,
              zamani: odeme.zamani,
            })
            return
          }
          const key = u.ad
          const varOlan = odenenUrunler.get(key)
          if (varOlan) {
            varOlan.adet += u.adet
            varOlan.toplamFiyat += u.fiyat * u.adet
          } else {
            odenenUrunler.set(key, { adet: u.adet, toplamFiyat: u.fiyat * u.adet })
          }
        })
      }
    })
  }

  return (
    <div className="container page-container">

      {/* Geri + Başlık */}
      <div className="page-header">
        <div className="page-header__left">
          <Link
            href="/"
            className="btn btn-secondary btn-sm"
            style={{ gap: 'var(--space-2)' }}
          >
            ← Geri
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{masaConfig.ad}</h1>
            {session && (
              <div className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-surface-2)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                <span style={{ fontWeight: 600 }}>{session.oyuncuSayisi} kişi</span>
                <span>·</span>
                <span style={{ fontWeight: 600 }}>{sure}</span>
                <span>·</span>
                {session.durum === 'hesap_istendi' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-bill)' }}>
                    <Receipt size={14} /> Hesap İstendi
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-active)' }}>
                    <Dices size={14} /> Oyunda
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Masa Kapalıysa: Açma Formu ─── */}
      {!session && (
        <div style={{ maxWidth: 420, margin: '0 auto', marginTop: 'var(--space-8)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ color: 'var(--color-empty)' }}><Armchair size={48} /></span>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-2)' }}>Bu masa boş</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                Masayı açmak için oyuncu sayısını girin.
              </p>
            </div>

            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="oyuncu-sayisi" className="form-label">Oyuncu Sayısı</label>
              <input
                id="oyuncu-sayisi"
                type="number"
                min={1}
                max={20}
                className="form-input"
                value={oyuncuSayisi === 0 ? '' : oyuncuSayisi}
                placeholder="Oyuncu sayısı girin"
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setOyuncuSayisi(isNaN(val) ? 0 : Math.min(20, val))
                }}
                style={{ textAlign: 'center', fontSize: 24, fontWeight: 700 }}
              />
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
                Maks. 20 kişi
              </span>
            </div>

            <button
              id="masayi-ac-btn"
              className="btn btn-primary btn-lg"
              onClick={masayiAc}
              disabled={aciliyor || oyuncuSayisi === 0}
              style={{ width: '100%', opacity: (aciliyor || oyuncuSayisi === 0) ? 0.6 : 1 }}
            >
              {aciliyor ? 'Açılıyor…' : <><Dices size={18} /> Masayı Aç</>}
            </button>
          </div>
        </div>
      )}

      {/* ─── Masa Açıksa: Sipariş + Hesap ─── */}
      {session && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-6)', alignItems: 'start' }}>

          {/* Sol: Menü */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Menü
              </p>
            </div>

            {/* Kategori Sekmeleri */}
            {availableCategories.length > 0 && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', padding: '0 var(--space-4)', overflowX: 'auto' }}>
                {availableCategories.map((katName) => {
                  const katObj = categories.find((c) => c.ad === katName)
                  const icon = katName === 'diğer' ? '📦' : (katObj?.icon || '🏷️')
                  const label = katName === 'diğer' ? 'Diğer' : katName
                  return (
                    <button
                      key={katName}
                      onClick={() => setAktifKat(katName)}
                      style={{
                        padding: 'var(--space-3) var(--space-4)',
                        fontSize: 13,
                        fontWeight: 500,
                        color: currentAktifKat === katName ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: `2px solid ${currentAktifKat === katName ? 'var(--color-accent)' : 'transparent'}`,
                        marginBottom: -1,
                        background: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.15s, border-color 0.15s',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {icon} {label}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Ürünler */}
            <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {filtreliMenu.length === 0 ? (
                <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
                  Bu kategoride ürün yok
                </p>
              ) : (
                filtreliMenu.map((item) => {
                  const mevcut = session.siparisler.find((s) => s.menuItemId === item.id)
                  const adet = mevcut?.adet ?? 0

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        background: adet > 0 ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                        border: `1px solid ${adet > 0 ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{item.ad}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 600 }}>
                          ₺{item.fiyat.toFixed(2)}
                        </div>
                      </div>

                      {/* Adet kontrolü */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {adet > 0 && (
                          azaltmaOnayId === item.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                              <button
                                onClick={() => {
                                  siparisAzalt(item.id)
                                  setAzaltmaOnayId(null)
                                }}
                                style={{
                                  background: 'var(--color-active)',
                                  border: 'none',
                                  color: '#fff',
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Azaltmayı Onayla
                              </button>
                              <button
                                onClick={() => setAzaltmaOnayId(null)}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--color-border)',
                                  color: 'var(--color-text-muted)',
                                  fontSize: 11,
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                }}
                              >
                                Vazgeç
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAzaltmaOnayId(item.id)}
                              style={{
                                width: 28, height: 28,
                                borderRadius: '50%',
                                background: 'var(--color-surface-3)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                                fontSize: 16,
                                fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                              }}
                            >
                              <Minus size={16} />
                            </button>
                          )
                        )}
                        {adet > 0 && (
                          <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center', color: 'var(--color-accent)' }}>
                            {adet}
                          </span>
                        )}
                        <button
                          id={`ekle-${item.id}`}
                          onClick={() => siparisEkle(item)}
                          style={{
                            width: 28, height: 28,
                            borderRadius: '50%',
                            background: 'var(--color-accent)',
                            border: 'none',
                            color: '#000',
                            fontSize: 18,
                            fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.1s, background 0.15s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}

              {menu.length === 0 && (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 'var(--space-4)' }}>
                    Menü henüz eklenmedi.
                  </p>
                  <Link href="/ayarlar?tab=menu" className="btn btn-secondary btn-sm">
                    Menü Ekle →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sağ: Hesap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: 'calc(var(--navbar-height) + 16px)' }}>

            {/* Aktif Siparişler */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Siparişler
                </p>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {session.siparisler.reduce((t, s) => t + s.adet, 0)} ürün
                </span>
              </div>

              {session.siparisler.length === 0 ? (
                <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-faint)', fontSize: 14 }}>
                  Henüz sipariş yok
                </p>
              ) : (
                <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {session.siparisler.map((s) => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '6px var(--space-2)' }}>
                      <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-accent)', minWidth: 20, textAlign: 'center' }}>
                        {s.adet}×
                      </span>
                      <span style={{ flex: 1, fontSize: 13 }}>{s.ad}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        ₺{(s.fiyat * s.adet).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hesap Özeti */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Hesap Özeti
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {/* Sipariş toplamı */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Siparişler</span>
                  <span>₺{session.siparisler.reduce((t, s) => t + s.fiyat * s.adet, 0).toFixed(2)}</span>
                </div>

                {/* Oyun parası */}
                {politika.mod === 'oyun_parasi' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>
                      Oyun ({sure}{politika.kisiBasiMi ? ` × ${session.oyuncuSayisi} kişi` : ''})
                    </span>
                    <span>
                      ₺{(
                        ((Date.now() - new Date(session.acilisZamani).getTime()) / 3_600_000) *
                        (politika.saatlikUcret ?? 0) *
                        (politika.kisiBasiMi ? session.oyuncuSayisi : 1)
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Min. harcama farkı */}
                {politika.mod === 'masa_limiti' && session.siparisler.reduce((t, s) => t + s.fiyat * s.adet, 0) < (politika.minimumHarcama ?? 0) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Min. harcama farkı</span>
                    <span>₺{((politika.minimumHarcama ?? 0) - session.siparisler.reduce((t, s) => t + s.fiyat * s.adet, 0)).toFixed(2)}</span>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Toplam</span>
                  <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-accent)' }}>
                    ₺{toplam.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                id="hesap-kapat-btn"
                href={`/masa/${masaId}/hesap-kapat`}
                className="btn btn-danger"
                style={{
                  width: '100%',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                <Receipt size={16} /> Ödemeye Geç ve Hesabı Kapat
              </Link>

              {session.odemeler && session.odemeler.length > 0 && (
                <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-2)' }}>
                    <Check size={12} /> Ödenmiş Siparişler
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.5 }}>
                    {Array.from(odenenUrunler.entries()).map(([ad, data]) => (
                      <div key={ad} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>{data.adet}× {ad}</span>
                        <span style={{ color: 'var(--color-text-faint)' }}>₺{data.toplamFiyat.toFixed(2)}</span>
                      </div>
                    ))}
                    {tutarOdemeleri.map((o, idx) => {
                      const yontemMap: Record<string, string> = {
                        nakit: 'Nakit',
                        kredi_karti: 'Kredi Kartı',
                        iban: 'IBAN'
                      }
                      return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontStyle: 'italic' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>₺{o.tutar.toFixed(2)} Tutar Ödemesi ({yontemMap[o.yontem] || o.yontem})</span>
                          <span style={{ color: 'var(--color-text-faint)' }}>₺{o.tutar.toFixed(2)}</span>
                        </div>
                      )
                    })}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Ödenen Toplam</span>
                      <span style={{ color: 'var(--color-text-faint)' }}>
                        ₺{session.odemeler.reduce((sum, o) => sum + o.tutar, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
