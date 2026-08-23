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

  return <></>;
}
