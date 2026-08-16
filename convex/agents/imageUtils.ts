import { v } from "convex/values";
import { internalQuery, mutation } from "../_generated/server";
import { authenticatedUserId } from "../utils/auth";

// Storage operations shared by image-capable Agents.
export const generateImageUploadUrl = mutation({
    args: {},
    returns: v.string(),
    handler: async (ctx) => {
        await authenticatedUserId(ctx);
        return await ctx.storage.generateUploadUrl();
    },
});

export const getStoredImageMetadata = internalQuery({
    args: { imageId: v.id("_storage") },
    returns: v.union(
        v.null(),
        v.object({ contentType: v.union(v.string(), v.null()) }),
    ),
    handler: async (ctx, { imageId }) => {
        const metadata = await ctx.db.system.get("_storage", imageId);
        return metadata ? { contentType: metadata.contentType ?? null } : null;
    },
});
