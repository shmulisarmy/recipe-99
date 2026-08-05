import { createSignal, createMemo } from "solid-js";
import type { IngredientSet, Recipe, RequiredIngredient } from "../data";
import { recipeMakingProjection } from "../logic";
import type { Measurement } from "../primitives/measurement";
import { useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

type RecipeStatus =
  | { kind: "ready"; recipe: Recipe }
  | { kind: "no-analytics-because-no-pantry"; recipe: Recipe }
  | { kind: "missing"; recipe: Recipe; unfulfilled: {RequiredIngredient: RequiredIngredient, have: Measurement}[] };


/** Build the readiness verdict for a single recipe. Guards the `false` return defensively. */
function projectRecipe(recipe: Recipe, pantry: Doc<"pantryItems">[]): RecipeStatus {
  const pantrySet: IngredientSet = {};
  for (const ingredient of pantry) {
    pantrySet[ingredient.name_] = ingredient.Measurement;
  }
  const proj = recipeMakingProjection(recipe, pantrySet, 1);
  if (proj && proj.unfulfilledIngredients.length === 0) {
    return { kind: "ready", recipe };
  }
  // false (unknown/blocked) OR unfulfilled ingredients present → MISSING.
  if (!proj) return { kind: "no-analytics-because-no-pantry", recipe };
  const unfulfilled = proj.unfulfilledIngredients
  return { kind: "missing", recipe, unfulfilled };
}

function RecipeCard(props: { status: RecipeStatus }) {
  const recipe = () => props.status.recipe;

  const missingNames = createMemo(() => {
    if (props.status.kind !== "missing") return new Set<string>();
    return new Set(props.status.unfulfilled.map((i) => i.RequiredIngredient.name));
  });

  const ownedIngredients = createMemo(() =>
    recipe().requiredIngredients.filter((i) => !missingNames().has(i.name))
  );

  const missingIngredients = createMemo(() =>
    props.status.kind === "missing" ? props.status.unfulfilled : []
  );

  const isReady = () => props.status.kind === "ready";

  void ownedIngredients;
  void missingIngredients;
  void isReady;

  return (<></>);
}



export function Menu(props: { pantry: Doc<"pantryItems">[] | undefined }) {
  const [query, setQuery] = createSignal("");
  const [readyOnly, setReadyOnly] = createSignal(false);

  // Compute readiness once per recipe (AvailableIngredients is static).
   const menu2 = useQuery(api.data.getAllRecipes, {});
  
  const allStatuses = () => Array.from(menu2.data() ?? []).map((recipe) => {
    if (!props.pantry) return { kind: "no-analytics-because-no-pantry", recipe } as const;
    return projectRecipe(recipe, props.pantry ?? [])});

  const totalCount = createMemo(() => allStatuses().length);

  const filtered = createMemo<RecipeStatus[]>(() => {
    const q = query().trim().toLowerCase();
    return allStatuses().filter((status) => {
      if (readyOnly() && status.kind !== "ready") return false;
      if (q === "") return true;
      const recipe = status.recipe;
      if (recipe.title.toLowerCase().includes(q)) return true;
      // Match ingredient names too — the killer "what can I do with X" feature.
      return recipe.requiredIngredients.some((i) =>
        i.name.toLowerCase().includes(q)
      );
    });
  });

  void setQuery;
  void setReadyOnly;
  void totalCount;
  void filtered;

  return (<></>);
}
