import { query } from "../../_generated/server";
import { authenticatedUserId } from "../../utils/auth";


export const getAvailableIngredients = query({
    args: {},
    handler: async (ctx) => {
        const userId = await authenticatedUserId(ctx);
        return await ctx.db
            .query("pantryItems")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();
    },
});
