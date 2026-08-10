import { defineSchema } from "convex/server";
import { pantryItems } from "./tables/pantryItems/table";
import { plannerTable } from "./tables/planner/table";
import { recipes, recipesVersions } from "./tables/recipes/table";
import { customUnits } from "./tables/customUnits/table";

export default defineSchema({
    recipes,
    pantryItems,
    recipesVersions,
    plannerTable,
    customUnits,
});
