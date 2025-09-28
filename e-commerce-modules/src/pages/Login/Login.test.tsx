import '@testing-library/jest-dom'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import path from '@/constants/path'
import { renderWithRouter } from '@/utils/testUtils'

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

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeEach(async () => {
    renderWithRouter({ route: path.login })
    expect(await screen.findByPlaceholderText('Email')).toBeInTheDocument()
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  // Cleanup sau mỗi test để tránh rò rỉ DOM
  // afterEach(async () => {
  //   cleanup()

  //   const { currentTestName, suppressedErrors } = expect.getState()
  //   if (suppressedErrors?.length) {
  //     console.log(`❌ Test failed: ${currentTestName}`)
  //     await logScreenAfter(document.body, { timeout: 3000 })
  //   }

  // })

  it('Hiển thị lỗi required khi người dùng không nhập gì', async () => {
    fireEvent.click(submitButton)
    expect(await screen.findByText('Email Address is Invalid')).toBeInTheDocument()
    expect(await screen.findByText('Password is required')).toBeInTheDocument()
  })

  it('Không nên hiển thị lỗi khi nhập lại value đúng', async () => {
    fireEvent.change(emailInput, { target: { value: 'a@a.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    //Kiểm tra có show lỗi dưới form không
    expect(screen.queryByText(/Email Address is Invalid/i)).toBeFalsy()
    expect(screen.queryByText(/Length from 5-160 characters/i)).not.toBeInTheDocument()

    //Click submit
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(document.title).toBe('Vite + React + TS')
    })
  })
})
