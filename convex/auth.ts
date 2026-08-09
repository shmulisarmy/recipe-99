import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCurrentUserOAuthId = query({
    args: {},
    returns: v.object({
        oauthId: v.string(),
        tokenIdentifier: v.string(),
        email: v.union(v.string(), v.null()),
    }),
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        return {
            oauthId: identity.subject,
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email ?? null,
        };
    },
});
