import type { Metadata } from 'next'
import './globals.css'
import AppShell from './AppShell'
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
          <AppShell>
            {children}
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  )
}
