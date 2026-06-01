'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    setToasts((prev) => [...prev, { id, message, type }])

    // Otomatik kapatma (3 saniye)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portalı / Container */}
      <div
        style={{
          position: 'fixed',
          top: 'var(--space-6)',
          right: 'var(--space-6)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          pointerEvents: 'none',
          maxWidth: '360px',
          width: '100%',
        }}
      >
        {toasts.map((toast) => {
          let bg = 'var(--color-surface-2)'
          let border = '1px solid var(--color-border)'
          let color = 'var(--color-text)'
          let Icon = Info

          if (toast.type === 'success') {
            bg = 'rgba(34, 197, 94, 0.15)'
            border = '1px solid var(--color-empty)'
            color = 'var(--color-empty)'
            Icon = CheckCircle2
          } else if (toast.type === 'error') {
            bg = 'rgba(239, 68, 68, 0.15)'
            border = '1px solid var(--color-active)'
            color = 'var(--color-active)'
            Icon = AlertCircle
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: bg,
                border: border,
                color: color,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                backdropFilter: 'blur(10px)',
                animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <Icon size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, color: 'var(--color-text)' }}>{toast.message}</span>
              <button
                type="button"
                aria-label="Bildirimi kapat"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>

      {/* SlideIn Animasyon Stili */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
