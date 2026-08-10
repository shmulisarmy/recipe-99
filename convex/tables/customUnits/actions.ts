import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createCustomUnit = mutation({
    args: {associatedIngredient: v.string(), unitName: v.string(), gramsPerUnit: v.number()},
    returns: v.id("customUnits"),
    handler: async (ctx, {associatedIngredient, unitName, gramsPerUnit}) => {
        return await ctx.db.insert("customUnits", {associatedIngredient, unitName, gramsPerUnit});
    },
});
