import { describe, expect, test } from 'vitest'

import { delay, renderWithRouter } from '@/utils/testUtils'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  })
})


describe('ProductDetail', () => {
  test('Render UI ProductDetail', async () => {
    renderWithRouter({
      route: '/Điện%20Thoại%20Vsmart%20Active%203%206GB64GB%20%20Hàng%20Chính%20Hãng-i.60afb2c76ef5b902180aacba'
    })

    await delay(1000)
    expect(document.body).toMatchSnapshot()
  })
})
