# Alumni email function — setup

The Alumni portal works **without** this function: registrations are saved and
approvals happen normally, the applicant just doesn't get an automatic email.
Deploy this once to switch the two automated emails on.

## What it sends

| Trigger | Email |
|---|---|
| Someone submits the registration form | *Thank You for Registering as an iConnect Alumni* |
| An admin clicks **Approve** in `/admin` | *Your iConnect Alumni Profile Has Been Approved* (includes their profile link) |

## One-time setup (~15 minutes)

### 1. Get an email sending key

Sign up free at [resend.com](https://resend.com) (3,000 emails/month free).

- Add and verify the domain **iconnectgjust.in** (Resend gives you DNS records —
  add them in Cloudflare where your domain already lives).
- Create an API key and copy it.

> Without domain verification Resend only lets you send to your own address,
> which is fine for testing.

### 2. Install the Supabase CLI and log in

```bash
npm install -g supabase
supabase login
supabase link --project-ref srjczytqgaolfzviszsw
```

### 3. Add the secrets

```bash
supabase secrets set RESEND_API_KEY=your_resend_key_here
supabase secrets set ALUMNI_FROM_EMAIL="Team iConnect <support@iconnectgjust.in>"
supabase secrets set SITE_URL="https://www.iconnectgjust.in"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

### 4. Deploy

```bash
supabase functions deploy alumni-email
```

That's it — the website starts sending both emails immediately, with no code change.

## Security notes

This endpoint is callable by anonymous visitors (the registration form needs it),
so it does **not** simply email whatever address it is given:

- `registered` only sends if a **pending** profile with that exact email was
  created in the **last 10 minutes**.
- `approved` requires a valid admin login token **and** the profile must
  actually be approved in the database.

Together these stop the function being used to send mail to arbitrary people.

## Testing

1. Submit the form at `/alumni` with your own email → confirmation should arrive.
2. In `/admin` → Alumni Management → **Approve** that row → approval email arrives.
3. **Resend** in the actions column re-sends the appropriate email.

If something fails, check logs:

```bash
supabase functions logs alumni-email
```
