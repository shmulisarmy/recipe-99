import { createAnthropic } from "@ai-sdk/anthropic";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { makeFunctionReference } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import { action, env, internalAction } from "../_generated/server";
import { initialIngredientBulkAddFormDraft } from "../tables/initialIngredientBulkAddFormDraft/table";
import { authenticatedUserId } from "../utils/auth";
import {
    addIngredients,
    createCustomUnit,
    markAsDone,
    updateIngredient,
} from "../tables/initialIngredientBulkAddFormDraft/tools";



const initialIngredientBulkAddFormDraftAgent = new Agent(components.agent, {
    name: "initialIngredientBulkAddFormDraftAgent",
    languageModel: createAnthropic({ apiKey: env.ANTHROPIC_API_KEY })(
        "claude-haiku-4-5-20251001",
    ),
    instructions: `
        You create an ingredient bulk-add draft from user context, usually a receipt or a list of pantry items.

        Primary goal: visible feedback first
        - Your highest-priority responsibility is to put useful ingredients into the draft as fast as possible so the user sees the form populate immediately.
        - On your FIRST tool step, scan the entire input only for ingredients whose full measurement is already a single unambiguous amount followed directly by a builtin unit: grams, kilograms, ounces, or pounds.
        - An item is NOT eligible for the fast builtin pass if its measurement contains multiple numbers, multiplication, a count, a container, or a package word—even if it also contains grams, kilograms, ounces, or pounds. Defer the entire item for custom-unit handling.
        - Never multiply a package count by its package weight to force that item into the fast builtin pass. The package representation must remain intact.
        - Treat every distinct input ingredient name as a separate item. If one name contains another or two items share the same unit, do not merge, deduplicate, or omit either one.
        - Before the first tool call, count the eligible builtin-unit input entries; the ingredients array in that call must contain exactly that many entries.
        - If any such ingredients exist, your FIRST tool call must be one addIngredients call containing all of those obvious builtin-unit ingredients. Do not narrate, create custom units, or solve harder measurements before making this write.
        - This fast first write is mandatory even when an earlier item in the input needs a custom unit. Skip the harder item temporarily; never make obvious builtin-unit ingredients wait behind it.
        - Prefer one immediate batched addIngredients call over several separate calls for these obvious ingredients because one write gives the user the fastest useful feedback.
        - Only after that first write succeeds should you reason about liters, containers, package counts, ambiguous measurements, or other custom units.
        - If no ingredient has an obvious builtin measurement, immediately begin the single clearest custom-unit ingredient; do not spend a turn merely describing your plan.
        - After the fast pass, finish the entire draft carefully.
        - Before finishing, account for every supplied ingredient exactly once with a specific amount and unit.
        - Never claim the draft is complete while an input item is missing or has an incomplete measurement.

        Measurement rules
        - Preserve the user's stated amount, unit, package size, and package count whenever possible. Do not replace liters with kilograms, packages with a total weight, or another merely equivalent representation.
        - Use a builtin unit only when the user directly supplied grams, kilograms, ounces, or pounds and the package form is not meaningful.
        - Use a custom unit for counts, containers, package sizes, or unsupported units such as bag, bottle, can, carton, loaf, bunch, gallon, or liter.
        - Give custom units singular, self-describing names that include package size when known, such as "24 oz jar", "750 ml bottle", or "6-count carton". Avoid vague names such as "container" when the size is known.
        - gramsPerUnit always means the number of grams in exactly ONE custom unit. It is never the item count, the package's numeric label by itself, or the total weight of all packages.
        - Parse multiplicative phrases carefully: "3 12-ounce cans" means amount 3 with custom unit "12 oz can" and gramsPerUnit 340.1942775. It does not mean amount 36 ounces, and gramsPerUnit is not 28.349523125.
        - Use these exact mass conversions: 1 ounce = 28.349523125 grams; 1 pound = 453.59237 grams; 1 kilogram = 1000 grams.
        - For liters or gallons of a water-like liquid such as broth, preserve the volume as a custom unit and use 1000 grams per liter or 3785.411784 grams per gallon unless the user supplies a more specific conversion.
        - Do not invent precision that the user did not provide for the amount. Preserve qualifiers such as "about" by choosing the stated numeric amount without silently changing its unit.

        Tool sequencing
        - First perform the mandatory fast builtin-unit add described above. Custom-unit work must not delay it.
        - After the fast builtin write, when a custom unit is needed, call createCustomUnit first and wait for it to succeed before adding or updating the ingredient with that unit.
        - Create each needed custom unit at most once during this run.
        - After custom units exist, add ingredients with the exact same custom-unit name and gramsPerUnit values.
        - Use the lowercase measurement field required by the tools.
        - markAsDone sets the draft's isDoneInitialGeneration field to true. The frontend reactively observes that field; this tool call is how you communicate that initial generation is complete.
        - Call markAsDone exactly once after the completion check passes. It must be your final tool call.
        - Never call markAsDone while an ingredient is missing or has an incomplete measurement.
        - Do not rely on conversational text to communicate completion. Generation is complete only when markAsDone succeeds.

        Examples
        - For an input containing rice in kilograms, tomatoes in cans, broth in gallons, and almonds in ounces: FIRST add rice and almonds together with builtin units. Only afterward create the can and gallon units and add tomatoes and broth.
        - "750 grams of rice" -> amount 750, builtin grams.
        - "3 12-ounce cans of tomatoes" -> create custom unit "12 oz can" with gramsPerUnit 340.1942775; then add tomatoes with amount 3 and that custom unit.
        - "4 2-kilogram sacks of potatoes" -> create custom unit "2 kg sack" with gramsPerUnit 2000; then add potatoes with amount 4 and that custom unit.
        - "3 gallons of broth" -> create custom unit "gallon" with gramsPerUnit 3785.411784; then add broth with amount 3 and that custom unit. Do not substitute a builtin mass unit.

        Completion check
        - Compare the final planned tool inputs against the original context.
        - Confirm every ingredient is present exactly once.
        - Confirm every measurement has both amount and unit.
        - Confirm each custom unit preserves the user's package or volume representation and has the weight of one unit.
        - If anything fails this check, use the tools to correct it before responding that the draft is ready.
        - After every check passes, call markAsDone with the draftId. Its successful write notifies the reactive frontend that the draft is ready; do not say the draft is ready unless that tool succeeds.
     `,
    tools: { addIngredients, updateIngredient, createCustomUnit, markAsDone },
    stopWhen: stepCountIs(1000),
});

const createDraftMutation = makeFunctionReference<
    "mutation",
    Record<string, never>,
    Id<"initialIngredientBulkAddFormDraft">
>("tables/initialIngredientBulkAddFormDraft/actions:createDraft");

const getDraftQuery = makeFunctionReference<
    "query",
    { draftId: Id<"initialIngredientBulkAddFormDraft"> },
    Doc<"initialIngredientBulkAddFormDraft">
>("tables/initialIngredientBulkAddFormDraft/queries:getDraft");

const getStoredImageMetadataQuery = makeFunctionReference<
    "query",
    { imageId: Id<"_storage"> },
    { contentType: string | null } | null
>("agents/imageUtils:getStoredImageMetadata");

export const generateDraftInBackground = internalAction({
    args: {
        threadId: v.string(),
        userId: v.string(),
        userSuppliedContext: v.string(),
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        imageId: v.id("_storage"),
        ocrText: v.string()
    },
    returns: v.null(),
    handler: async (ctx, { threadId, userId, userSuppliedContext, draftId, imageId, ocrText }) => {
        const { thread } = await initialIngredientBulkAddFormDraftAgent.continueThread(
            ctx,
            { threadId, userId },
        );

        try {
            const metadata = await ctx.runQuery(getStoredImageMetadataQuery, { imageId });
            if (!metadata) throw new Error("Uploaded image not found");
            if (!metadata.contentType?.startsWith("image/")) {
                throw new Error("Uploaded file is not an image");
            }
            const imageUrl = await ctx.storage.getUrl(imageId);
            if (!imageUrl) throw new Error("Uploaded image not found");

            await thread.generateText({
                prompt: [{
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ userSuppliedContext, draftId, 'here is some ocr text that we pulled that can maybe be used as a quick suggestion': ocrText }),
                        },
                        {
                            type: "image",
                            image: new URL(imageUrl),
                            mediaType: metadata.contentType,
                        },
                    ],
                }],
            });
        } finally {
            await ctx.storage.delete(imageId);
        }
        return null;
    },
});

export const getAgentToMakeInitialIngredientBulkAddFormDraft = action({
    args: { userSuppliedContext: v.string(), imageId: v.id("_storage"), ocrText: v.string(), },
    returns: v.object({
        threadId: v.string(),
        draftId: v.id("initialIngredientBulkAddFormDraft"),
        text: v.string(),
        draft: initialIngredientBulkAddFormDraft.validator.extend({
            _id: v.id("initialIngredientBulkAddFormDraft"),
            _creationTime: v.number(),
        }),
    }),
    handler: async (ctx, { userSuppliedContext, imageId, ocrText }) => {
        const userId = await authenticatedUserId(ctx);
        const draftId = await ctx.runMutation(createDraftMutation, {});
        const { threadId } = await initialIngredientBulkAddFormDraftAgent.createThread(ctx, { userId });
        const draft = await ctx.runQuery(getDraftQuery, { draftId });
        await ctx.scheduler.runAfter(
            0,
            internal.agents.initialIngredientBulkAddFormDraftAgent.generateDraftInBackground,
            {
                threadId,
                userId,
                userSuppliedContext,
                imageId,
                draftId,
                ocrText
            },
        );

        return {
            threadId,
            draftId,
            text: "Building your ingredient list…",
            draft,
        };
    },
});

export { getDraft } from "../tables/initialIngredientBulkAddFormDraft/queries";
