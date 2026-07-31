import { Measurement, Measurement_Minus, ZeroedMeasurement } from "../../primitives/measurement";
import { PlannerType } from "./data";
import { today } from "./types";

// Public API for code outside this feature; keep planner internals sealed.
export { today } from "./types";
export { reSimulatePlannerProjection } from "./logic";
export function todaysShoppingCart(planner: PlannerType){
    return planner[today.toDateString()].shoppingCart
}

export function StillNeedToGetToday(planner: PlannerType, ingredientName: string): Measurement{
    if (!todaysShoppingCart(planner).toGet[ingredientName]){
        throw new Error(`StillNeedToGetToday: ingredient ${ingredientName} not found in shopping cart`);
    }
    return Measurement_Minus(todaysShoppingCart(planner).toGet[ingredientName], todaysShoppingCart(planner).alreadyGot[ingredientName] || ZeroedMeasurement());
}