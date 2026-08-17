import { Measurement } from "./primitives/measurement";

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
export function makeCacheKey(recipeId: RecipeId): `${string}@${number}` {
  return `${recipeId.title}@${recipeId.version}`;
}

export function fromCacheKey(cacheKey: `${string}@${number}`): RecipeId {
  const [title, version] = cacheKey.split('@');
  return { title, version: parseInt(version) };
}

