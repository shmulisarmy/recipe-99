import { Show, createSignal } from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { Icon } from "../../../components/ui";
import { RecipeThumb } from "../../../components/recipe_image";

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
  const readyCount = () => Object.keys(props.item.scratchPadOfIngredientsNeededToUse).length;
  const missingCount = () => props.item.unfulfilledIngredients.length;
  const ingredientLine = () =>
    props.item.couldMake
      ? `${readyCount()} ${readyCount() === 1 ? "ingredient" : "ingredients"} ready`
      : `${missingCount()} ${missingCount() === 1 ? "ingredient" : "ingredients"} missing`;

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

  return (
    <li
      ref={props.registerRow}
      class="meal-card"
      data-meal-drop-id={id()}
      classList={{ "is-drag-over": isDragOver() || props.touchDropActive, "is-moving": isMoving(), "is-lifted": props.isLifted }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer) event.dataTransfer.dropEffect = "move"; setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => void handleDrop(event)}
      tabindex="-1"
    >
      <button class="meal-open" type="button" onClick={props.onOpen}>
        <RecipeThumb title={title()} size="row"/>
        <span class="meal-main">
          <span class="meal-title">{title()}</span>
          <span class="meal-meta">
            <Icon name="chef"/>
            <span>{ingredientLine()}</span>
            <Show when={override() !== undefined}>
              <span class="serving-override">{override()} people</span>
            </Show>
          </span>
          <Show when={props.moveLabel}><span class="move-proposal">{props.moveLabel}</span></Show>
          <Show when={moveError()}><span class="field-error" role="status">{moveError()}</span></Show>
        </span>
        <span class="meal-badge" classList={{ "is-ready": props.item.couldMake, "is-missing": !props.item.couldMake }}>
          {props.item.couldMake ? "Ready" : "Missing"}
        </span>
      </button>
      <span class="meal-row-actions">
        <button
          class="icon-button drag-control"
          type="button"
          draggable="true"
          aria-label={`Move ${title()}`}
          aria-pressed={props.isLifted}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={() => document.body.classList.remove("is-dragging-meal")}
          onPointerDown={props.onTouchMoveStart}
          onKeyDown={props.onMoveKeyDown}
        ><Icon name="grip"/></button>
        <div class="anchored-control">
          <button class="icon-button" type="button" aria-label={`More actions for ${title()}`} aria-expanded={menuOpen()} onClick={() => setMenuOpen((open) => !open)}><Icon name="more"/></button>
          <Show when={menuOpen()}><div class="action-menu"><button type="button" onClick={() => { setMenuOpen(false); props.onOpen(); }}>Open details</button><button type="button" onClick={() => { setMenuOpen(false); props.onAmount(); }}>Amount to make</button><button type="button" onClick={() => { setMenuOpen(false); props.onMove(); }}>Move meal</button></div></Show>
        </div>
      </span>
    </li>
  );
}
