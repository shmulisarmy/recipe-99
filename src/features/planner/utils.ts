import { DayKind, PlannedRecipe, today } from "./types";
import { PlannerType } from "./data";

export function GetPlannedRecipe(planner: PlannerType, recipeId: string): {recipe: PlannedRecipe, day: string} {
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

export function toRouteDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function fromRouteDate(value: string | undefined): Date | undefined {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return;
    return date;
}
