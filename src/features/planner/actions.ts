import { planner } from "./data";
import { reSimulatePlannerProjection } from "./logic";
import { Measurement, Measurement_Minus, Measurement_Plus, ZeroedMeasurement } from "../../primitives/measurement";
import { GetPlannedRecipe } from "./utils";
import { today } from "./types";




type PlannedRecipeId = string;


export function removeRecipeById(recipeId: PlannedRecipeId): void {
    const {recipe, day} = GetPlannedRecipe(recipeId);
    const plannedDay = planner[day];
    if (!plannedDay) throw new Error(`No planned day for ${day}`);    
    const recipeInDay = plannedDay.recipes.find((r) => r.id === recipeId);
    if (!recipeInDay) throw new Error(`No recipe ${recipeId} in ${day}`);
    planner[day].recipes.splice(planner[day].recipes.indexOf(recipeInDay), 1);
} 
export function InsertRecipeAtBeginningOfDate(recipeId: PlannedRecipeId, toDate: Date): void {
    const {recipe, day} = GetPlannedRecipe(recipeId);
    removeRecipeById(recipeId);
    planner[toDate.toDateString()].recipes.unshift(recipe);
    reSimulatePlannerProjection();
}



export function MoveRecipeOnTopOfOtherRecipe(recipeId: PlannedRecipeId, otherRecipeId: PlannedRecipeId): void {
    const {recipe, day} = GetPlannedRecipe(recipeId);
    const {recipe: otherRecipe, day: otherDay} = GetPlannedRecipe(otherRecipeId);
    const otherRecipeIndex = planner[otherDay].recipes.indexOf(otherRecipe);
    if (otherRecipeIndex === -1) throw new Error(`No recipe ${otherRecipeId} in ${otherDay}`);
    removeRecipeById(recipeId);
    planner[otherDay].recipes.splice(otherRecipeIndex, 0, recipe);
    reSimulatePlannerProjection();
}

export function updateDayMultiplier(date: Date, multiplier: number): void {
    const day = planner[date.toDateString()];
    if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
    day.multiplier = multiplier;

    reSimulatePlannerProjection();
}

export function updateRecipeOverrideMultiplier(recipeId: PlannedRecipeId, multiplier: number): void {
    const { recipe } = GetPlannedRecipe(recipeId);
    recipe.overrideDayMultiplier = multiplier;

    reSimulatePlannerProjection();
}


//cart actions

export function UpdateCartToGet(date: Date, ingredient: { name: string; measurement: Measurement }): void {
    const day = planner[date.toDateString()];
    if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
    day.shoppingCart.toGet[ingredient.name] = ingredient.measurement;

    reSimulatePlannerProjection();
}

export function UpdateCartAlreadyGot(date: Date, ingredient: { name: string; measurement: Measurement }): void {
    const day = planner[date.toDateString()];
    if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
    day.shoppingCart.alreadyGot[ingredient.name] = ingredient.measurement;

    reSimulatePlannerProjection();
}


export function PushOverIngredientShoppingItemForTheNextDay(ingredientName: string): void {
    //pushes the ingredient amount that still needs to be gotten (toGet - hasGotten) for the shopping cart of the next day
    const day = planner[today.toDateString()];
    if (!day) throw new Error(`No planned day for ${today.toDateString()}`);
    if (!day.shoppingCart.toGet[ingredientName]){
        throw new Error(`PushOverIngredientShoppingItemForTheNextDay: ingredient ${ingredientName} not found in shopping cart`);
    }
    const stillNeededToGet = Measurement_Minus(day.shoppingCart.toGet[ingredientName], day.shoppingCart.alreadyGot[ingredientName] || ZeroedMeasurement());
    day.shoppingCart.toGet[ingredientName] = JSON.parse(JSON.stringify(day.shoppingCart.toGet[ingredientName]));
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextDay = planner[tomorrow.toDateString()];
    nextDay.shoppingCart.toGet[ingredientName] = Measurement_Plus(nextDay.shoppingCart.toGet[ingredientName]?? ZeroedMeasurement(), stillNeededToGet);
    reSimulatePlannerProjection();
}