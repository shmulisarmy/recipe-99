import { v } from "convex/values";


const BuiltinUnit =  v.object({
  type: v.literal('builtin'),
  unit: v.union(v.literal('grams'), v.literal('kilograms'), v.literal('ounces'), v.literal('pounds'))
})
const CustomUnit = v.object({
  name: v.string(),
  gramsPerUnit: v.number(),
  type: v.literal('custom'),
});

export const measurementT = v.object({ 
    amount: v.number(),
    unit: v.union(BuiltinUnit, CustomUnit),
});
