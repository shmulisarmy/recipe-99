# Purpose

Own browser authentication and the authenticated application gate.

# Ownership

- `google.tsx` owns Google Identity Services loading, ID-token validation and session restoration, Convex token delivery, sign-in presentation, sign-out, and the frontend auth context.

# Local Contracts

- Require `VITE_GOOGLE_CLIENT_ID`; validate a restored token's audience and expiry before giving it to Convex.
- Keep the ID token in session storage, clear unusable or signed-out tokens, and never treat decoded browser claims as server authorization.
- Use `convexClient.setAuth` to deliver tokens. Server functions remain responsible for identity and ownership checks.
- Mount authenticated children only after Convex accepts the token, and expose identity and sign-out through `useAuth` inside `GoogleAuthGate`.

# Work Guidance

- Keep provider order in `src/index.tsx`: `ConvexProvider` wraps `GoogleAuthGate`, which wraps the application.

# Verification

- Run `npm run build`.
- Verify fresh sign-in, session restoration, failed token handling, and sign-out in the browser after authentication-flow changes.

# Child DOX Index
