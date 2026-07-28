import { createSignal, For, Show } from "solid-js";
import { InsertRecipeAtBeginningOfDate } from "../actions/recipe";
import { reSimulatePlannerProjection } from "../logic";
import { CartButton } from "./cart_button";
import { RecipePill } from "./recipe_pill";
import type { RecipeProjection } from "./types";

export function DayCell(props: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  recipes: RecipeProjection[];
  cartCount: number | undefined;
  onSelectDay: () => void;
  onOpenRecipe: (item: RecipeProjection) => void;
  onOpenCart: () => void;
}) {
  console.log({props})
  const [isDragOver, setIsDragOver] = createSignal(false);

  return (
    <div
      class="min-h-14 sm:min-h-32 flex flex-col gap-1 border-t border-l border-stone-100 p-1.5 transition-colors"
      classList={{
        "bg-white": props.inMonth && !isDragOver(),
        "bg-stone-50": !props.inMonth && !isDragOver(),
        "bg-stone-100": isDragOver(),
        "ring-2 ring-inset ring-stone-900 sm:ring-0": props.selected,
      }}
      onClick={() => props.onSelectDay()}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedId = e.dataTransfer!.getData("text/plain");
        if (draggedId) {
          InsertRecipeAtBeginningOfDate(draggedId, props.date);
          reSimulatePlannerProjection();
        }
      }}
    >
      {/* Day-number row: cart button left, number right */}
      <div class="flex items-center justify-between">
        <Show when={props.cartCount !== undefined} fallback={<span />}>
          <span class="hidden sm:inline-flex">
            <CartButton
              count={props.cartCount!}
              onOpen={() => props.onOpenCart()}
              label={`Open shopping cart for ${props.date.toDateString()}`}
            />
          </span>
        </Show>
        <span
          class="self-end text-xs font-medium"
          classList={{
            "flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white":
              props.isToday,
            "text-stone-500": !props.isToday && props.inMonth,
            "text-stone-300": !props.isToday && !props.inMonth,
          }}
        >
          {props.date.getDate()}
        </span>
      </div>

      {/* Recipe pills — desktop only */}
      <Show when={props.recipes.length > 0}>
        <div class="hidden sm:flex sm:flex-col sm:gap-1">
          <For each={props.recipes}>
            {(item) => (
              <RecipePill item={item} onOpen={() => props.onOpenRecipe(item)} />
            )}
          </For>
        </div>

        {/* Mobile dot row — one dot per recipe */}
        <div class="flex sm:hidden justify-center gap-0.5">
          <For each={props.recipes}>
            {(item) => (
              <span
                class="h-1.5 w-1.5 rounded-full"
                classList={{
                  "bg-green-500": item.couldMake,
                  "bg-red-500": !item.couldMake,
                }}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
