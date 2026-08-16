import { defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "../../types";



export const initialIngredientBulkAddFormDraft = defineTable(
    v.object({
        userId: v.string(),
        isDoneInitialGeneration: v.boolean(),
        ingredients: v.array(
            v.object({
                name: v.string(),
                measurement: measurementT.partial(),
            })
        ),
    })
)
