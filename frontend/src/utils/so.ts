export function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window as any).isMobileApp
}

export function isApp() {
  return (window as any).isMobileApp
}