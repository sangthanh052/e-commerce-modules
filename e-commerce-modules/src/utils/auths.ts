import type { User } from '@/types/user.type'

export const LocalStorageEventTarget = new EventTarget() //Api có sẵn trình duyệt

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokentoLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLs') //Api có sẵn trình duyệt
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getprofileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  const result = JSON.stringify(profile)
  localStorage.setItem('profile', result)
}
