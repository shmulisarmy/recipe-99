import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { recipeValidator } from "./schema";
import { measurementT } from "./types";
import { Measurement_Plus } from "../src/primitives/measurement";


export const getAvailableIngredients = query({  
    args: {userId: v.string()},
    handler: async (ctx) => {
        return await ctx.db.query("pantryItems").withIndex("userId").collect();
    },  
});


export const updateAvailableIngredient = mutation({  
    args: {userId: v.string(), ingredientName: v.string(), measurement: measurementT},
    handler: async (ctx, args) => {
        const ingredient = await ctx.db.query("pantryItems").withIndex("myIngredient", (q) => q.eq("userId", args.userId).eq("name_", args.ingredientName)).unique();
        if (!ingredient) throw new Error(`Ingredient ${args.ingredientName} not found`);
        await ctx.db.patch(ingredient._id, { Measurement: args.measurement });
        return ingredient;
    },
});


export const getAllRecipes = query({  
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("recipes").collect();
    },  
});




export const getRecipeById = query({  
    args: { recipeId: v.id("recipes")},
    handler: async (ctx, { recipeId }) => {
        return await ctx.db.get("recipes", recipeId);
    },  
});


export const getRecipeByTitle = query({
    args: { recipeTitle: v.string(), version: v.optional(v.number()) },
    handler: async (ctx, { recipeTitle, version }) => {
        const latest = version === undefined
            ? await ctx.db.query("recipesVersions")
                .withIndex("recipeTitle", (q) => q.eq("recipeTitle", recipeTitle))
                .unique()
            : null;
        const resolvedVersion = version ?? latest?.mostRecentVersion;

        if (resolvedVersion === undefined) return null;

        return await ctx.db.query("recipes").withIndex("versionedRecipe", 
            (q) => q.eq("title", recipeTitle).eq("version", resolvedVersion)
        ).unique();
    },  
});



export const createRecipe = mutation({
    args: recipeValidator.fields,
    handler: async (ctx, recipe) => {
        return await ctx.db.insert("recipes", recipe);
    },
});



export const AvailableIngredientsBulkAdd = mutation({  
    args: {
        userId: v.string(),
        ingredientsToAdd: v.array(v.object({
            name: v.string(),
            Measurement: measurementT,
        })),
    },
    handler: async (ctx, args) => {
        for (const { name, Measurement } of args.ingredientsToAdd) {
            const ingredient = await ctx.db
                .query("pantryItems")
                .withIndex("myIngredient", (q) =>
                    q.eq("userId", args.userId).eq("name_", name)
                )
                .unique();

            if (ingredient) {
                await ctx.db.patch(ingredient._id, {
                    Measurement: Measurement_Plus(ingredient.Measurement, Measurement),
                });
            } else {
                await ctx.db.insert("pantryItems", {
                    userId: args.userId,
                    name_: name,
                    Measurement,
                });
            }
        }

        return null;
    },
});
