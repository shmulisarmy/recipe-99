import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  type JSX,
} from "solid-js";
import { useMutation } from "convex-solidjs";
import type { RecipeProjection } from "./types";
import type { PlannedDay } from "../types";
import { api } from "../../../../convex/_generated/api";
import { Icon } from "../../../components/ui";
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
  onCloseSheet: () => void;
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

  let sheet!: HTMLElement;
  onMount(() => queueMicrotask(() => sheet.focus()));

  const date = () => new Date(props.dateStr);
  const longDate = () =>
    date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  const sheetDate = () =>
    date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  const missingCount = createMemo(
    () => props.recipes.filter((recipe) => !recipe.couldMake).length,
  );
  const plannedLine = () =>
    props.recipes.length === 0
      ? "No planned recipes"
      : `${props.recipes.length} planned ${props.recipes.length === 1 ? "recipe" : "recipes"}${missingCount() ? ` · ${missingCount()} missing` : ""}`;

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

  return (
    <div class="day-sheet-shell">
      <button
        class="day-sheet-scrim"
        type="button"
        tabindex="-1"
        aria-label={`Close ${longDate()}`}
        onClick={props.onCloseSheet}
      />
      <aside
        ref={sheet}
        tabindex="-1"
        class="day-sheet"
        classList={{ "is-drag-over": isDragOver() }}
        aria-labelledby="day-sheet-title"
        onDragOver={(event) => {
          if (!props.plannedDay) return;
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          if (
            !(event.currentTarget as Element).contains(
              event.relatedTarget as Node,
            )
          )
            setIsDragOver(false);
        }}
        onDrop={(event) => void handleTicketDrop(event)}
      >
        <span class="day-sheet-grab" aria-hidden="true" />
        <header class="day-sheet-head">
          <div>
            <h2 id="day-sheet-title">{sheetDate()}</h2>
            <p class="day-sheet-count">{plannedLine()}</p>
          </div>
          <button
            class="sheet-close"
            type="button"
            aria-label={`Close ${longDate()}`}
            onClick={props.onCloseSheet}
          >
            <Icon name="close" />
          </button>
        </header>
        <div class="day-sheet-body">
          <Show
            when={props.plannedDay}
            fallback={
              <p class="helper-text">No meals planned for {longDate()}.</p>
            }
          >
            <label class="people-control">
              <Icon name="people" />
              <span>People eating</span>
              <input
                class="people-number"
                inputmode="numeric"
                value={peopleDraft()}
                aria-invalid={!!peopleError()}
                aria-describedby={peopleError() ? "people-error" : undefined}
                disabled={updatePeopleCount.isLoading()}
                onInput={(event) => setPeopleDraft(event.currentTarget.value)}
                onBlur={() => void savePeople()}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void savePeople();
                  }
                }}
              />
            </label>
            <Show when={peopleError()}>
              <p class="field-error" id="people-error">
                {peopleError()}
              </p>
            </Show>
            <Show when={peopleSaveError()}>
              <p class="field-error" role="alert">
                {peopleSaveError()}
              </p>
            </Show>
            <Show
              when={props.recipes.length > 0}
              fallback={
                <p class="helper-text">No meals are on this day yet.</p>
              }
            >
              <ol
                class="day-sheet-meals"
                data-ticket-end-date={props.dateStr}
                classList={{
                  "is-touch-end-target":
                    props.touchTargetEndDate === props.dateStr,
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => void handleEndDrop(event)}
              >
                <For each={props.recipes}>
                  {(item, index) => (
                    <RecipePill
                      item={item}
                      order={index() + 1}
                      onOpen={() => props.onOpenRecipe(item)}
                      onAmount={() => props.onOpenAmount(item)}
                      onMove={() => props.onMoveRecipe(item)}
                      onMoveKeyDown={(event) =>
                        props.onMoveKeyDown(item, event)
                      }
                      isLifted={props.isLifted(item)}
                      moveLabel={props.moveLabel(item)}
                      registerRow={(element) =>
                        props.registerRow(item, element)
                      }
                      touchDropActive={
                        props.touchTargetMealId ===
                        item.plannedRecipeReference.id
                      }
                      onTouchMoveStart={(event) =>
                        props.onTouchMoveStart(item, event)
                      }
                      onMoveFailure={props.onMoveFailure}
                    />
                  )}
                </For>
                <li class="meal-end-drop" aria-hidden="true">
                  Move to end
                </li>
              </ol>
            </Show>
            <details class="disclosure">
              <summary>How readiness works</summary>
              <p>
                Recipe 99 looks ahead in date and meal order. It adds what is
                still expected from each day’s cart, then subtracts ingredients
                as planned meals use them.
              </p>
            </details>
          </Show>
        </div>
      </aside>
    </div>
  );
}
