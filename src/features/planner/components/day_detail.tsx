import { createSignal, For, JSX, Show } from "solid-js";
import { useMutation } from "convex-solidjs";
import { CartButton } from "./cart_button";
import { RecipePill } from "./recipe_pill";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";

function dayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const diff = Math.round((startOfDay(date) - startOfDay(today)) / dayMs);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export function DayDetail(props: {
    dateStr: string; // toDateString() key
    recipes: RecipeProjection[];
    cartCount: number | undefined;
    onOpenRecipe: (item: RecipeProjection) => void;
    onOpenCart: () => void;
}): JSX.Element {
    const [isDragOver, setIsDragOver] = createSignal(false);
    const date = () => new Date(props.dateStr);
    const insertRecipeAtBeginningOfDate = useMutation(
        api.planner_exports.InsertRecipeAtBeginningOfDate,
    );

    return (
        <div
            class="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:hidden transition-colors"
            classList={{ "bg-stone-100": isDragOver() }}
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
                        toDate: date().toDateString(),
                    });
                }
            }}
        >
            <div class="flex items-center justify-between gap-2">
                <h2 class="text-base font-semibold text-stone-900">{dayLabel(props.dateStr)}</h2>
                <Show when={props.cartCount !== undefined}>
                    <CartButton
                        count={props.cartCount ?? 0}
                        onOpen={() => props.onOpenCart()}
                        label={`Open shopping cart for ${dayLabel(props.dateStr)}`}
                        class="px-2 py-1 text-xs"
                    />
                </Show>
            </div>
            <Show
                when={props.recipes.length > 0}
                fallback={<p class="mt-2 text-sm text-stone-500">Nothing planned.</p>}
            >
                <div class="mt-2 space-y-1.5">
                    <For each={props.recipes}>
                        {(item) => (
                            <RecipePill
                                item={item}
                                truncate={false}
                                class="px-3 py-2 text-sm"
                                onOpen={() => props.onOpenRecipe(item)}
                            />
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}
