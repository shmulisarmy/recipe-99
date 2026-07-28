import { Measurement } from "./primitives/measurement";
import { api } from "../convex/_generated/api";
import { convexClient } from "./convex_client";

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
  


export type RecipeId = `${string}@${number}`
export type RecipeCache = Map<RecipeId, Recipe>;
const recipeCache: RecipeCache = new Map<RecipeId, Recipe>();


  export async function getOrSetRecipeByTitle(recipeId: RecipeId): Promise<Recipe> {
    const recipeTitle = recipeId.split('@')[0];
    const version = JSON.parse(recipeId.split('@')[1]);
    if (!recipeCache.has(recipeId)) {
      const recipeInMenu = await convexClient.query(api.data.getRecipeByTitle, { recipeTitle, version });
      if (!recipeInMenu) throw new Error(`Recipe "${recipeId}" not found in menu.`);
      recipeCache.set(recipeId, recipeInMenu);
    }
    return recipeCache.get(recipeId)!;
  }


  export async function loadRecipeCache() {
    const recipes = await convexClient.query(api.data.getAllRecipes, {});
    for (const recipe of recipes) {
      recipeCache.set(`${recipe.title}@${recipe.version}`, recipe);
    }
  }


  loadRecipeCache();
