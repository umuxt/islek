import type { Metadata } from 'next'
import './globals.css'
import AppShell from './AppShell'
import { ToastProvider } from '@/context/ToastContext'

export const metadata: Metadata = {
  title: 'İşlek — Kafe Adisyon Yönetimi',
  description: 'Kafeniz için masa takibi, sipariş yönetimi ve günlük istatistikler.',
  icons: {
    icon: '/logo-islek.svg',
    shortcut: '/logo-islek.svg',
    apple: '/logo-islek.svg',
  },
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
