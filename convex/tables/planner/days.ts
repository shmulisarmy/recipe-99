import type { Doc } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";

/** A day nobody has shaped yet cooks for one person. */
export const DEFAULT_DAY_MULTIPLIER = 1;

type PlannedRecipe = Doc<"plannerTable">["recipes"][number];

export async function getPlannerDay(
    ctx: QueryCtx | MutationCtx,
    userId: string,
    date: string,
): Promise<Doc<"plannerTable"> | null> {
    return await ctx.db
        .query("plannerTable")
        .withIndex("by_userId_and_date", (q) =>
            q.eq("userId", userId).eq("date", date)
        )
        .unique();
}

export async function insertPlannerDay(
    ctx: MutationCtx,
    userId: string,
    date: string,
    recipes: PlannedRecipe[] = [],
): Promise<Doc<"plannerTable">> {
    const dayId = await ctx.db.insert("plannerTable", {
        date,
        recipes,
        multiplier: DEFAULT_DAY_MULTIPLIER,
        shoppingCart: {
            toGet: {},
            alreadyGot: {},
        },
        userId,
    });

    const day = await ctx.db.get("plannerTable", dayId);
    if (!day) throw new Error(`Planner day for ${date} disappeared after insert`);
    return day;
}

/**
 * The planner has no "create a day" step: a day exists the moment the user puts
 * something on it. Every write that names a date goes through here so an empty
 * date behaves exactly like a planned one.
 */
export async function getOrCreatePlannerDay(
    ctx: MutationCtx,
    userId: string,
    date: string,
): Promise<Doc<"plannerTable">> {
    return (
        (await getPlannerDay(ctx, userId, date)) ??
        (await insertPlannerDay(ctx, userId, date))
    );
}
