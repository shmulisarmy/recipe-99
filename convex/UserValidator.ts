import { v } from "convex/values";

export const UserValidator = v.object({
    name: v.string(),
    age: v.number(),
    message: v.string(),
});