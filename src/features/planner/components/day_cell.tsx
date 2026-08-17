import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { Icon, StatusText } from "../../../components/ui";
import { useNavigate } from "@solidjs/router";
import { toRouteDate } from "../utils";

export function DayCell(props: {
  date: Date;
  inMonth: boolean;
  isToday: boolean;
  selected: boolean;
  recipes: RecipeProjection[];
  cartCount: number | undefined;
  peopleCount: number | undefined;
  onSelectDay: () => void;
  onFocusKey: (event: KeyboardEvent) => void;
  registerButton: (element: HTMLButtonElement) => void;
  touchDropActive: boolean;
  onStartRecipeDrag: (item: RecipeProjection) => void;
  onMoveFailure: (message: string, retry: () => Promise<void>) => void;
}) {
  const [isDragOver, setIsDragOver] = createSignal(false);
  const [isMoving, setIsMoving] = createSignal(false);
  const [moveError, setMoveError] = createSignal("");
  const insertRecipeAtBeginningOfDate = useMutation(
    api.planner_exports.InsertRecipeAtBeginningOfDate,
  );
  const readyCount = createMemo(
    () => props.recipes.filter((recipe) => recipe.couldMake).length,
  );
  const missingCount = createMemo(() => props.recipes.length - readyCount());
  const recipesToShow: number = 2;
  const visibleRecipes = () => props.recipes.slice(0, recipesToShow);
  const fullLabel = createMemo(() => {
    const parts = [
      props.date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    ];
    if (props.isToday) parts.push("today");
    if (props.selected) parts.push("selected");
    if (props.recipes.length)
      parts.push(
        `${props.recipes.length} ${props.recipes.length === 1 ? "meal" : "meals"}`,
        `${readyCount()} ready`,
        `${missingCount()} missing`,
      );
    if (props.peopleCount !== undefined)
      parts.push(`${props.peopleCount} people`);
    if (props.cartCount)
      parts.push(
        `${props.cartCount} shopping ${props.cartCount === 1 ? "item" : "items"}`,
      );
    return parts.join(", ");
  });

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };
  const handleDragLeave = (event: DragEvent) => {
    if (!(event.currentTarget as Element).contains(event.relatedTarget as Node))
      setIsDragOver(false);
  };
  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId) return;
    setIsMoving(true);
    setMoveError("");
    try {
      await insertRecipeAtBeginningOfDate.mutate({
        recipeId: draggedId,
        toDate: props.date.toDateString(),
      });
      const live = document.getElementById("app-live-region");
      if (live)
        live.textContent = `Meal moved to ${props.date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, position 1.`;
    } catch {
      setMoveError("Move failed. Try the move again.");
      props.onMoveFailure(
        "The meal didn’t move. The confirmed order was restored.",
        async () => {
          await insertRecipeAtBeginningOfDate.mutate({
            recipeId: draggedId,
            toDate: props.date.toDateString(),
          });
        },
      );
    } finally {
      setIsMoving(false);
    }
  };
  const navigate = useNavigate();

  return (
    <div
      class="calendar-cell-wrap"
      data-day-drop-date={props.date.toDateString()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(event) => void handleDrop(event)}
    >
      <button
        ref={props.registerButton}
        class="day-cell"
        classList={{
          outside: !props.inMonth,
          selected: props.selected,
          today: props.isToday,
          "drop-valid": true,
          "is-drag-over": isDragOver() || props.touchDropActive,
          "is-moving": isMoving(),
        }}
        type="button"
        aria-label={fullLabel()}
        aria-pressed={props.selected}
        aria-current={props.isToday ? "date" : undefined}
        onClick={props.onSelectDay}
        onKeyDown={props.onFocusKey}
      >
        <span class="day-number">{props.date.getDate()}</span>
        <span class="desktop-meals">
          <For each={visibleRecipes()}>
            {(recipe) => (
              <span
                class="meal-summary"
                draggable="true"
                classList={{
                  "status-ready": recipe.couldMake,
                  "status-missing": !recipe.couldMake,
                }}
                onDragStart={(event) => {
                  event.stopPropagation();
                  event.dataTransfer?.setData(
                    "text/plain",
                    recipe.plannedRecipeReference.id,
                  );
                  if (event.dataTransfer)
                    event.dataTransfer.effectAllowed = "move";
                  props.onStartRecipeDrag(recipe);
                  document.body.classList.add("is-dragging-meal");
                }}
                onDragEnd={() =>
                  document.body.classList.remove("is-dragging-meal")
                }
              >
                <Icon name={recipe.couldMake ? "check" : "warning"} />
                <span>{recipe.plannedRecipeReference.recipeId.title}</span>
              </span>
            )}
          </For>
          <Show when={props.recipes.length > recipesToShow}>
            <span class="more-meals">
              +{props.recipes.length - recipesToShow} more
            </span>
          </Show>
        </span>
        <span class="mobile-status" aria-hidden="true">
          <Show when={readyCount()}>
            <span class="ready-count">
              <Icon name="check" />
              {readyCount()}
            </span>
          </Show>
          <Show when={missingCount()}>
            <span class="missing-count">
              <Icon name="warning" />
              {missingCount()}
            </span>
          </Show>
        </span>
        <span class="cell-meta">
          <span>
            <Show when={props.peopleCount !== undefined}>
              <Icon name="people" />
              {props.peopleCount}
            </Show>
          </span>
          <span
            onclick={function () {
              navigate(`/planner/day/${toRouteDate(props.date)}/cart`);
            }}
            class="hover:border-black"
          >
            <Show when={props.cartCount}>
              <Icon name="cart" />
              {props.cartCount}
            </Show>
          </span>
        </span>
      </button>
      <Show when={moveError()}>
        <span class="drop-error" role="status">
          <StatusText kind="error">{moveError()}</StatusText>
        </span>
      </Show>
    </div>
  );
}
