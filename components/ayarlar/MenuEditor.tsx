'use client'

import { useState, useEffect } from 'react'
import type { MenuItem, Kategori } from '@/lib/types'
import { useToast } from '@/context/ToastContext'
import { Plus, Save, Trash, List, AlertTriangle } from 'lucide-react'

interface Props {
  onDirtyChange?: (isDirty: boolean) => void
}

export default function MenuEditor({ onDirtyChange }: Props) {
  const [urunler, setUrunler] = useState<MenuItem[]>([])
  const [originalUrunler, setOriginalUrunler] = useState<MenuItem[]>([])
  const [kategoriler, setKategoriler] = useState<Kategori[]>([])
  const [yeniUrun, setYeniUrun] = useState<Omit<MenuItem, 'id'>>({
    ad: '',
    fiyat: 0,
    kategori: '',
  })
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [filtre, setFiltre] = useState<string>('tumu')
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([
      fetch('/api/menu').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([menuData, catsData]: [MenuItem[], Kategori[]]) => {
        const menu = Array.isArray(menuData) ? menuData : []
        const cats = Array.isArray(catsData) ? catsData : []
        setUrunler(menu)
        setOriginalUrunler(JSON.parse(JSON.stringify(menu)))
        setKategoriler(cats)
        setYeniUrun({ ad: '', fiyat: 0, kategori: '' })
        setYukleniyor(false)
      })
      .catch(() => setYukleniyor(false))
  }, [])

  const isDirty = JSON.stringify(urunler) !== JSON.stringify(originalUrunler)

  // AyarlarClient'a değişiklik durumunu bildir
  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  function urunEkle() {
    if (!yeniUrun.ad.trim() || yeniUrun.fiyat <= 0 || !yeniUrun.kategori) return
    const yeni: MenuItem = {
      id: `item-${Date.now()}`,
      ...yeniUrun,
      ad: yeniUrun.ad.trim(),
    }
    setUrunler((prev) => [...prev, yeni])
    setYeniUrun({ ad: '', fiyat: 0, kategori: '' })
    showToast('Ürün listeye eklendi. Kaydetmeyi unutmayın.', 'info')
  }

  function urunSil(id: string) {
    setUrunler((prev) => prev.filter((u) => u.id !== id))
    showToast('Ürün listeden kaldırıldı. Kaydetmeyi unutmayın.', 'info')
  }

  function fiyatGuncelle(id: string, yeniFiyat: number) {
    setUrunler((prev) =>
      prev.map((u) => (u.id === id ? { ...u, fiyat: yeniFiyat } : u))
    )
  }

  async function handleKaydet() {
    setKaydediliyor(true)
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(urunler),
      })
      if (res.ok) {
        setOriginalUrunler(JSON.parse(JSON.stringify(urunler)))
        showToast('Menü başarıyla kaydedildi.', 'success')
      } else {
        showToast('Menü kaydedilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    } finally {
      setKaydediliyor(false)
    }
  }

  const hasDiger = urunler.some((u) => u.kategori === 'diğer')
  const filtreliUrunler =
    filtre === 'tumu' ? urunler : urunler.filter((u) => u.kategori === filtre)

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 720 }}>

      {/* Yeni Ürün Ekleme */}
      <div className="card">
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-4)' }}>
          Yeni Ürün Ekle
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 160px auto', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div className="form-group">
            <label htmlFor="urun-ad" className="form-label">Ürün Adı</label>
            <input
              id="urun-ad"
              className="form-input"
              placeholder="ör. Çay, Nescafé..."
              value={yeniUrun.ad}
              onChange={(e) => setYeniUrun((p) => ({ ...p, ad: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && urunEkle()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="urun-fiyat" className="form-label">Fiyat (₺)</label>
            <input
              id="urun-fiyat"
              type="number"
              min={0}
              step={0.5}
              className="form-input"
              placeholder="0"
              value={yeniUrun.fiyat || ''}
              onChange={(e) => setYeniUrun((p) => ({ ...p, fiyat: parseFloat(e.target.value) || 0 }))}
              style={{ width: 100 }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="urun-kategori" className="form-label">Kategori</label>
            <select
              id="urun-kategori"
              className="form-select"
              value={yeniUrun.kategori}
              onChange={(e) => setYeniUrun((p) => ({ ...p, kategori: e.target.value }))}
            >
              <option value="" disabled>Kategori Seçin</option>
              {kategoriler.map((kat) => (
                <option key={kat.id} value={kat.ad}>{kat.ad}</option>
              ))}
              <option value="diğer">Diğer</option>
            </select>
          </div>

          <button
            id="urun-ekle-btn"
            onClick={urunEkle}
            className="btn btn-primary"
            disabled={!yeniUrun.ad.trim() || yeniUrun.fiyat <= 0 || !yeniUrun.kategori}
            style={{ marginBottom: 0, height: 42, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={16} /> Ekle
          </button>
        </div>
      </div>

      {/* Menü Listesi */}
      <div>
        {/* Filtre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFiltre('tumu')}
              className={`btn btn-sm ${filtre === 'tumu' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <List size={16} /> Tümü
            </button>
            {kategoriler.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setFiltre(kat.ad)}
                className={`btn btn-sm ${filtre === kat.ad ? 'btn-primary' : 'btn-secondary'}`}
              >
                {kat.icon || '🏷️'} {kat.ad}
              </button>
            ))}
            {(hasDiger || kategoriler.length === 0) && (
              <button
                onClick={() => setFiltre('diğer')}
                className={`btn btn-sm ${filtre === 'diğer' ? 'btn-primary' : 'btn-secondary'}`}
              >
                📦 Diğer
              </button>
            )}
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              id="kaydet-menu"
              onClick={handleKaydet}
              disabled={!isDirty || kaydediliyor}
              className="btn btn-primary"
              style={{ opacity: (!isDirty || kaydediliyor) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {kaydediliyor ? 'Kaydediliyor…' : <><Save size={16} /> Kaydet</>}
            </button>
          </div>
        </div>

        {/* Liste */}
        {filtreliUrunler.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
            <div className="empty-state__icon" style={{ color: 'var(--color-text-muted)' }}><List size={48} /></div>
            <p className="empty-state__title" style={{ fontSize: 16 }}>Bu kategoride ürün yok</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {filtreliUrunler.map((urun) => {
              const kat = kategoriler.find((k) => k.ad === urun.kategori)
              const icon = urun.kategori === 'diğer' ? '📦' : (kat?.icon || '🏷️')
              const label = urun.kategori === 'diğer' ? 'Diğer' : urun.kategori
              return (
                <div
                  key={urun.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>

                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{urun.ad}</span>

                  <span style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text-muted)',
                    fontWeight: 500,
                  }}>
                    {label}
                  </span>

                  {/* Fiyat inline düzenleme */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={urun.fiyat}
                      onChange={(e) => fiyatGuncelle(urun.id, parseFloat(e.target.value) || 0)}
                      style={{
                        width: 70,
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-accent)',
                        outline: 'none',
                        textAlign: 'right',
                      }}
                      aria-label={`${urun.ad} fiyatı`}
                    />
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>₺</span>
                  </div>

                  <button
                    onClick={() => urunSil(urun.id)}
                    className="btn btn-ghost btn-sm"
                    aria-label={`${urun.ad} sil`}
                    style={{ color: 'var(--color-active)', padding: '4px 8px' }}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
