import { createSignal, createMemo, For, Show } from "solid-js";
import type { IngredientSet, Recipe, RequiredIngredient } from "../data";
import { recipeMakingProjection } from "../logic";
import type { Measurement } from "../primitives/measurement";
import { useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

type RecipeStatus =
  | { kind: "ready"; recipe: Recipe }
  | { kind: "no-analytics-because-no-pantry"; recipe: Recipe }
  | { kind: "missing"; recipe: Recipe; unfulfilled: {RequiredIngredient: RequiredIngredient, have: Measurement}[] };


function formatMeasurement(m: Measurement): string {
  return `${m.amount} ${m.unit}`;
}

/** Curated images per recipe title (lowercase), with a generic food fallback. */
const recipeImages = new Map<string, string>([
  [
    "chocolate cake",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=60",
  ],
]);
const fallbackImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60";

function imageForRecipe(title: string): string {
  return recipeImages.get(title.toLowerCase()) ?? fallbackImage;
}

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

  return (
    <li
      class="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition hover:shadow-md"
      classList={{
        "ring-emerald-200": isReady(),
        "ring-stone-200": !isReady(),
      }}
    >
      {/* Recipe image with the status badge overlaid — the verdict, first. */}
      <div class="relative">
        <img
          src={imageForRecipe(recipe().title)}
          alt={recipe().title}
          class="h-44 w-full object-cover"
          loading="lazy"
        />
        <div class="absolute left-3 top-3">
          <Show
            when={isReady()}
            fallback={
              <span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50/95 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-700 shadow-sm ring-1 ring-amber-200">
                <span aria-hidden="true">•</span>
                Missing {missingIngredients().length}
              </span>
            }
          >
            <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/95 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-emerald-200">
              <span aria-hidden="true">✓</span>
              Ready to make
            </span>
          </Show>
        </div>
      </div>

      <div class="flex flex-1 flex-col p-5">
        {/* Title */}
        <h2 class="text-xl font-semibold tracking-tight text-stone-800 capitalize">
          {recipe().title}
        </h2>

        {/* Description */}
        <p class="mt-1 text-sm leading-relaxed text-stone-500">
          {recipe().description}
        </p>

        {/* Missing ingredients — readable rows, not a chip pile. */}
        <Show when={missingIngredients().length > 0}>
          <div class="mt-4 rounded-xl bg-rose-50/60 p-3 ring-1 ring-rose-100">
            <h3 class="text-xs font-medium uppercase tracking-wide text-rose-700">
              You still need
            </h3>
            <ul class="mt-2 space-y-2">
              <For each={missingIngredients()}>
                {(ingredient) => (
                  <li class="text-sm">
                    <div class="flex items-baseline justify-between gap-3">
                      <span class="font-medium text-rose-700 capitalize">
                        <span aria-hidden="true">• </span>
                        {ingredient.RequiredIngredient.name}
                      </span>
                      <span class="whitespace-nowrap text-xs text-rose-600">
                        {formatMeasurement(ingredient.RequiredIngredient.Measurement)}
                      </span>
                    </div>
                    <Show when={ingredient.RequiredIngredient.substitute}>
                      {(sub) => (
                        <p class="mt-0.5 pl-3 text-xs text-stone-500">
                          out of {ingredient.RequiredIngredient.name}? substitute:{" "}
                          <span class="font-medium text-stone-600 capitalize">
                            {sub().name}
                          </span>{" "}
                          ({formatMeasurement(sub().Measurement)})
                        </p>
                      )}
                    </Show>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>

        {/* Owned ingredients — calm green chips under their own label. */}
        <Show when={ownedIngredients().length > 0}>
          <div class="mt-4">
            <h3 class="text-xs font-medium uppercase tracking-wide text-stone-400">
              In your pantry
            </h3>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              <For each={ownedIngredients()}>
                {(ingredient) => (
                  <li>
                    <span class="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 capitalize">
                      <span aria-hidden="true">✓</span>
                      {ingredient.name}
                      <span class="text-emerald-600/80 lowercase">
                        {formatMeasurement(ingredient.Measurement)}
                      </span>
                    </span>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Show>
      </div>
    </li>
  );
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

  return (
    <div class="min-h-screen bg-stone-50">
      <div class="mx-auto max-w-6xl px-4 py-8">
        {/* Page header */}
        <header class="mb-6">
          <h1 class="text-3xl font-semibold tracking-tight text-stone-900">
            What can I cook tonight?
          </h1>
          <p class="mt-1 text-sm leading-relaxed text-stone-500">
            Scan the menu against your pantry — ready recipes are green, the rest
            show exactly what's missing.
          </p>
        </header>

        {/* Search — first-class control */}
        <div class="mb-4">
          <label for="recipe-search" class="sr-only">
            Search recipes or ingredients
          </label>
          <div class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-stone-400"
              aria-hidden="true"
            >
              {/* search icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <input
              id="recipe-search"
              type="text"
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              placeholder="Search recipes or ingredients…"
              class="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-stone-800 placeholder:text-stone-400 ring-1 ring-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            />
          </div>
        </div>

        {/* Filters + result count */}
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setReadyOnly((v) => !v)}
            aria-pressed={readyOnly()}
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            classList={{
              "bg-emerald-600 text-white": readyOnly(),
              "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-300":
                !readyOnly(),
            }}
          >
            <span aria-hidden="true">✓</span>
            Ready only
          </button>
          <p class="text-sm text-stone-500" aria-live="polite">
            Showing {filtered().length} of {totalCount()}
          </p>
        </div>

        {/* Grid or empty state */}
        <Show
          when={filtered().length > 0}
          fallback={
            <div class="py-20 text-center">
              <p class="text-lg font-medium text-stone-700">
                No recipes match "{query().trim()}"
              </p>
              <p class="mt-1 text-sm text-stone-500">
                Try a different recipe or ingredient name.
              </p>
            </div>
          }
        >
          <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <For each={filtered()}>
              {(status) => <RecipeCard status={status} />}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
}
