import { createMutable } from "solid-js/store";
import { IngredientSet, makeCacheKey, Recipe, RecipeCache, RecipeId, RequiredIngredient } from "../../data";
import { recipeMakingProjection } from "../../logic";

import { Date_, PlannedRecipe, ShoppingCart } from "./types";
import { Measurement, Measurement_Minus, Measurement_Plus, ZeroedMeasurement } from "../../primitives/measurement";
import { PlannerProjection } from "./components/types";
import { deepCopy } from "../../utils/object";
import { Doc } from "../../../convex/_generated/dataModel";
import { PlannerType } from "./data";
import { sortDateStrings } from "../../utils/date";




export function createPlannerProjection(planner: PlannerType, AvailableIngredients: Doc<"pantryItems">[], initialMenu: Doc<"recipes">[]) {
    type RecipeProjection = {
        plannedRecipeReference: PlannedRecipe;
        multiplier: number;
        dayMultiplier: number;
        couldMake: boolean;
        scratchPadOfIngredientsNeededToUse: IngredientSet;
        unfulfilledIngredients: {RequiredIngredient: RequiredIngredient, have: Measurement}[];
    };
    const workingIngredientsForProjection: IngredientSet = {}; 
    const menu: RecipeCache = new Map();
    {
        //easier data to work with for projection
        for (const ingredient of AvailableIngredients) {
            workingIngredientsForProjection[ingredient.name_] = ingredient.Measurement;
        }
        for (const recipe of initialMenu) {
            menu.set(`${recipe.title}@${recipe.version}`, recipe);
        }
    }
    const projection: Record<Date_, RecipeProjection[]> = {};

    function fillCart(cart: ShoppingCart) {
        for (const [ingredientName, AmountToGet] of Object.entries(cart.toGet)) {
            const notGottenYet = Measurement_Minus(AmountToGet, cart.alreadyGot[ingredientName] ?? ZeroedMeasurement());
            workingIngredientsForProjection[ingredientName] =
                Measurement_Plus(workingIngredientsForProjection[ingredientName] ?? ZeroedMeasurement(), notGottenYet);
        }
    }
    

    for (const date of sortDateStrings(Object.keys(planner))) {
        const plannedDay = planner[date];
        fillCart(plannedDay.shoppingCart);
        
        const daysProjection: RecipeProjection[] = [];
        console.log({date})
        for (const recipe of plannedDay.recipes) {
            console.log({recipe})
            const { recipeId: recipeId, overrideDayMultiplier } = recipe;
            const multiplier =  overrideDayMultiplier ?? plannedDay.multiplier
            
            const recipeInMenu = menu.get(makeCacheKey(recipeId));
            // const recipeInMenu = menu.get(recipeId);
            console.log({recipeInMenu})
            if (!recipeInMenu) throw new Error(`Recipe "${recipeId}" not found in menu.`);

            const { unfulfilledIngredients, scratchPadOfIngredientsNeededToUse,substitutedIngredientUses } = recipeMakingProjection(recipeInMenu, workingIngredientsForProjection, multiplier);
            const couldMake = unfulfilledIngredients.length === 0;
            //simulate making of it
            if (couldMake) {
                for (const [ingredientName, ingredientMeasurement] of Object.entries(scratchPadOfIngredientsNeededToUse)) {
                    workingIngredientsForProjection[ingredientName] =
                        Measurement_Minus(workingIngredientsForProjection[ingredientName] ?? ZeroedMeasurement(), ingredientMeasurement);
                }
            }
            daysProjection.push({
                plannedRecipeReference: recipe,
                multiplier,
                dayMultiplier: plannedDay.multiplier,
                couldMake,
                scratchPadOfIngredientsNeededToUse,
                unfulfilledIngredients
            });
        }
        projection[date] = daysProjection;
    }
    return projection;
}


export const projection: PlannerProjection = createMutable({});



export function reSimulatePlannerProjection() {
    // createPlannerProjection().then(projection_ => 
    //     Object.assign(projection, projection_)
    // );
}


    
