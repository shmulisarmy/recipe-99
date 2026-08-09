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

  return (
    <div class="ticket-shell">
      <aside
        class="day-ticket"
        classList={{ "is-drag-over": isDragOver() }}
        aria-labelledby="ticket-title"
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
        <header class="ticket-head">
          <div>
            <p class="ticket-date">{shortDate()}</p>
            <Show when={date().toDateString() === new Date().toDateString()}>
              <p class="ticket-context">Today</p>
            </Show>
          </div>
          <Show when={props.plannedDay}>
            <label class="people-control">
              <Icon name="people" />
              <span>People</span>
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
          </Show>
        </header>
        <div class="ticket-body">
          <Show
            when={props.plannedDay}
            fallback={
              <div class="empty-ticket">
                <h2 id="ticket-title">No meals planned</h2>
                <p>No meals planned for {longDate()}.</p>
              </div>
            }
          >
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
            <div class="ticket-summary">
              <h2 id="ticket-title">Meals</h2>
              <Show
                when={missingCount() > 0}
                fallback={<StatusText kind="ready">All ready</StatusText>}
              >
                <StatusText kind="missing">{missingCount()} missing</StatusText>
              </Show>
            </div>
            <Show
              when={props.recipes.length > 0}
              fallback={
                <p class="helper-text">No meals are on this day yet.</p>
              }
            >
              <ol
                class="ticket-meals"
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
            <div class="ticket-cart">
              <Show
                when={cartEntries().length > 0}
                fallback={<p>Nothing to buy for this day.</p>}
              >
                <div class="ticket-cart-line">
                  <strong>Shopping</strong>
                  <span>
                    {cartEntries().length}{" "}
                    {cartEntries().length === 1 ? "item" : "items"},{" "}
                    {cartPercent()}% obtained
                  </span>
                </div>
                <div
                  class="progress"
                  role="progressbar"
                  aria-label={`Shopping progress for ${longDate()}`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={cartPercent()}
                >
                  <span style={{ width: `${cartPercent()}%` }} />
                </div>
                <button
                  class="button button-primary"
                  type="button"
                  onClick={props.onOpenCart}
                >
                  <Icon name="cart" />
                  Open shopping cart
                </button>
              </Show>
            </div>
          </Show>
        </div>
      </aside>
    </div>
  );
}
