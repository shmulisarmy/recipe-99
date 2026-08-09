    import { v } from "convex/values";
    import type { Doc } from "../../../_generated/dataModel";
    import type { MutationCtx } from "../../../_generated/server";
    import { mutation } from "../../../_generated/server";
    import { authenticatedUserId } from "../../../utils/auth";
    import { recipeId as recipeIdValidator } from "../types";

    type PlannedRecipe = Doc<"plannerTable">["recipes"][number];
    const DEFAULT_DAY_MULTIPLIER = 1;

    async function getPlannerDay(
    ctx: MutationCtx,
    userId: string,
    date: string,
    ): Promise<Doc<"plannerTable"> | null> {
    return await ctx.db
        .query("plannerTable")
        .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", userId).eq("date", date),
        )
        .unique();
    }

    async function insertPlannerDay(
    ctx: MutationCtx,
    userId: string,
    date: string,
    recipes: PlannedRecipe[],
    ) {
    return await ctx.db.insert("plannerTable", {
        date,
        recipes,
        multiplier: DEFAULT_DAY_MULTIPLIER,
        shoppingCart: {
        toGet: {},
        alreadyGot: {},
        },
        userId,
    });
    }

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

    export const AddRecipeToDate = mutation({
    args: {
        recipeId: recipeIdValidator,
        toDate: v.string(),
    },
    returns: v.string(),
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const recipe = await ctx.db
        .query("recipes")
        .withIndex("versionedRecipe", (q) =>
            q.eq("title", args.recipeId.title).eq("version", args.recipeId.version),
        )
        .unique();

        if (!recipe) {
        throw new Error(
            `No recipe ${args.recipeId.title} version ${args.recipeId.version}`,
        );
        }

        const plannedRecipe: PlannedRecipe = {
        recipeId: args.recipeId,
        id: crypto.randomUUID(),
        };
        const day = await getPlannerDay(ctx, userId, args.toDate);

        if (day) {
        await ctx.db.patch(day._id, {
            recipes: [...day.recipes, plannedRecipe],
        });
        } else {
        await insertPlannerDay(ctx, userId, args.toDate, [plannedRecipe]);
        }

        return plannedRecipe.id;
    },
    });

    export const InsertRecipeAtBeginningOfDate = mutation({
    args: {
        recipeId: v.string(),
        toDate: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const { recipe, day: sourceDay } = await getPlannedRecipe(
        ctx,
        userId,
        args.recipeId,
        );
        const destinationDay = await getPlannerDay(ctx, userId, args.toDate);

        const sourceRecipes = sourceDay.recipes.filter(
        (candidate) => candidate.id !== args.recipeId,
        );

        if (!destinationDay) {
        await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
        await insertPlannerDay(ctx, userId, args.toDate, [recipe]);
        } else if (sourceDay._id === destinationDay._id) {
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

    export const InsertRecipeAtEndOfDate = mutation({
    args: {
        recipeId: v.string(),
        toDate: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const { recipe, day: sourceDay } = await getPlannedRecipe(
        ctx,
        userId,
        args.recipeId,
        );
        const destinationDay = await getPlannerDay(ctx, userId, args.toDate);
        const sourceRecipes = sourceDay.recipes.filter(
        (candidate) => candidate.id !== args.recipeId,
        );

        if (!destinationDay) {
        await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
        await insertPlannerDay(ctx, userId, args.toDate, [recipe]);
        } else if (sourceDay._id === destinationDay._id) {
        await ctx.db.patch(sourceDay._id, {
            recipes: [...sourceRecipes, recipe],
        });
        } else {
        await ctx.db.patch(sourceDay._id, { recipes: sourceRecipes });
        await ctx.db.patch(destinationDay._id, {
            recipes: [...destinationDay.recipes, recipe],
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
    returns: v.null(),
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
        const { overrideDayMultiplier: _, ...recipeWithoutOverride } =
        recipes[recipeIndex];
        recipes[recipeIndex] =
        args.multiplier === null
            ? recipeWithoutOverride
            : {
                ...recipeWithoutOverride,
                overrideDayMultiplier: args.multiplier,
            };

        await ctx.db.patch(day._id, { recipes });
        return null;
    },
    });
