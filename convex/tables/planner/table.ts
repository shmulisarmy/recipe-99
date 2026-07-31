import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { measurementT } from "../../types";
import { PlannedDay } from "./types";




export const plannerTable = defineTable(PlannedDay).index("by_userId", ["userId"])
    .index("by_userId_and_date", ["userId", "date"])
