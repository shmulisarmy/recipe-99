import { createTool } from "@convex-dev/agent";
import { makeFunctionReference } from "convex/server";
import { z } from "zod/v4";
import type { Id } from "../../_generated/dataModel";

const unitSchema = z.union([
    z.object({
        type: z.literal("builtin"),
        unit: z.enum(["grams", "kilograms", "ounces", "pounds"]),
    }),
    z.object({
        type: z.literal("custom"),
        name: z.string(),
        gramsPerUnit: z.number(),
    }),
]);

const ingredientSchema = z.object({
    name: z.string(),
    measurement: z.object({
        amount: z.number().optional(),
        unit: unitSchema.optional(),
    }),
});

const draftIdSchema = z.string().transform(
    (draftId) => draftId as Id<"initialIngredientBulkAddFormDraft">,
);

type Ingredient = z.infer<typeof ingredientSchema>;

const addIngredientsMutation = makeFunctionReference<
    "mutation",
    {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        ingredients: Ingredient[];
        userId: string;
    },
    null
>("tables/initialIngredientBulkAddFormDraft/actions:addIngredientsFromAgent");

const updateIngredientMutation = makeFunctionReference<
    "mutation",
    {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        ingredientName: string;
        ingredient: Ingredient;
        userId: string;
    },
    null
>("tables/initialIngredientBulkAddFormDraft/actions:updateIngredientFromAgent");

const markAsDoneMutation = makeFunctionReference<
    "mutation",
    {
        draftId: Id<"initialIngredientBulkAddFormDraft">;
        userId: string;
    },
    null
>("tables/initialIngredientBulkAddFormDraft/actions:markAsDoneFromAgent");

const createCustomUnitMutation = makeFunctionReference<
    "mutation",
    {
        associatedIngredient: string;
        unitName: string;
        gramsPerUnit: number;
    },
    Id<"customUnits">
>("customUnit_exports:createCustomUnit");



function agentUserId(userId: string | undefined): string {
    if (!userId) throw new Error("Agent user ID is required");
    return userId;
}

export const addIngredients = createTool({
    description: "Append complete ingredients to a bulk-add draft. Preserve the user's amount and unit representation; when using a custom unit, its name and gramsPerUnit must exactly match the custom unit created for that ingredient.",
    inputSchema: z.object({
        draftId: draftIdSchema,
        ingredients: z.array(ingredientSchema),
    }),
    execute: async (ctx, args) => {
        await ctx.runMutation(addIngredientsMutation, {
            ...args,
            userId: agentUserId(ctx.userId),
        });
        return "Ingredients added to the draft.";
    },
});

export const updateIngredient = createTool({
    description: "Replace one ingredient in a bulk-add draft to correct its name or complete measurement. Preserve the user's original amount, package count, package size, and unit representation.",
    inputSchema: z.object({
        draftId: draftIdSchema,
        ingredientName: z.string(),
        ingredient: ingredientSchema,
    }),
    execute: async (ctx, args) => {
        await ctx.runMutation(updateIngredientMutation, {
            ...args,
            userId: agentUserId(ctx.userId),
        });
        return "Ingredient updated in the draft.";
    },
});

export const createCustomUnit = createTool({
    description: "Create one ingredient-specific count, package, container, or unsupported-volume unit before using it in a draft. unitName must be singular and self-describing (for example, '5 lb bag'); gramsPerUnit is the gram weight of exactly one such unit.",
    inputSchema: z.object({
        associatedIngredient: z.string(),
        unitName: z.string(),
        gramsPerUnit: z.number().positive(),
    }),
    execute: async (ctx, args) => {
        return await ctx.runMutation(createCustomUnitMutation, args);
    },
});

export const markAsDone = createTool({
    description: "Mark the ingredient bulk-add draft's initial generation as complete. Call this exactly once, only after every supplied ingredient has been added with a complete measurement.",
    inputSchema: z.object({
        draftId: draftIdSchema,
    }),
    execute: async (ctx, args) => {
        await ctx.runMutation(markAsDoneMutation, {
            ...args,
            userId: agentUserId(ctx.userId),
        });
        return "Draft marked as done.";
    },
});
