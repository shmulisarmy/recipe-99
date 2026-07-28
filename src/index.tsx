/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import 'solid-devtools';
import { ConvexProvider, setupConvex } from "convex-solidjs";


import App from './App';
import { convexClient } from './convex_client';

const root = document.getElementById('root');






if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() =>
  <ConvexProvider client={convexClient}>
    <App />
  </ConvexProvider>
, root!);
