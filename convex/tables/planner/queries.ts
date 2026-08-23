import { v } from "convex/values";
import { query } from "../../_generated/server";
import { authenticatedUserId } from "../../utils/auth";
import { PlannedDayDocument } from "./types";

export const usersPlanner = query({
    args: {},
    returns: v.record(v.string(), PlannedDayDocument),
    handler: async (ctx) => {
        const userId = await authenticatedUserId(ctx);
        const days = await ctx.db.query('plannerTable')
            .withIndex('by_userId', q => q.eq('userId', userId))
            .collect();
        const obj: Record<string, typeof days[0]> = {}
        for (const day of days) {
            obj[day.date] = day;
        }
        return obj;
    },
});
