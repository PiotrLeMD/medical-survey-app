export const ADMIN_AUTH_STORAGE_KEY = "is_admin_authenticated"

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true"
}

export function setAdminAuthenticated(authenticated: boolean): void {
  if (typeof window === "undefined") return
  if (authenticated) {
    localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true")
  } else {
    localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY)
  }
}

export function clearAdminSession(): void {
  setAdminAuthenticated(false)
}
