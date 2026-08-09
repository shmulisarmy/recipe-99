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
  


export type RecipeId = {title: string, version: number}
export type RecipeCache = Map<`${string}@${number}`, Recipe>;
const recipeCache: RecipeCache = new Map();
export function makeCacheKey(recipeId: RecipeId): `${string}@${number}` {
  return `${recipeId.title}@${recipeId.version}`;
}

export function fromCacheKey(cacheKey: `${string}@${number}`): RecipeId {
  const [title, version] = cacheKey.split('@');
  return { title, version: parseInt(version) };
}


  export async function getOrSetRecipeByTitle(recipeId: RecipeId): Promise<Recipe> {
    const cacheKey = makeCacheKey(recipeId);
    if (!recipeCache.has(cacheKey)) {
      const recipeInMenu = await convexClient.query(api.recipe_exports.getRecipeByTitle, { recipeTitle: recipeId.title, version: recipeId.version });
      if (!recipeInMenu) throw new Error(`Recipe "${cacheKey}" not found in menu.`);
      recipeCache.set(cacheKey, recipeInMenu);
    }
    return recipeCache.get(cacheKey)!;
  }


  export async function loadRecipeCache() {
    const recipes = await convexClient.query(api.recipe_exports.getAllRecipes, {});
    for (const recipe of recipes) {
      recipeCache.set(makeCacheKey({title: recipe.title, version: recipe.version}), recipe);
    }
  }


  loadRecipeCache();
