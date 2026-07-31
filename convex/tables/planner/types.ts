import { type Infer, v } from "convex/values";
import { measurementT } from "../../types";
import { defineTable } from "convex/server";



export const recipeId = v.object({
    title: v.string(),
    version: v.number(),
});

export type RecipeIdT = Infer<typeof recipeId>;

export const PlannedRecipe = v.object({
    recipeId: recipeId,
    overrideDayMultiplier: v.optional(v.number()),
    id: v.string(),
});

export type PlannedRecipeT = Infer<typeof PlannedRecipe>;

export const IngredientSet = v.record(v.string(), measurementT);

export type IngredientSetT = Infer<typeof IngredientSet>;

export const ShoppingCart = v.object({
    toGet: IngredientSet,
    alreadyGot: IngredientSet,
});

export type ShoppingCartT = Infer<typeof ShoppingCart>;

// TOUR 1 — This validator is the durable version of the frontend PlannedDay contract; Convex-compatible primitives must meet here.
export const PlannedDay = v.object({
    date: v.string(),
    recipes: v.array(PlannedRecipe),
    multiplier: v.number(),
    shoppingCart: ShoppingCart,
    userId: v.string(),
});



export type PlannedDayT = Infer<typeof PlannedDay>;
