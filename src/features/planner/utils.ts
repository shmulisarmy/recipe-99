import { planner } from "./data";
import { DayKind, PlannedRecipe, today } from "./types";

export function GetPlannedRecipe(recipeId: string): {recipe: PlannedRecipe, day: string} {
    for (const [date, plannedDay] of Object.entries(planner)) {
        const recipeInDay = plannedDay.recipes.find((r) => r.id === recipeId);
        if (!recipeInDay) continue;
        return {recipe: recipeInDay, day: date};
    }
    throw new Error(`No recipe with id ${recipeId}`);
}


export function Morrow(amount: number): Date {
    const date = new Date(today);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}


export function GetDayKind(date: Date): DayKind {
    if (date.getTime() === today.getTime()) {
        return 'today';
    } else if (date.getTime() < today.getTime()) {
        return 'past';
    } else {
        return 'future';
    }
}