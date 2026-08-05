import { v } from "convex/values";
import { mutation } from "../../../_generated/server";
import { measurementT } from "../../../types";
import { authenticatedUserId } from "../../../utils/auth";
import {
    Measurement,
    Measurement_Minus,
    Measurement_Plus,
    ZeroedMeasurement,
} from "../../../../src/primitives/measurement";

const ingredient = v.object({
    name: v.string(),
    measurement: measurementT,
});


export const BulkUpdateCartToGet = mutation({
    args: {
        date: v.string(),
        ingredients: v.array(ingredient),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.date}`);

        await ctx.db.patch(day._id, {
            shoppingCart: {
                ...day.shoppingCart,
                toGet: {
                    ...args.ingredients.reduce((acc, ingredient) => {
                        acc[ingredient.name] = Measurement_Plus(
                            acc[ingredient.name] ?? ZeroedMeasurement(),
                            ingredient.measurement,
                        );
                        return acc;
                    }, day.shoppingCart.toGet),
                },
            },
        });
    },
});

export const BulkSetCartToGet = mutation({
    args: {
        date: v.string(),
        ingredients: v.array(ingredient),
    },
    returns: v.null(),
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.date}`);

        const toGet = { ...day.shoppingCart.toGet };
        for (const item of args.ingredients) {
            toGet[item.name] = item.measurement;
        }

        await ctx.db.patch(day._id, {
            shoppingCart: {
                ...day.shoppingCart,
                toGet,
            },
        });

        return null;
    },
});

export const UpdateCartToGet = mutation({
    args: {
        date: v.string(),
        ingredient,
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.date}`);

        await ctx.db.patch(day._id, {
            shoppingCart: {
                ...day.shoppingCart,
                toGet: {
                    ...day.shoppingCart.toGet,
                    [args.ingredient.name]: args.ingredient.measurement,
                },
            },
        });

        return null;
    },
});

export const UpdateCartAlreadyGot = mutation({
    args: {
        date: v.string(),
        ingredient,
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.date)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.date}`);

        await ctx.db.patch(day._id, {
            shoppingCart: {
                ...day.shoppingCart,
                alreadyGot: {
                    ...day.shoppingCart.alreadyGot,
                    [args.ingredient.name]: args.ingredient.measurement,
                },
            },
        });

        return null;
    },
});

export const PushOverIngredientShoppingItemsForTheNextDay = mutation({
    args: {
        ingredientNames: v.array(v.string()),
        dayAsString: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await authenticatedUserId(ctx);
        const day = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", args.dayAsString)
            )
            .unique();

        if (!day) throw new Error(`No planned day for ${args.dayAsString}`);

        const nextDate = new Date(args.dayAsString);
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDayAsString = nextDate.toDateString();
        const nextDay = await ctx.db
            .query("plannerTable")
            .withIndex("by_userId_and_date", (q) =>
                q.eq("userId", userId).eq("date", nextDayAsString)
            )
            .unique();

        if (!nextDay) throw new Error(`No planned day for ${nextDayAsString}`);

        const toGet = { ...day.shoppingCart.toGet };
        const nextDayToGet = { ...nextDay.shoppingCart.toGet };

        for (const ingredientName of args.ingredientNames) {
            const needed = toGet[ingredientName];
            if (!needed) {
                throw new Error(
                    `PushOverIngredientShoppingItemsForTheNextDay: ingredient ${ingredientName} not found in shopping cart`,
                );
            }

            const alreadyGot =
                day.shoppingCart.alreadyGot[ingredientName] ??
                ZeroedMeasurement();
            const stillNeeded = Measurement_Minus(needed, alreadyGot);
            toGet[ingredientName] = alreadyGot;
            nextDayToGet[ingredientName] = Measurement_Plus(
                nextDayToGet[ingredientName] ?? ZeroedMeasurement(),
                stillNeeded,
            );
        }

        await ctx.db.patch(day._id, {
            shoppingCart: { ...day.shoppingCart, toGet },
        });
        await ctx.db.patch(nextDay._id, {
            shoppingCart: {
                ...nextDay.shoppingCart,
                toGet: nextDayToGet,
            },
        });

        return null;
    },
});

