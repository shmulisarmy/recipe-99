import { planner } from "../data";
import { reSimulatePlannerProjection } from "../logic";

export function updateDayMultiplier(date: Date, multiplier: number): void {
    const day = planner[date.toDateString()];
    if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
    day.multiplier = multiplier;

}