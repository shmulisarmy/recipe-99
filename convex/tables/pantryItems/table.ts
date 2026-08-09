import { defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "../../types";

export const pantryItems = defineTable({
    name_: v.string(),
    Measurement: measurementT,
    userId: v.string(),
})
    .index("by_userId", ["userId"])
    .index("by_userId_and_name_", ["userId", "name_"]);
