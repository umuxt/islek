'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { TableConfig } from '@/lib/types'
import { useToast } from '@/context/ToastContext'
import { Plus, Save, Armchair, Trash } from 'lucide-react'

const CHIP_W = 100
const CHIP_H = 80
const CANVAS_W = 900 // Viewport Width
const CANVAS_H = 600 // Viewport Height
const VIRTUAL_W = 2000 // Virtual Layout Width
const VIRTUAL_H = 1500 // Virtual Layout Height
const GRID = 20

function snap(v: number) {
  return Math.round(v / GRID) * GRID
}

function yeniId() {
  return `masa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

interface Props {
  onDirtyChange?: (isDirty: boolean) => void
}

export default function YerlasimEditor({ onDirtyChange }: Props) {
  const [masalar, setMasalar] = useState<TableConfig[]>([])
  const [originalMasalar, setOriginalMasalar] = useState<TableConfig[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [secili, setSecili] = useState<string | null>(null)
  const { showToast } = useToast()

  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/tables')
      .then((r) => r.json())
      .then((data: TableConfig[]) => {
        const list = Array.isArray(data) ? data : []
        setMasalar(list)
        setOriginalMasalar(JSON.parse(JSON.stringify(list)))
        setYukleniyor(false)
      })
      .catch(() => setYukleniyor(false))
  }, [])

  const isDirty = JSON.stringify(masalar) !== JSON.stringify(originalMasalar)

  // AyarlarClient'a değişiklik durumunu bildir
  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  // Sürükleme — pointer events kullanıyoruz
  const handlePointerDown = useCallback(
    (e: React.PointerEvent, masaId: string) => {
      e.preventDefault()
      const masa = masalar.find((m) => m.id === masaId)
      if (!masa) return
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      draggingRef.current = {
        id: masaId,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      }
      setSecili(masaId)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [masalar]
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || !canvasRef.current) return
    const canvasRect = canvasRef.current.getBoundingClientRect()
    const { id, offsetX, offsetY } = draggingRef.current

    // ClientX viewport'a göre + viewport scrollLeft offset'i - chip içindeki pointer kayması
    const rawX = e.clientX - canvasRect.left - offsetX + canvasRef.current.scrollLeft
    const rawY = e.clientY - canvasRect.top - offsetY + canvasRef.current.scrollTop

    const x = Math.max(0, Math.min(snap(rawX), VIRTUAL_W - CHIP_W))
    const y = Math.max(0, Math.min(snap(rawY), VIRTUAL_H - CHIP_H))

    setMasalar((prev) =>
      prev.map((m) => (m.id === id ? { ...m, x, y } : m))
    )
  }, [])

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null
  }, [])

  function scrollCanvas(dx: number, dy: number) {
    if (canvasRef.current) {
      canvasRef.current.scrollBy({ left: dx, top: dy, behavior: 'smooth' })
    }
  }

  function masaEkle() {
    // Görünür olan ekranın ortasında bir yerde ekle ya da scroll hizasına göre
    const scrollX = canvasRef.current ? canvasRef.current.scrollLeft : 0
    const scrollY = canvasRef.current ? canvasRef.current.scrollTop : 0
    
    const yeni: TableConfig = {
      id: yeniId(),
      ad: `Masa ${masalar.length + 1}`,
      x: snap(scrollX + 100 + (masalar.length % 3) * 120),
      y: snap(scrollY + 100 + Math.floor((masalar.length % 9) / 3) * 120),
      kapasite: 4,
    }
    setMasalar((prev) => [...prev, yeni])
    setSecili(yeni.id)
    showToast(`${yeni.ad} eklendi. Kaydetmeyi unutmayın.`, 'info')
  }

  function masaSil(id: string) {
    const silinen = masalar.find((m) => m.id === id)
    const ad = silinen ? silinen.ad : 'Masa'
    setMasalar((prev) => prev.filter((m) => m.id !== id))
    if (secili === id) setSecili(null)
    showToast(`${ad} silindi. Kaydetmeyi unutmayın.`, 'info')
  }

  function masaGuncelle(id: string, alan: keyof TableConfig, deger: string | number) {
    setMasalar((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [alan]: deger } : m))
    )
  }

  async function handleKaydet() {
    setKaydediliyor(true)
    try {
      const res = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(masalar),
      })
      if (res.ok) {
        setOriginalMasalar(JSON.parse(JSON.stringify(masalar)))
        showToast('Yerleşim başarıyla kaydedildi.', 'success')
      } else {
        showToast('Yerleşim kaydedilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    } finally {
      setKaydediliyor(false)
    }
  }

  const seciliMasa = masalar.find((m) => m.id === secili)

  if (yukleniyor) {
    return <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

      {/* Araç Çubuğu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <button id="masa-ekle-btn" onClick={masaEkle} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={16} /> Masa Ekle
        </button>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          {masalar.length} masa · Masaları kanvasta sürükleyerek yerleştirin · Ok tuşlarıyla kaydırın
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <button
            id="kaydet-yerlasim"
            onClick={handleKaydet}
            disabled={!isDirty || kaydediliyor}
            className="btn btn-primary"
            style={{ opacity: (!isDirty || kaydediliyor) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {kaydediliyor ? 'Kaydediliyor…' : <><Save size={16} /> Kaydet</>}
          </button>
        </div>
      </div>

      {/* Kanvas + Özellikler */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>

        {/* Viewport Wrapper (Non-scrollable container) */}
        <div
          style={{
            position: 'relative',
            width: CANVAS_W,
            height: CANVAS_H,
            maxWidth: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {/* Kaydırma Okları (Statik Konumlu) */}
          <button type="button" className="canvas-arrow canvas-arrow--top" onClick={() => scrollCanvas(0, -160)} title="Yukarı Kaydır">▲</button>
          <button type="button" className="canvas-arrow canvas-arrow--bottom" onClick={() => scrollCanvas(0, 160)} title="Aşağı Kaydır">▼</button>
          <button type="button" className="canvas-arrow canvas-arrow--left" onClick={() => scrollCanvas(-160, 0)} title="Sola Kaydır">◀</button>
          <button type="button" className="canvas-arrow canvas-arrow--right" onClick={() => scrollCanvas(160, 0)} title="Sağa Kaydır">▶</button>

          {/* Kaydırılabilir Viewport Div */}
          <div
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
            }}
          >
            {/* Gerçek Kaydırılabilir Grid Alanı (Inner Canvas) */}
            <div
              id="yerlasim-kanvas-inner"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
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
                top: 0,
              }}
            >
              {masalar.length === 0 && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}>
                  <span style={{ color: 'var(--color-text-muted)' }}><Armchair size={48} /></span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                    "Masa Ekle" butonuna tıklayın
                  </span>
                </div>
              )}

              {masalar.map((masa) => {
                const aktif = secili === masa.id
                return (
                  <div
                    key={masa.id}
                    onPointerDown={(e) => handlePointerDown(e, masa.id)}
                    onClick={() => setSecili(masa.id)}
                    style={{
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
                      boxShadow: aktif ? 'var(--shadow-accent)' : 'none',
                    }}
                  >
                    <span style={{ color: aktif ? 'var(--color-accent)' : 'var(--color-text-muted)' }}><Armchair size={24} /></span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: aktif ? 'var(--color-accent)' : 'var(--color-text)' }}>
                      {masa.ad}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                      {masa.kapasite} kişi
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Seçili Masa Özellikleri */}
        {seciliMasa && (
          <div
            className="card"
            style={{ minWidth: 220, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Masa Özellikleri
            </p>

            <div className="form-group">
              <label htmlFor="masa-ad" className="form-label">Ad</label>
              <input
                id="masa-ad"
                className="form-input"
                value={seciliMasa.ad}
                onChange={(e) => masaGuncelle(seciliMasa.id, 'ad', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="masa-kapasite" className="form-label">Kapasite</label>
              <input
                id="masa-kapasite"
                type="number"
                min={1}
                max={20}
                className="form-input"
                value={seciliMasa.kapasite}
                onChange={(e) => masaGuncelle(seciliMasa.id, 'kapasite', parseInt(e.target.value) || 1)}
              />
            </div>

            <button
              id={`masa-sil-${seciliMasa.id}`}
              onClick={() => masaSil(seciliMasa.id)}
              className="btn btn-danger btn-sm"
              style={{ width: '100%' }}
            >
              <Trash size={16} /> Masayı Sil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
