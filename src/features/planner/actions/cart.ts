import { Measurement, Measurement_Minus, Measurement_Plus, ZeroedMeasurement } from "../../../primitives/measurement";
import { reSimulatePlannerProjection } from "../logic";
import { today } from "../types";

// export function UpdateCartToGet(date: Date, ingredient: { name: string; measurement: Measurement }): void {
//     const day = planner[date.toDateString()];
//     if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
//     day.shoppingCart.toGet[ingredient.name] = ingredient.measurement;

//     reSimulatePlannerProjection();
// }

// export function UpdateCartAlreadyGot(date: Date, ingredient: { name: string; measurement: Measurement }): void {
//     const day = planner[date.toDateString()];
//     if (!day) throw new Error(`No planned day for ${date.toDateString()}`);
//     day.shoppingCart.alreadyGot[ingredient.name] = ingredient.measurement;

//     reSimulatePlannerProjection();
// }


export function PushOverIngredientShoppingItemForTheNextDay(ingredientName: string): void {
    // //pushes the ingredient amount that still needs to be gotten (toGet - hasGotten) for the shopping cart of the next day
    // const day = planner[today.toDateString()];
    // if (!day) throw new Error(`No planned day for ${today.toDateString()}`);
    // if (!day.shoppingCart.toGet[ingredientName]){
    //     throw new Error(`PushOverIngredientShoppingItemForTheNextDay: ingredient ${ingredientName} not found in shopping cart`);
    // }
    // const stillNeededToGet = Measurement_Minus(day.shoppingCart.toGet[ingredientName], day.shoppingCart.alreadyGot[ingredientName] || ZeroedMeasurement());
    // day.shoppingCart.toGet[ingredientName] = JSON.parse(JSON.stringify(day.shoppingCart.alreadyGot[ingredientName]));
    // const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    // const nextDay = planner[tomorrow.toDateString()];
    // nextDay.shoppingCart.toGet[ingredientName] = Measurement_Plus(nextDay.shoppingCart.toGet[ingredientName]?? ZeroedMeasurement(), stillNeededToGet);
    // reSimulatePlannerProjection();
}