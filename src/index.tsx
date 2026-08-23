/* @refresh reload */
import './index.css';
import '@fontsource/atkinson-hyperlegible-next/latin-400.css';
import '@fontsource/atkinson-hyperlegible-next/latin-600.css';
import '@fontsource/chivo/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-600.css';
import { render } from 'solid-js/web';
import 'solid-devtools';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// The Convex client throws on a missing deployment URL, and it throws while the
// module graph is loading, which leaves a blank page and nothing to read. Name
// what is missing instead, and only reach for the app once it is there.
if (!import.meta.env.VITE_CONVEX_URL) {
  render(
    () => (
      <main class="auth-page auth-page-solo" id="main">
        <section class="sign-in-panel">
          <div class="sign-in-card">
            <h1>Captain Cook is not configured.</h1>
            <p>
              This deployment has no backend address. Set <code>VITE_CONVEX_URL</code>{' '}
              in the site’s environment variables and deploy again.
            </p>
          </div>
        </section>
      </main>
    ),
    root!,
  );
} else {
  const [{ default: App }, { convexClient }, { GoogleAuthGate }, { ConvexProvider }] =
    await Promise.all([
      import('./App'),
      import('./convex_client'),
      import('./auth/google'),
      import('convex-solidjs'),
    ]);

  render(
    () => (
      <ConvexProvider client={convexClient}>
        <GoogleAuthGate>
          <App />
        </GoogleAuthGate>
      </ConvexProvider>
    ),
    root!,
  );
}
