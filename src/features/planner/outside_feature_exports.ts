import { Measurement, Measurement_Minus, ZeroedMeasurement } from "../../primitives/measurement";
import { planner } from "./data";
import { today } from "./types";

// Public API for code outside this feature; keep planner internals sealed.
export { today } from "./types";
export { reSimulatePlannerProjection } from "./logic";
export function todaysShoppingCart(){
    return planner[today.toDateString()].shoppingCart
}

export function StillNeedToGetToday(ingredientName: string): Measurement{
    if (!todaysShoppingCart().toGet[ingredientName]){
        throw new Error(`StillNeedToGetToday: ingredient ${ingredientName} not found in shopping cart`);
    }
    return Measurement_Minus(todaysShoppingCart().toGet[ingredientName], todaysShoppingCart().alreadyGot[ingredientName] || ZeroedMeasurement());
}