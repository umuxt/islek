'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Banknote, Map, List, Settings, AlertTriangle } from 'lucide-react'
import UcretlendirmeAyarlari from '@/components/ayarlar/UcretlendirmeAyarlari'
import YerlasimEditor from '@/components/ayarlar/YerlasimEditor'
import MenuEditor from '@/components/ayarlar/MenuEditor'
import KategoriYonetimi from '@/components/ayarlar/KategoriYonetimi'
import { clientCache } from '@/lib/clientCache'

type Tab = 'ucretlendirme' | 'yerlasim' | 'menu' | 'kategori'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'ucretlendirme', label: 'Ücretlendirme Politikası', icon: <Banknote size={16}/> },
  { id: 'yerlasim',      label: 'Yerleşim & Masalar',       icon: <Map size={16}/> },
  { id: 'menu',          label: 'Menü',                     icon: <List size={16}/> },
  { id: 'kategori',      label: 'Ürün Kategori Yönetimi',   icon: <Settings size={16}/> },
]

export default function AyarlarClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = (searchParams.get('tab') as Tab) ?? 'ucretlendirme'

  const [isCurrentTabDirty, setIsCurrentTabDirty] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingTab, setPendingTab] = useState<Tab | null>(null)

  // Ayarlar açıldığında istemci önbelleğini temizle (güncel verilerin yüklenmesini garanti eder)
  useEffect(() => {
    clientCache.clear()
  }, [])

  // Sekme değiştiğinde dirty state'i temizle
  useEffect(() => {
    setIsCurrentTabDirty(false)
  }, [activeTab])

  function handleTabClick(tab: Tab) {
    if (activeTab === tab) return
    if (isCurrentTabDirty) {
      setPendingTab(tab)
      setShowConfirmModal(true)
    } else {
      router.push(`/ayarlar?tab=${tab}`)
    }
  }

  function confirmTabSwitch() {
    if (pendingTab) {
      router.push(`/ayarlar?tab=${pendingTab}`)
    }
    setIsCurrentTabDirty(false)
    setShowConfirmModal(false)
    setPendingTab(null)
  }

  function cancelTabSwitch() {
    setShowConfirmModal(false)
    setPendingTab(null)
  }

  return (
    <>
      <div className="settings-tabs" role="tablist" aria-label="Ayarlar sekmeleri">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            className={`settings-tab${activeTab === id ? ' active' : ''}`}
            onClick={() => handleTabClick(id)}
          >
            <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'ucretlendirme' && <UcretlendirmeAyarlari onDirtyChange={setIsCurrentTabDirty} />}
        {activeTab === 'yerlasim'      && <YerlasimEditor onDirtyChange={setIsCurrentTabDirty} />}
        {activeTab === 'menu'          && <MenuEditor onDirtyChange={setIsCurrentTabDirty} />}
        {activeTab === 'kategori'      && <KategoriYonetimi onDirtyChange={setIsCurrentTabDirty} />}
      </div>

      {/* Kaydedilmemiş Değişiklikler Modalı */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 'var(--space-4)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelTabSwitch()
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-accent)' }}><AlertTriangle size={48} /></div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                Kaydedilmemiş Değişiklikler Var!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Yaptığınız değişiklikleri kaydetmediniz. Başka bir sekmeye geçerseniz bu değişiklikler kaybolacaktır.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={cancelTabSwitch}
              >
                Geri Dön
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1, background: 'var(--color-active)', color: '#fff' }}
                onClick={confirmTabSwitch}
              >
                Değişiklikleri At
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
