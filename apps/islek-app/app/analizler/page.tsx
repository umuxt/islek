"use client"

import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Banknote, CreditCard, Building } from 'lucide-react'
import type { DailyStats } from '@islek/db'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalizlerPage() {
  const [zamanFiltresi, setZamanFiltresi] = useState<number>(1) // Varsayılan: Bugün (1 gün)
  const [stats, setStats] = useState<DailyStats[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setYukleniyor(true)
      try {
        const res = await fetch(`/api/stats?gun=${zamanFiltresi}`)
        const data = await res.json()
        setStats(Array.isArray(data) ? data : [])
        
        // Ödemeleri çek (Bugünün)
        const payRes = await fetch(`/api/stats/payments?limit=5`)
        const payData = await payRes.json()
        setPayments(payData.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setYukleniyor(false)
      }
    }
    fetchData()
  }, [zamanFiltresi])

  const kpi = useMemo(() => {
    let toplamCiro = 0
    let masaSayisi = 0
    let nakit = 0
    let krediKarti = 0
    let iban = 0
    const urunHaritasi: Record<string, number> = {}

    stats.forEach(s => {
      toplamCiro += s.toplamCiro || 0
      masaSayisi += s.masaSayisi || 0
      nakit += s.nakitCiro || 0
      krediKarti += s.krediKartiCiro || 0
      iban += s.ibanCiro || 0

      s.enCokSatilanlar?.forEach(u => {
        urunHaritasi[u.ad] = (urunHaritasi[u.ad] || 0) + u.adet
      })
    })

    const enCokSatanlar = Object.entries(urunHaritasi)
      .map(([ad, adet]) => ({ ad, adet }))
      .sort((a, b) => b.adet - a.adet)
      .slice(0, 5)

    return { toplamCiro, masaSayisi, nakit, krediKarti, iban, enCokSatanlar }
  }, [stats])

  const pieData = [
    { name: 'Nakit', value: kpi.nakit },
    { name: 'Kredi Kartı', value: kpi.krediKarti },
    { name: 'IBAN', value: kpi.iban },
  ].filter(d => d.value > 0)

  if (yukleniyor) {
    return (
      <main className="container" style={{ padding: 'var(--space-8) 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <img src="/logo-loading.png" alt="Loading" style={{ height: '64px', width: 'auto', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15 }}>Analizler yükleniyor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container page-container">
      
      {/* Header & Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', marginBottom: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="page-title">Analizler</h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', background: 'var(--color-surface-2)', padding: 'var(--space-1)', borderRadius: 'var(--radius-full)', justifyContent: 'center' }}>
          {[
            { label: 'Bugün', val: 1 },
            { label: 'Son 7 Gün', val: 7 },
            { label: 'Son 30 Gün', val: 30 },
            { label: 'Tüm Zamanlar', val: 365 },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setZamanFiltresi(f.val)}
              className="btn btn-sm"
              style={{
                padding: '6px 14px', fontSize: 13, fontWeight: 600,
                borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                background: zamanFiltresi === f.val ? '#000' : 'transparent',
                color: zamanFiltresi === f.val ? '#20D76D' : 'var(--color-text-muted)',
                boxShadow: zamanFiltresi === f.val ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <a 
            href="/analizler/gun-sonu"
            className="btn btn-primary btn-sm"
            style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            GÜN SONU KONTROL
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>TOPLAM CİRO</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-primary)' }}>
            ₺{kpi.toplamCiro.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
        </div>
        
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>AÇILAN MASA</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)' }}>
            {kpi.masaSayisi}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>ORTALAMA SEPET</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text)' }}>
            ₺{kpi.masaSayisi > 0 ? (kpi.toplamCiro / kpi.masaSayisi).toLocaleString('tr-TR', { maximumFractionDigits: 0 }) : 0}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-4)' }}>Ciro Trendi</h3>
          <div style={{ height: 250, width: '100%' }}>
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="tarih" tickFormatter={(val) => val.split('-').slice(1).join('/')} stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₺${val}`} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--color-surface)' }}
                    contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)', boxShadow: 'var(--shadow-lg)' }}
                    formatter={(val: any) => [`₺${val}`, 'Ciro']}
                    labelFormatter={(val: any) => `Tarih: ${val}`}
                  />
                  <Bar dataKey="toplamCiro" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Kayıt Yok</div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-4)' }}>Ödeme Yöntemleri</h3>
          <div style={{ height: 250, width: '100%' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}
                    formatter={(val: any) => [`₺${Number(val).toLocaleString()}`, 'Tutar']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>Kayıt Yok</div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Top Sellers & Recent Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        
        {/* Top Sellers */}
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 'var(--space-4)' }}>En Çok Satanlar</h3>
          {kpi.enCokSatanlar.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {kpi.enCokSatanlar.map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.ad}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{u.adet} adet</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>Henüz yeterli veri yok.</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div style={{ background: 'var(--color-surface-2)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>Son İşlemler (Bugün)</h3>
            <span style={{ fontSize: 12, color: 'var(--color-primary)', background: 'var(--color-primary-muted)', padding: '4px 8px', borderRadius: 'var(--radius-md)' }}>Canlı</span>
          </div>
          
          {payments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {payments.map((p, i) => {
                const date = new Date(p.zamani)
                const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.masaAdi || 'Masa'}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {timeStr} • 
                        {p.yontem === 'nakit' ? <><Banknote size={12}/> Nakit</> : p.yontem === 'iban' ? <><Building size={12}/> IBAN</> : <><CreditCard size={12}/> Kredi Kartı</>}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>₺{p.tutar}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>Bugün henüz işlem yok.</p>
          )}
        </div>

      </div>

    </main>
  )
}
