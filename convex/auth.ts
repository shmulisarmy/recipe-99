import { v } from "convex/values";
import { internalQuery, query } from "./_generated/server";
import { singleStoredUserId } from "./utils/auth";

export const resolveSingleUserIdForRedesign = internalQuery({
    args: {},
    returns: v.string(),
    handler: singleStoredUserId,
});

export const getCurrentUserOAuthId = query({
    args: {},
    returns: v.object({
        oauthId: v.string(),
        tokenIdentifier: v.string(),
        email: v.union(v.string(), v.null()),
    }),
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            const userId = await singleStoredUserId(ctx);
            return {
                oauthId: userId,
                tokenIdentifier: userId,
                email: null,
            };
        }

        return {
            oauthId: identity.subject,
            tokenIdentifier: identity.tokenIdentifier,
            email: identity.email ?? null,
        };
    },
});
