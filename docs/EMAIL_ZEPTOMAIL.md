# ZeptoMail Email Integration

Puncto uses **ZeptoMail** (by Zoho) as the default transactional email provider across the app and Firebase Functions.

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ZEPTOMAIL_API_KEY` | Yes | Send Mail Token from ZeptoMail Agents → SMTP/API → Send Mail Token |
| `ZEPTOMAIL_FROM_EMAIL` | No | Sender email (default: `noreply@puncto.app`). Must be from a verified domain in ZeptoMail |
| `ZEPTOMAIL_FROM_NAME` | No | Sender display name (default: `Puncto`) |
| `EMAIL_PROVIDER` | No | Set to `zeptomail`, `resend`, or `mailgun` to override auto-detection |

### Where to Set

1. **Next.js / Vercel**: Add to Vercel project → Settings → Environment Variables
2. **Firebase Functions**: Add via Firebase Console → Functions → Environment config, or `firebase functions:config:set zeptomail.api_key="..."` (requires mapping to `process.env` in code)

For Firebase Functions, ensure `ZEPTOMAIL_API_KEY`, `ZEPTOMAIL_FROM_EMAIL`, and `ZEPTOMAIL_FROM_NAME` are available in the Functions environment (e.g. via Secret Manager or Functions config).

## Where Emails Are Sent

| Location | Purpose |
|----------|---------|
| `src/lib/messaging/email.ts` | Main email client used by API routes |
| `src/app/api/campaigns/send/route.ts` | Marketing campaign emails |
| `src/app/api/professionals/invite/route.ts` | Professional invite (password reset link) |
| `punctoFunctions/triggers/onBookingCreate.ts` | Booking confirmation |
| `punctoFunctions/scheduled/reminders.ts` | Booking reminders (48h, 24h, 3h) |
| `punctoFunctions/scheduled/birthdayReminders.ts` | Birthday campaign emails |
| `punctoFunctions/scheduled/inventoryAlerts.ts` | Low stock alerts |
| `punctoFunctions/staff/inviteStaff.ts` | Staff invite emails |

## Switching Providers

Set `EMAIL_PROVIDER`:

- `zeptomail` – ZeptoMail (default when `ZEPTOMAIL_API_KEY` is set)
- `resend` – Resend (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`)
- `mailgun` – Mailgun (`MAILGUN_API_KEY`, `MAILGUN_DOMAIN`)
