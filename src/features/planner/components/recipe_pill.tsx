import { Show, createSignal } from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { Icon, StatusText } from "../../../components/ui";

export function RecipePill(props: {
  item: RecipeProjection;
  order: number;
  onOpen: () => void;
  onAmount: () => void;
  onMove: () => void;
  onMoveKeyDown: (event: KeyboardEvent) => void;
  isLifted: boolean;
  moveLabel?: string;
  registerRow?: (element: HTMLLIElement) => void;
  touchDropActive: boolean;
  onTouchMoveStart: (event: PointerEvent) => void;
  onMoveFailure: (message: string, retry: () => Promise<void>) => void;
}) {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [isMoving, setIsMoving] = createSignal(false);
  const [moveError, setMoveError] = createSignal("");
  const moveRecipeOnTopOfOtherRecipe = useMutation(api.planner_exports.MoveRecipeOnTopOfOtherRecipe);
  const id = () => props.item.plannedRecipeReference.id;
  const title = () => props.item.plannedRecipeReference.recipeId.title;
  const override = () => props.item.plannedRecipeReference.overrideDayMultiplier;

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer?.setData("text/plain", id());
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    document.body.classList.add("is-dragging-meal");
  };
  const handleDrag = (event: DragEvent) => {
    if (!event.clientY) return;
    const edge = 48;
    const delta = event.clientY < edge ? -12 : event.clientY > window.innerHeight - edge ? 12 : 0;
    if (delta) window.scrollBy(0, delta);
  };
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId || draggedId === id()) return;
    setIsMoving(true);
    setMoveError("");
    try {
      await moveRecipeOnTopOfOtherRecipe.mutate({ recipeId: draggedId, otherRecipeId: id() });
      const live = document.getElementById("app-live-region");
      if (live) live.textContent = `Meal moved before ${title()}.`;
    } catch {
      setMoveError("Move failed. Try the move again.");
      props.onMoveFailure("The meal didn’t move. The confirmed order was restored.", async () => {
        await moveRecipeOnTopOfOtherRecipe.mutate({ recipeId: draggedId, otherRecipeId: id() });
      });
    } finally {
      setIsMoving(false);
    }
  };

  return <></>;
}
