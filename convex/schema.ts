import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "./types";






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

const recipes = defineTable(recipeValidator).index("versionedRecipe", ["title", "version"]);



const pantryItems = defineTable({
    name_: v.string(),
    Measurement: measurementT,
    userId: v.string(),
}).index("userId", ["userId"]).index("myIngredient", ["userId", "name_"]);

export default defineSchema({
    recipes,
    pantryItems,
    recipesVersions: defineTable({
        recipeTitle: v.string(),
        mostRecentVersion: v.number(),
    }).index("recipeTitle", ["recipeTitle"]),
});
