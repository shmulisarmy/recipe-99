import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { measurementT } from "../../types";
import { authenticatedUserId } from "../../utils/auth";
import { Measurement_Plus } from "../../../src/primitives/measurement";
import { pantryItemDocumentValidator } from "./table";

export const updateAvailableIngredient = mutation({
    args: { ingredientName: v.string(), measurement: measurementT },
    returns: pantryItemDocumentValidator,
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const ingredient = await ctx.db
            .query("pantryItems")
            .withIndex("by_userId_and_name_", (q) => q.eq("userId", userId).eq("name_", args.ingredientName)
            )
            .unique();

        // Setting an amount for an ingredient the pantry has never held is a
        // way of stocking it, not an error.
        if (!ingredient) {
            const ingredientId = await ctx.db.insert("pantryItems", {
                userId,
                name_: args.ingredientName,
                Measurement: args.measurement,
            });
            const created = await ctx.db.get("pantryItems", ingredientId);
            if (!created) throw new Error(`Ingredient ${args.ingredientName} disappeared after insert`);
            return created;
        }

        await ctx.db.patch(ingredient._id, { Measurement: args.measurement });
        return { ...ingredient, Measurement: args.measurement };
    },
});

export const AvailableIngredientsBulkAdd = mutation({
    args: {
        ingredientsToAdd: v.array(v.object({
            name: v.string(),
            Measurement: measurementT,
        })),
    },
    returns: v.null(),
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
