// app.test.js
import '@testing-library/jest-dom'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import path from './constants/path'
import { logScreenAfter, logScreenImmediate, renderWithRouter } from './utils/testUtils'

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
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('App', () => {
  // test và it là 1, viết cái nào cũng được
  test('App render và chuyển trang', async () => {
    const { user } = renderWithRouter()
    // Verify vào đúng trang chủ
    await waitFor(() => {
      logScreenAfter(document.body.parentElement as HTMLElement)
      expect(document.querySelector('title')?.textContent).toBe('Vite + React + TS')
    })

    
    // Verify chuyển sang trang login
    await user.click(screen.getByText(/Đăng nhập/i))

    expect(await screen.findByText('Bạn chưa có tài khoản?')).toBeInTheDocument()
  })

  test('Về trang NotFound', async () => {
    const badRoute = '/some/bad/route' //url sai để redirect về page 404
    renderWithRouter({ route: badRoute })

    expect(await screen.findByText(/Page Not Found/i)).toBeInTheDocument()

    logScreenImmediate()
  })

  test('Render trang Register', async () => {
    renderWithRouter({ route: path.register })
    expect(await screen.findByText(/Bạn đã có tài khoản?/i)).toBeInTheDocument()
  })
})
