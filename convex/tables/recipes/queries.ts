import { v } from "convex/values";
import { query } from "../../_generated/server";
import { recipeDocumentValidator } from "./table";

export const getAllRecipes = query({
    args: {},
    returns: v.array(recipeDocumentValidator),
    handler: async (ctx) => {
        return await ctx.db.query("recipes").collect();
    },
});

export const getRecipeById = query({
    args: { recipeId: v.id("recipes") },
    returns: v.union(recipeDocumentValidator, v.null()),
    handler: async (ctx, { recipeId }) => {
        return await ctx.db.get("recipes", recipeId);
    },
});

export const getRecipeByTitle = query({
    args: { recipeTitle: v.string(), version: v.optional(v.number()) },
    returns: v.union(recipeDocumentValidator, v.null()),
    handler: async (ctx, { recipeTitle, version }) => {
        const latest = version === undefined
            ? await ctx.db.query("recipesVersions")
                .withIndex("recipeTitle", (q) => q.eq("recipeTitle", recipeTitle))
                .unique()
            : null;
        const resolvedVersion = version ?? latest?.mostRecentVersion;

        if (resolvedVersion === undefined) return null;

        return await ctx.db.query("recipes").withIndex(
            "versionedRecipe",
            (q) => q.eq("title", recipeTitle).eq("version", resolvedVersion),
        ).unique();
    },
});
