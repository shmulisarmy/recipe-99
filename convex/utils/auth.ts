import { makeFunctionReference } from "convex/server";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

const resolveSingleUserIdForRedesign = makeFunctionReference<
    "query",
    Record<string, never>,
    string
>("auth:resolveSingleUserIdForRedesign");

export async function singleStoredUserId(ctx: QueryCtx | MutationCtx): Promise<string> {
    const plannedDay = await ctx.db
        .query("plannerTable")
        .withIndex("by_userId")
        .first();
    if (plannedDay) return plannedDay.userId;

    const pantryItem = await ctx.db
        .query("pantryItems")
        .withIndex("by_userId")
        .first();
    if (pantryItem) return pantryItem.userId;

    throw new Error("No stored user is available for redesign mode");
}

export async function authenticatedUserId(ctx: QueryCtx | MutationCtx | ActionCtx): Promise<string> {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) return identity.tokenIdentifier;

    if ("db" in ctx) return singleStoredUserId(ctx);
    return ctx.runQuery(resolveSingleUserIdForRedesign, {});
}
