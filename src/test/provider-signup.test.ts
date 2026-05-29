// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ---------------------------------------------------------------------------
// Hoist mock factories so they are available inside vi.mock() closures
// ---------------------------------------------------------------------------
const {
  mockGenerateLink,
  mockDeleteUser,
  mockInsert,
  mockUpsert,
  mockFrom,
  mockSendEmail,
} = vi.hoisted(() => {
  const mockSingle = vi.fn()
  const mockInsert = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({ single: mockSingle }),
  })
  const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null })
  const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert, upsert: mockUpsert })
  const mockGenerateLink = vi.fn()
  const mockDeleteUser = vi.fn().mockResolvedValue({ error: null })
  const mockSendEmail = vi.fn().mockResolvedValue(undefined)

  // Expose mockSingle so individual tests can configure it
  ;(mockInsert as { _single?: typeof mockSingle })._single = mockSingle

  return { mockGenerateLink, mockDeleteUser, mockInsert, mockUpsert, mockFrom, mockSendEmail }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { admin: { generateLink: mockGenerateLink, deleteUser: mockDeleteUser } },
    from: mockFrom,
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://storage.example.com/profile.jpg' },
        }),
      })),
    },
  })),
}))

vi.mock('@/lib/email', () => ({
  sendApplicationConfirmation: mockSendEmail,
}))

import { POST } from '@/app/api/provider/apply/route'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const VALID_BODY = {
  name: 'Alice Co',
  categories: ['tutoring'],
  description: 'Expert tutoring',
  address: '1 Test St',
  phone: '07700900000',
  email: 'alice@example.com',
  accountName: 'Alice Smith',
  password: 'password123',
}

const GENERATED_LINK_DATA = {
  data: {
    user: { id: 'user-abc-123' },
    properties: { action_link: 'https://test.supabase.co/auth/v1/verify?token=tok123&type=signup' },
  },
  error: null,
}

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/provider/apply', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

function getSingleMock() {
  // Access the mockSingle that was threaded through mockInsert
  return (mockInsert as { _single?: ReturnType<typeof vi.fn> })._single!
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('POST /api/provider/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default happy-path return values
    mockGenerateLink.mockResolvedValue(GENERATED_LINK_DATA)
    getSingleMock().mockResolvedValue({ data: { id: 'provider-xyz' }, error: null })
    mockInsert.mockReturnValue({
      select: vi.fn().mockReturnValue({ single: getSingleMock() }),
    })
  })

  // ------------------------------------------------------------------
  // 1. Provider can sign up
  // ------------------------------------------------------------------
  describe('provider signup', () => {
    it('returns 200 with providerId on valid submission', async () => {
      const res = await POST(makeRequest(VALID_BODY))
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json).toEqual({ ok: true, providerId: 'provider-xyz' })
    })

    it('creates an auth user with the correct email and name', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockGenerateLink).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'signup',
          email: 'alice@example.com',
          password: 'password123',
          options: expect.objectContaining({
            data: { full_name: 'Alice Smith' },
          }),
        })
      )
    })

    it('inserts the provider record with status "unconfirmed"', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Co',
          email: 'alice@example.com',
          user_id: 'user-abc-123',
          status: 'unconfirmed',
        })
      )
    })

    it('returns 400 when required fields are missing', async () => {
      const res = await POST(makeRequest({ email: 'alice@example.com', password: 'pass123' }))
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.error).toMatch(/required fields/i)
    })

    it('returns 400 when password is fewer than 6 characters', async () => {
      const res = await POST(makeRequest({ ...VALID_BODY, password: 'abc' }))
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.error).toMatch(/6 characters/i)
    })

    it('returns a friendly error when the email is already registered', async () => {
      mockGenerateLink.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })

      const res = await POST(makeRequest(VALID_BODY))
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.error).toMatch(/already an account/i)
    })

    it('returns 500 and deletes the auth user when the provider insert fails', async () => {
      getSingleMock().mockResolvedValue({ data: null, error: { message: 'insert failed' } })
      mockInsert.mockReturnValue({
        select: vi.fn().mockReturnValue({ single: getSingleMock() }),
      })

      const res = await POST(makeRequest(VALID_BODY))
      const json = await res.json()

      expect(res.status).toBe(500)
      expect(mockDeleteUser).toHaveBeenCalledWith('user-abc-123')
      expect(json.error).toMatch(/couldn't save/i)
    })
  })

  // ------------------------------------------------------------------
  // 2. Provider receives a confirmation email
  // ------------------------------------------------------------------
  describe('confirmation email', () => {
    it('sends a confirmation email after successful signup', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockSendEmail).toHaveBeenCalledTimes(1)
    })

    it('sends the email to the provider\'s address', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'alice@example.com' })
      )
    })

    it('includes the provider\'s name and business name in the email', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice Smith',
          businessName: 'Alice Co',
        })
      )
    })

    it('includes the Supabase-generated confirmation URL in the email', async () => {
      await POST(makeRequest(VALID_BODY))

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          confirmationUrl: GENERATED_LINK_DATA.data.properties.action_link,
        })
      )
    })

    it('still returns 200 even if the email fails to send', async () => {
      mockSendEmail.mockRejectedValue(new Error('Resend unavailable'))

      const res = await POST(makeRequest(VALID_BODY))
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.ok).toBe(true)
    })
  })
})
