import { defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "../../types";

export const pantryItemValidator = v.object({
    name_: v.string(),
    Measurement: measurementT,
    userId: v.string(),
});

export const pantryItemDocumentValidator = pantryItemValidator.extend({
    _id: v.id("pantryItems"),
    _creationTime: v.number(),
});

export const pantryItems = defineTable(pantryItemValidator)
    .index("by_userId", ["userId"])
    .index("by_userId_and_name_", ["userId", "name_"]);
