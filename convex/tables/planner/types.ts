import { type Infer, v } from "convex/values";
import { measurementT } from "../../types";
import { defineTable } from "convex/server";



export const recipeId = v.object({
    title: v.string(),
    version: v.number(),
});


export const PlannedRecipe = v.object({
    recipeId: recipeId,
    overrideDayMultiplier: v.optional(v.number()),
    id: v.string(),
});


export const IngredientSet = v.record(v.string(), measurementT);


export const ShoppingCart = v.object({
    toGet: IngredientSet,
    alreadyGot: IngredientSet,
});


export const PlannedDay = v.object({
    date: v.string(),
    recipes: v.array(PlannedRecipe),
    multiplier: v.number(),
    shoppingCart: ShoppingCart,
    userId: v.string(),
});


export type RecipeIdT = Infer<typeof recipeId>;
export type PlannedDayT = Infer<typeof PlannedDay>;
export type PlannedRecipeT = Infer<typeof PlannedRecipe>;
export type IngredientSetT = Infer<typeof IngredientSet>;
export type ShoppingCartT = Infer<typeof ShoppingCart>;
