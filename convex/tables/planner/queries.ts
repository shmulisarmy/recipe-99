import { query } from "../../_generated/server";
import { authenticatedUserId } from "../../utils/auth";






export const usersPlanner = query({
    args: {},
    handler: async (ctx) => {
        // const userId = await authenticatedUserId(ctx);
        const items = await ctx.db.query('plannerTable')
        // withIndex('by_userId', q => q.eq('userId', userId))
        .collect();
        const obj: Record<string, typeof items[0]> = {}
        for (const item of items) {
            obj[item.date] = item;
        }
        return obj;
    },
});