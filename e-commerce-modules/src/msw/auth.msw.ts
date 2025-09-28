import { HttpStatusCode } from 'axios'
import { http, HttpResponse } from 'msw'
import { URL_LOGIN } from '@/apis/auth.api'


import config from '@/constants/config'

export const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMTU6MTU6MTIuNTMyWiIsImlhdCI6MTc1NjkxMjUxMiwiZXhwIjoxNzU3NTE3MzEyfQ.jw_OSC02mnHKr6queBZSfX8PgW6jfhJnXXii9eTev-I'
export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMTU6MTU6MTIuNTMyWiIsImlhdCI6MTc1NjkxMjUxMiwiZXhwIjoxNzU3NTE3MzEyfQ.jw_OSC02mnHKr6queBZSfX8PgW6jfhJnXXii9eTev-I'
export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMTU6MTU6MTIuNTMyWiIsImlhdCI6MTc1NjkxMjUxMiwiZXhwIjoxNzY1NTUyNTEyfQ.b16KDWx00eu3uB_yYElffgMY47FWvLrL4-zIezAqSnk'

const loginRes = {
  message: 'Đăng nhập thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMTU6MTU6MTIuNTMyWiIsImlhdCI6MTc1NjkxMjUxMiwiZXhwIjoxNzU3NTE3MzEyfQ.jw_OSC02mnHKr6queBZSfX8PgW6jfhJnXXii9eTev-I',
    expires: 604800,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMTU6MTU6MTIuNTMyWiIsImlhdCI6MTc1NjkxMjUxMiwiZXhwIjoxNzY1NTUyNTEyfQ.b16KDWx00eu3uB_yYElffgMY47FWvLrL4-zIezAqSnk',
    expires_refresh_token: 8640000,
    user: {
      _id: '64b42d831afc2e1a1f96b952',
      roles: ['User'],
      email: 'a@a.com',
      createdAt: '2023-07-16T17:48:51.361Z',
      updatedAt: '2025-08-29T14:06:24.452Z',
      __v: 0,
      address: '11/9 Đình Phong Phú',
      avatar: 'https://api-ecom.duthanhduoc.com/images/84360bd5-af07-4584-bdd5-5e54c6d5b88e.jpg',
      date_of_birth: '2020-08-19T17:00:00.000Z',
      name: 'user test',
      phone: '123455643'
    }
  }
}

const loginResErr = {
  message: 'Lỗi',
  data: {
    email: 'Email không đúng định dạng',
    password: 'Mật khẩu phải từ 6-160 kí tự'
  }
}

const refreshTokenRes = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMDk6MzU6MDEuOTIxWiIsImlhdCI6MTc1Njg5MjEwMSwiZXhwIjoxNzU3NDk2OTAxfQ.Cm2k2pxEpvkAPWXkTX1G-mMSHQ_y473RvQXNvKL8ZAQ'
  }
}

const loginRequest = http.post(`${config.baseUrl}${URL_LOGIN}`, () => {
  return HttpResponse.json(loginRes, { status: HttpStatusCode.Ok })
})

const refreshToken = http.post(`${config.baseUrl}refresh-access-token`, () => {
  return HttpResponse.json(refreshTokenRes, { status: HttpStatusCode.Ok })
})

// export const restHandlers = [
//   http.post(`${config.baseUrl}login`, async ({ request }) => {
//     // Nếu cần đọc body (JSON hoặc formData)
//     // const body = await request.json()
//     return HttpResponse.json(loginRes, { status: HttpStatusCode.Ok }) // thay ctx.status + ctx.json
//   })
// ]

const authRequest = [loginRequest, refreshToken]
export default authRequest
