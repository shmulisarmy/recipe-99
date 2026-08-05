import { createSignal } from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import { makeCacheKey } from "../../../data";
import { MAX_PILL_CHARS } from "./_settings";
import { api } from "../../../../convex/_generated/api";

function truncateName(name: string): string {
  return name.length > MAX_PILL_CHARS
    ? `${name.slice(0, MAX_PILL_CHARS).trimEnd()}…`
    : name;
}

export function RecipePill(props: {
  item: RecipeProjection;
  onOpen: () => void;
  truncate?: boolean;
  class?: string;
}) {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const moveRecipeOnTopOfOtherRecipe = useMutation(
    api.planner_exports.MoveRecipeOnTopOfOtherRecipe,
  );

  const id = () => props.item.plannedRecipeReference.id;
  const recipeName = () => props.item.plannedRecipeReference.recipeId;
  const name = () =>
    props.truncate === false ? recipeName() : truncateName(makeCacheKey(recipeName()));

  return (
    <button
      type="button"
      draggable={true}
      class={`block w-full truncate rounded-md text-left font-medium capitalize ${
        props.class ?? "px-1.5 py-0.5 text-xs"
      }`}
      classList={{
        "bg-green-100 text-green-800 hover:bg-green-200": props.item.couldMake && !isDragOver(),
        "bg-red-100 text-red-800 hover:bg-red-200": !props.item.couldMake && !isDragOver(),
        "ring-2 ring-stone-400 opacity-60": isDragOver(),
      }}
      onDragStart={(e) => {
        e.dataTransfer!.setData("text/plain", id());
        e.dataTransfer!.effectAllowed = "move";
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDragEnd={() => setIsDragOver(false)}
      onDrop={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const draggedId = e.dataTransfer!.getData("text/plain");
        if (draggedId && draggedId !== id()) {
          await moveRecipeOnTopOfOtherRecipe.mutate({
            recipeId: draggedId,
            otherRecipeId: id(),
          });
        }
      }}
      onClick={() => props.onOpen()}
    >
      {name()}
      {props.item.multiplier !== 1 ? ` ×${props.item.multiplier}` : ""}
    </button>
  );
}
