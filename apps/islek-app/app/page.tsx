'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Map as MapIcon, List, Dices, Receipt, Armchair, ArrowRightLeft, Building2, RefreshCw } from 'lucide-react'
import type { FloorConfig, TableConfig, TableSession, PricingPolicy } from '@islek/db'

const DEFAULT_FLOOR_ID = 'zemin'
const FLOOR_STORAGE_KEY = 'islek_aktif_kat'

// Süre formatlama (client-safe, lib/pricing'den bağımsız)
function hesaplaSureDk(acilisZamani: string): number {
  return Math.floor((Date.now() - new Date(acilisZamani).getTime()) / 60000)
}

function formatSure(dakika: number): string {
  const s = Math.floor(dakika / 60)
  const dk = dakika % 60
  if (s === 0) return `${dk}dk`
  return `${s}s ${dk}dk`
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

type MasaDurumu = 'bos' | 'acik' | 'hesap_istendi'

interface MasaState {
  config: TableConfig
  session: TableSession | null
  durum: MasaDurumu
}

function normalizeFloors(floors: FloorConfig[]): FloorConfig[] {
  const list = Array.isArray(floors) ? floors.filter((floor) => floor.id) : []
  const hasDefault = list.some((floor) => floor.id === DEFAULT_FLOOR_ID)
  return hasDefault ? list : [{ id: DEFAULT_FLOOR_ID, ad: 'Zemin Kat' }, ...list]
}

function katAdi(floor: FloorConfig, index: number) {
  const ad = floor.ad?.trim()
  if (ad) return ad
  if (floor.id === DEFAULT_FLOOR_ID) return 'Zemin Kat'
  return `${index}. Kat`
}

function katSira(floors: FloorConfig[], floorId: string) {
  return Math.max(1, floors.filter((floor) => floor.id !== DEFAULT_FLOOR_ID).findIndex((floor) => floor.id === floorId) + 1)
}

export default function CafePage() {
  const [masalar, setMasalar] = useState<MasaState[]>([])
  const [katlar, setKatlar] = useState<FloorConfig[]>([{ id: DEFAULT_FLOOR_ID, ad: 'Zemin Kat' }])
  const [aktifKatId, setAktifKatId] = useState(DEFAULT_FLOOR_ID)
  const [politika, setPolitika] = useState<PricingPolicy>({ mod: 'siparis_bazli' })
  const [gorunum, setGorunum] = useState<'liste' | 'harita'>('harita')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [tick, setTick] = useState(0) // zamanlayıcı için

  const [transferModuAcik, setTransferModuAcik] = useState(false)
  const [transferSourceMasa, setTransferSourceMasa] = useState<MasaState | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  const yukle = useCallback(async () => {
    try {
      const [tablesRes, sessionsRes, configRes, floorsRes] = await Promise.all([
        fetch('/api/tables'),
        fetch('/api/sessions'),
        fetch('/api/config'),
        fetch('/api/floors'),
      ])
      const tables: TableConfig[] = await tablesRes.json()
      const sessions: TableSession[] = await sessionsRes.json()
      const policy: PricingPolicy = await configRes.json()
      const floors: FloorConfig[] = await floorsRes.json()
      const floorList = normalizeFloors(Array.isArray(floors) ? floors : [])
      const savedFloor = localStorage.getItem(FLOOR_STORAGE_KEY)
      const nextActiveFloor = savedFloor && floorList.some((floor) => floor.id === savedFloor)
        ? savedFloor
        : DEFAULT_FLOOR_ID

      setPolitika(policy)
      setKatlar(floorList)
      setAktifKatId(nextActiveFloor)
      const sessionMap = new Map(sessions.map((s) => [s.masaId, s]))

      setMasalar(
        tables.map((t) => {
          const config = { ...t, katId: t.katId || DEFAULT_FLOOR_ID }
          const session = sessionMap.get(t.id) ?? null
          let durum: MasaDurumu = 'bos'
          if (session?.durum === 'hesap_istendi') durum = 'hesap_istendi'
          else if (session) durum = 'acik'
          return { config, session, durum }
        })
      )
    } catch (err) {
      console.error('Masalar yüklenemedi', err)
    } finally {
      setYukleniyor(false)
    }
  }, [])

  // İlk yükleme + 5 saniyede bir otomatik yenile
  useEffect(() => {
    yukle()
    const interval = setInterval(yukle, 5000)
    return () => clearInterval(interval)
  }, [yukle])

  // Görünüm tercihi (mount olunca)
  useEffect(() => {
    const kayitliGorunum = localStorage.getItem('islek_gorunum')
    if (kayitliGorunum === 'liste' || kayitliGorunum === 'harita') {
      setGorunum(kayitliGorunum)
    }
  }, [])

  const handleGorunumDegistir = (yeni: 'liste' | 'harita') => {
    setGorunum(yeni)
    localStorage.setItem('islek_gorunum', yeni)
  }

  const handleKatDegistir = (katId: string) => {
    setAktifKatId(katId)
    localStorage.setItem(FLOOR_STORAGE_KEY, katId)
    setTransferModuAcik(false)
    setTransferSourceMasa(null)
  }

  // Timer için (her dakika)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [])

  // Aktarma Modunu Aç
  const openTransferMode = (masa: MasaState) => {
    if (masa.durum === 'bos') return // Boş masa aktarılamaz
    setTransferSourceMasa(masa)
    setTransferModuAcik(true)
  }

  // İptal
  const cancelTransferMode = () => {
    setTransferModuAcik(false)
    setTransferSourceMasa(null)
  }

  // Aktarma İşlemini Gerçekleştir
  const executeTransfer = async (targetMasaId: string) => {
    if (!transferSourceMasa || !targetMasaId) return
    setIsTransferring(true)
    try {
      const res = await fetch(`/api/sessions/${transferSourceMasa.config.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetMasaId })
      })
      
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Aktarma başarısız')
        return
      }
      
      // Başarılı
      setTransferModuAcik(false)
      setTransferSourceMasa(null)
      await yukle() // Masaları yenile
    } catch (err) {
      console.error(err)
      alert('Aktarma sırasında hata oluştu.')
    } finally {
      setIsTransferring(false)
    }
  }

  if (yukleniyor) {
    return (
      <main className="container" style={{ padding: 'var(--space-8) 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <img src="/logo-islek.svg" alt="Loading" style={{ height: '64px', width: 'auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Masalar Yükleniyor...</p>
        </div>
      </main>
    )
  }

  const aktifKat = katlar.find((floor) => floor.id === aktifKatId) ?? katlar[0] ?? { id: DEFAULT_FLOOR_ID, ad: 'Zemin Kat' }
  const aktifKatIndex = aktifKat ? katSira(katlar, aktifKat.id) : 1
  const gorunenMasalar = masalar.filter((masa) => (masa.config.katId || DEFAULT_FLOOR_ID) === aktifKatId)
  const aktifSayisi = gorunenMasalar.filter((m) => m.durum !== 'bos').length
  const katSecici = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      {katlar.map((kat) => {
        const index = katSira(katlar, kat.id)
        return (
          <button
            key={kat.id}
            type="button"
            onClick={() => handleKatDegistir(kat.id)}
            className={`btn btn-sm ${aktifKatId === kat.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Building2 size={15} />
            {katAdi(kat, index)}
          </button>
        )
      })}
    </div>
  )

  if (gorunenMasalar.length === 0) {
    const tumSistemdeMasaYok = masalar.length === 0

    return (
      <main className="container page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Cafe</h1>
              <p className="page-subtitle">{katAdi(aktifKat, aktifKatIndex)} yerleşimi ve aktif oturumlar</p>
            </div>
            <div className="page-header__actions">
              {katSecici}
              <button onClick={yukle} className="btn btn-ghost btn-sm" title="Yenile">
                <RefreshCw size={16} /> Yenile
              </button>
            </div>
          </div>
          <div className="empty-state empty-state--cafe">
            <h2 className="empty-state__title">{tumSistemdeMasaYok ? 'Henüz masa eklenmedi' : 'Bu katta masa yok'}</h2>
            <p className="empty-state__desc">
              {tumSistemdeMasaYok
                ? 'Kafenizin masa yerleşimini oluşturmak için Ayarlar > Yerleşim & Masalar bölümünü kullanın.'
                : `${katAdi(aktifKat, aktifKatIndex)} için masa eklemek veya mevcut masaları düzenlemek üzere Ayarlar > Yerleşim & Masalar bölümünü kullanın.`}
            </p>
            <Link href="/ayarlar?tab=yerlasim" className="btn btn-primary btn-lg">
              Masa Ekle
            </Link>
          </div>
      </main>
    )
  }

  // Kanvas sınırlarını hesapla
  const PAD = 24
  const CHIP_W = 110
  const CHIP_H = 90
  const maxX = Math.max(...gorunenMasalar.map((m) => m.config.x + CHIP_W)) + PAD
  const maxY = Math.max(...gorunenMasalar.map((m) => m.config.y + CHIP_H)) + PAD
  const canvasW = Math.max(maxX, 600)
  const canvasH = Math.max(maxY, 400)

  return (
    <main className="container page-container">
        <div className="page-header">
          <div className="page-header__left">
              <div>
                <h1 className="page-title">Cafe</h1>
                <p className="page-subtitle">{katAdi(aktifKat, aktifKatIndex)} yerleşimi ve aktif oturumlar</p>
              </div>
            </div>

          <div className="page-header__actions">
            {katSecici}

            {/* Masa Özeti */}
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500, paddingRight: 'var(--space-2)', borderRight: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{aktifSayisi}</span> / {gorunenMasalar.length} masa aktif
            </div>

            {/* Lejant */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-empty)', display: 'inline-block' }} />
                Boş
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-active)', display: 'inline-block' }} />
                Dolu
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-bill)', display: 'inline-block' }} />
                Hesap
              </span>
            </div>

            {/* Görünüm Değiştirici Switch */}
            <div style={{
              display: 'flex',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 2,
              gap: 2,
            }}>
              <button
                onClick={() => handleGorunumDegistir('harita')}
                className="btn btn-sm"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  fontWeight: 600,
                  background: gorunum === 'harita' ? 'var(--color-accent)' : 'transparent',
                  color: gorunum === 'harita' ? '#000' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <MapIcon size={16} /> Harita
              </button>
              <button
                onClick={() => handleGorunumDegistir('liste')}
                className="btn btn-sm"
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  fontWeight: 600,
                  background: gorunum === 'liste' ? 'var(--color-accent)' : 'transparent',
                  color: gorunum === 'liste' ? '#000' : 'var(--color-text-muted)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <List size={16} /> Liste
              </button>
            </div>

            <button onClick={yukle} className="btn btn-secondary btn-sm" title="Yenile" style={{ height: 34, width: 34, padding: 0, minWidth: 'auto' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Transfer Modu Bildirim Çubuğu */}
        {transferModuAcik && transferSourceMasa && (
          <div style={{
            background: '#3b82f6', // Mavi bildirim
            color: '#fff',
            padding: 'var(--space-4) var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9, marginBottom: 4 }}>
                Transfer Modu
              </div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>
                <strong>{transferSourceMasa.config.ad}</strong> masasını aktarmak için hedef <strong>boş bir masaya</strong> dokunun.
              </div>
            </div>
            <button 
              onClick={cancelTransferMode}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              İptal Et
            </button>
          </div>
        )}

        {/* ─── Görünüm Panelleri ─── */}
        {gorunum === 'liste' ? (
          /* Liste Görünümü */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            paddingBottom: 'var(--space-12)'
          }}>
            {gorunenMasalar.map(({ config, session, durum }) => {
              const sure = session ? formatSure(hesaplaSureDk(session.acilisZamani)) : null
              const toplam = session ? hesaplaToplamClient(session, politika) : 0
              void tick

              let renkBadge = 'badge-green'
              let durumText = 'Boş'
              let cardBorder = '1px solid var(--color-border)'

              if (durum === 'acik') {
                renkBadge = 'badge-red'
                durumText = 'Aktif'
                cardBorder = '1px solid var(--color-active)'
              } else if (durum === 'hesap_istendi') {
                renkBadge = 'badge-yellow'
                durumText = 'Hesap İstendi'
                cardBorder = '1px solid var(--color-bill)'
              }

              return (
                <div
                  key={config.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                    border: cardBorder,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text)' }}>
                        {config.ad}
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Kapasite: {config.kapasite} Kişi
                      </p>
                    </div>
                    <span className={`badge ${renkBadge}`}>
                      {durumText}
                    </span>
                  </div>

                  {session ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <span>Açılış Süresi:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)', fontVariantNumeric: 'tabular-nums' }}>{sure}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <span>Oyuncu Sayısı:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{session.oyuncuSayisi} Kişi</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)' }}>
                        <span>Siparişler:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                          {session.siparisler.reduce((t, s) => t + s.adet, 0)} Ürün
                        </span>
                      </div>
                      <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Güncel Tutar:</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-accent)' }}>
                          ₺{toplam.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 'var(--space-4) 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-faint)' }}>Masa Kullanımda Değil</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link 
                      href={`/masa/${config.id}`} 
                      className="btn btn-secondary btn-sm" 
                      style={{ flex: 1, justifyContent: 'center', opacity: transferModuAcik ? 0.5 : 1, pointerEvents: transferModuAcik ? 'none' : 'auto' }}
                    >
                      {session ? <><Receipt size={16} /> Detay</> : <><Dices size={16} /> Masayı Aç</>}
                    </Link>
                    {session && !transferModuAcik && (
                      <button 
                        onClick={() => openTransferMode({ config, session, durum })}
                        className="btn btn-secondary btn-sm"
                        style={{ width: 44, padding: 0, justifyContent: 'center' }}
                        title="Masayı Aktar"
                      >
                        <ArrowRightLeft size={16} />
                      </button>
                    )}
                    {durum === 'bos' && transferModuAcik && (
                      <button 
                        onClick={() => executeTransfer(config.id)}
                        disabled={isTransferring}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center', background: '#3b82f6', color: '#fff', border: 'none' }}
                      >
                        Buraya Aktar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Harita Görünümü */
          <div style={{ overflowX: 'auto', overflowY: 'auto', paddingBottom: 'var(--space-8)' }}>
            <div
              id="cafe-kanvas"
              style={{
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
                backgroundSize: '40px 40px',
              }}
            >
              {gorunenMasalar.map(({ config, session, durum }) => {
                const sure = session ? formatSure(hesaplaSureDk(session.acilisZamani)) : null
                void tick

                const renkMap = {
                  bos: {
                    bg: 'var(--color-empty-dim)',
                    border: 'var(--color-empty)',
                    shadow: 'rgba(34,197,94,0.15)',
                    textColor: 'var(--color-empty)',
                  },
                  acik: {
                    bg: 'var(--color-active-dim)',
                    border: 'var(--color-active)',
                    shadow: 'rgba(239,68,68,0.2)',
                    textColor: 'var(--color-active)',
                  },
                  hesap_istendi: {
                    bg: 'var(--color-bill-dim)',
                    border: 'var(--color-bill)',
                    shadow: 'rgba(234,179,8,0.2)',
                    textColor: 'var(--color-bill)',
                  },
                }
                const renk = renkMap[durum]

                return (
                  <Link
                    key={config.id}
                    href={`/masa/${config.id}`}
                    id={`masa-chip-${config.id}`}
                    style={{
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
                      userSelect: 'none',
                    }}
                    onContextMenu={(e) => {
                      if (transferModuAcik) {
                        e.preventDefault()
                      }
                    }}
                    onClick={(e) => {
                      if (transferModuAcik) {
                        e.preventDefault() // Linke gitme
                        if (durum === 'bos') {
                          executeTransfer(config.id)
                        } else if (config.id === transferSourceMasa?.config?.id) {
                          cancelTransferMode() // Kendisine tıklarsa iptal
                        }
                      }
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'scale(1.06)'
                      el.style.boxShadow = `0 0 32px ${renk.shadow}`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.transform = 'scale(1)'
                      el.style.boxShadow = `0 0 20px ${renk.shadow}`
                    }}
                  >
                    {/* Transfer İkonu (Sol Alt) */}
                    {durum !== 'bos' && !transferModuAcik && (
                      <div
                        title="Masayı Aktar"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          openTransferMode({ config, session, durum })
                        }}
                        style={{
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
                          zIndex: 10,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        <ArrowRightLeft size={12} />
                      </div>
                    )}

                    {/* İkon */}
                    <span style={{ color: durum === 'bos' ? 'var(--color-empty)' : durum === 'hesap_istendi' ? 'var(--color-bill)' : 'var(--color-active)' }}>
                      {durum === 'bos' ? <Armchair size={24} /> : durum === 'hesap_istendi' ? <Receipt size={24} /> : <Dices size={24} />}
                    </span>

                    {/* Masa adı */}
                    <span style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: durum === 'bos' ? 'var(--color-text)' : renk.textColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}>
                      {config.ad}
                    </span>

                    {/* Durum / Süre */}
                    {durum === 'bos' ? (
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                        {config.kapasite} kişi
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, fontWeight: 600, color: renk.textColor, fontVariantNumeric: 'tabular-nums' }}>
                        {sure}
                      </span>
                    )}

                    {/* Sipariş sayısı */}
                    {session && session.siparisler.length > 0 && (
                      <span style={{
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
                        justifyContent: 'center',
                      }}>
                        {session.siparisler.reduce((t, s) => t + s.adet, 0)}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
    </main>
  )
}
