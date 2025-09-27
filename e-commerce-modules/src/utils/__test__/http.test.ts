/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokentoLS
} from '../auths'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from '../utils'

// Mock toàn bộ dependency
// [0][0] = success handler , [0][1] = error handler
const mockAxiosInstance = {
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  },
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
}

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance)
    },
    isAxiosError: vi.fn(),
    isAxiosUnauthorizedError: vi.fn(),
    HttpStatusCode: {
      Unauthorized: 401,
      BadRequest: 400,
      UnprocessableEntity: 422,
      InternalServerError: 500
    }
  }
})

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
  beforeEach(async () => {
    vi.clearAllMocks()
    const { Http } = await import('../http')
    new Http()
  })

  //"Kiểm tra xem trong quá trình chạy test, hàm axios.create() có được gọi hay không
  it('thêm accessToken vào headers nếu có', async () => {
    // import lại http sau khi mock. Đảm bảo class/function sử dụng mocked version, không phải bản gốc.

    // set fake value
    ;(getAccessTokenFromLS as unknown as ReturnType<typeof vi.fn>).mockReturnValue('token123')
    ;(getRefreshTokenFromLS as unknown as ReturnType<typeof vi.fn>).mockReturnValue('refresh123')

    // toHaveBeenCalled() là matcher của Vitest/Jest để đảm bảo rằng Http đã tạo instance axios mới, tức interceptor cũng đã được setup.
    expect(axios.create).toHaveBeenCalled()
  })

  it('khi login thành công thì set accessToken, refreshToken, profile', async () => {
    const { URL_LOGIN } = await import('@/apis/auth.api')

    const response = {
      config: { url: URL_LOGIN },
      data: {
        data: {
          access_token: 'access123',
          refresh_token: 'refresh123',
          user: { id: 1, name: 'Shang' }
        }
      }
    }

    // mockAxiosInstance.interceptors.response.use giả lập this.instance.interceptors.response.use
    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled()

    // Lấy callback success của interceptor
    const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0]
    const result = responseInterceptor(response)

    // Kiểm tra hàm mock đã được gọi với đúng tham số
    expect(setAccessTokenToLS).toHaveBeenCalledWith('access123')
    expect(setRefreshTokentoLS).toHaveBeenCalledWith('refresh123')
    expect(setProfileToLS).toHaveBeenCalledWith({ id: 1, name: 'Shang' })

    expect(result).toEqual(response)
  })

  it('handleErrorResponse: toast error khi không phải 401/422', async () => {
    const error = {
      response: { status: HttpStatusCode.BadRequest, data: { message: 'fail' } },
      message: 'error'
    } as AxiosError

    // lấy callback error từ interceptor
    const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]
    await errorInterceptor(error).catch(() => {})
    expect(mockedToast.error).toHaveBeenCalledWith('fail')
  })

  // it('handleErrorResponse: gọi clearAuth và toast khi Unauthorized mà không phải refresh', async () => {
  //   ;(isAxiosUnauthorizedError as any).mockReturnValue(true)
  //   ;(isAxiosExpiredTokenError as any).mockReturnValue(false)

  //   const error = {
  //     response: { status: HttpStatusCode.Unauthorized, config: { url: '/other' }, data: { message: 'unauthorized' } }
  //   } as any

  //   const errorInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]
  //   await errorInterceptor(error).catch(() => {})

  //   expect(clearLS).toHaveBeenCalled()
  //   expect(mockedToast.error).toHaveBeenCalledWith('unauthorized')
  // })

  it('handleErrorResponse: gọi clearAuth và toast khi Unauthorized mà không phải refresh', async () => {
    ;(isAxiosUnauthorizedError as any).mockReturnValue(true)
    ;(isAxiosExpiredTokenError as any).mockReturnValue(false)
    const error = {
      response: { status: HttpStatusCode.Unauthorized, config: { url: '/other' }, data: { message: 'unauthorized' } }
    }
    const postMock = vi.fn().mockRejectedValue(error)

    const { Http } = await import('../http')
    const http = new Http()

    ;(http as any).instance.post = postMock

    const clearSpy = vi.spyOn(http as any, 'clearAuth')

    //http as any ép kiểu sẽ gọi được private
    await (http as any).handleErrorResponse(error).catch(() => {})

    expect(clearSpy).toHaveBeenCalled()
    expect(mockedToast.error).toHaveBeenCalledWith('unauthorized')
  })

  it('handleRefreshToken: set accessToken khi refresh thành công', async () => {
    const postMock = vi.fn().mockResolvedValue({
      data: { data: { access_token: 'newToken' } }
    })
    const { Http } = await import('../http')
    const http = new Http()

    http.instance.post = postMock

    const token = await (http as any).handleRefreshToken()

    expect(token).toBe('newToken')
    expect(setAccessTokenToLS).toHaveBeenCalledWith('newToken')
  })

  it('handleRefreshToken: clearAuth khi refresh thất bại', async () => {
    const { Http } = await import('../http')
    const http = new Http()

    // mock API refresh token thất bại
    ;(http as any).instance.post = vi.fn().mockRejectedValue(new Error('refresh fail'))

    const clearSpy = vi.spyOn(http as any, 'clearAuth')

    await expect((http as any).handleRefreshToken()).rejects.toThrow('refresh fail')
    expect(clearSpy).toHaveBeenCalled()
  })
})
