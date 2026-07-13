/**
 * Pluggable email sender for booking confirmations.
 *
 * Currently a STUB that logs to the console — bookings are stored regardless of
 * email. To send real email, implement `send()` (e.g. with Resend or nodemailer)
 * and keep the same interface; nothing else needs to change.
 */
import type { Booking } from './db.ts'
import { bookingConfig } from './availability.ts'

export interface EmailSender {
  send(booking: Booking): Promise<void>
}

/** Owner's inbox — set OWNER_EMAIL in the environment to receive notifications. */
const OWNER_EMAIL = process.env.OWNER_EMAIL ?? 'hello@dinosupply.xyz'

function formatWhen(iso: string): string {
  // Display in the configured local time for a human-readable confirmation.
  return new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

export const emailSender: EmailSender = {
  async send(booking: Booking): Promise<void> {
    const when = `${formatWhen(booking.start)} (${bookingConfig.timezoneLabel})`
    // TODO: replace these logs with a real provider (Resend / nodemailer).
    console.log('[email:stub] → owner', OWNER_EMAIL, {
      subject: `New booking: ${booking.name} — ${when}`,
      from: booking.email,
      phone: booking.phone,
      note: booking.note,
    })
    console.log('[email:stub] → client', booking.email, {
      subject: `Your call is booked — ${when}`,
      body: `Thanks ${booking.name}, your call is confirmed for ${when}. I'll be in touch.`,
    })
  },
}
