import { defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "../../types";

export const recipeValidator = v.object({
    title: v.string(),
    version: v.number(),
    description: v.string(),
    requiredIngredients: v.array(v.object({
        name: v.string(),
        Measurement: measurementT,
        substitute: v.optional(v.object({
            name: v.string(),
            Measurement: measurementT,
        })),
    })),
});

export const recipeDocumentValidator = recipeValidator.extend({
    _id: v.id("recipes"),
    _creationTime: v.number(),
});

export const recipes = defineTable(recipeValidator)
    .index("versionedRecipe", ["title", "version"]);

export const recipesVersions = defineTable({
    recipeTitle: v.string(),
    mostRecentVersion: v.number(),
}).index("recipeTitle", ["recipeTitle"]);
