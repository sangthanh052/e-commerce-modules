import type { AuthResponse } from '@/types/auth.type'
import http from '@/utils/http'

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const authApi = {
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_LOGIN, body),
  registerAccount: (body: { email: string; password: string }) => http.post<AuthResponse>(URL_REGISTER, body),
  logoutAccount: () => http.post<AuthResponse>(URL_LOGOUT)
}

export default authApi
