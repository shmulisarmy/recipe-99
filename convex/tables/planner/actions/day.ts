import { v } from "convex/values";
import { mutation } from "../../../_generated/server";
import { authenticatedUserId } from "../../../utils/auth";

export const updateDayMultiplier = mutation({
    args: {
        date: v.string(),
        multiplier: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.date}`);

        await ctx.db.patch(day._id, { multiplier: args.multiplier });
        return null;
    },
});
