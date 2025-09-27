/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError, HttpStatusCode } from 'axios'
import { describe, expect, test } from 'vitest'

import {
  formatCurrency,
  generateNameId,
  getIdFromNameId,
  isAxiosError,
  isAxiosExpiredTokenError,
  isAxiosUnauthorizedError,
  isAxiosUnprocessableEntityError,
  rateSale
} from '../utils'

describe('utils', () => {
  describe('Axios error type guards', () => {
    // Helper tạo AxiosError mock
    const mockError = (status?: number, data?: any): AxiosError<any> =>
      ({
        isAxiosError: true,
        response: status
          ? {
              status,
              data
            }
          : undefined
      }) as AxiosError

    // isAxiosError

    test('isAxiosError should return true for AxiosError', () => {
      const error = mockError()
      expect(isAxiosError(error)).toBe(true)
    })

    test('isAxiosError should return false for non-AxiosError', () => {
      expect(isAxiosError(new Error('normal error'))).toBe(false)
    })

    // isAxiosUnprocessableEntityError

    test('isAxiosUnprocessableEntityError should return true for 422', () => {
      const error = mockError(HttpStatusCode.UnprocessableEntity)
      expect(isAxiosUnprocessableEntityError(error)).toBe(true)
    })

    test('isAxiosUnprocessableEntityError should return false for other status', () => {
      const error = mockError(HttpStatusCode.BadRequest)
      expect(isAxiosUnprocessableEntityError(error)).toBe(false)
    })

    // isAxiosUnauthorizedError

    test('isAxiosUnauthorizedError should return true for 401', () => {
      const error = mockError(HttpStatusCode.Unauthorized)
      expect(isAxiosUnauthorizedError(error)).toBe(true)
    })

    test('isAxiosUnauthorizedError should return false for non-401', () => {
      const error = mockError(HttpStatusCode.Forbidden)
      expect(isAxiosUnauthorizedError(error)).toBe(false)
    })

    // isAxiosExpiredTokenError

    test('isAxiosExpiredTokenError should return true when status 401 and name=EXPIRED_TOKEN', () => {
      const error = mockError(HttpStatusCode.Unauthorized, {
        data: { name: 'EXPIRED_TOKEN', message: 'expired' }
      })
      expect(isAxiosExpiredTokenError(error)).toBe(true)
    })

    test('isAxiosExpiredTokenError should return false when status 401 but different name', () => {
      const error = mockError(HttpStatusCode.Unauthorized, {
        data: { name: 'OTHER', message: 'invalid' }
      })
      expect(isAxiosExpiredTokenError(error)).toBe(false)
    })
  })

  describe('formatCurrency', () => {
    test('should format number to VND currency with dot separator', () => {
      expect(formatCurrency(1000000)).toBe('₫1.000.000')
    })
  })

  describe('rateSale', () => {
    test('should return correct sale rate', () => {
      expect(rateSale(100000, 80000)).toBe('20%')
    })
  })

  describe('generateNameId & getIdFromNameId', () => {
    test('should generate nameId without special characters and return id correctly', () => {
      const name = 'Giày @Nike Zoom! Pegasus'
      const id = '12345'
      const nameId = generateNameId({ name, id })
      expect(nameId).toBe('Giày-Nike-Zoom-Pegasus-i.12345')
      expect(getIdFromNameId(nameId)).toBe('12345')
    })
  })
})
