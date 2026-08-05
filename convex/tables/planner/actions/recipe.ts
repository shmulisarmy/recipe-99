import { v } from "convex/values";
import type { Doc } from "../../../_generated/dataModel";
import type { MutationCtx } from "../../../_generated/server";
import { mutation } from "../../../_generated/server";
import { authenticatedUserId } from "../../../utils/auth";

type PlannedRecipe = Doc<"plannerTable">["recipes"][number];

async function getPlannedRecipe(
    ctx: MutationCtx,
    userId: string,
    recipeId: string,
): Promise<{ recipe: PlannedRecipe; day: Doc<"plannerTable"> }> {
    const days = await ctx.db
        .query("plannerTable")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .collect();

    for (const day of days) {
        const recipe = day.recipes.find((candidate) => candidate.id === recipeId);
        if (recipe) return { recipe, day };
    }

    throw new Error(`No recipe with id ${recipeId}`);
}

export const removeRecipeById = mutation({
    args: {
        recipeId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const { day } = await getPlannedRecipe(ctx, userId, args.recipeId);
        const recipeIndex = day.recipes.findIndex(
            (recipe) => recipe.id === args.recipeId,
        );

        if (recipeIndex === -1) {
            throw new Error(`No recipe ${args.recipeId} in ${day.date}`);
        }

        await ctx.db.patch(day._id, {
            recipes: day.recipes.filter((_, index) => index !== recipeIndex),
        });

        return null;
    },
});

export const InsertRecipeAtBeginningOfDate = mutation({
    args: {
        recipeId: v.string(),
        toDate: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const { recipe, day: sourceDay } = await getPlannedRecipe(
            ctx,
            userId,
            args.recipeId,
        );
        const destinationDay = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.toDate)
            )
            .unique();

        if (!destinationDay) {
            throw new Error(`No planned day for ${args.toDate}`);
        }

        const sourceRecipes = sourceDay.recipes.filter(
            (candidate) => candidate.id !== args.recipeId,
        );

        if (sourceDay._id === destinationDay._id) {
            await ctx.db.patch(sourceDay._id, {
                recipes: [recipe, ...sourceRecipes],
            });
        } else {
            await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
            await ctx.db.patch(destinationDay._id, {
                recipes: [recipe, ...destinationDay.recipes],
            });
        }

        return null;
    },
});

export const MoveRecipeOnTopOfOtherRecipe = mutation({
    args: {
        recipeId: v.string(),
        otherRecipeId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        if (args.recipeId === args.otherRecipeId) return null;

        const { recipe, day: sourceDay } = await getPlannedRecipe(
            ctx,
            userId,
            args.recipeId,
        );
        const { day: destinationDay } = await getPlannedRecipe(
            ctx,
            userId,
            args.otherRecipeId,
        );
        const sourceRecipes = sourceDay.recipes.filter(
            (candidate) => candidate.id !== args.recipeId,
        );

        if (sourceDay._id === destinationDay._id) {
            const otherRecipeIndex = sourceRecipes.findIndex(
                (candidate) => candidate.id === args.otherRecipeId,
            );
            if (otherRecipeIndex === -1) {
                throw new Error(
                    `No recipe ${args.otherRecipeId} in ${destinationDay.date}`,
                );
            }

            sourceRecipes.splice(otherRecipeIndex, 0, recipe);
            await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
        } else {
            const destinationRecipes = [...destinationDay.recipes];
            const otherRecipeIndex = destinationRecipes.findIndex(
                (candidate) => candidate.id === args.otherRecipeId,
            );
            if (otherRecipeIndex === -1) {
                throw new Error(
                    `No recipe ${args.otherRecipeId} in ${destinationDay.date}`,
                );
            }

            destinationRecipes.splice(otherRecipeIndex, 0, recipe);
            await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
            await ctx.db.patch(destinationDay._id, {
                recipes: destinationRecipes,
            });
        }

        return null;
    },
});

export const updateRecipeOverrideMultiplier = mutation({
    args: {
        recipeId: v.string(),
        multiplier: v.union(v.number(), v.null()),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const { day } = await getPlannedRecipe(ctx, userId, args.recipeId);
        const recipeIndex = day.recipes.findIndex(
            (recipe) => recipe.id === args.recipeId,
        );

        if (recipeIndex === -1) {
            throw new Error(`No recipe ${args.recipeId} in ${day.date}`);
        }

        const recipes = [...day.recipes];
        const { overrideDayMultiplier: _, ...recipeWithoutOverride } = recipes[recipeIndex];
        recipes[recipeIndex] = args.multiplier === null
            ? recipeWithoutOverride
            : {
                ...recipeWithoutOverride,
                overrideDayMultiplier: args.multiplier,
            };

        await ctx.db.patch(day._id, { recipes });
        return null;
    },
});
