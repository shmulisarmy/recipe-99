import { Show, createSignal } from "solid-js";
import { Icon } from "./ui";

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

export const imageForRecipe = (title: string) => recipeImages.get(title.toLowerCase());

export function RecipeImage(props: { title: string; class?: string }) {
  const source = () => imageForRecipe(props.title);
  const [loaded, setLoaded] = createSignal(false);
  const [failed, setFailed] = createSignal(false);
  return <div class={`recipe-image ${props.class ?? ""}`} classList={{ "is-loaded": loaded(), "is-failed": failed() || !source() }}><Show when={source() && !failed()} fallback={<div class="recipe-image-fallback"><Icon name="recipes"/><span>{props.title}</span></div>}><Show when={!loaded()}><div class="recipe-image-loading" aria-hidden="true"/></Show><img src={source()} alt="" width="1200" height="750" loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)}/></Show></div>;
}

/** Six plate tints keep meals without a photograph distinguishable at thumbnail size. */
const plateTints = ["tint-1", "tint-2", "tint-3", "tint-4", "tint-5", "tint-6"];

export function plateTint(title: string): string {
  let hash = 0;
  for (const character of title) hash = (hash * 31 + character.charCodeAt(0)) % 997;
  return plateTints[hash % plateTints.length];
}

/**
 * Square meal thumbnail for dense planner surfaces. Falls back to a tinted
 * plate carrying the meal's first letter so a calendar day stays scannable
 * when a photograph is missing or blocked.
 */
export function RecipeThumb(props: { title: string; size: "calendar" | "row" }) {
  const source = () => imageForRecipe(props.title);
  const [failed, setFailed] = createSignal(false);
  return (
    <span class={`recipe-thumb thumb-${props.size} ${plateTint(props.title)}`} aria-hidden="true">
      <Show when={source() && !failed()} fallback={<span class="thumb-letter">{props.title.trim()[0]?.toUpperCase() ?? "?"}</span>}>
        <img src={source()} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)}/>
      </Show>
    </span>
  );
}
