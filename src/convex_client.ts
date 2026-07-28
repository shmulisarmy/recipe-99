import { setupConvex } from "convex-solidjs";

export const convexClient = setupConvex(
  import.meta.env.VITE_CONVEX_URL,
);