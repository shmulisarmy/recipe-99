import { createSignal, For, Show } from "solid-js";
import { useMutation } from "convex-solidjs";
import { CartButton } from "./cart_button";
import { RecipePill } from "./recipe_pill";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";

export function DayCell(props: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  recipes: RecipeProjection[];
  cartCount: number | undefined;
  peopleCount: number | undefined;
  onSelectDay: () => void;
  onOpenRecipe: (item: RecipeProjection) => void;
  onOpenCart: () => void;
}) {
  console.log({props})
  const [isDragOver, setIsDragOver] = createSignal(false);
  const insertRecipeAtBeginningOfDate = useMutation(
    api.planner_exports.InsertRecipeAtBeginningOfDate,
  );
  const updatePeopleCount = useMutation(api.planner_exports.updateDayMultiplier);
  const [isUpdatingPeople, setIsUpdatingPeople] = createSignal(false);

  const savePeopleCount = async (event: Event & { currentTarget: HTMLInputElement }) => {
    event.stopPropagation();
    const peopleCount = Number(event.currentTarget.value);
    if (!Number.isInteger(peopleCount) || peopleCount < 0) {
      event.currentTarget.value = String(props.peopleCount ?? 0);
      return;
    }

    setIsUpdatingPeople(true);
    try {
      await updatePeopleCount.mutate({
        date: props.date.toDateString(),
        multiplier: peopleCount,
      });
    } catch {
      event.currentTarget.value = String(props.peopleCount ?? 0);
    } finally {
      setIsUpdatingPeople(false);
    }
  };

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
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedId = e.dataTransfer!.getData("text/plain");
        if (draggedId) {
          await insertRecipeAtBeginningOfDate.mutate({
            recipeId: draggedId,
            toDate: props.date.toDateString(),
          });
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

      <Show when={props.peopleCount !== undefined}>
        <label
          class="mt-auto flex w-fit items-center gap-1 rounded-md bg-stone-100 px-1.5 py-1 text-stone-500"
          title="People eating this day"
          onClick={(event) => event.stopPropagation()}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            class="h-3.5 w-3.5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span class="sr-only">People eating this day</span>
          <input
            type="number"
            min="0"
            step="1"
            value={props.peopleCount}
            disabled={isUpdatingPeople()}
            aria-label={`People eating on ${props.date.toDateString()}`}
            class="w-8 rounded border border-transparent bg-transparent px-0.5 text-center text-xs font-semibold tabular-nums text-stone-700 outline-none hover:border-stone-300 focus:border-stone-400 focus:bg-white focus:ring-2 focus:ring-stone-200 disabled:cursor-wait"
            onClick={(event) => event.currentTarget.select()}
            onChange={savePeopleCount}
          />
        </label>
      </Show>
    </div>
  );
}
