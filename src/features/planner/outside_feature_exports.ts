import { planner } from "./data";
import { today } from "./types";

// Public API for code outside this feature; keep planner internals sealed.
export { today } from "./types";
export { reSimulatePlannerProjection } from "./logic";
export function todaysShoppingCart(){
    return planner[today.toDateString()].shoppingCart
}