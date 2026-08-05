import { IngredientSet, RecipeId, RecipeName } from "../../data";
import { Id } from "../../../convex/_generated/dataModel";





export type PlannedRecipe = {
    recipeId: RecipeId;
    overrideDayMultiplier?: number;
    id: string;
};

export type ShoppingCart = {
    toGet: IngredientSet;
    alreadyGot: IngredientSet;
};
export type PlannedDay = {
    userId: string;
    _id: Id<"plannerTable">;
    _creationTime: number;
    date: string;
    recipes: PlannedRecipe[];
    multiplier: number;
    shoppingCart: ShoppingCart;
};



export type DayKind = 'today' | 'past' | 'future';



export const today = new Date("Fri Jul 31 2026");





export type Date_ = string;