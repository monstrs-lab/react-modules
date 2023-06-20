/**
 * @jest-environment jsdom
 */

import { describe }       from '@jest/globals'
import { afterEach }      from '@jest/globals'
import { it }             from '@jest/globals'
import { expect }         from '@jest/globals'
import { renderHook }     from '@testing-library/react'

import { useIdentityUrl } from './use-identity-url.hook.js'

describe('use-identity-url', () => {
  const originalLocation = window.location

  const mockWindowLocation = (newLocation: Location | URL): void => {
    // @ts-expect-error
    delete window.location
    // @ts-expect-error
    window.location = newLocation
  }

  afterEach(() => {
    mockWindowLocation(originalLocation)
  })

  it('without params', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ returnTo: true }))

    expect(result.current).toBe(
      'https://accounts.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/'
    )
  })

  it('custom type', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ type: 'registration', returnTo: true }))

    expect(result.current).toBe(
      'https://accounts.monstrs.dev/auth/registration?return_to=https://identity.monstrs.dev/'
    )
  })

  it('return to pathname', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ returnTo: { pathname: '/custom' } }))

    expect(result.current).toBe(
      'https://accounts.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/custom'
    )
  })

  it('return to subdomain', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ returnTo: { subdomain: 'custom' } }))

    expect(result.current).toBe(
      'https://accounts.monstrs.dev/auth/login?return_to=https://custom.monstrs.dev/'
    )
  })
})
