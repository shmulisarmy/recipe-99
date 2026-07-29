# Google OAuth + Convex Resources

## Knowledge

- [Convex: Custom OIDC provider](https://docs.convex.dev/auth/advanced/custom-auth)
  Primary source for configuring an external OIDC issuer in `convex/auth.config.ts`.
- [Convex: Auth in functions](https://docs.convex.dev/auth/functions-auth)
  Primary source for deriving identity with `ctx.auth.getUserIdentity()` instead of trusting a client-provided user ID.
- [Convex: Custom JWT provider](https://docs.convex.dev/auth/advanced/custom-jwt)
  Primary security reference for issuer, audience, and signing-key validation; specifically warns that Google tokens require an application ID check.
- [Google: Display the Sign in with Google button](https://developers.google.com/identity/gsi/web/guides/display-button)
  Primary source for loading Google Identity Services, rendering the button, and receiving its JWT credential.
- [Google: Sign in with Google JavaScript API](https://developers.google.com/identity/gsi/web/reference/js-reference)
  Primary API reference for initialization, credential callbacks, button rendering, and sign-out behavior.

## Wisdom (Communities)

- [Convex Discord](https://convex.dev/community)
  Official community for current authentication and non-React client integration questions.
- [Google Identity developer support](https://developers.google.com/identity/protocols/oauth2/support)
  Official support routes for OAuth configuration, verification, and policy problems.
