export function getActiveWaiter(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('islek_aktif_garson')
}

export function setActiveWaiter(name: string | null) {
  if (typeof window === 'undefined') return
  if (name) {
    localStorage.setItem('islek_aktif_garson', name)
  } else {
    localStorage.removeItem('islek_aktif_garson')
  }
  window.dispatchEvent(new Event('islek-garson-changed'))
}
