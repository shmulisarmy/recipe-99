import { v } from "convex/values";
import { query } from "../../_generated/server";
import { customUnitDocumentValidator } from "./table";

export const getCustomUnits = query({
    args: {associatedIngredient: v.string()},
    returns: v.array(customUnitDocumentValidator),
    handler: async (ctx, args) => {
        return ctx.db.query("customUnits").withIndex("by_associatedIngredient", (q) => q.eq("associatedIngredient", args.associatedIngredient)).collect();
    },
});
