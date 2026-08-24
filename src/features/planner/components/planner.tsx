import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { useMutation, useQuery } from "convex-solidjs";
import { projection } from "../logic";
import { today } from "../types";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { fromRouteDate, toRouteDate } from "../utils";
import { DayCell } from "./day_cell";
import { DayDetail } from "./day_detail";
import {
  AmountToMakeSurface,
  CartModal,
  MoveMealModal,
  RecipeModal,
} from "./planner_modals";
import { Amount, Icon } from "../../../components/ui";

function monthGridDays(): Date[] {
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    1 - first.getDay(),
  );
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    last.getDate() + (6 - last.getDay()),
  );
  const days: Date[] = [];
  for (
    let date = new Date(start);
    date <= end;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  )
    days.push(date);
  return days;
}

type KeyboardMove = {
  item: RecipeProjection;
  targetDate: string;
  position: number;
};

type TouchMove = {
  item: RecipeProjection;
  pointerId: number;
  x: number;
  y: number;
  targetDate?: string;
  targetMealId?: string;
  targetEndDate?: string;
};

export function Planner() {
  const planner = useQuery(api.planner_exports.usersPlanner, {});
  const params = useParams<{ date?: string; plannedRecipeId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const insertBeginning = useMutation(
    api.planner_exports.InsertRecipeAtBeginningOfDate,
  );
  const moveBefore = useMutation(
    api.planner_exports.MoveRecipeOnTopOfOtherRecipe,
  );
  const insertEnd = useMutation(api.planner_exports.InsertRecipeAtEndOfDate);
  const days = monthGridDays();
  const [amountItem, setAmountItem] = createSignal<RecipeProjection>();
  const [moveItem, setMoveItem] = createSignal<RecipeProjection>();
  const [keyboardMove, setKeyboardMove] = createSignal<KeyboardMove>();
  const [moveError, setMoveError] = createSignal("");
  const [pointerRetry, setPointerRetry] = createSignal<() => Promise<void>>();
  const [isRetryingMove, setIsRetryingMove] = createSignal(false);
  const [pendingMealFocus, setPendingMealFocus] = createSignal<string>();
  const [touchMove, setTouchMove] = createSignal<TouchMove>();
  const dayButtons: HTMLButtonElement[] = [];
  const mealRows = new Map<string, HTMLLIElement>();
  let calendarViewport: HTMLDivElement | undefined;

  const routeDate = createMemo(() => fromRouteDate(params.date));
  const selectedDate = () => routeDate() ?? today;
  const selectedDateStr = () => selectedDate().toDateString();
  const selectedRecipes = () => projection[selectedDateStr()] ?? [];
  const selectedDay = () => planner.data()?.[selectedDateStr()];
  const isCartOpen = () => location.pathname.endsWith("/cart");
  const isDayOpen = () =>
    !!params.date && !params.plannedRecipeId && !isCartOpen();
  const routeRecipe = createMemo(() =>
    params.plannedRecipeId
      ? selectedRecipes().find(
          (item) =>
            item.plannedRecipeReference.id ===
            decodeURIComponent(params.plannedRecipeId!),
        )
      : undefined,
  );
  const monthTitle = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  createEffect(() => {
    planner.data();
    const selected = selectedDateStr();
    if (!calendarViewport || !window.matchMedia("(max-width: 767px)").matches)
      return;
    queueMicrotask(() => {
      if (!calendarViewport) return;
      const index = days.findIndex((date) => date.toDateString() === selected);
      const rowCount = days.length / 7;
      const row = Math.min(Math.max(0, Math.floor(index / 7)), rowCount - 2);
      const rowElement = calendarViewport.querySelectorAll<HTMLElement>("tbody tr")[row];
      if (rowElement)
        calendarViewport.scrollTop = rowElement.offsetTop;
    });
  });

  const selectDay = (date: Date) =>
    navigate(`/planner/day/${toRouteDate(date)}`);
  const openRecipe = (item: RecipeProjection) =>
    navigate(
      `/planner/day/${toRouteDate(selectedDate())}/recipe/${encodeURIComponent(item.plannedRecipeReference.id)}`,
    );
  const openCart = () =>
    navigate(`/planner/day/${toRouteDate(selectedDate())}/cart`);
  const closeOverlay = () =>
    navigate(`/planner/day/${toRouteDate(selectedDate())}`);
  const closeDay = () => navigate("/planner");
  const cartCount = (dateStr: string) => {
    const day = planner.data()?.[dateStr];
    return day ? Object.keys(day.shoppingCart.toGet).length : undefined;
  };

  const focusDay = (index: number) =>
    dayButtons[Math.max(0, Math.min(days.length - 1, index))]?.focus();
  const onDayFocusKey = (index: number, event: KeyboardEvent) => {
    let target: number | undefined;
    if (event.key === "ArrowLeft") target = index - 1;
    if (event.key === "ArrowRight") target = index + 1;
    if (event.key === "ArrowUp") target = index - 7;
    if (event.key === "ArrowDown") target = index + 7;
    if (event.key === "Home") target = index - (index % 7);
    if (event.key === "End") target = index + (6 - (index % 7));
    if (target !== undefined) {
      event.preventDefault();
      focusDay(target);
    }
  };

  const targetItems = (move: KeyboardMove) =>
    (projection[move.targetDate] ?? []).filter(
      (item) =>
        item.plannedRecipeReference.id !== move.item.plannedRecipeReference.id,
    );
  const announce = (message: string) => {
    const live = document.getElementById("app-live-region");
    if (live) live.textContent = message;
  };
  const cancelKeyboardMove = () => {
    const move = keyboardMove();
    setKeyboardMove(undefined);
    if (move)
      queueMicrotask(() =>
        document
          .querySelector<HTMLElement>(
            `[aria-label="Move ${CSS.escape(move.item.plannedRecipeReference.recipeId.title)}"]`,
          )
          ?.focus(),
      );
    announce("Move canceled.");
  };
  const dropKeyboardMove = async () => {
    const move = keyboardMove();
    if (!move) return;
    const targets = targetItems(move);
    try {
      if (move.position === 0 || !targets[move.position - 1])
        await insertBeginning.mutate({
          recipeId: move.item.plannedRecipeReference.id,
          toDate: move.targetDate,
        });
      else
        await moveBefore.mutate({
          recipeId: move.item.plannedRecipeReference.id,
          otherRecipeId: targets[move.position - 1].plannedRecipeReference.id,
        });
      const dateLabel = new Date(move.targetDate).toLocaleDateString(
        undefined,
        { weekday: "long", month: "long", day: "numeric" },
      );
      announce(
        `Moved ${move.item.plannedRecipeReference.recipeId.title} to ${dateLabel}, position ${move.position + 1} of ${targets.length + 1}.`,
      );
      setPendingMealFocus(move.item.plannedRecipeReference.id);
      setKeyboardMove(undefined);
      if (move.targetDate !== selectedDateStr())
        navigate(`/planner/day/${toRouteDate(new Date(move.targetDate))}`);
      else
        queueMicrotask(() => {
          const row = mealRows.get(move.item.plannedRecipeReference.id);
          if (row) {
            row.focus();
            setPendingMealFocus(undefined);
          }
        });
    } catch {
      setMoveError("Couldn’t move the meal. Try again.");
      announce("Move failed. The confirmed meal order was restored.");
    }
  };
  const onMoveKeyDown = (item: RecipeProjection, event: KeyboardEvent) => {
    const move = keyboardMove();
    if (!move) {
      if (event.key !== " ") return;
      event.preventDefault();
      setMoveError("");
      setKeyboardMove({ item, targetDate: selectedDateStr(), position: 0 });
      announce(
        `Lifted ${item.plannedRecipeReference.recipeId.title}. Use Left and Right to change day, Up and Down to change position, Space to drop, or Escape to cancel.`,
      );
      return;
    }
    if (move.item.plannedRecipeReference.id !== item.plannedRecipeReference.id)
      return;
    if (event.key === "Escape") {
      event.preventDefault();
      cancelKeyboardMove();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      void dropKeyboardMove();
      return;
    }
    if (
      !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const date = new Date(move.targetDate);
      date.setDate(date.getDate() + (event.key === "ArrowLeft" ? -1 : 1));
      setKeyboardMove({
        ...move,
        targetDate: date.toDateString(),
        position: 0,
      });
    } else {
      const max = targetItems(move).length;
      setKeyboardMove({
        ...move,
        position: Math.max(
          0,
          Math.min(max, move.position + (event.key === "ArrowUp" ? -1 : 1)),
        ),
      });
    }
  };
  const moveLabel = (item: RecipeProjection) => {
    const move = keyboardMove();
    if (
      !move ||
      move.item.plannedRecipeReference.id !== item.plannedRecipeReference.id
    )
      return;
    return `${new Date(move.targetDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, position ${move.position + 1}`;
  };
  const onPointerMoveFailure = (
    message: string,
    retry: () => Promise<void>,
  ) => {
    setMoveError(message);
    setPointerRetry(() => retry);
  };
  const retryPointerMove = async () => {
    const retry = pointerRetry();
    if (!retry) return;
    setIsRetryingMove(true);
    try {
      await retry();
      setMoveError("");
      setPointerRetry(undefined);
      announce("Meal moved.");
    } catch {
      setMoveError("The meal still didn’t move. Try again.");
    } finally {
      setIsRetryingMove(false);
    }
  };

  const clearTouchListeners = () => {
    window.removeEventListener("pointermove", updateTouchMove);
    window.removeEventListener("pointerup", finishTouchMove);
    window.removeEventListener("pointercancel", cancelTouchMove);
  };
  const cancelTouchMove = () => {
    clearTouchListeners();
    document.body.classList.remove("is-dragging-meal", "is-touch-dragging-meal");
    setTouchMove(undefined);
    announce("Move canceled.");
  };
  const updateTouchMove = (event: PointerEvent) => {
    const move = touchMove();
    if (!move || event.pointerId !== move.pointerId) return;
    event.preventDefault();
    const element = document.elementFromPoint(event.clientX, event.clientY);
    const mealTarget = element?.closest<HTMLElement>("[data-meal-drop-id]");
    const dayTarget = element?.closest<HTMLElement>("[data-day-drop-date]");
    const endTarget = element?.closest<HTMLElement>("[data-ticket-end-date]");
    const targetMealId = mealTarget?.dataset.mealDropId;

    setTouchMove({
      ...move,
      x: event.clientX,
      y: event.clientY,
      targetMealId:
        targetMealId && targetMealId !== move.item.plannedRecipeReference.id
          ? targetMealId
          : undefined,
      targetDate: targetMealId ? undefined : dayTarget?.dataset.dayDropDate,
      targetEndDate:
        targetMealId || dayTarget ? undefined : endTarget?.dataset.ticketEndDate,
    });
  };
  const finishTouchMove = (event: PointerEvent) => {
    const move = touchMove();
    if (!move || event.pointerId !== move.pointerId) return;
    event.preventDefault();
    clearTouchListeners();
    document.body.classList.remove("is-dragging-meal", "is-touch-dragging-meal");
    setTouchMove(undefined);

    const runMove = async () => {
      if (move.targetMealId) {
        await moveBefore.mutate({
          recipeId: move.item.plannedRecipeReference.id,
          otherRecipeId: move.targetMealId,
        });
      } else if (move.targetEndDate) {
        await insertEnd.mutate({
          recipeId: move.item.plannedRecipeReference.id,
          toDate: move.targetEndDate,
        });
      } else if (move.targetDate) {
        await insertBeginning.mutate({
          recipeId: move.item.plannedRecipeReference.id,
          toDate: move.targetDate,
        });
      } else {
        announce("Move canceled. Drop on a meal or calendar day.");
        return;
      }
      announce(`Moved ${move.item.plannedRecipeReference.recipeId.title}.`);
    };

    void runMove().catch(() =>
      onPointerMoveFailure(
        "The meal didn’t move. The confirmed order was restored.",
        runMove,
      ),
    );
  };
  const startTouchMove = (item: RecipeProjection, event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    event.preventDefault();
    clearTouchListeners();
    document.body.classList.add("is-dragging-meal", "is-touch-dragging-meal");
    setTouchMove({
      item,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    });
    window.addEventListener("pointermove", updateTouchMove, { passive: false });
    window.addEventListener("pointerup", finishTouchMove, { passive: false });
    window.addEventListener("pointercancel", cancelTouchMove);
    announce(`Lifted ${item.plannedRecipeReference.recipeId.title}. Drag to another meal or calendar day.`);
  };
  onCleanup(clearTouchListeners);

  const selectedCartEntries = () =>
    Object.entries(selectedDay()?.shoppingCart.toGet ?? {});
  const visibleCartEntries = () => selectedCartEntries().slice(0, 4);
  const hiddenCartCount = () =>
    Math.max(0, selectedCartEntries().length - visibleCartEntries().length);

  return (
    <main class="main planner-page" id="main">
      <header class="planner-heading">
        <h1>Meal Schedule</h1>
        <button class="planner-plan-button" type="button">
          <Icon name="plus" />
          Plan Meal
        </button>
      </header>

      <Show when={planner.isLoading()}>
        <div class="planner-loading" aria-live="polite">
          <p>Loading your meal plan…</p>
          <div class="skeleton skeleton-calendar" />
        </div>
      </Show>

      <Show when={planner.error()}>
        <div class="empty-state notice-error">
          <h2>Your meal plan couldn’t load.</h2>
          <button
            class="button button-secondary"
            type="button"
            onClick={planner.refetch}
          >
            Try again
          </button>
        </div>
      </Show>

      <Show when={planner.data()}>
        <Show when={moveError()}>
          <div class="inline-notice notice-error" role="alert">
            <p>{moveError()}</p>
            <div class="notice-actions">
              <Show when={pointerRetry()}>
                <button
                  class="button button-secondary"
                  type="button"
                  disabled={isRetryingMove()}
                  onClick={() => void retryPointerMove()}
                >
                  {isRetryingMove() ? "Retrying…" : "Retry move"}
                </button>
              </Show>
              <button
                class="button button-quiet"
                type="button"
                onClick={() => {
                  setMoveError("");
                  setPointerRetry(undefined);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </Show>

        <div class="planner-base-layout">
          <section class="planner-calendar-card" aria-labelledby="calendar-title">
            <div class="planner-month-heading">
              <h2 id="calendar-title">{monthTitle}</h2>
              <Icon name="chevron" />
            </div>
            <div class="planner-calendar-scroll" ref={calendarViewport}>
            <table class="calendar" aria-label={`${monthTitle} meal plan`}>
              <tbody>
                <For
                  each={Array.from(
                    { length: days.length / 7 },
                    (_, row) => row,
                  )}
                >
                  {(row) => (
                    <tr>
                      <For each={days.slice(row * 7, row * 7 + 7)}>
                        {(date, column) => {
                          const index = row * 7 + column();
                          const dateStr = date.toDateString();
                          const day = () => planner.data()?.[dateStr];
                          return (
                            <td>
                              <DayCell
                                date={date}
                                inMonth={date.getMonth() === today.getMonth()}
                                isToday={dateStr === today.toDateString()}
                                selected={dateStr === selectedDateStr()}
                                recipes={projection[dateStr] ?? []}
                                cartCount={cartCount(dateStr)}
                                peopleCount={day()?.multiplier}
                                onSelectDay={() => selectDay(date)}
                                onFocusKey={(event) =>
                                  onDayFocusKey(index, event)
                                }
                                registerButton={(element) => {
                                  dayButtons[index] = element;
                                }}
                                touchDropActive={
                                  touchMove()?.targetDate === dateStr
                                }
                                onStartRecipeDrag={() => {
                                  if (dateStr !== selectedDateStr())
                                    selectDay(date);
                                }}
                                onMoveFailure={onPointerMoveFailure}
                              />
                            </td>
                          );
                        }}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            </div>
          </section>

          <section class="planner-shopping-card" aria-labelledby="shopping-title">
            <header class="planner-shopping-heading">
              <div>
                <Icon name="cart" />
                <h2 id="shopping-title">Shopping List</h2>
              </div>
              <span>
                {selectedCartEntries().length}{" "}
                {selectedCartEntries().length === 1 ? "item" : "items"}
              </span>
            </header>

            <Show
              when={selectedCartEntries().length > 0}
              fallback={
                <p class="planner-shopping-empty">
                  Nothing to buy for this day.
                </p>
              }
            >
              <ul class="planner-shopping-list">
                <For each={visibleCartEntries()}>
                  {([name, measurement]) => (
                    <li>
                      <span>{name}</span>
                      <Amount measurement={measurement} />
                    </li>
                  )}
                </For>
              </ul>
              <Show when={hiddenCartCount() > 0}>
                <p class="planner-shopping-more">
                  + {hiddenCartCount()} more items
                </p>
              </Show>
            </Show>

            <div class="planner-shopping-actions">
              <button
                class="planner-shopping-action"
                type="button"
                onClick={openCart}
              >
                Start Shopping
              </button>
              <button class="planner-shopping-action" type="button">
                <Icon name="intake" />
                Auto Shop
              </button>
            </div>
          </section>
        </div>

        <Show when={touchMove()}>
          {(move) => (
            <div
              class="touch-drag-preview"
              style={{ left: `${move().x}px`, top: `${move().y}px` }}
              aria-hidden="true"
            >
              <Icon name="grip" />
              {move().item.plannedRecipeReference.recipeId.title}
            </div>
          )}
        </Show>
      </Show>

      <Show when={isDayOpen() && planner.data()}>
        <DayDetail
          dateStr={selectedDateStr()}
          plannedDay={selectedDay()}
          recipes={selectedRecipes()}
          onOpenRecipe={openRecipe}
          onOpenAmount={setAmountItem}
          onMoveRecipe={setMoveItem}
          onMoveKeyDown={onMoveKeyDown}
          isLifted={(item) =>
            keyboardMove()?.item.plannedRecipeReference.id ===
            item.plannedRecipeReference.id
          }
          moveLabel={moveLabel}
          registerRow={(item, element) => {
            const id = item.plannedRecipeReference.id;
            mealRows.set(id, element);
            if (pendingMealFocus() === id)
              queueMicrotask(() => {
                element.focus();
                setPendingMealFocus(undefined);
              });
          }}
          touchTargetMealId={touchMove()?.targetMealId}
          touchTargetEndDate={touchMove()?.targetEndDate}
          onTouchMoveStart={startTouchMove}
          onOpenCart={openCart}
          onClose={closeDay}
          onMoveFailure={onPointerMoveFailure}
        />
      </Show>

      <Show when={routeRecipe()}>
        {(item) => (
          <RecipeModal
            item={item()}
            dateStr={selectedDateStr()}
            onClose={closeOverlay}
          />
        )}
      </Show>
      <Show
        when={params.plannedRecipeId && !routeRecipe() && !planner.isLoading()}
      >
        <div class="inline-notice notice-error overlay-route-error">
          <Icon name="warning" />
          That planned recipe is not available.
          <button
            class="button button-secondary"
            type="button"
            onClick={closeOverlay}
          >
            Back to day
          </button>
        </div>
      </Show>
      <Show when={isCartOpen() && planner.data()}>
        <CartModal
          dateStr={selectedDateStr()}
          plannerData={planner.data()!}
          onClose={closeOverlay}
        />
      </Show>
      <Show when={amountItem()}>
        {(item) => (
          <AmountToMakeSurface
            item={item()}
            onClose={() => setAmountItem(undefined)}
          />
        )}
      </Show>
      <Show when={moveItem()}>
        {(item) => (
          <Show when={planner.data()}>
            {(plannerData) => (
              <MoveMealModal
                item={item()}
                dateStr={selectedDateStr()}
                plannerData={plannerData()}
                onMoved={(dateStr, position, total) =>
                  announce(
                    `Moved ${item().plannedRecipeReference.recipeId.title} to ${new Date(dateStr).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}, position ${position} of ${total}.`,
                  )
                }
                onClose={() => setMoveItem(undefined)}
              />
            )}
          </Show>
        )}
      </Show>
    </main>
  );
}
