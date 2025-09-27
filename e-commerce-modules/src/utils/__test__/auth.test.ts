/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  LocalStorageEventTarget,
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  getprofileFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokentoLS
} from '../auths' // chỉnh lại path cho phù hợp

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjQyZDgzMWFmYzJlMWExZjk2Yjk1MiIsImVtYWlsIjoiYUBhLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjUtMDktMDNUMDk6MDM6NTUuODA5WiIsImlhdCI6MTc1Njg5MDIzNSwiZXhwIjoxNzU3NDk1MDM1fQ._bUNHMDyQLb-7osznFsmKP5a5f-V03o0j4FpFVh62-0'
const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xNVQxNDowNTozNS41MTVaIiwiaWF0IjoxNjcxMTEzMTM1LCJleHAiOjE3NTc1MTMxMzV9.OHDBqBjhih1fgNe6-mWo0PQ-IcukNz4ljlXUCxM-8V8'
const profile =
  '{"_id":"64b42d831afc2e1a1f96b952","roles":["User"],"email":"a@a.com","createdAt":"2023-07-16T17:48:51.361Z","updatedAt":"2025-08-23T15:37:44.316Z","__v":0,"address":"11/9 Đình Phong Phú","avatar":"https://api-ecom.duthanhduoc.com/images/03f87e38-3dff-4021-ad7a-1dc5e9e0bb9e.png","date_of_birth":"2020-08-19T17:00:00.000Z","name":"user test","phone":"123455643"}'

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('set/get accessToken', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    setAccessTokenToLS(access_token)

    expect(spy).toHaveBeenCalledWith('access_token', access_token)
    expect(getAccessTokenFromLS()).toBe(access_token)
  })

  it('set/get refreshToken', () => {
    setRefreshTokentoLS(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
    expect(getRefreshTokenFromLS()).toBe(refresh_token)
  })

  it('set/get profile', () => {
    setProfileToLS(JSON.parse(profile))
    expect(getprofileFromLS()).toEqual(JSON.parse(profile))
  })

  it('getprofileFromLS trả về null nếu không có', () => {
    expect(getprofileFromLS()).toBeNull()
  })

  it('clearLS xoá các key và phát event', () => {
    const listener = vi.fn()
    LocalStorageEventTarget.addEventListener('clearLs', listener)

    setAccessTokenToLS(access_token)
    setRefreshTokentoLS(refresh_token)
    setProfileToLS(JSON.parse(profile))

    clearLS()

    expect(getAccessTokenFromLS()).toBe('')
    expect(getRefreshTokenFromLS()).toBe('')
    expect(getprofileFromLS()).toBeNull()

    expect(listener).toHaveBeenCalled()
  })
})
