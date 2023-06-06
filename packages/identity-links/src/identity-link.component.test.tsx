/**
 * @jest-environment jsdom
 */

import type { JSX }     from 'react'

import { describe }     from '@jest/globals'
import { afterEach }    from '@jest/globals'
import { it }           from '@jest/globals'
import { expect }       from '@jest/globals'
import { render }       from '@testing-library/react'
import { screen }       from '@testing-library/react'
import React            from 'react'

import { IdentityLink } from './identity-link.component.jsx'

describe('identity-link.component', () => {
  const originalLocation = window.location

  const mockWindowLocation = (newLocation): void => {
    // @ts-expect-error
    delete window.location
    window.location = newLocation
  }

  afterEach(() => {
    mockWindowLocation(originalLocation)
  })

  it('without params', async () => {
    mockWindowLocation(new URL('https://identity.monstrs.dev'))

    render(<IdentityLink returnTo>{(url): JSX.Element => <a href={url}>Login</a>}</IdentityLink>)

    expect(screen.getByText('Login').getAttribute('href')).toBe(
      'https://accounts.monstrs.dev/auth/login?return_to=https://identity.monstrs.dev/'
    )
  })
})
