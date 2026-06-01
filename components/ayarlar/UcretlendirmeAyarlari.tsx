'use client'

import { useState, useEffect } from 'react'
import type { PricingPolicy, UcretlendirmeModu } from '@/lib/types'
import { useToast } from '@/context/ToastContext'

const MOD_SECENEKLERI: { value: UcretlendirmeModu; label: string; desc: string }[] = [
  {
    value: 'siparis_bazli',
    label: 'Sipariş Bazlı',
    desc: 'Sadece alınan ürünlerin tutarı hesaplanır. Oyun ücreti alınmaz.',
  },
  {
    value: 'oyun_parasi',
    label: 'Oyun Parası',
    desc: 'Saatlik oyun ücreti alınır. Siparişler ayrıca eklenir.',
  },
  {
    value: 'masa_limiti',
    label: 'Masa Limiti',
    desc: 'Masada minimum harcama zorunludur. Sipariş tutarı minimumun altında ise fark alınır.',
  },
]

interface Props {
  onDirtyChange?: (isDirty: boolean) => void
}

export default function UcretlendirmeAyarlari({ onDirtyChange }: Props) {
  const [politika, setPolitika] = useState<PricingPolicy>({ mod: 'siparis_bazli' })
  const [originalPolitika, setOriginalPolitika] = useState<PricingPolicy>({ mod: 'siparis_bazli' })
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.mod) {
          setPolitika(data)
          setOriginalPolitika(JSON.parse(JSON.stringify(data)))
        }
        setYukleniyor(false)
      })
      .catch(() => setYukleniyor(false))
  }, [])

  const isDirty = JSON.stringify(politika) !== JSON.stringify(originalPolitika)

  // AyarlarClient'a değişiklik durumunu bildir
  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  async function handleKaydet() {
    setKaydediliyor(true)
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(politika),
      })
      if (res.ok) {
        setOriginalPolitika(JSON.parse(JSON.stringify(politika)))
        showToast('Ücretlendirme ayarları başarıyla kaydedildi.', 'success')
      } else {
        showToast('Ayarlar kaydedilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    } finally {
      setKaydediliyor(false)
    }
  }

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* Mod seçimi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <p className="form-label">Ücretlendirme Modu</p>
        {MOD_SECENEKLERI.map(({ value, label, desc }) => {
          const secili = politika.mod === value
          return (
            <button
              key={value}
              id={`mod-${value}`}
              onClick={() => setPolitika((p) => ({ ...p, mod: value }))}
              style={{
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
                width: '100%',
              }}
            >
              <div
                style={{
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
                  transition: 'all var(--transition-fast)',
                }}
              >
                {secili && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: secili ? 'var(--color-accent)' : 'var(--color-text)', marginBottom: 4 }}>
                  {label}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {desc}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Oyun parası detayları */}
      {politika.mod === 'oyun_parasi' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Oyun Parası Ayarları
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              id="saatlik-ucret-aktif"
              type="checkbox"
              checked={politika.saatlikUcretAktif ?? false}
              onChange={(e) => setPolitika((p) => ({ ...p, saatlikUcretAktif: e.target.checked }))}
              style={{ accentColor: 'var(--color-accent)' }}
            />
            <label htmlFor="saatlik-ucret-aktif" style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Saatlik Ücret Al
            </label>
          </div>

          {politika.saatlikUcretAktif ? (
            <>
              <div className="form-group">
                <label htmlFor="saatlik-ucret" className="form-label">Saatlik Ücret (₺)</label>
                <input
                  id="saatlik-ucret"
                  type="number"
                  min={0}
                  step={0.5}
                  value={politika.saatlikUcret ?? ''}
                  onChange={(e) => setPolitika((p) => ({ ...p, saatlikUcret: parseFloat(e.target.value) || 0 }))}
                  className="form-input"
                  placeholder="ör. 50"
                />
              </div>

              <div className="form-group">
                <label htmlFor="kisi-basi" className="form-label">Ücret Türü</label>
                <select
                  id="kisi-basi"
                  value={politika.kisiBasiMi ? 'kisi' : 'masa'}
                  onChange={(e) => setPolitika((p) => ({ ...p, kisiBasiMi: e.target.value === 'kisi' }))}
                  className="form-select"
                >
                  <option value="masa">Masa Başı</option>
                  <option value="kisi">Kişi Başı</option>
                </select>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="sabit-ucret" className="form-label">Sabit Oyun Ücreti (₺)</label>
              <input
                id="sabit-ucret"
                type="number"
                min={0}
                step={0.5}
                value={politika.sabitUcret ?? ''}
                onChange={(e) => setPolitika((p) => ({ ...p, sabitUcret: parseFloat(e.target.value) || 0 }))}
                className="form-input"
                placeholder="ör. 30"
              />
            </div>
          )}
        </div>
      )}

      {/* Masa limiti detayları */}
      {politika.mod === 'masa_limiti' && (
        <div className="card">
          <div className="form-group">
            <label htmlFor="min-harcama" className="form-label">Minimum Harcama (₺)</label>
            <input
              id="min-harcama"
              type="number"
              min={0}
              step={1}
              value={politika.minimumHarcama ?? ''}
              onChange={(e) => setPolitika((p) => ({ ...p, minimumHarcama: parseFloat(e.target.value) || 0 }))}
              className="form-input"
              placeholder="ör. 100"
            />
          </div>
        </div>
      )}

      {/* Kaydet */}
      <div>
        <button
          onClick={handleKaydet}
          disabled={!isDirty || kaydediliyor}
          className="btn btn-primary"
          id="kaydet-ucretlendirme"
          style={{ opacity: (!isDirty || kaydediliyor) ? 0.5 : 1 }}
        >
          {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
