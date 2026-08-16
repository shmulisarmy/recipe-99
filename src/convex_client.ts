import { createRoot } from "solid-js";
import { setupConvex } from "convex-solidjs";

// setupConvex registers onCleanup(() => client.close()); this module-level
// singleton lives for the whole page, so own that cleanup with an app-lifetime
// root instead of letting Solid warn that it will never run.
export const convexClient = createRoot(() =>
  setupConvex(import.meta.env.VITE_CONVEX_URL),
);