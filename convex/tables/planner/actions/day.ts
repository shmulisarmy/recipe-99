import { v } from "convex/values";
import { mutation } from "../../../_generated/server";
import { authenticatedUserId } from "../../../utils/auth";
import { getOrCreatePlannerDay } from "../days";

export const updateDayMultiplier = mutation({
  args: {
    date: v.string(),
    multiplier: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await authenticatedUserId(ctx);
    const day = await getOrCreatePlannerDay(ctx, userId, args.date);

    await ctx.db.patch(day._id, { multiplier: args.multiplier });
    return null;
  },
});
