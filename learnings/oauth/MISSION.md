# Mission: Add Google OAuth to Recipe-99

## Why
Add Google sign-in to Recipe-99 so Convex functions can securely identify the current user and keep each user's pantry data separate.

## Success looks like
- Explain how Google issues an ID token and how Convex verifies it
- Configure a Google web OAuth client for the local application
- Connect the SolidJS client to Convex with the Google ID token
- Derive pantry ownership from the authenticated identity on the Convex server
- Diagnose common issuer, audience, origin, and token-expiration failures

## Constraints
- Keep the existing SolidJS, Vite, and `convex-solidjs` architecture
- Explain important architecture and failure points while implementing them
- Never trust a client-supplied user ID for authorization

## Out of scope
- Calling Google APIs such as Drive or Calendar
- Production OAuth origins and production Convex deployment configuration
- Roles, organizations, and multi-tenant administration
