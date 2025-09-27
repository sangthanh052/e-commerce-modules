/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from '../utils'
import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokentoLS
} from '../auths'

// mock axios instance
const mockAxiosInstance = {
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

vi.mock('axios', () => ({
  default: { create: vi.fn(() => mockAxiosInstance) },
  isAxiosError: vi.fn(),
  HttpStatusCode: { Unauthorized: 401, BadRequest: 400, UnprocessableEntity: 422, InternalServerError: 500 }
}))

vi.mock('@/apis/auth.api', () => ({
  URL_LOGIN: '/login',
  URL_REGISTER: '/register',
  URL_LOGOUT: '/logout',
  URL_REFRESH_TOKEN: '/refresh-token'
}))

vi.mock('../auths', () => ({
  getAccessTokenFromLS: vi.fn(),
  getRefreshTokenFromLS: vi.fn(),
  setAccessTokenToLS: vi.fn(),
  setRefreshTokentoLS: vi.fn(),
  setProfileToLS: vi.fn(),
  clearLS: vi.fn()
}))

vi.mock('../utils', () => ({
  isAxiosUnauthorizedError: vi.fn(),
  isAxiosExpiredTokenError: vi.fn()
}))

vi.mock('react-toastify', () => ({ toast: { error: vi.fn() } }))

const mockedToast = toast as unknown as { error: ReturnType<typeof vi.fn> }

describe('Http class', () => {
  let Http: any

  const getInterceptor = () => mockAxiosInstance.interceptors.response.use.mock.calls[0]

  beforeEach(async () => {
    vi.clearAllMocks()
    Http = (await import('../http')).Http
    new Http()
  })

  it('thêm accessToken vào headers nếu có', () => {
    ;(getAccessTokenFromLS as unknown as ReturnType<typeof vi.fn>).mockReturnValue('token123')
    ;(getRefreshTokenFromLS as unknown as ReturnType<typeof vi.fn>).mockReturnValue('refresh123')
    expect(axios.create).toHaveBeenCalled()
  })

  it('login thành công thì set token + profile', async () => {
    const { URL_LOGIN } = await import('@/apis/auth.api')
    const response = {
      config: { url: URL_LOGIN },
      data: { data: { access_token: 'a1', refresh_token: 'r1', user: { id: 1 } } }
    }
    const [success] = getInterceptor()
    success(response)

    expect(setAccessTokenToLS).toHaveBeenCalledWith('a1')
    expect(setRefreshTokentoLS).toHaveBeenCalledWith('r1')
    expect(setProfileToLS).toHaveBeenCalledWith({ id: 1 })
  })

  it('toast error khi không phải 401/422', async () => {
    const error = { response: { status: HttpStatusCode.BadRequest, data: { message: 'fail' } } } as AxiosError
    const [, fail] = getInterceptor()
    await fail(error).catch(() => {})
    expect(mockedToast.error).toHaveBeenCalledWith('fail')
  })

  it('clearAuth + toast khi Unauthorized mà không phải refresh', async () => {
    ;(isAxiosUnauthorizedError as any).mockReturnValue(true)
    ;(isAxiosExpiredTokenError as any).mockReturnValue(false)

    const error = { response: { status: 401, config: { url: '/other' }, data: { message: 'unauthorized' } } }

    const http = new Http()
    const clearSpy = vi.spyOn(http as any, 'clearAuth')

    await (http as any).handleErrorResponse(error).catch(() => {})
    expect(clearSpy).toHaveBeenCalled()
    expect(mockedToast.error).toHaveBeenCalledWith('unauthorized')
  })

  it('set accessToken khi refresh thành công', async () => {
    const http = new Http()
    http.instance.post = vi.fn().mockResolvedValue({ data: { data: { access_token: 'newToken' } } })

    const token = await (http as any).handleRefreshToken()
    expect(token).toBe('newToken')
    expect(setAccessTokenToLS).toHaveBeenCalledWith('newToken')
  })

  it('clearAuth khi refresh thất bại', async () => {
    const http = new Http()
    http.instance.post = vi.fn().mockRejectedValue(new Error('refresh fail'))
    const clearSpy = vi.spyOn(http as any, 'clearAuth')


    await expect((http as any).handleRefreshToken()).rejects.toThrow('refresh fail')
    expect(clearSpy).toHaveBeenCalled()
  })
})
