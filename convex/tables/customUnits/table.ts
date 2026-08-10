import { defineTable } from "convex/server";
import { v } from "convex/values";

export const customUnitValidator = v.object({
    associatedIngredient: v.string(),
    gramsPerUnit: v.number(),
    unitName: v.string(),
});

export const customUnitDocumentValidator = customUnitValidator.extend({
    _id: v.id("customUnits"),
    _creationTime: v.number(),
});

export const customUnits = defineTable(customUnitValidator)
    .index("by_associatedIngredient", ["associatedIngredient"]);
