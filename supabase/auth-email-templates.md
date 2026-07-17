# Supabase Auth email templates

Configure Resend SMTP in **Supabase Dashboard → Authentication → SMTP Settings** before using these templates. Then copy the appropriate template into **Authentication → Email Templates**. Disable click tracking in Resend so confirmation links are not rewritten.

Use `{{ .ConfirmationURL }}` for confirmation, recovery, invite, magic-link, and email-change links; use `{{ .Token }}` for reauthentication codes. These templates preserve the Qfloww editorial tone formerly rendered by the application.

## Confirm signup

**Subject:** `Confirm your email`

```html
<h2>Confirm your email.</h2><p>Welcome to Qfloww. Confirm your email to finish creating your account.</p><p><a href="{{ .ConfirmationURL }}">Confirm email address</a></p><p>If you did not create this account, you can safely ignore this email.</p>
```

## Recovery

**Subject:** `Reset your password`

```html
<h2>Reset your password.</h2><p>We received a request to reset the password for {{ .Email }}.</p><p><a href="{{ .ConfirmationURL }}">Choose a new password</a></p><p>If you did not request this, you can safely ignore this email.</p>
```

## Invite

**Subject:** `You've been invited`

```html
<h2>You've been invited.</h2><p>You have been invited to join Qfloww.</p><p><a href="{{ .ConfirmationURL }}">Accept invitation</a></p>
```

## Magic link

**Subject:** `Your login link`

```html
<h2>Your sign-in link.</h2><p>Use the secure link below to sign in to Qfloww.</p><p><a href="{{ .ConfirmationURL }}">Sign in</a></p>
```

## Change email

**Subject:** `Confirm your new email`

```html
<h2>Confirm your new email.</h2><p>Confirm this address to complete your Qfloww email change.</p><p><a href="{{ .ConfirmationURL }}">Confirm new email</a></p>
```

## Reauthentication

**Subject:** `Your verification code`

```html
<h2>Your verification code.</h2><p>Enter this code to continue: <strong>{{ .Token }}</strong></p><p>If you did not request this, you can safely ignore this email.</p>
```
