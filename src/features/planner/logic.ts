import { createMutable } from "solid-js/store";
import { getOrSetRecipeByTitle, getSecretPantry, IngredientSet } from "../../data";
import { recipeMakingProjection } from "../../logic";
import { planner } from "./data";
import { Date_, PlannedRecipe, ShoppingCart } from "./types";
import { Measurement_Minus, Measurement_Plus, ZeroedMeasurement } from "../../primitives/measurement";
import { PlannerProjection } from "./components/types";
import { deepCopy } from "../../utils/object";




export async function createPlannerProjection() {
    
    type RecipeProjection = {
        plannedRecipeReference: PlannedRecipe;
        multiplier: number;
        couldMake: boolean;
        scratchPadOfIngredientsNeededToUse: IngredientSet;
    };
    const workingIngredientsForProjection: IngredientSet = deepCopy(getSecretPantry()); 
    const projection: Record<Date_, RecipeProjection[]> = {};

    function fillCart(cart: ShoppingCart) {
        for (const [ingredientName, AmountToGet] of Object.entries(cart.toGet)) {
            const notGottenYet = Measurement_Minus(AmountToGet, cart.alreadyGot[ingredientName] ?? ZeroedMeasurement());
            workingIngredientsForProjection[ingredientName] =
                Measurement_Plus(workingIngredientsForProjection[ingredientName] ?? ZeroedMeasurement(), notGottenYet);
        }
    }

    for (const [date, plannedDay] of Object.entries(planner)) {
        fillCart(plannedDay.shoppingCart);
        
        const daysProjection: RecipeProjection[] = [];
        console.log({date})
        for (const recipe of plannedDay.recipes) {
            console.log({recipe})
            const { recipe: recipeName, overrideDayMultiplier } = recipe;
            const multiplier =  overrideDayMultiplier ?? plannedDay.multiplier
            
            const recipeInMenu = await getOrSetRecipeByTitle(recipeName);
            // const recipeInMenu = menu.get(recipeName);
            console.log({recipeInMenu})
            if (!recipeInMenu) throw new Error(`Recipe "${recipeName}" not found in menu.`);

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
                couldMake,
                scratchPadOfIngredientsNeededToUse,
            });
        }
        projection[date] = daysProjection;
    }
    return projection;
}


export const projection: PlannerProjection = createMutable({});

createPlannerProjection().then(projection_ => 
    Object.assign(projection, projection_)
);

export function reSimulatePlannerProjection() {
    createPlannerProjection().then(projection_ => 
        Object.assign(projection, projection_)
    );
}


    
