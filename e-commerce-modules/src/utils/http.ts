/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, HttpStatusCode, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '@/apis/auth.api'
import type { AuthResponse, RefreshTokenReponse } from '@/types/auth.type'
import type { ErrorResponse } from '@/types/utils.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokentoLS
} from './auths'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10 // 10 giây
        // 'expire-refresh-token': 60 * 60 // 1 giờ
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        // xử lý login, register, logout
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokentoLS(this.refreshToken)
          setProfileToLS(data.data.user)
        } else if (url === URL_LOGOUT) {
          this.clearAuth()
        }

        return response
      },
      (error: AxiosError) => this.handleErrorResponse(error)
    )
  }

  private async handleErrorResponse(error: AxiosError) {
    const status = error.response?.status

    // chỉ toast khi không phải 422 hoặc 401
    if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(status as number)) {
      const data = error.response?.data as any
      const message = data?.message || error.message
      toast.error(message)
    }

    if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
      const config = (error.response?.config || { headers: {} }) as InternalAxiosRequestConfig
      const { url } = config

      if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
        // Nếu this.refreshTokenRequest đã có → dùng lại Promise đang chạy.
        // Nếu chưa có → gọi handleRefreshToken() để tạo request refresh.
        // ví dụ có 5 rq thì chạy 5 lần nhưng chỉ dùng handleRefreshToken() 1 lần trong khoảng 10s.
        // Kỹ thuật này gọi là deduplication hoặc request coalescing.
        this.refreshTokenRequest =
          this.refreshTokenRequest ??
          this.handleRefreshToken().finally(() => {
            setTimeout(() => (this.refreshTokenRequest = null), 10000)
          })

        return this.refreshTokenRequest.then((access_token) =>
          this.instance({
            ...config,
            headers: { ...config.headers, authorization: access_token }
          })
        )
      }

      this.clearAuth()
      toast.error((error.response?.data as any)?.data?.message || (error.response?.data as any)?.message)
    }

    return Promise.reject(error)
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        this.accessToken = access_token
        setAccessTokenToLS(access_token)
        return access_token
      })
      .catch((error) => {
        this.clearAuth()
        throw error
      })
  }

  private clearAuth() {
    clearLS()
    this.accessToken = ''
    this.refreshToken = ''
  }
}

const http = new Http().instance
export default http
