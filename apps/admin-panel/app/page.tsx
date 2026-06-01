'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Tenant {
  id: string
  name: string
  email: string
  createdAt: string
  active: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editTenant, setEditTenant] = useState<Tenant | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchTenants = useCallback(async () => {
    try {
      const res = await fetch('/api/tenants')
      if (res.ok) setTenants(await res.json())
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchTenants() }, [fetchTenants])

  const openCreate = () => {
    setEditTenant(null)
    setForm({ name: '', email: '', password: '' })
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (t: Tenant) => {
    setEditTenant(t)
    setForm({ name: t.name, email: t.email, password: '' })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      let res: Response
      if (editTenant) {
        res = await fetch(`/api/tenants/${editTenant.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        res = await fetch('/api/tenants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      if (res.ok) {
        setShowModal(false)
        fetchTenants()
      } else {
        const data = await res.json()
        setFormError(data.error ?? 'Bir hata oluştu')
      }
    } catch {
      setFormError('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (t: Tenant) => {
    await fetch(`/api/tenants/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !t.active }),
    })
    fetchTenants()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu işletmeyi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/tenants/${id}`, { method: 'DELETE' })
    fetchTenants()
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  const activeTenants = tenants.filter(t => t.active).length
  const inactiveTenants = tenants.filter(t => !t.active).length

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">İ</div>
          <div>
            <div className="sidebar__title">İşlek Admin</div>
            <div className="sidebar__sub">Platform Yönetimi</div>
          </div>
        </div>

        <a href="/" className="sidebar__nav-item active">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          İşletmeler
        </a>

        <div className="sidebar__spacer" />

        <button onClick={handleLogout} className="sidebar__nav-item" style={{ color: 'var(--danger)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Çıkış Yap
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="main-inner">
          <div style={{ marginBottom: 28 }}>
            <h1 className="page-title">İşletme Yönetimi</h1>
            <p className="page-sub">Platforma kayıtlı tüm işletmeleri buradan yönetin</p>
          </div>

          {/* İstatistikler */}
          <div className="card-grid">
            <div className="stat-card">
              <div className="stat-card__label">Toplam İşletme</div>
              <div className="stat-card__value">{tenants.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Aktif</div>
              <div className="stat-card__value stat-card__accent">{activeTenants}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Pasif</div>
              <div className="stat-card__value" style={{ color: 'var(--text-muted)' }}>{inactiveTenants}</div>
            </div>
          </div>

          {/* Tablo başlığı */}
          <div className="flex items-center justify-between mb-6">
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Tüm İşletmeler</h2>
            <button className="btn btn-primary" onClick={openCreate}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Yeni İşletme Ekle
            </button>
          </div>

          {/* Tablo */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>İşletme Adı</th>
                  <th>E-posta</th>
                  <th>Kayıt Tarihi</th>
                  <th>Durum</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Yükleniyor...
                    </td>
                  </tr>
                ) : tenants.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Henüz işletme eklenmemiş. İlk işletmeyi eklemek için "Yeni İşletme Ekle" butonuna tıklayın.
                    </td>
                  </tr>
                ) : (
                  tenants.map(t => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{t.email}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td>
                        <span className={`badge ${t.active ? 'badge-green' : 'badge-red'}`}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                          {t.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>
                            Düzenle
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleActive(t)}
                            style={{ color: t.active ? 'var(--warning)' : 'var(--accent)' }}
                          >
                            {t.active ? 'Dondur' : 'Aktifleştir'}
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal__title">
              {editTenant ? 'İşletmeyi Düzenle' : 'Yeni İşletme Ekle'}
            </h2>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="tenant-name">İşletme Adı</label>
                <input
                  id="tenant-name"
                  className="form-input"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Örn: Kahve Durağı"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tenant-email">E-posta (Giriş için)</label>
                <input
                  id="tenant-email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="kafe@ornekmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tenant-password">
                  Şifre {editTenant && <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>(boş bırakılırsa değişmez)</span>}
                </label>
                <input
                  id="tenant-password"
                  type="password"
                  className="form-input"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required={!editTenant}
                />
              </div>

              {formError && (
                <div style={{
                  background: 'var(--danger-dim)',
                  border: '1px solid var(--danger)',
                  color: 'var(--danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                }}>
                  {formError}
                </div>
              )}

              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  İptal
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Kaydediliyor...' : editTenant ? 'Güncelle' : 'İşletme Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
