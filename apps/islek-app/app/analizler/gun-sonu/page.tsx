"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Banknote, CreditCard, Building } from 'lucide-react'

export default function GunSonuPage() {
  const [rapor, setRapor] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [aktifTab, setAktifTab] = useState<'ozet' | 'islemler'>('ozet')
  const [odemeFiltresi, setOdemeFiltresi] = useState<'tumu' | 'nakit' | 'kredi_karti' | 'iban'>('tumu')
  const [tarihSecimi, setTarihSecimi] = useState(() => {
    return new Date().toLocaleDateString('en-CA') 
  })

  const tarihDegistir = (gunFarki: number) => {
    const d = new Date(tarihSecimi)
    d.setDate(d.getDate() + gunFarki)
    setTarihSecimi(d.toLocaleDateString('en-CA'))
  }

  useEffect(() => {
    async function fetchData() {
      setYukleniyor(true)
      try {
        const res = await fetch(`/api/stats/end-of-day?date=${tarihSecimi}`)
        const data = await res.json()
        setRapor(data)
      } catch (err) {
        console.error(err)
      } finally {
        setYukleniyor(false)
      }
    }
    fetchData()
  }, [tarihSecimi])

  return (
    <main className="container page-container">
      
      {/* Header */}
      <div className="page-header">
        <div className="page-header__left">
          <Link
            href="/analizler"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            ← Geri
          </Link>
          <div>
            <h1 className="page-title">Gün Sonu Kontrol</h1>
          </div>
        </div>

        <div className="page-header__actions">
          <button 
            onClick={() => tarihDegistir(-1)}
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg style={{ position: 'absolute', left: 12, pointerEvents: 'none', color: 'var(--color-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <input 
              type="date" 
              value={tarihSecimi} 
              onChange={(e) => setTarihSecimi(e.target.value)}
              style={{
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            />
          </div>

          <button 
            onClick={() => tarihDegistir(1)}
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      {yukleniyor || !rapor ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <img src="/logo-islek.svg" alt="Loading" style={{ height: '64px', width: 'auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Rapor Yükleniyor...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          
          {/* Özet Kartları (Her iki tabda da görünsün) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>GENEL TOPLAM</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)' }}>
                ₺{rapor.ozet.toplamCiro.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>NAKİT TOPLAM</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
                ₺{rapor.ozet.nakit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>KART TOPLAM</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>
                ₺{rapor.ozet.krediKarti.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>IBAN TOPLAM</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
                ₺{rapor.ozet.iban.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Sekmeler */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            <button
              onClick={() => setAktifTab('ozet')}
              style={{
                background: aktifTab === 'ozet' ? 'var(--color-primary)' : 'transparent',
                color: aktifTab === 'ozet' ? 'var(--color-primary-fg)' : 'var(--color-text)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ürün Dökümü
            </button>
            <button
              onClick={() => setAktifTab('islemler')}
              style={{
                background: aktifTab === 'islemler' ? 'var(--color-primary)' : 'transparent',
                color: aktifTab === 'islemler' ? 'var(--color-primary-fg)' : 'var(--color-text)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Tüm Ödemeler (Fişler)
            </button>
          </div>

          {/* Kalem Kalem Ürün Tablosu (Aktif Sekme: ozet) */}
          {aktifTab === 'ozet' && (
            <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Tüketilen Ürünler (Kalem Kalem)</h3>
                <div style={{ visibility: 'hidden', display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-1)' }}>
                  <button style={{ padding: '6px 14px', fontSize: 13, border: 'none' }}>Hayalet Filtre</button>
                </div>
              </div>
            
            {rapor.urunler.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--color-surface)' }}>
                    <tr>
                      <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>ÜRÜN ADI</th>
                      <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>ADET</th>
                      <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>TOPLAM TUTAR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rapor.urunler.map((u: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 500 }}>{u.ad}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-5)' }}>
                          <span style={{ background: 'var(--color-surface)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}>
                            {u.adet}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'right', fontWeight: 700, color: 'var(--color-primary)' }}>
                          ₺{u.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                Bu tarihte henüz hiçbir ürün satılmamış.
              </div>
            )}
          </div>
          )}

          {/* İşlemler / Fişler Tablosu (Aktif Sekme: islemler) */}
          {aktifTab === 'islemler' && (
            <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>Satır Satır Tüm Ödemeler</h3>
                
                {/* Ödeme Filtresi */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--color-surface-2)', padding: 'var(--space-1)', borderRadius: 'var(--radius-md)' }}>
                  {[
                    { label: 'Tümü', val: 'tumu' },
                    { label: 'Nakit', val: 'nakit' },
                    { label: 'Kredi Kartı', val: 'kredi_karti' },
                    { label: 'IBAN', val: 'iban' },
                  ].map(f => (
                    <button
                      key={f.val}
                      onClick={() => setOdemeFiltresi(f.val as any)}
                      style={{
                        padding: '6px 14px', fontSize: 13, fontWeight: 600,
                        borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                        background: odemeFiltresi === f.val ? '#000' : 'transparent',
                        color: odemeFiltresi === f.val ? '#20D76D' : 'var(--color-text-muted)',
                        boxShadow: odemeFiltresi === f.val ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {rapor.islemler && rapor.islemler.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--color-surface)' }}>
                      <tr>
                        <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>SAAT</th>
                        <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>MASA</th>
                        <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>İŞLEM</th>
                        <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>ÖDEME TİPİ</th>
                        <th style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, fontSize: 13, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>TUTAR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rapor.islemler
                        .filter((islem: any) => odemeFiltresi === 'tumu' || islem.yontem === odemeFiltresi)
                        .map((islem: any, i: number) => {
                        const date = new Date(islem.zamani)
                        const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                        
                        // Ürünlerin kısaltılmış özeti
                        const icerikOzeti = (islem.urunler || [])
                          .map((u: any) => `${u.adet}x ${u.ad}`)
                          .join(', ')
                          
                        // Ödeme Tipi Rengi
                        let typeColor = 'var(--color-text)'
                        let typeBg = 'var(--color-surface)'
                        let typeLabel: React.ReactNode = islem.yontem
                        if (islem.yontem === 'nakit') {
                          typeColor = '#10b981'
                          typeBg = 'rgba(16, 185, 129, 0.1)'
                          typeLabel = <><Banknote size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Nakit</>
                        } else if (islem.yontem === 'kredi_karti') {
                          typeColor = '#3b82f6'
                          typeBg = 'rgba(59, 130, 246, 0.1)'
                          typeLabel = <><CreditCard size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Kredi Kartı</>
                        } else if (islem.yontem === 'iban') {
                          typeColor = '#f59e0b'
                          typeBg = 'rgba(245, 158, 11, 0.1)'
                          typeLabel = <><Building size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> IBAN</>
                        }

                        return (
                          <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 500, whiteSpace: 'nowrap' }}>{timeStr}</td>
                            <td style={{ padding: 'var(--space-3) var(--space-5)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                              {islem.masaAdi || 'Genel Satış'}
                            </td>
                            <td style={{ padding: 'var(--space-3) var(--space-5)' }}>
                              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {icerikOzeti || 'Detay yok'}
                              </div>
                            </td>
                            <td style={{ padding: 'var(--space-3) var(--space-5)' }}>
                              <span style={{ color: typeColor, background: typeBg, padding: '4px 8px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600 }}>
                                {typeLabel}
                              </span>
                            </td>
                            <td style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'right', fontWeight: 700 }}>
                              ₺{Number(islem.tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  Bu tarihte henüz hiçbir ödeme kaydı yok.
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </main>
  )
}
