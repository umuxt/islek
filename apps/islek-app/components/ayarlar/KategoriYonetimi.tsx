'use client'

import { useState, useEffect } from 'react'
import type { Kategori } from '@islek/db'
import { useToast } from '@/context/ToastContext'
import { Plus, Save, Trash, Info } from 'lucide-react'

const VARSAYILAN_IKONLAR = [
  '☕', // Sıcak İçecekler (Türk Kahvesi, Espresso)
  '🫖', // Demlik Çay (Okey salonlarının vazgeçilmezi)
  '🍵', // Bitki Çayı / Salep
  '🥤', // Kutu İçecekler / Soğuk Kahveler / Ayran
  '🍹', // Kokteyl / Frozen / Milkshake / Limonata
  '🧃', // Meyve Suyu
  '💧', // Su / Maden Suyu
  '🍔', // Hamburger / Burger Çeşitleri
  '🍕', // Pizza
  '🌯', // Dürüm / Wrap
  '🥪', // Tost / Sandviç
  '🍝', // Makarna / Mantı
  '🍟', // Atıştırmalık Sepeti / Patates / Çıtır Tavuk
  '🍳', // Kahvaltı / Omlet / Menemen
  '🫓', // Gözleme / Bazlama
  '🥗', // Salata
  '🍉', // Meyve Tabağı
  '🥜', // Kuruyemiş / Çerez Tabakları
  '🍰', // Tatlı / Pasta / Sufle
  '🧇', // Waffle
  '💨', // Nargile / Tütün Mamülleri
  '🎲', // Okey / Tavla / Masa Oyunları
  '🃏', // İskambil / Kart Oyunları
  '🎱', // Bilardo
]

interface Props {
  onDirtyChange?: (isDirty: boolean) => void
}

export default function KategoriYonetimi({ onDirtyChange }: Props) {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [originalKategoriler, setOriginalKategoriler] = useState<Kategori[]>([])
  const [yeniAd, setYeniAd] = useState('')
  const [yeniIcon, setYeniIcon] = useState('🏷️')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const { showToast } = useToast()

  // Emojipicker ve silme onay durumu
  const [activePickerId, setActivePickerId] = useState<string | null>(null) // 'yeni' veya kategori.id
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data: Kategori[]) => {
        const cats = Array.isArray(data) ? data : []
        setKategoriler(cats)
        setOriginalKategoriler(JSON.parse(JSON.stringify(cats)))
        setYukleniyor(false)
      })
      .catch(() => setYukleniyor(false))
  }, [])

  // Değişiklik olup olmadığını kontrol et (dirty state)
  const isDirty = JSON.stringify(kategoriler) !== JSON.stringify(originalKategoriler)
  const isDuplicate = kategoriler.some((c) => c.ad.toLowerCase() === yeniAd.trim().toLowerCase())

  // AyarlarClient'a değişiklik durumunu bildir
  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  // Emoji Seçici Dış Tıklama Kapatma Listener
  useEffect(() => {
    if (activePickerId === null) return

    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('.emoji-picker-trigger') && !target.closest('.emoji-picker-popup')) {
        setActivePickerId(null)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [activePickerId])

  function kategoriEkle() {
    if (!yeniAd.trim()) return
    const adTemiz = yeniAd.trim()
    const duplicate = kategoriler.some((c) => c.ad.toLowerCase() === adTemiz.toLowerCase())
    if (duplicate) {
      showToast('Bu isimde bir kategori zaten mevcut!', 'error')
      return
    }
    const yeni: Kategori = {
      id: `cat-${Date.now()}`,
      ad: adTemiz,
      icon: yeniIcon.trim() || '🏷️',
    }
    setKategoriler((prev) => [...prev, yeni])
    setYeniAd('')
    setYeniIcon('🏷️')
    showToast('Kategori listeye eklendi. Kaydetmeyi unutmayın.', 'info')
  }

  function kategoriSil(id: string) {
    setKategoriler((prev) => prev.filter((c) => c.id !== id))
    showToast('Kategori listeden kaldırıldı. Kaydetmeyi unutmayın.', 'info')
  }

  function alanGuncelle(id: string, alan: 'ad' | 'icon', deger: string) {
    setKategoriler((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [alan]: deger } : c))
    )
  }

  async function handleKaydet() {
    setKaydediliyor(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kategoriler),
      })
      if (res.ok) {
        setOriginalKategoriler(JSON.parse(JSON.stringify(kategoriler)))
        showToast('Kategoriler başarıyla kaydedildi.', 'success')
      } else {
        showToast('Kategoriler kaydedilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    } finally {
      setKaydediliyor(false)
    }
  }

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 720 }}>
      {/* Yeni Kategori Ekleme */}
      <div className="card" style={{ position: 'relative' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-4)' }}>
          Yeni Kategori Ekle
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="kat-icon" className="form-label">İkon</label>
            <button
              id="kat-icon"
              type="button"
              className="form-input emoji-picker-trigger"
              onClick={() => setActivePickerId(activePickerId === 'yeni' ? null : 'yeni')}
              style={{
                height: 42,
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                width: '100%',
              }}
            >
              {yeniIcon}
            </button>

            {/* Emoji Seçim Popover */}
            {activePickerId === 'yeni' && (
              <div
                className="emoji-picker-popup"
                style={{
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
                  marginTop: '4px',
                }}
              >
                {VARSAYILAN_IKONLAR.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      setYeniIcon(icon)
                      setActivePickerId(null)
                    }}
                    style={{
                      fontSize: 20,
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="btn-ghost"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="kat-ad" className="form-label">Kategori Adı</label>
            <input
              id="kat-ad"
              className="form-input"
              placeholder="ör. Tatlılar, Sıcak İçecekler..."
              value={yeniAd}
              onChange={(e) => setYeniAd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && kategoriEkle()}
            />
          </div>

          <button
            id="kat-ekle-btn"
            onClick={kategoriEkle}
            className="btn btn-primary"
            disabled={!yeniAd.trim() || isDuplicate}
            style={{ marginBottom: 0, height: 42, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={16} /> Ekle
          </button>
        </div>
      </div>

      {/* Kategori Listesi */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Kategoriler ({kategoriler.length})
          </span>

          <div style={{ marginLeft: 'auto' }}>
            <button
              id="kaydet-categories"
              onClick={handleKaydet}
              disabled={!isDirty || kaydediliyor}
              className="btn btn-primary"
              style={{ opacity: (!isDirty || kaydediliyor) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {kaydediliyor ? 'Kaydediliyor…' : <><Save size={16} /> Kaydet</>}
            </button>
          </div>
        </div>

        {kategoriler.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-10)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div className="empty-state__icon">🏷️</div>
            <p className="empty-state__title" style={{ fontSize: 16 }}>Henüz kategori oluşturulmadı</p>
            <p className="empty-state__desc" style={{ fontSize: 13 }}>Menü ürünlerini sınıflandırmak için yukarıdan ilk kategorinizi ekleyin.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {kategoriler.map((kat) => (
              <div
                key={kat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative',
                }}
              >
                {/* İkon Picker */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="emoji-picker-trigger"
                    onClick={() => setActivePickerId(activePickerId === kat.id ? null : kat.id)}
                    style={{
                      width: 50,
                      height: 42,
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {kat.icon || '🏷️'}
                  </button>

                  {/* Popover */}
                  {activePickerId === kat.id && (
                    <div
                      className="emoji-picker-popup"
                      style={{
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
                        marginTop: '4px',
                      }}
                    >
                      {VARSAYILAN_IKONLAR.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            alanGuncelle(kat.id, 'icon', icon)
                            setActivePickerId(null)
                          }}
                          style={{
                            fontSize: 20,
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          className="btn-ghost"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={kat.ad}
                  onChange={(e) => alanGuncelle(kat.id, 'ad', e.target.value)}
                  style={{
                    flex: 1,
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px var(--space-3)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--color-text)',
                    outline: 'none',
                  }}
                  aria-label={`${kat.ad} adı`}
                />

                {/* Silme & Onay Butonları */}
                {deleteConfirmId === kat.id ? (
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      onClick={() => {
                        kategoriSil(kat.id)
                        setDeleteConfirmId(null)
                      }}
                      className="btn btn-danger btn-sm"
                      style={{
                        background: 'var(--color-active)',
                        color: '#fff',
                        fontWeight: 600,
                        padding: '8px 12px',
                        fontSize: '12px',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      Silme İşlemini Tamamla
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '8px 12px', fontSize: '12px', borderRadius: 'var(--radius-md)' }}
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(kat.id)}
                    className="btn btn-ghost btn-sm"
                    aria-label={`${kat.ad} sil`}
                    style={{ color: 'var(--color-active)', padding: '4px 8px' }}
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--color-accent)' }} /> <strong>Bilgi:</strong> Bir kategoriyi sildiğinizde, o kategoriye ait tüm menü ürünleri otomatik olarak <strong>"diğer"</strong> kategorisine taşınır. Bir kategorinin adını değiştirdiğinizde, tüm ürünlerin kategorisi yeni adla güncellenir.
        </p>
      </div>
    </div>
  )
}
