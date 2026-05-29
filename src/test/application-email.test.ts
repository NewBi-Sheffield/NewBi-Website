// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mock Resend before importing anything that instantiates it at module level.
// Must use vi.hoisted so mockEmailSend is available when vi.mock() runs (it
// is hoisted to the top of the file). Must use a regular function (not an
// arrow) so `new Resend()` works correctly.
// ---------------------------------------------------------------------------
const { mockEmailSend } = vi.hoisted(() => ({
  mockEmailSend: vi.fn().mockResolvedValue({ data: { id: 'email-001' }, error: null }),
}))

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(function () {
    return { emails: { send: mockEmailSend } }
  }),
}))

import { applicationConfirmationHtml } from '@/lib/emails/applicationConfirmation'
import { sendApplicationConfirmation } from '@/lib/email'

const SAMPLE_PARAMS = {
  name: 'Alice Smith',
  businessName: 'Alice Co',
  confirmationUrl: 'https://test.supabase.co/auth/v1/verify?token=abc&type=signup',
  email: 'alice@example.com',
}

// ---------------------------------------------------------------------------
// Email template — pure function, no mocks needed
// ---------------------------------------------------------------------------
describe('applicationConfirmationHtml()', () => {
  it('includes the recipient\'s name', () => {
    const html = applicationConfirmationHtml(SAMPLE_PARAMS)
    expect(html).toContain('Alice Smith')
  })

  it('includes the business name', () => {
    const html = applicationConfirmationHtml(SAMPLE_PARAMS)
    expect(html).toContain('Alice Co')
  })

  it('includes the confirmation URL as a link', () => {
    const html = applicationConfirmationHtml(SAMPLE_PARAMS)
    expect(html).toContain(SAMPLE_PARAMS.confirmationUrl)
  })

  it('renders a valid HTML document', () => {
    const html = applicationConfirmationHtml(SAMPLE_PARAMS)
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('</html>')
  })
})

// ---------------------------------------------------------------------------
// Email sending function
// ---------------------------------------------------------------------------
describe('sendApplicationConfirmation()', () => {
  beforeEach(() => {
    mockEmailSend.mockClear()
  })

  it('calls Resend with the correct recipient', async () => {
    await sendApplicationConfirmation(SAMPLE_PARAMS)
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'alice@example.com' })
    )
  })

  it('uses the correct subject line', async () => {
    await sendApplicationConfirmation(SAMPLE_PARAMS)
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Confirm your email to complete your NewBi application',
      })
    )
  })

  it('sends from the NewBi address', async () => {
    await sendApplicationConfirmation(SAMPLE_PARAMS)
    expect(mockEmailSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'NewBi <hello@newbi.co.uk>' })
    )
  })

  it('embeds the confirmation URL in the email body', async () => {
    await sendApplicationConfirmation(SAMPLE_PARAMS)
    const call = mockEmailSend.mock.calls[0][0] as { html: string }
    expect(call.html).toContain(SAMPLE_PARAMS.confirmationUrl)
  })
})
