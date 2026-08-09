import { v } from "convex/values";


const BuiltinUnit =  v.union(v.literal('grams'), v.literal('kilograms'), v.literal('ounces'), v.literal('pounds'))
const CustomUnit = v.object({
  name: v.string(),
  gramsPerUnit: v.number(),
});

export const measurementT = v.object({ 
    amount: v.number(),
    unit: BuiltinUnit,
});
