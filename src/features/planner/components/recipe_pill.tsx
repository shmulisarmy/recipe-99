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

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("text/plain", id());
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const clearDragState = () => setIsDragOver(false);

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId || draggedId === id()) return;
    await moveRecipeOnTopOfOtherRecipe.mutate({
      recipeId: draggedId,
      otherRecipeId: id(),
    });
  };

  void isDragOver;
  void name;
  void handleDragStart;
  void handleDragOver;
  void clearDragState;
  void handleDrop;

  return (<></>);
}
