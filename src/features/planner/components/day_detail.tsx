import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
} from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import type { PlannedDay } from "../types";
import { api } from "../../../../convex/_generated/api";
import {
  Measurement_Divide,
  Measurement_GTE,
  Measurement_Minus,
  ZeroedMeasurement,
} from "../../../primitives/measurement";
import { Icon, StatusText } from "../../../components/ui";
import { RecipePill } from "./recipe_pill";

export function DayDetail(props: {
  dateStr: string;
  plannedDay: PlannedDay | undefined;
  recipes: RecipeProjection[];
  onOpenRecipe: (item: RecipeProjection) => void;
  onOpenAmount: (item: RecipeProjection) => void;
  onMoveRecipe: (item: RecipeProjection) => void;
  onMoveKeyDown: (item: RecipeProjection, event: KeyboardEvent) => void;
  isLifted: (item: RecipeProjection) => boolean;
  moveLabel: (item: RecipeProjection) => string | undefined;
  registerRow: (item: RecipeProjection, element: HTMLLIElement) => void;
  touchTargetMealId: string | undefined;
  touchTargetEndDate: string | undefined;
  onTouchMoveStart: (item: RecipeProjection, event: PointerEvent) => void;
  onOpenCart: () => void;
  onMoveFailure: (message: string, retry: () => Promise<void>) => void;
}): JSX.Element {
  const updatePeopleCount = useMutation(
    api.planner_exports.updateDayMultiplier,
  );
  const insertRecipeAtBeginning = useMutation(
    api.planner_exports.InsertRecipeAtBeginningOfDate,
  );
  const insertRecipeAtEnd = useMutation(
    api.planner_exports.InsertRecipeAtEndOfDate,
  );
  const [peopleDraft, setPeopleDraft] = createSignal(
    String(props.plannedDay?.multiplier ?? 0),
  );
  const [peopleError, setPeopleError] = createSignal("");
  const [peopleSaveError, setPeopleSaveError] = createSignal("");
  const [isDragOver, setIsDragOver] = createSignal(false);
  let lastSavedPeople = props.plannedDay?.multiplier;

  createEffect(() => {
    if (props.plannedDay && props.plannedDay.multiplier !== lastSavedPeople) {
      lastSavedPeople = props.plannedDay.multiplier;
      setPeopleDraft(String(props.plannedDay.multiplier));
    }
  });

  const date = () => new Date(props.dateStr);
  const longDate = () =>
    date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  const shortDate = () =>
    date().toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  const missingCount = createMemo(
    () => props.recipes.filter((recipe) => !recipe.couldMake).length,
  );
  const cartEntries = () =>
    Object.entries(props.plannedDay?.shoppingCart.toGet ?? {});
  const itemPercent = (name: string) => {
    const target = props.plannedDay?.shoppingCart.toGet[name];
    if (!target || target.amount === 0) return 100;
    const got =
      props.plannedDay?.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement();
    if (Measurement_GTE(got, target)) return 100;
    const covered = Measurement_Minus(target, Measurement_Minus(target, got));
    return Math.max(
      0,
      Math.min(
        100,
        Math.round(Measurement_Divide(covered, target.amount).amount * 100),
      ),
    );
  };
  const cartPercent = () =>
    cartEntries().length
      ? Math.round(
          cartEntries().reduce((sum, [name]) => sum + itemPercent(name), 0) /
            cartEntries().length,
        )
      : 100;

  const savePeople = async () => {
    if (!props.plannedDay) return;
    const people = Number(peopleDraft());
    if (!peopleDraft().trim() || !Number.isInteger(people) || people < 0) {
      setPeopleError("Enter a whole number of 0 or more.");
      return;
    }
    if (people === props.plannedDay.multiplier) return;
    setPeopleError("");
    setPeopleSaveError("");
    try {
      await updatePeopleCount.mutate({
        date: props.dateStr,
        multiplier: people,
      });
      lastSavedPeople = people;
    } catch {
      setPeopleDraft(String(props.plannedDay.multiplier));
      setPeopleSaveError("Couldn’t update people. Try again.");
    }
  };

  const handleTicketDrop = async (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId || !props.plannedDay) return;
    try {
      await insertRecipeAtBeginning.mutate({
        recipeId: draggedId,
        toDate: props.dateStr,
      });
    } catch {
      setPeopleSaveError("Move failed. Try the move again.");
    }
  };

  const handleEndDrop = async (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const draggedId = event.dataTransfer?.getData("text/plain");
    if (!draggedId || !props.plannedDay) return;
    try {
      await insertRecipeAtEnd.mutate({
        recipeId: draggedId,
        toDate: props.dateStr,
      });
    } catch {
      setPeopleSaveError("Move failed. Try the move again.");
    }
  };

  return <></>;
}
