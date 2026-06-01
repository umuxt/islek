'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Banknote, CreditCard, Building, Check, HelpCircle, Tags, ShoppingCart } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import type { TableConfig, TableSession, MenuItem, PricingPolicy, Kategori } from '@islek/db'
import { clientCache } from '@/lib/clientCache'

interface Props {
  masaId: string
}

interface SelectedItem {
  menuItemId: string
  ad: string
  fiyat: number
  adet: number
  kategori: string
}

export default function HesapKapatClient({ masaId }: Props) {
  const router = useRouter()
  const { showToast } = useToast()

  const [masaConfig, setMasaConfig] = useState<TableConfig | null>(null)
  const [session, setSession] = useState<TableSession | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Kategori[]>([])
  const [politika, setPolitika] = useState<PricingPolicy>({ mod: 'siparis_bazli' })
  const [yukleniyor, setYukleniyor] = useState(true)

  // 1. Kolon: Kalan (Ödenmemiş) Ürünler listesi
  const [remainingItems, setRemainingItems] = useState<SelectedItem[]>([])
  // 2. Kolon: Ödeme için seçilenler
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  // 3. Kolon: Ödeme yöntemi ve durumları
  const [odemeYontemi, setOdemeYontemi] = useState<'nakit' | 'kredi_karti' | 'iban'>('nakit')
  const [masayiKapatOnay, setMasayiKapatOnay] = useState(false)
  const [odemeYapiliyor, setOdemeYapiliyor] = useState(false)
  const [paymentMode, setPaymentMode] = useState<'urun_bazli' | 'tutar_bazli'>('urun_bazli')
  const [customAmount, setCustomAmount] = useState<string>('')

  const yukle = useCallback(async (forceUpdate = false) => {
    const force = typeof forceUpdate === 'boolean' ? forceUpdate : false
    try {
      const [tables, sessionRes, menu, policy, categories] = await Promise.all([
        clientCache.fetchTables(force),
        fetch(`/api/sessions/${masaId}`),
        clientCache.fetchMenu(force),
        clientCache.fetchConfig(force),
        clientCache.fetchCategories(force),
      ])
      
      const config = tables.find((t) => t.id === masaId) ?? null
      setMasaConfig(config)

      const currentMenu: MenuItem[] = Array.isArray(menu) ? menu : []
      setMenu(currentMenu)

      const activePolicy: PricingPolicy = policy
      setPolitika(activePolicy)

      setCategories(Array.isArray(categories) ? categories : [])

      if (sessionRes.ok) {
        const activeSession: TableSession = await sessionRes.json()
        setSession(activeSession)
        
        if (activeSession.odemeler?.some((o: any) => o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme'))) {
          setPaymentMode('tutar_bazli')
        }

        // Siparişleri ve sanal ücretleri 'remainingItems' olarak ilklendir
        const items: SelectedItem[] = []

        // Gerçek ürün siparişlerini ekle
        activeSession.siparisler.forEach((sip) => {
          // Kategoriyi menüden bulalım
          const menuItem = currentMenu.find((m) => m.id === sip.menuItemId)
          const kategori = menuItem?.kategori || 'diğer'
          items.push({
            menuItemId: sip.menuItemId,
            ad: sip.ad,
            fiyat: sip.fiyat,
            adet: sip.adet,
            kategori,
          })
        })

        // Oyun parası modundaysa dinamik oyun ücretini sanal ürün olarak ekle
        if (activePolicy.mod === 'oyun_parasi') {
          let oyunUcreti = 0
          if (activePolicy.saatlikUcretAktif) {
            const acilis = new Date(activeSession.acilisZamani).getTime()
            const saat = (Date.now() - acilis) / 3_600_000
            const ceilSaat = Math.max(1, Math.ceil(saat))
            
            if (activePolicy.kisiBasiMi) {
              oyunUcreti = ceilSaat * (activePolicy.saatlikUcret ?? 0) * activeSession.oyuncuSayisi
            } else {
              oyunUcreti = ceilSaat * (activePolicy.saatlikUcret ?? 0)
            }
          } else {
            oyunUcreti = activePolicy.sabitUcret ?? 0
          }
          
          let oyunUcretiOdenen = 0
          activeSession.odemeler?.forEach((o: any) => {
            o.urunler?.forEach((u: any) => {
              if (u.menuItemId === 'game-fee') {
                oyunUcretiOdenen += u.fiyat * u.adet
              }
            })
          })

          oyunUcreti = Math.max(0, oyunUcreti - oyunUcretiOdenen)
          
          if (oyunUcreti > 0) {
            items.push({
              menuItemId: 'game-fee',
              ad: 'Oyun Ücreti',
              fiyat: Number(oyunUcreti.toFixed(2)),
              adet: 1,
              kategori: 'Masa Ücretleri',
            })
          }
        }

        // Limit bazlı moddaysa minimum harcama farkını sanal ürün olarak ekle
        if (activePolicy.mod === 'masa_limiti') {
          const odenenler = activeSession.odemeler || []
          let urunBazliOdenen = 0
          odenenler.forEach((o: any) => {
            if (!(o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme'))) {
              urunBazliOdenen += o.tutar
            }
          })
          const toplamSiparis = activeSession.siparisler.reduce((s, o) => s + o.fiyat * o.adet, 0)
          const toplamHarcama = urunBazliOdenen + toplamSiparis
          const minSpend = activePolicy.minimumHarcama ?? 0
          const fark = minSpend - toplamHarcama
          if (fark > 0) {
            items.push({
              menuItemId: 'min-difference',
              ad: 'Min. Harcama Farkı',
              fiyat: Number(fark.toFixed(2)),
              adet: 1,
              kategori: 'Masa Ücretleri',
            })
          }
        }

        setRemainingItems(items)
      } else {
        setSession(null)
      }
    } catch (e) {
      console.error(e)
      showToast('Veriler yüklenirken hata oluştu', 'error')
    } finally {
      setYukleniyor(false)
    }
  }, [masaId, showToast])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    yukle()
  }, [yukle])

  // Kolon 1'den Kolon 2'ye aktarma (Siparişten azaltıp checkouta ekleme)
  const secimeEkle = (item: SelectedItem) => {
    // Kalan listedeki adeti 1 azalt
    setRemainingItems((prev) =>
      prev.map((r) => (r.menuItemId === item.menuItemId ? { ...r, adet: r.adet - 1 } : r))
    )

    // Seçilenler listesindeki adeti 1 artır
    setSelectedItems((prev) => {
      const mevcut = prev.find((s) => s.menuItemId === item.menuItemId)
      if (mevcut) {
        return prev.map((s) => (s.menuItemId === item.menuItemId ? { ...s, adet: s.adet + 1 } : s))
      } else {
        return [...prev, { ...item, adet: 1 }]
      }
    })
  }

  // Oyun ücretini N'e böl
  const bolOyunUcreti = (n: number) => {
    const selected = selectedItems.find(s => s.menuItemId === 'game-fee')
    if (selected) {
      showToast('Lütfen önce ödeme listesindeki oyun ücretini çıkarın', 'error')
      return
    }
    setRemainingItems(prev => prev.map(item => {
      if (item.menuItemId === 'game-fee') {
        const total = item.fiyat * item.adet
        const yeniFiyat = total / n
        return { ...item, adet: n, fiyat: Number(yeniFiyat.toFixed(2)) }
      }
      return item
    }))
  }

  // Kolon 2'den Kolon 1'e geri aktarma (Checkouttan azaltıp siparişe ekleme)
  const secimdenCikar = (item: SelectedItem) => {
    // Seçilenler listesindeki adeti 1 azalt veya tamamen kaldır
    setSelectedItems((prev) => {
      const mevcut = prev.find((s) => s.menuItemId === item.menuItemId)
      if (!mevcut) return prev
      if (mevcut.adet <= 1) {
        return prev.filter((s) => s.menuItemId !== item.menuItemId)
      } else {
        return prev.map((s) => (s.menuItemId === item.menuItemId ? { ...s, adet: s.adet - 1 } : s))
      }
    })

    // Kalan listedeki adeti 1 artır
    setRemainingItems((prev) =>
      prev.map((r) => (r.menuItemId === item.menuItemId ? { ...r, adet: r.adet + 1 } : r))
    )
  }

  // Tümünü checkout listesine ekle
  const tumunuSec = () => {
    const guncelSecilenler = [...selectedItems]
    
    remainingItems.forEach((r) => {
      if (r.adet > 0) {
        const mevcut = guncelSecilenler.find((s) => s.menuItemId === r.menuItemId)
        if (mevcut) {
          mevcut.adet += r.adet
        } else {
          guncelSecilenler.push({ ...r })
        }
      }
    })

    setSelectedItems(guncelSecilenler)
    setRemainingItems((prev) => prev.map((r) => ({ ...r, adet: 0 })))
  }

  // Seçilenleri tamamen temizle
  const secimiTemizle = () => {
    setRemainingItems((prev) => {
      const guncelKalan = [...prev]
      selectedItems.forEach((s) => {
        const k = guncelKalan.find((item) => item.menuItemId === s.menuItemId)
        if (k) k.adet += s.adet
      })
      return guncelKalan
    })
    setSelectedItems([])
  }

  // Hesaplama
  const tutarBazliOdenen = session?.odemeler?.filter((o: any) => o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme')).reduce((sum, o) => sum + o.tutar, 0) ?? 0
  const masaKalanBakiye = Math.max(0, (remainingItems.reduce((sum, item) => sum + item.fiyat * item.adet, 0) + selectedItems.reduce((sum, item) => sum + item.fiyat * item.adet, 0)) - tutarBazliOdenen)
  const secilenlerToplam = paymentMode === 'urun_bazli'
    ? selectedItems.reduce((sum, item) => sum + item.fiyat * item.adet, 0)
    : Number(customAmount) || 0
  const kalanAdetToplami = remainingItems.reduce((sum, item) => sum + item.adet, 0)

  // Otomatik masa kapatma kontrolü
  useEffect(() => {
    if (paymentMode === 'urun_bazli') {
      if (kalanAdetToplami === 0 && selectedItems.length > 0) {
        setMasayiKapatOnay(true)
      } else {
        setMasayiKapatOnay(false)
      }
    } else {
      const amt = Number(customAmount) || 0
      if (amt >= masaKalanBakiye && masaKalanBakiye > 0) {
        setMasayiKapatOnay(true)
      } else {
        setMasayiKapatOnay(false)
      }
    }
  }, [kalanAdetToplami, selectedItems.length, paymentMode, customAmount, masaKalanBakiye])

  // Ödemeyi tamamla tetikleyicisi
  const odemeyiTamamla = async () => {
    const isUrunBazli = paymentMode === 'urun_bazli'
    if (isUrunBazli && selectedItems.length === 0) return
    if (!isUrunBazli && secilenlerToplam <= 0) return
    if (odemeYapiliyor) return

    setOdemeYapiliyor(true)
    try {
      const payloadSecilenler = isUrunBazli
        ? selectedItems
        : [{ menuItemId: 'custom-amount', ad: 'Tutar Olarak Ödeme', fiyat: secilenlerToplam, adet: 1 }]

      const res = await fetch(`/api/sessions/${masaId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secilenler: payloadSecilenler,
          yontem: odemeYontemi,
          tutar: secilenlerToplam,
          masaKapatilsinMi: masayiKapatOnay,
          masaAdi: masaConfig?.ad,
          tip: paymentMode,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        showToast('Ödeme başarıyla alındı', 'success')
        
        if (data.kapatildi) {
          router.push('/')
        } else {
          setSelectedItems([])
          setCustomAmount('')
          await yukle()
        }
      } else {
        showToast('Ödeme işlemi başarısız oldu', 'error')
      }
    } catch (e) {
      console.error(e)
      showToast('Bağlantı hatası oluştu', 'error')
    } finally {
      setOdemeYapiliyor(false)
    }
  }

  if (yukleniyor) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="skeleton" style={{ height: 40, width: 200, borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <img src="/logo-islek.svg" alt="Loading" style={{ height: '64px', width: 'auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Hesap Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!masaConfig || !session) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: 'var(--space-12)' }}>
          <div className="empty-state__icon"><HelpCircle size={48} color="var(--color-text-muted)" /></div>
          <h2 className="empty-state__title">Aktif oturum bulunamadı</h2>
          <Link href="/" className="btn btn-primary">← Cafe'ye Dön</Link>
        </div>
      </div>
    )
  }

  // Kategori bazlı gruplama
  const categoriesList = Array.from(new Set(remainingItems.map((item) => item.kategori)))

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
      {/* Üst Navigasyon */}
      <div className="page-header">
        <div className="page-header__left">
          <Link href={`/masa/${masaId}`} className="btn btn-secondary btn-sm">
            ← Masaya Geri Dön
          </Link>
          <div>
            <h1 className="page-title">{masaConfig.ad} — Hesap Ödeme</h1>
            <p className="page-subtitle">Kısmi veya tam hesap tahsilat paneli</p>
          </div>
        </div>

        <div className="page-header__actions">
          {!session.odemeler?.some((o: any) => o.tip === 'tutar_bazli' || o.urunler?.some((u: any) => u.menuItemId === 'custom-amount' || u.ad === 'Tutar Olarak Ödeme')) && (
            <button
              onClick={() => {
                setPaymentMode((m) => (m === 'urun_bazli' ? 'tutar_bazli' : 'urun_bazli'))
                setSelectedItems([])
                setCustomAmount('')
              }}
              className="btn btn-primary btn-sm"
              style={{
                background: paymentMode === 'tutar_bazli' ? 'var(--color-accent-dim)' : 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                color: paymentMode === 'tutar_bazli' ? 'var(--color-accent)' : '#000',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {paymentMode === 'urun_bazli' ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Banknote size={16} /> Tutar Olarak Öde</span> : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Tags size={16} /> Ürün Seçerek Öde</span>}
            </button>
          )}
        </div>
      </div>

      {/* Ana 3 Kolonlu Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 360px',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Kolon 1: Masanın Tüm Siparişleri */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: 'var(--space-4) var(--space-5)',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Masa Sipariş Listesi
            </span>
            {paymentMode === 'urun_bazli' && (
              <button className="btn btn-secondary btn-xs" onClick={tumunuSec} disabled={kalanAdetToplami === 0}>
                Tümünü Seç
              </button>
            )}
          </div>

          <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {kalanAdetToplami === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--color-text-faint)', fontSize: 14, padding: 'var(--space-6) 0' }}>
                Tüm siparişler ödeme listesine eklendi.
              </p>
            )}

            {categoriesList.map((kat) => {
              const katItems = remainingItems.filter((item) => item.kategori === kat)
              // Kalan adetleri 0 olanları gizlemeyip disabled gösterebiliriz
              if (katItems.length === 0) return null

              return (
                <div key={kat} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-1)' }}>
                    {kat === 'diğer' ? 'Diğer' : kat}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {katItems.map((item) => (
                      <div
                        key={item.menuItemId}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          background: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          opacity: item.adet === 0 ? 0.4 : 1,
                          transition: 'opacity 0.2s',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-2) var(--space-3)',
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.ad}</span>
                            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                              ₺{item.fiyat.toFixed(2)}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                              {item.adet} adet
                            </span>
                            {paymentMode === 'urun_bazli' && (
                              <button
                                className="btn btn-secondary"
                                onClick={() => secimeEkle(item)}
                                disabled={item.adet === 0}
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: 'var(--radius-md)',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 18,
                                  fontWeight: 700,
                                }}
                              >
                                −
                              </button>
                            )}
                          </div>
                        </div>

                        {item.menuItemId === 'game-fee' && item.adet > 0 && selectedItems.find(s => s.menuItemId === 'game-fee') === undefined && (
                          <div style={{ padding: '0 var(--space-3) var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', borderTop: '1px dashed var(--color-border)', marginTop: 4, paddingTop: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>BÖL:</span>
                            {[2, 3, 4, 5, 6].map(n => (
                              <button
                                key={n}
                                onClick={() => bolOyunUcreti(n)}
                                className="btn btn-secondary btn-xs"
                                style={{ padding: '2px 8px', fontSize: 11 }}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Kalan Toplam Borç Gösterimi */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)' }}>Kalan Toplam Borç</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-accent)' }}>
                ₺{masaKalanBakiye.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Kolon 2: Ödeme İçin Seçilenler veya Tutar Girişi */}
        {paymentMode === 'urun_bazli' ? (
          <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Seçilenler ({selectedItems.reduce((s, i) => s + i.adet, 0)} ürün)
              </span>
              <button className="btn btn-secondary btn-xs" onClick={secimiTemizle} disabled={selectedItems.length === 0}>
                Temizle
              </button>
            </div>

            <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {selectedItems.length === 0 ? (
                <div style={{ padding: 'var(--space-12) 0', textAlign: 'center', color: 'var(--color-text-faint)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}><ShoppingCart size={48} /></span>
                  <p style={{ fontSize: 14 }}>Henüz ürün seçilmedi.</p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', maxWidth: 220 }}>
                    Soldaki listeden "−" butonuna basarak ödemek istediğiniz ürünleri buraya ekleyin.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {selectedItems.map((item) => {
                    const original = remainingItems.find((r) => r.menuItemId === item.menuItemId)
                    const originalCount = original?.adet ?? 0
                    
                    return (
                      <div
                        key={item.menuItemId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-2) var(--space-3)',
                          background: 'var(--color-accent-dim)',
                          border: '1px solid var(--color-accent)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{item.ad}</span>
                          <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 600 }}>
                            ₺{(item.fiyat * item.adet).toFixed(2)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => secimdenCikar(item)}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 'var(--radius-md)',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              fontWeight: 700,
                            }}
                          >
                            −
                          </button>
                          <span style={{ fontSize: 14, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
                            {item.adet}
                          </span>
                          <button
                            className="btn btn-secondary"
                            onClick={() => secimeEkle(item)}
                            disabled={originalCount === 0}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 'var(--radius-md)',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 18,
                              fontWeight: 700,
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tutar Girişi
              </span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Ödemek istediğiniz tutarı elle girin veya aşağıdaki bölme oranlarını kullanın.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="custom-amount-input" className="form-label">
                Ödenecek Tutar (₺)
              </label>
              <input
                id="custom-amount-input"
                type="number"
                step="any"
                min={1}
                max={masaKalanBakiye}
                className="form-input"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Örn: 50.00"
                style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-accent)' }}
              />
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Masa Kalan Borç: ₺{masaKalanBakiye.toFixed(2)}
              </span>
            </div>

            {/* Bölme İpuçları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Bölme İpuçları (Alman Usulü)
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
                {[2, 3, 4, 5, 6].map((bol) => {
                  const bolTutari = Number((masaKalanBakiye / bol).toFixed(2))
                  return (
                    <button
                      key={bol}
                      onClick={() => setCustomAmount(bolTutari.toString())}
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        fontSize: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span>{bol}'ye Böl</span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>₺{bolTutari}</span>
                    </button>
                  )
                })}
                <button
                  onClick={() => setCustomAmount(masaKalanBakiye.toFixed(2))}
                  className="btn btn-secondary btn-sm"
                  style={{
                    gridColumn: 'span 2',
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>Tümünü Öde (1/1)</span>
                  <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>₺{masaKalanBakiye.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Kolon 3: Hesaplanan Tutar ve Ödeme Yöntemi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tahsilat Özeti
            </span>

            {/* Fiyat Gösterimi */}
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' }}>
                Seçilen Tutar
              </p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-accent)' }}>
                ₺{secilenlerToplam.toFixed(2)}
              </h2>
            </div>

            {/* Ödeme Yöntemleri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Ödeme Yöntemi</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  onClick={() => setOdemeYontemi('nakit')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    background: odemeYontemi === 'nakit' ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                    border: `1px solid ${odemeYontemi === 'nakit' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Banknote size={16} /> Nakit</span>
                  {odemeYontemi === 'nakit' && <span style={{ color: 'var(--color-accent)' }}><Check size={16} /></span>}
                </button>

                <button
                  type="button"
                  onClick={() => setOdemeYontemi('kredi_karti')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    background: odemeYontemi === 'kredi_karti' ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                    border: `1px solid ${odemeYontemi === 'kredi_karti' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard size={16} /> Kredi Kartı</span>
                  {odemeYontemi === 'kredi_karti' && <span style={{ color: 'var(--color-accent)' }}><Check size={16} /></span>}
                </button>

                <button
                  type="button"
                  onClick={() => setOdemeYontemi('iban')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    background: odemeYontemi === 'iban' ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
                    border: `1px solid ${odemeYontemi === 'iban' ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16} /> IBAN / Havale</span>
                  {odemeYontemi === 'iban' && <span style={{ color: 'var(--color-accent)' }}><Check size={16} /></span>}
                </button>
              </div>
            </div>

            {/* Masa Kapatma Onay Kutusu */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                  fontSize: 13,
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={masayiKapatOnay}
                  onChange={(e) => {
                    // Eğer kalan ürün varsa kullanıcının seçmesine izin verelim
                    // Kalan ürün yoksa mecburen kapatılacak (hep true kalacak)
                    if (kalanAdetToplami > 0) {
                      setMasayiKapatOnay(e.target.checked)
                    }
                  }}
                  disabled={kalanAdetToplami === 0}
                  style={{ marginTop: 2, accentColor: 'var(--color-accent)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>Masayı Kapat</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                    {kalanAdetToplami === 0
                      ? 'Tüm siparişler ödendiği için masa kapatılacaktır.'
                      : 'Bu ödeme ile birlikte masayı boşalt ve oturumu sonlandır.'}
                  </span>
                </div>
              </label>
            </div>

            {/* İşlem Butonu */}
            <button
              onClick={odemeyiTamamla}
              disabled={
                odemeYapiliyor ||
                (paymentMode === 'urun_bazli' ? selectedItems.length === 0 : secilenlerToplam <= 0)
              }
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: 'var(--space-3) 0',
                fontSize: 15,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
            >
              {odemeYapiliyor ? (
                'İşlem Yapılıyor...'
              ) : (
                <>
                  <Check size={18} />
                  <span>
                    {masayiKapatOnay ? 'Ödemeyi Al ve Masayı Kapat' : 'Kısmi Ödeme Al'}
                  </span>
                </>
              )}
            </button>

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
    </div>
  )
}
