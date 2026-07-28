import { createMutable } from "solid-js/store";
import { Measurement } from "./primitives/measurement";
import { useQuery } from "convex-solidjs";
import { api } from "../convex/_generated/api";
import { getRecipeById } from "../convex/data";
import { convexClient } from "./convex_client";
import { exactOptional } from "zod";
import type { Doc } from "../convex/_generated/dataModel";

type Ingredient = {
    name: string;
    Measurement: Measurement;
  };
  
  
  export type RequiredIngredient = Ingredient & {
    substitute?: Ingredient;
  };
  
  export type Recipe = {
    title: string;
    description: string;
    requiredIngredients: RequiredIngredient[];
  };



  export type RecipeName = string;
  
  export type IngredientSet = Record<string, Measurement>;
  
  export const AvailableIngredients = createMutable<IngredientSet>({
    milk:         { amount: 1400,   unit: 'grams' },
    butter:       { amount: 100,   unit: 'grams' },
    flour:        { amount: 1,   unit: 'grams' },
    sugar:        { amount: 1,   unit: 'grams' },
    salt:         { amount: 1,   unit: 'grams' },
    'cocoa powder': { amount: 1175,  unit: 'grams' },
    eggs:         { amount: 150, unit: 'grams' },
  });
  

  


let secretPantry: IngredientSet = createMutable({});


export function getSecretPantry(): IngredientSet {
  return secretPantry;
}

export function secretPantryAssign(newSecretPantry: Doc<"pantryItems">[]){
  for (const ingredient of newSecretPantry) {
    secretPantry[ingredient.name_] = ingredient.Measurement;
  }
}
export function GetIngredientMeasurement(name: string): Measurement{
  if (!secretPantry) throw new Error(`secretPantry not assigned yet`);
  if (!secretPantry[name]) throw new Error(`Ingredient ${name} not found in secret pantry`);
  return secretPantry[name];
}


  
const recipeCache = new Map<RecipeName, Recipe>();

  export async function getOrSetRecipeByTitle(recipeTitle: RecipeName): Promise<Recipe> {
    if (!recipeCache.has(recipeTitle)) {
      const recipeInMenu = await convexClient.query(api.data.getRecipeByTitle, { recipeTitle });
      if (!recipeInMenu) throw new Error(`Recipe "${recipeTitle}" not found in menu.`);
      recipeCache.set(recipeTitle, recipeInMenu);
    }
    return recipeCache.get(recipeTitle)!;
  }


  export async function loadRecipeCache() {
    const recipes = await convexClient.query(api.data.getAllRecipes, {});
    for (const recipe of recipes) {
      recipeCache.set(recipe.title, recipe);
    }
  }


  loadRecipeCache();
