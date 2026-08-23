import { useBeforeLeave } from "@solidjs/router";
import { For, Show, createMemo, createSignal, type JSX } from "solid-js";
import type { IngredientSet } from "../../../data";
import {
  Measurement_Divide,
  Measurement_GTE,
  Measurement_Minus,
  Measurement_Plus,
  type Measurement,
  type Unit,
  ZeroedMeasurement,
  BuiltinUnit,
} from "../../../primitives/measurement";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex-solidjs";
import type { PlannerType } from "../data";
import type { RecipeProjection } from "./types";
import { toRouteDate } from "../utils";
import {
  BuiltinUnitOptions,
  Amount,
  ConfirmDialog,
  Icon,
  Overlay,
  StatusText,
} from "../../../components/ui";
import { Select } from "../../../components/Select";

function longDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function AmountToMakeSurface(props: {
  item: RecipeProjection;
  onClose: () => void;
}) {
  const initialOverride =
    props.item.plannedRecipeReference.overrideDayMultiplier;
  const [draft, setDraft] = createSignal(
    String(initialOverride ?? props.item.dayMultiplier),
  );
  const [error, setError] = createSignal("");
  const [notice, setNotice] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const updateMultiplier = useMutation(
    api.planner_exports.updateRecipeOverrideMultiplier,
  );
  const recipeId = () => props.item.plannedRecipeReference.id;

  const save = async (event: SubmitEvent) => {
    event.preventDefault();
    const multiplier = Number(draft());
    if (!draft().trim() || !Number.isFinite(multiplier) || multiplier <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateMultiplier.mutate({ recipeId: recipeId(), multiplier });
      setNotice("Amount updated.");
      window.setTimeout(props.onClose, 500);
    } catch {
      setError("Couldn’t update the amount. Try again.");
    } finally {
      setSaving(false);
    }
  };
  const useDefault = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await updateMultiplier.mutate({ recipeId: recipeId(), multiplier: null });
      setNotice("Using the day default.");
      setDraft(String(props.item.dayMultiplier));
      window.setTimeout(props.onClose, 650);
    } catch {
      setError("Couldn’t update the amount. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return <></>;
}

export function RecipeModal(props: {
  item: RecipeProjection;
  dateStr: string;
  onClose: () => void;
}): JSX.Element {
  const recipeId = () => props.item.plannedRecipeReference.recipeId;
  const [amountOpen, setAmountOpen] = createSignal(false);
  const [isAdding, setIsAdding] = createSignal(false);
  const [added, setAdded] = createSignal(false);
  const [addError, setAddError] = createSignal("");
  const recipe = useQuery(api.recipe_exports.getRecipeByTitle, () => ({
    recipeTitle: recipeId().title,
    version: recipeId().version,
  }));
  const addIngredientsToCart = useMutation(
    api.planner_exports.BulkUpdateCartToGet,
  );
  const coveredEntries = () =>
    Object.entries(props.item.scratchPadOfIngredientsNeededToUse);

  const addMissing = async () => {
    const ingredients: IngredientSet = {};
    for (const item of props.item.unfulfilledIngredients) {
      const missing = Measurement_Minus(
        item.RequiredIngredient.Measurement,
        item.have,
      );
      ingredients[item.RequiredIngredient.name] = ingredients[
        item.RequiredIngredient.name
      ]
        ? Measurement_Plus(ingredients[item.RequiredIngredient.name], missing)
        : missing;
    }
    setIsAdding(true);
    setAddError("");
    setAdded(false);
    try {
      await addIngredientsToCart.mutate({ date: props.dateStr, ingredients });
      setAdded(true);
    } catch {
      setAddError("Couldn’t add the missing ingredients. Try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return <></>;
}

export function MoveMealModal(props: {
  item: RecipeProjection;
  dateStr: string;
  plannerData: PlannerType;
  onMoved: (dateStr: string, position: number, total: number) => void;
  onClose: () => void;
}) {
  const [targetDate, setTargetDate] = createSignal(props.dateStr);
  const [position, setPosition] = createSignal("first");
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const insertBeginning = useMutation(
    api.planner_exports.InsertRecipeAtBeginningOfDate,
  );
  const insertEnd = useMutation(api.planner_exports.InsertRecipeAtEndOfDate);
  const moveBefore = useMutation(
    api.planner_exports.MoveRecipeOnTopOfOtherRecipe,
  );
  const selectedDay = () => props.plannerData[targetDate()];
  const targetMeals = () =>
    selectedDay()?.recipes.filter(
      (recipe) => recipe.id !== props.item.plannedRecipeReference.id,
    ) ?? [];
  const routeDates = () =>
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date(props.dateStr);
      date.setDate(date.getDate() + index - 3);
      return date;
    });

  const move = async (event: SubmitEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (position() === "first")
        await insertBeginning.mutate({
          recipeId: props.item.plannedRecipeReference.id,
          toDate: targetDate(),
        });
      else if (position() === "last")
        await insertEnd.mutate({
          recipeId: props.item.plannedRecipeReference.id,
          toDate: targetDate(),
        });
      else
        await moveBefore.mutate({
          recipeId: props.item.plannedRecipeReference.id,
          otherRecipeId: position(),
        });
      const targetPosition =
        position() === "first"
          ? 1
          : position() === "last"
            ? targetMeals().length + 1
            : targetMeals().findIndex((meal) => meal.id === position()) + 1;
      props.onMoved(targetDate(), targetPosition, targetMeals().length + 1);
      props.onClose();
    } catch {
      setError("Couldn’t move the meal. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return <></>;
}

export function CartModal(props: {
  dateStr: string;
  onClose: () => void;
  plannerData: PlannerType;
}): JSX.Element {
  type MeasurementDraft = { amount: string; unit: Unit };
  const [drafts, setDrafts] = createSignal<Record<string, MeasurementDraft>>(
    {},
  );
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal("");
  const [saved, setSaved] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  let pendingNavigation: (() => void) | undefined;
  const saveCart = useMutation(api.planner_exports.BulkSetCartToGet);
  const plannedDay = () => props.plannerData[props.dateStr];
  const entries = () => Object.entries(plannedDay()?.shoppingCart.toGet ?? {});
  const hasDrafts = () => Object.keys(drafts()).length > 0;
  const beginEdit = (name: string, measurement: Measurement) =>
    setDrafts((current) =>
      current[name]
        ? current
        : {
            ...current,
            [name]: {
              amount: String(measurement.amount),
              unit: measurement.unit,
            },
          },
    );
  const updateDraft = (name: string, update: Partial<MeasurementDraft>) =>
    setDrafts((current) => ({
      ...current,
      [name]: { ...current[name], ...update },
    }));
  const alreadyGot = (name: string) =>
    plannedDay()?.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement();
  const percent = (name: string, target: Measurement) => {
    if (target.amount === 0 || Measurement_GTE(alreadyGot(name), target))
      return 100;
    const covered = Measurement_Minus(
      target,
      Measurement_Minus(target, alreadyGot(name)),
    );
    return Math.min(
      100,
      Math.max(
        0,
        Math.round(Measurement_Divide(covered, target.amount).amount * 100),
      ),
    );
  };
  const completedCount = () =>
    entries().filter(([name, target]) => percent(name, target) === 100).length;

  const requestClose = () => {
    if (hasDrafts()) setConfirmOpen(true);
    else props.onClose();
  };
  useBeforeLeave((event) => {
    if (!hasDrafts() || event.defaultPrevented) return;
    event.preventDefault();
    pendingNavigation = () => event.retry(true);
    setConfirmOpen(true);
  });
  const discard = () => {
    setDrafts({});
    setErrors({});
    setConfirmOpen(false);
    const retry = pendingNavigation;
    pendingNavigation = undefined;
    if (retry) retry();
    else props.onClose();
  };
  const keepEditing = () => {
    pendingNavigation = undefined;
    setConfirmOpen(false);
  };

  const save = async () => {
    const nextErrors: Record<string, string> = {};
    const ingredients = Object.entries(drafts()).map(([name, draft]) => {
      const amount = Number(draft.amount);
      if (!draft.amount.trim() || !Number.isFinite(amount) || amount < 0)
        nextErrors[name] = "Enter a valid amount of 0 or more.";
      return { name, measurement: { amount, unit: draft.unit } };
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      queueMicrotask(() =>
        document
          .querySelector<HTMLElement>(".cart-row [aria-invalid='true']")
          ?.focus(),
      );
      return;
    }
    setIsSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      await saveCart.mutate({ date: props.dateStr, ingredients });
      setDrafts({});
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaveError("Couldn’t save the shopping amounts. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return <></>;
}
