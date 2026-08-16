import { v } from "convex/values";
import { query } from "../../_generated/server";
import { authenticatedUserId } from "../../utils/auth";
import { initialIngredientBulkAddFormDraft } from "./table";

export const getDraft = query({
    args: { draftId: v.id("initialIngredientBulkAddFormDraft") },
    returns: initialIngredientBulkAddFormDraft.validator.extend({
        _id: v.id("initialIngredientBulkAddFormDraft"),
        _creationTime: v.number(),
    }),
    handler: async (ctx, { draftId }) => {
        const userId = await authenticatedUserId(ctx);
        const draft = await ctx.db.get("initialIngredientBulkAddFormDraft", draftId);
        if (!draft) throw new Error("Draft not found");
        if (draft.userId !== userId) throw new Error("Not authorized");
        return draft;
    },
});
