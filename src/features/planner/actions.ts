import { planner } from "./data";
import { reSimulatePlannerProjection } from "./logic";
import { Measurement } from "../../primitives/measurement";
import { GetPlannedRecipe } from "./utils";




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