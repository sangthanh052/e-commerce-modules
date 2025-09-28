import { http, HttpResponse } from 'msw'

import config from '@/constants/config'
import { access_token_1s } from './auth.msw'
import { HttpStatusCode } from 'axios'

const meRes = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '64b42d831afc2e1a1f96b952',
    roles: ['User'],
    email: 'a@a.com',
    createdAt: '2023-07-16T17:48:51.361Z',
    updatedAt: '2025-08-29T14:06:24.452Z',
    address: '11/9 Đình Phong Phú',
    avatar: 'https://api-ecom.duthanhduoc.com/images/84360bd5-af07-4584-bdd5-5e54c6d5b88e.jpg',
    date_of_birth: '2020-08-19T17:00:00.000Z',
    name: 'user test',
    phone: '123455643'
  }
}

/**
 * 
  http.get('/example/:id', ({
    request,
    params,
    cookies,
    requestId,
    signal,
  }) => {
    // request: Fetch API Request object
    // params: object chứa route params (ví dụ /example/123 → params.id = "123")
    // cookies: object chứa cookies parse sẵn
    // requestId: string unique cho mỗi request (dùng debug/log)
    // signal: AbortSignal, có thể nghe khi request bị hủy
  })
 */

export const meRequest = http.get(`${config.baseUrl}user`, ({ request }) => {
  const access_token = request.headers.get('authorization')

  if (access_token === access_token_1s) {
    console.log(access_token);
    return HttpResponse.json(
      {
        message: 'Lỗi',
        data: {
          message: 'Token hết hạn',
          name: 'EXPIRED_TOKEN'
        }
      },
      { status: HttpStatusCode.Unauthorized }
    )
  }

  return HttpResponse.json(meRes, { status: HttpStatusCode.Ok })
})

const userRequests = [meRequest]

export default userRequests
