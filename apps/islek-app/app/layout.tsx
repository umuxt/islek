import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: 'OkeyBill — Okey Kafesi Adisyon Yönetimi',
  description: 'Okey kafeniz için masa takibi, sipariş yönetimi ve günlük istatistikler.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <ToastProvider>
          <Navbar />
          <div className="page-wrapper">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}
