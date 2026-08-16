import { defineApp } from "convex/server";
import { v } from "convex/values";
import agent from "@convex-dev/agent/convex.config.js";

const app = defineApp({
    env: {
        ANTHROPIC_API_KEY: v.string(),
    },
});

app.use(agent);

export default app;
