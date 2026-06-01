'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && <Navbar />}
      <div className={`page-wrapper${isLoginPage ? ' page-wrapper--no-navbar' : ''}`}>
        {children}
      </div>
    </>
  )
}
