import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";


export async function authenticatedUserId(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<string> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return identity.tokenIdentifier;
}
