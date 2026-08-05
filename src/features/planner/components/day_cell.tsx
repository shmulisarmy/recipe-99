import { createSignal } from "solid-js";
import { useMutation } from "convex-solidjs";
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

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    if (!(event.currentTarget as Element).contains(event.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId) return;
    await insertRecipeAtBeginningOfDate.mutate({
      recipeId: draggedId,
      toDate: props.date.toDateString(),
    });
  };

  void isDragOver;
  void isUpdatingPeople;
  void savePeopleCount;
  void handleDragOver;
  void handleDragLeave;
  void handleDrop;

  return (<></>);
}
