import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { recipeValidator } from "./table";

export const createRecipe = mutation({
    args: recipeValidator.fields,
    returns: v.id("recipes"),
    handler: async (ctx, recipe) => {
        return await ctx.db.insert("recipes", recipe);
    },
});
