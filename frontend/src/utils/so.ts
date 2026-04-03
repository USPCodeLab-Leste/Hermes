export function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window as any).isMobileApp
}