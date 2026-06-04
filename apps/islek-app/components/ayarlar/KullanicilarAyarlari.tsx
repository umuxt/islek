'use client'

import { useState, useEffect } from 'react'
import type { CafeUser } from '@islek/db'
import { useToast } from '@/context/ToastContext'
import { Plus, Save, Trash, Info, Users, UserCheck } from 'lucide-react'

interface Props {
  onDirtyChange?: (isDirty: boolean) => void
}

export default function KullanicilarAyarlari({ onDirtyChange }: Props) {
  const [users, setUsers] = useState<CafeUser[]>([])
  const [originalUsers, setOriginalUsers] = useState<CafeUser[]>([])
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [originalTrackingEnabled, setOriginalTrackingEnabled] = useState(false)

  const [yeniAd, setYeniAd] = useState('')
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showConfirmToggleModal, setShowConfirmToggleModal] = useState(false)
  const [pendingToggleValue, setPendingToggleValue] = useState<boolean | null>(null)
  
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then((data) => {
        const userList = Array.isArray(data.users) ? data.users : []
        const enabled = !!data.trackingEnabled
        setUsers(userList)
        setOriginalUsers(JSON.parse(JSON.stringify(userList)))
        setTrackingEnabled(enabled)
        setOriginalTrackingEnabled(enabled)
        setYukleniyor(false)
      })
      .catch((err) => {
        console.error('Kullanıcılar yüklenemedi', err)
        setYukleniyor(false)
      })
  }, [])

  // Değişiklik kontrolü (dirty state) - Sadece kullanıcı listesini karşılaştırır
  const isDirty = JSON.stringify(users) !== JSON.stringify(originalUsers)

  // Aileye (AyarlarClient) dirty durumunu bildir
  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  // Aktif kullanıcıları filtrele (Soft delete edilmemiş olanlar)
  const aktifKullanicilar = users.filter((u) => u.active !== false)

  const isDuplicate = aktifKullanicilar.some(
    (u) => u.name.toLowerCase() === yeniAd.trim().toLowerCase()
  )

  function userEkle() {
    if (!yeniAd.trim()) return
    const adTemiz = yeniAd.trim()

    if (isDuplicate) {
      showToast('Bu isimde bir kullanıcı zaten mevcut!', 'error')
      return
    }

    const yeniUser: CafeUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: adTemiz,
      active: true,
    }

    setUsers((prev) => [...prev, yeniUser])
    setYeniAd('')
    showToast('Kullanıcı listeye eklendi. Kaydetmeyi unutmayın.', 'info')
  }

  function userSoftDelete(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: false } : u))
    )
    showToast('Kullanıcı kaldırıldı. Kaydetmeyi unutmayın.', 'info')
  }

  function userNameGuncelle(id: string, name: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, name } : u))
    )
  }

  async function handleKaydet() {
    setKaydediliyor(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          users,
        }),
      })

      if (res.ok) {
        setOriginalUsers(JSON.parse(JSON.stringify(users)))
        showToast('Kullanıcı listesi başarıyla kaydedildi.', 'success')
      } else {
        showToast('Kullanıcı listesi kaydedilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    } finally {
      setKaydediliyor(false)
    }
  }

  const handleToggleChange = (checked: boolean) => {
    setPendingToggleValue(checked)
    setShowConfirmToggleModal(true)
  }

  const saveToggleState = async (enabled: boolean) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingEnabled: enabled }),
      })

      if (res.ok) {
        setTrackingEnabled(enabled)
        setOriginalTrackingEnabled(enabled)
        window.dispatchEvent(new Event('islek-garson-changed'))
        showToast(
          enabled
            ? 'Kullanıcı izleme özelliği başarıyla aktif edildi.'
            : 'Kullanıcı izleme özelliği kapatıldı.',
          'success'
        )
      } else {
        showToast('Ayar değiştirilemedi.', 'error')
      }
    } catch {
      showToast('Bağlantı hatası oluştu.', 'error')
    }
  }

  const confirmToggle = async () => {
    setShowConfirmToggleModal(false)
    if (pendingToggleValue !== null) {
      await saveToggleState(pendingToggleValue)
    }
    setPendingToggleValue(null)
  }

  const cancelToggle = () => {
    setShowConfirmToggleModal(false)
    setPendingToggleValue(null)
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
      
      {/* Kullanıcı İzleme Seçeneği */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text)' }}>
              <UserCheck size={20} className="color-accent" style={{ color: 'var(--color-accent)' }} />
              Kullanıcı İzini Sür
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.5 }}>
              Bu özellik açıldığında cafe panelinde işlem yapmadan önce garsonların isimlerini seçmeleri zorunlu olur.
            </p>
          </div>
          <div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: 50, height: 26 }}>
              <input
                type="checkbox"
                checked={trackingEnabled}
                onChange={(e) => handleToggleChange(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: trackingEnabled ? 'var(--color-accent)' : 'var(--color-surface-3)',
                  transition: '0.3s',
                  borderRadius: 34,
                  border: '1px solid var(--color-border)'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    content: '""',
                    height: 18, width: 18,
                    left: trackingEnabled ? 26 : 4,
                    bottom: 3,
                    backgroundColor: trackingEnabled ? '#000' : 'var(--color-text-muted)',
                    transition: '0.3s',
                    borderRadius: '50%'
                  }}
                />
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Yeni Kullanıcı Ekleme Formu */}
      {trackingEnabled && (
        <div className="card">
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-4)' }}>
            Yeni Kullanıcı Ekle
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)', alignItems: 'end' }}>
            <div className="form-group">
              <label htmlFor="user-ad" className="form-label">Kullanıcı (Garson) Adı Soyadı</label>
              <input
                id="user-ad"
                className="form-input"
                placeholder="ör. Ahmet Yılmaz, Merve Kaya"
                value={yeniAd}
                onChange={(e) => setYeniAd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && userEkle()}
              />
            </div>

            <button
              id="user-ekle-btn"
              onClick={userEkle}
              className="btn btn-primary"
              disabled={!yeniAd.trim() || isDuplicate}
              style={{ marginBottom: 0, height: 42, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={16} /> Ekle
            </button>
          </div>
        </div>
      )}

      {/* Kullanıcı Listesi */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Aktif Kullanıcılar ({aktifKullanicilar.length})
          </span>

          <div style={{ marginLeft: 'auto' }}>
            <button
              id="kaydet-users"
              onClick={handleKaydet}
              disabled={!isDirty || kaydediliyor}
              className="btn btn-primary"
              style={{ opacity: (!isDirty || kaydediliyor) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {kaydediliyor ? 'Kaydediliyor…' : <><Save size={16} /> Kaydet</>}
            </button>
          </div>
        </div>

        <div style={{
          opacity: trackingEnabled ? 1 : 0.5,
          pointerEvents: trackingEnabled ? 'auto' : 'none',
          transition: 'opacity 0.2s ease, filter 0.2s ease'
        }}>
          {aktifKullanicilar.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-10)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
              <div className="empty-state__icon"><Users size={32} /></div>
              <p className="empty-state__title" style={{ fontSize: 16 }}>Henüz kullanıcı oluşturulmadı</p>
              <p className="empty-state__desc" style={{ fontSize: 13 }}>Kullanıcı izleme özelliğini açmak için yukarıdan en az bir çalışan ekleyin.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {aktifKullanicilar.map((u) => (
                <div
                  key={u.id}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ color: 'var(--color-accent)', display: 'inline-flex' }}>
                      <Users size={18} />
                    </span>
                    <input
                      type="text"
                      value={u.name}
                      onChange={(e) => userNameGuncelle(u.id, e.target.value)}
                      style={{
                        flex: 1,
                        background: 'var(--color-surface-2)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px var(--space-3)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        outline: 'none',
                      }}
                      aria-label={`${u.name} adı`}
                    />
                  </div>

                  {/* Kaldırma ve Onay */}
                  {deleteConfirmId === u.id ? (
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={() => {
                          userSoftDelete(u.id)
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
                        Kaldırmayı Onayla
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
                      onClick={() => setDeleteConfirmId(u.id)}
                      className="btn btn-ghost btn-sm"
                      aria-label={`${u.name} kaldır`}
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
      </div>

      <div className="card" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px', color: 'var(--color-accent)' }} /> <strong>Bilgi:</strong> Geçmiş işlemlerin doğruluğu için silinen kullanıcılar sistemden tamamen kaldırılmaz. Bu sayede, yaptıkları eski siparişler ve ödemeler hareket geçmişinde adlarıyla görünmeye devam eder. Kullanıcı izleme kapatılsa bile çalışan listesi korunur.
        </p>
      </div>

      {/* Kullanıcı İzlemeyi Aktif Etme Onay Modalı */}
      {showConfirmToggleModal && (
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
            if (e.target === e.currentTarget) cancelToggle()
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
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-accent)' }}><Users size={48} /></div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
                {pendingToggleValue === false ? 'Kullanıcı İzlemeyi Kapat?' : 'Kullanıcı İzlemeyi Aktif Et?'}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {pendingToggleValue === false
                  ? 'Kullanıcı izleme özelliğini kapattığınızda, işlemler sırasında çalışan seçimi yapılması gerekmeyecektir. Kapatmak istiyor musunuz?'
                  : 'Bu özelliği açtığınızda, tüm sipariş ve ödeme işlemlerinde çalışanların kendi isimlerini seçmesi zorunlu olacaktır. Aktif etmek istiyor musunuz?'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={cancelToggle}
              >
                Vazgeç
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={confirmToggle}
              >
                {pendingToggleValue === false ? 'Evet, Kapat' : 'Evet, Aktif Et'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
