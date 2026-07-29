import { v } from "convex/values";

export const measurementT = v.object({ 
    amount: v.number(),
    unit: v.union(v.literal('grams'), v.literal('kilograms'), v.literal('ounces'), v.literal('pounds')),
});
