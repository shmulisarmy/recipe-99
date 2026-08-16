import { defineSchema } from "convex/server";
import { pantryItems } from "./tables/pantryItems/table";
import { plannerTable } from "./tables/planner/table";
import { recipes, recipesVersions } from "./tables/recipes/table";
import { customUnits } from "./tables/customUnits/table";
import { initialIngredientBulkAddFormDraft } from "./tables/initialIngredientBulkAddFormDraft/table";

export default defineSchema({
    recipes,
    pantryItems,
    recipesVersions,
    plannerTable,
    customUnits,
    initialIngredientBulkAddFormDraft,
});
