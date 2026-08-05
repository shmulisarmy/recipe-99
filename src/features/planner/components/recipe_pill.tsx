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

  return (
    <li
      ref={props.registerRow}
      class="ticket-meal"
      classList={{ "is-drag-over": isDragOver(), "is-moving": isMoving(), "is-lifted": props.isLifted }}
      onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer) event.dataTransfer.dropEffect = "move"; setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => void handleDrop(event)}
      tabindex="-1"
    >
      <span class="meal-order">{props.order}</span>
      <span class="meal-main"><button class="meal-title" type="button" onClick={props.onOpen}>{title()}</button><span class="meal-meta"><StatusText kind={props.item.couldMake ? "ready" : "missing"}/><Show when={override() !== undefined}><span class="serving-override">{override()} people</span></Show></span><Show when={props.moveLabel}><span class="move-proposal">{props.moveLabel}</span></Show><Show when={moveError()}><span class="field-error" role="status">{moveError()}</span></Show></span>
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
