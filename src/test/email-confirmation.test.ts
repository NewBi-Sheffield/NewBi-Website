// @vitest-environment node
//
// Tests the /auth/callback route that Supabase redirects to after a user
// clicks a magic link or completes an OAuth flow.
//
// NOTE: The actual email-confirmation step (user clicking the Supabase
// action_link) happens server-side inside Supabase and fires a DB trigger
// that promotes provider status from "unconfirmed" → "pending". That DB
// trigger is covered by the migration in
// supabase/migrations/20260511000000_unconfirmed_status.sql and requires an
// integration test against a real database.  These unit tests cover the
// app-side auth callback route only.
//
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockExchangeCodeForSession } = vi.hoisted(() => ({
  mockExchangeCodeForSession: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { exchangeCodeForSession: mockExchangeCodeForSession },
  })),
}))

import { GET } from '@/app/auth/callback/route'
import { NextRequest } from 'next/server'

function makeCallbackRequest(params: Record<string, string>) {
  const url = new URL('http://localhost/auth/callback')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new NextRequest(url.toString())
}

describe('GET /auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exchanges the code for a session and redirects to the "next" path', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })

    const res = await GET(makeCallbackRequest({ code: 'valid-code', next: '/account' }))

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/account$/)
  })

  it('redirects to / when no "next" param is provided', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null })

    const res = await GET(makeCallbackRequest({ code: 'valid-code' }))

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toMatch(/\/$/)
  })

  it('redirects to /login with error when no code is present', async () => {
    const res = await GET(makeCallbackRequest({}))

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled()
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('error=auth_callback_failed')
  })

  it('redirects to /login with error when the code exchange fails', async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: { message: 'invalid token' } })

    const res = await GET(makeCallbackRequest({ code: 'bad-code' }))

    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('error=auth_callback_failed')
  })
})
