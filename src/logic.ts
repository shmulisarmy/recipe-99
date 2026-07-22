import { IngredientSet, Recipe, RequiredIngredient } from './data';
import { Measurement, Measurement_GTE, Measurement_Minus, Measurement_Plus, Measurement_Times, ZeroedMeasurement } from './primitives/measurement';











export function recipeMakingProjection(recipe: Recipe, ingredients: IngredientSet, multiplier: number= 1) {
  const unfulfilledIngredients: RequiredIngredient[] = [];
  const scratchPadOfIngredientsNeededToUse: IngredientSet = {}; //this is needed because of substitutions
  type IngredientName = string;
  const substitutedIngredientUses: Record<IngredientName, IngredientName> = {};
  requiredIngredientsLoop: for (const requiredIngredient of recipe.requiredIngredients) {
    for (const IngredientToTry of [requiredIngredient, requiredIngredient.substitute]) {
      if (!IngredientToTry) break; //if there is no substitute, we don't need to try it
      const have = ingredients[IngredientToTry.name] ?? ZeroedMeasurement();
      const inScratchPad = scratchPadOfIngredientsNeededToUse[IngredientToTry.name] ?? ZeroedMeasurement();
      if (Measurement_GTE(Measurement_Minus(have, inScratchPad), Measurement_Times(IngredientToTry.Measurement, multiplier))) {
        scratchPadOfIngredientsNeededToUse[IngredientToTry.name] =
          Measurement_Plus(scratchPadOfIngredientsNeededToUse[IngredientToTry.name] ?? ZeroedMeasurement(), Measurement_Times(IngredientToTry.Measurement, multiplier));
        if (IngredientToTry === requiredIngredient.substitute) {
          substitutedIngredientUses[requiredIngredient.name] = requiredIngredient.substitute.name;
        }
        continue requiredIngredientsLoop;
      }
  }
  //getting here means we tried the required ingredient and the substitute ingredient and didn't find enough
  unfulfilledIngredients.push(requiredIngredient);
}
  return {
    unfulfilledIngredients,
    scratchPadOfIngredientsNeededToUse,
    substitutedIngredientUses
  }
}