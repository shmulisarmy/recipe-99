import { Measurement } from "../../../primitives/measurement";
import { reSimulatePlannerProjection } from "../logic";


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


