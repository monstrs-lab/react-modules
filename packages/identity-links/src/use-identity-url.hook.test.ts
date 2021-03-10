import { renderHook }     from '@testing-library/react-hooks'

import { useIdentityUrl } from './use-identity-url.hook'

describe('use-identity-url', () => {
  const originalLocation = window.location

  const mockWindowLocation = (newLocation) => {
    // @ts-ignore
    delete window.location
    window.location = newLocation
  }

  afterEach(() => {
    mockWindowLocation(originalLocation)
  })

  it('without params', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl())

    expect(result.current).toBe(
      'https://accounts.identity.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/'
    )
  })

  it('custom type', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ type: 'registration' }))

    expect(result.current).toBe(
      'https://accounts.identity.monstrs.dev/auth/registration?return_to=https://identity.monstrs.dev/'
    )
  })

  it('custom subdomain', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ subdomain: 'custom' }))

    expect(result.current).toBe(
      'https://custom.identity.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/'
    )
  })

  it('return to path', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ returnTo: '/custom' }))

    expect(result.current).toBe(
      'https://accounts.identity.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/custom'
    )
  })

  it('return to url', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ returnTo: 'https://custom.monstrs.dev/' }))

    expect(result.current).toBe(
      'https://accounts.identity.monstrs.dev/auth/login?return_to=https://custom.monstrs.dev/'
    )
  })

  it('substract host', () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    const { result } = renderHook(() => useIdentityUrl({ substractHost: 'identity' }))

    expect(result.current).toBe(
      'https://accounts.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/'
    )
  })
})
