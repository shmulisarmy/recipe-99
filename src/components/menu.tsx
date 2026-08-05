import { A, useLocation, useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import type { IngredientSet, RequiredIngredient } from "../data";
import { fromCacheKey, makeCacheKey } from "../data";
import { recipeMakingProjection } from "../logic";
import type { Measurement } from "../primitives/measurement";
import { useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { Amount, Icon, Overlay, StatusText } from "./ui";

type RecipeStatus =
  | { kind: "ready"; recipe: Doc<"recipes"> }
  | { kind: "checking"; recipe: Doc<"recipes"> }
  | { kind: "missing"; recipe: Doc<"recipes">; unfulfilled: { RequiredIngredient: RequiredIngredient; have: Measurement }[] };

/** Curated title matches from the previous menu, with a broad kitchen-table fallback. */
const recipeImages = new Map<string, string>([
  ["chocolate cake", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=78"],
  ["tomato pasta", "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=78"],
  ["pancakes", "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1200&q=78"],
  ["grilled cheese", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=78"],
  ["scrambled eggs", "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=78"],
  ["chicken soup", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=78"],
  ["macaroni and cheese", "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=1200&q=78"],
  ["sesame noodles", "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1200&q=78"],
  ["spinach omelet", "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=1200&q=78"],
  ["rice and beans", "https://images.unsplash.com/photo-1699292933049-1ef1ade2de6d?auto=format&fit=crop&w=1200&q=78"],
  ["vegetable curry", "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=78"],
  ["lentil soup", "https://images.unsplash.com/photo-1741026079032-7cb660e44bad?auto=format&fit=crop&w=1200&q=78"],
]);
const imageForRecipe = (title: string) => recipeImages.get(title.toLowerCase());

function RecipeImage(props: { title: string; class?: string }) {
  const source = () => imageForRecipe(props.title);
  const [loaded, setLoaded] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  return <div class={`recipe-image ${props.class ?? ""}`} classList={{ "is-loaded": loaded(), "is-failed": failed() || !source() }}><Show when={source() && !failed()} fallback={<div class="recipe-image-fallback"><Icon name="recipes"/><span>{props.title}</span></div>}><Show when={!loaded()}><div class="recipe-image-loading" aria-hidden="true"/></Show><img src={source()} alt="" width="1200" height="750" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/></Show></div>;
}

function projectRecipe(recipe: Doc<"recipes">, pantry: Doc<"pantryItems">[]): RecipeStatus {
  const pantrySet: IngredientSet = {};
  for (const ingredient of pantry) pantrySet[ingredient.name_] = ingredient.Measurement;
  const result = recipeMakingProjection(recipe, pantrySet, 1);
  return result.unfulfilledIngredients.length === 0
    ? { kind: "ready", recipe }
    : { kind: "missing", recipe, unfulfilled: result.unfulfilledIngredients };
}

function RecipeDetail(props: { status: RecipeStatus; pantry: Doc<"pantryItems">[]; onClose: () => void }) {
  const pantryMeasurement = (name: string) => props.pantry.find((item) => item.name_ === name)?.Measurement;
  const missingNames = () => new Set(props.status.kind === "missing" ? props.status.unfulfilled.map((item) => item.RequiredIngredient.name) : []);
  const owned = () => props.status.recipe.requiredIngredients.filter((item) => !missingNames().has(item.name));
  const missing = () => props.status.kind === "missing" ? props.status.unfulfilled : [];
  const substitutes = () => props.status.recipe.requiredIngredients.filter((item) => item.substitute);
  return (
    <Overlay kind="inspection" title={props.status.recipe.title} eyebrow="Recipe library" onClose={props.onClose} footer={<button class="button button-secondary" type="button" onClick={props.onClose}>Close</button>}>
      <div class="recipe-detail-intro"><div class="detail-status"><Show when={props.status.kind === "ready"}><StatusText kind="ready"/></Show><Show when={props.status.kind === "missing"}><StatusText kind="missing"/></Show><Show when={props.status.kind === "checking"}><StatusText kind="checking"/></Show></div><p class="recipe-detail-description">{props.status.recipe.description}</p></div>
      <div class="recipe-detail-media"><RecipeImage title={props.status.recipe.title}/></div>
      <Show when={props.status.kind !== "checking"} fallback={<section class="ingredient-group" aria-labelledby="recipe-pantry-heading"><h3 id="recipe-pantry-heading">Pantry status unavailable</h3><p class="helper-text">Ingredient availability is still being checked. No ingredients are marked as on hand yet.</p></section>}>
        <section class="ingredient-group ready" aria-labelledby="recipe-have-heading"><h3 id="recipe-have-heading">You have</h3><For each={owned()}>{(ingredient) => <div class="ingredient-line"><strong>{ingredient.name}</strong><span>Need <Amount measurement={ingredient.Measurement}/></span><span>Available <Amount measurement={pantryMeasurement(ingredient.name)}/></span></div>}</For><Show when={owned().length === 0}><p class="helper-text">No required ingredients are fully covered.</p></Show></section>
        <Show when={missing().length > 0}><section class="ingredient-group missing" aria-labelledby="recipe-missing-heading"><h3 id="recipe-missing-heading">Still needed</h3><For each={missing()}>{(item) => <div class="ingredient-line"><strong>{item.RequiredIngredient.name}</strong><span>Need <Amount measurement={item.RequiredIngredient.Measurement}/></span><span>Available <Amount measurement={item.have}/></span></div>}</For></section></Show>
        <Show when={substitutes().length > 0}><section class="ingredient-group" aria-labelledby="recipe-substitute-heading"><h3 id="recipe-substitute-heading">Substitutes</h3><For each={substitutes()}>{(ingredient) => <div class="ingredient-line"><strong>{ingredient.substitute!.name}</strong><span>Instead of {ingredient.name}</span><span>Available <Amount measurement={pantryMeasurement(ingredient.substitute!.name)}/></span></div>}</For></section></Show>
      </Show>
    </Overlay>
  );
}

function RecipeCard(props: { status: RecipeStatus; onOpen: () => void }) {
  const missingNames = () => props.status.kind === "missing" ? props.status.unfulfilled.map((item) => item.RequiredIngredient.name) : [];
  return (
    <article class="recipe-card" classList={{ "is-ready": props.status.kind === "ready", "is-missing": props.status.kind === "missing" }}>
      <div class="recipe-card-media"><RecipeImage title={props.status.recipe.title}/></div>
      <div class="recipe-card-content">
        <div class="recipe-card-head"><h2>{props.status.recipe.title}</h2><span class="recipe-card-status"><Show when={props.status.kind === "ready"}><StatusText kind="ready">Ready</StatusText></Show><Show when={props.status.kind === "missing"}><StatusText kind="missing">Missing {missingNames().length}</StatusText></Show><Show when={props.status.kind === "checking"}><StatusText kind="checking">Checking pantry</StatusText></Show></span></div>
        <p class="recipe-description">{props.status.recipe.description}</p>
        <ul class="ingredient-preview">
          <For each={props.status.recipe.requiredIngredients.slice(0, 3)}>{(ingredient) => <li><span>{ingredient.name}</span><Amount measurement={ingredient.Measurement}/></li>}</For>
        </ul>
        <Show when={props.status.kind === "missing"}><p class="missing-summary">Missing {missingNames().slice(0, 2).join(", ")}{missingNames().length > 2 ? ` +${missingNames().length - 2} more` : ""}</p></Show>
        <button class="recipe-view-action" type="button" onClick={props.onOpen}>View recipe<Icon name="arrow-right"/></button>
      </div>
    </article>
  );
}

export function Menu() {
  const recipes = useQuery(api.data.getAllRecipes, {});
  const pantry = useQuery(api.data.getAvailableIngredients, {});
  const params = useParams<{ recipeKey?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams<{ q?: string; ready?: string }>();
  const [query, setQuery] = createSignal(searchParams.q ?? "");
  const [readyOnly, setReadyOnly] = createSignal(searchParams.ready === "1");
  let observedSearch = location.search;

  createEffect(() => {
    const nextSearch = location.search;
    if (nextSearch === observedSearch) return;
    observedSearch = nextSearch;
    const nextParams = new URLSearchParams(nextSearch);
    setQuery(nextParams.get("q") ?? "");
    setReadyOnly(nextParams.get("ready") === "1");
  });

  createEffect(() => {
    const value = query().trim();
    const ready = readyOnly();
    const timeout = window.setTimeout(() => setSearchParams({ q: value || undefined, ready: ready ? "1" : undefined }, { replace: true }), 250);
    onCleanup(() => window.clearTimeout(timeout));
  });

  const allStatuses = createMemo<RecipeStatus[]>(() => (recipes.data() ?? []).map((recipe) => pantry.data() ? projectRecipe(recipe, pantry.data()!) : { kind: "checking", recipe }));
  const filtered = createMemo(() => {
    const value = query().trim().toLowerCase();
    return allStatuses().filter((status) => {
      if (readyOnly() && status.kind !== "ready") return false;
      if (!value) return true;
      return status.recipe.title.toLowerCase().includes(value) || status.recipe.requiredIngredients.some((ingredient) => ingredient.name.toLowerCase().includes(value));
    });
  });
  const openStatus = createMemo(() => {
    if (!params.recipeKey) return undefined;
    try {
      const decoded = decodeURIComponent(params.recipeKey) as `${string}@${number}`;
      const recipeId = fromCacheKey(decoded);
      return allStatuses().find((status) => status.recipe.title === recipeId.title && status.recipe.version === recipeId.version);
    } catch {
      return undefined;
    }
  });
  const openRecipe = (status: RecipeStatus) => navigate(`/recipes/${encodeURIComponent(makeCacheKey({ title: status.recipe.title, version: status.recipe.version }))}${location.search}`, { state: { recipeOverlay: true } });
  const closeRecipe = () => {
    if ((location.state as { recipeOverlay?: boolean } | undefined)?.recipeOverlay) navigate(-1);
    else navigate(`/recipes${location.search}`, { replace: true });
  };

  return (
    <main class="main recipes-page" id="main">
      <header class="page-heading"><div><h1>Recipes</h1><p class="supporting-copy">See what your pantry can make right now.</p></div></header>
      <form class="filters recipe-workbench" role="search" onSubmit={(event) => event.preventDefault()}>
        <label class="field field-grow search-wrap"><span>Search recipes or ingredients</span><Icon name="search"/><input class="input" type="search" value={query()} placeholder="Try tomato, soup, or noodles" onInput={(event) => setQuery(event.currentTarget.value)}/></label>
        <div class="recipe-filter-meta"><label class="toggle"><input type="checkbox" checked={readyOnly()} onChange={(event) => setReadyOnly(event.currentTarget.checked)}/>Ready to make</label><p class="result-count" aria-live="polite">{filtered().length} of {allStatuses().length} recipes</p><Show when={recipes.isStale() || pantry.isStale()}><span class="filter-updating">Updating readiness…</span></Show><Show when={query() || readyOnly()}><button class="button button-quiet" type="button" onClick={() => { setQuery(""); setReadyOnly(false); }}>Clear</button></Show></div>
      </form>
      <Show when={pantry.error()}><div class="inline-notice notice-error"><p>Couldn’t check pantry.</p><button class="button button-secondary" type="button" onClick={pantry.refetch}>Try again</button></div></Show>
      <Show when={recipes.isLoading()}><div aria-live="polite"><p>Loading recipes…</p><div class="recipe-grid"><For each={[1,2,3]}>{() => <div class="skeleton skeleton-card"/>}</For></div></div></Show>
      <Show when={recipes.error()}><div class="empty-state notice-error"><h2>Recipes couldn’t load.</h2><button class="button button-secondary" type="button" onClick={recipes.refetch}>Try again</button></div></Show>
      <Show when={recipes.data()}>
        <Show when={allStatuses().length > 0} fallback={<div class="empty-state"><h2>No recipes are available yet.</h2></div>}>
          <Show when={filtered().length > 0} fallback={
            <div class="empty-state"><Icon name="search"/><h2>{query().trim() && readyOnly() ? `No ready recipes match “${query().trim()}”.` : query().trim() ? `No recipes match “${query().trim()}”.` : "Nothing is ready with your current pantry."}</h2><button class="button button-secondary" type="button" onClick={() => { if (query().trim() && readyOnly()) { setQuery(""); setReadyOnly(false); } else if (query().trim()) setQuery(""); else setReadyOnly(false); }}>{query().trim() && readyOnly() ? "Clear filters" : query().trim() ? "Clear search" : "Show all recipes"}</button></div>
          }>
            <section class="recipe-grid" aria-label="Recipe results"><For each={filtered()}>{(status) => <RecipeCard status={status} onOpen={() => openRecipe(status)}/>}</For></section>
          </Show>
        </Show>
      </Show>
      <Show when={params.recipeKey && !openStatus() && !recipes.isLoading()}><div class="inline-notice notice-error"><p>That recipe is not available.</p><A href={`/recipes${location.search}`}>Back to recipes</A></div></Show>
      <Show when={openStatus()}>{(status) => <RecipeDetail status={status()} pantry={pantry.data() ?? []} onClose={closeRecipe}/>}</Show>
    </main>
  );
}
