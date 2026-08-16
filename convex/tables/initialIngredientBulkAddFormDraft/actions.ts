import { v, type Infer } from "convex/values";
import type { Id } from "../../_generated/dataModel";
import { internalMutation, mutation, type MutationCtx } from "../../_generated/server";
import { measurementT } from "../../types";
import { authenticatedUserId } from "../../utils/auth";

const ingredientT = v.object({
    name: v.string(),
    measurement: measurementT.partial(),
});

type Ingredient = Infer<typeof ingredientT>;

async function ownedDraft(
    ctx: MutationCtx,
    draftId: Id<"initialIngredientBulkAddFormDraft">,
    userId: string,
) {
    const draft = await ctx.db.get(draftId);
    if (!draft) throw new Error("Draft not found");
    if (draft.userId !== userId) throw new Error("Not authorized");
    return draft;
}

async function addIngredientsForUser(
    ctx: MutationCtx,
    args: {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        ingredients: Ingredient[];
        userId: string;
    },
) {
    const draft = await ownedDraft(ctx, args.draftId, args.userId);
    await ctx.db.patch(args.draftId, {
        ingredients: [...draft.ingredients, ...args.ingredients],
    });
}

async function updateIngredientForUser(
    ctx: MutationCtx,
    args: {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        ingredientName: string;
        ingredient: Ingredient;
        userId: string;
    },
) {
    const draft = await ownedDraft(ctx, args.draftId, args.userId);
    const index = draft.ingredients.findIndex(
        (existingIngredient) => existingIngredient.name === args.ingredientName,
    );
    if (index === -1) throw new Error("Ingredient not found");

    const ingredients = [...draft.ingredients];
    ingredients[index] = args.ingredient;
    await ctx.db.patch(args.draftId, { ingredients });
}

async function markAsDoneForUser(
    ctx: MutationCtx,
    args: {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        userId: string;
    },
) {
    await ownedDraft(ctx, args.draftId, args.userId);
    await ctx.db.patch(args.draftId, { isDoneInitialGeneration: true });
}

export const createDraft = mutation({
    args: {},
    returns: v.id("initialIngredientBulkAddFormDraft"),
    handler: async (ctx) => {
        const userId = await authenticatedUserId(ctx);
        return await ctx.db.insert("initialIngredientBulkAddFormDraft", {
            userId,
            isDoneInitialGeneration: false,
            ingredients: [],
        });
    },
});

export const addIngredients = mutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        ingredients: v.array(ingredientT),
    },
    returns: v.null(),
    handler: async (ctx, { draftId, ingredients }) => {
        const userId = await authenticatedUserId(ctx);
        await addIngredientsForUser(ctx, { draftId, ingredients, userId });
        return null;
    },
});

export const addIngredientsFromAgent = internalMutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        ingredients: v.array(ingredientT),
        userId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await addIngredientsForUser(ctx, args);
        return null;
    },
});

export const updateIngredient = mutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        ingredientName: v.string(),
        ingredient: ingredientT,
    },
    returns: v.null(),
    handler: async (ctx, { draftId, ingredientName, ingredient }) => {
        const userId = await authenticatedUserId(ctx);
        await updateIngredientForUser(ctx, {
            draftId,
            ingredientName,
            ingredient,
            userId,
        });
        return null;
    },
});

export const updateIngredientFromAgent = internalMutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        ingredientName: v.string(),
        ingredient: ingredientT,
        userId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await updateIngredientForUser(ctx, args);
        return null;
    },
});



export const markAsDone = mutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
    },
    returns: v.null(),
    handler: async (ctx, { draftId }) => {
        const userId = await authenticatedUserId(ctx);
        await markAsDoneForUser(ctx, { draftId, userId });
        return null;
    },
});

export const markAsDoneFromAgent = internalMutation({
    args: {
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        userId: v.string(),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        await markAsDoneForUser(ctx, args);
        return null;
    },
});
