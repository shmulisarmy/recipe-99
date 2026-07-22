import { IngredientSet, RecipeName } from "../../data";





export type PlannedRecipe = {
    recipe: RecipeName;
    overrideDayMultiplier?: number;
    id: string;
};

export type ShoppingCart = {
    toGet: IngredientSet;
    alreadyGot: IngredientSet;
};
export type PlannedDay = {
    date: Date;
    recipes: PlannedRecipe[];
    multiplier: number;
    shoppingCart: ShoppingCart;
};



export type DayKind = 'today' | 'past' | 'future';



export const today = new Date();





export type Date_ = string;