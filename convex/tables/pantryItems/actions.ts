import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { measurementT } from "../../types";
import { authenticatedUserId } from "../../utils/auth";
import { Measurement_Plus } from "../../../src/primitives/measurement";

export const updateAvailableIngredient = mutation({
    args: { ingredientName: v.string(), measurement: measurementT },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const ingredient = await ctx.db
            .query("pantryItems")
            .withIndex("by_userId_and_name_", (q) => q.eq("userId", userId).eq("name_", args.ingredientName)
            )
            .unique();
        if (!ingredient) throw new Error(`Ingredient ${args.ingredientName} not found`);
        await ctx.db.patch(ingredient._id, { Measurement: args.measurement });
        return ingredient;
    },
});export const AvailableIngredientsBulkAdd = mutation({
    args: {
        ingredientsToAdd: v.array(v.object({
            name: v.string(),
            Measurement: measurementT,
        })),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        for (const { name, Measurement } of args.ingredientsToAdd) {
            const ingredient = await ctx.db
                .query("pantryItems")
                .withIndex("by_userId_and_name_", (q) => q.eq("userId", userId).eq("name_", name)
                )
                .unique();

            if (ingredient) {
                await ctx.db.patch(ingredient._id, {
                    Measurement: Measurement_Plus(ingredient.Measurement, Measurement),
                });
            } else {
                await ctx.db.insert("pantryItems", {
                    userId,
                    name_: name,
                    Measurement,
                });
            }
        }

        return null;
    },
});
