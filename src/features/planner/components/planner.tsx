import { useLocation, useNavigate, useParams } from "@solidjs/router";
import { For, Show, createMemo, createSignal } from "solid-js";
import { useMutation, useQuery } from "convex-solidjs";
import { projection } from "../logic";
import { today } from "../types";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { fromRouteDate, toRouteDate } from "../utils";
import { DayCell } from "./day_cell";
import { DayDetail } from "./day_detail";
import { AmountToMakeSurface, CartModal, MoveMealModal, RecipeModal } from "./planner_modals";
import { Icon } from "../../../components/ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthGridDays(): Date[] {
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = new Date(today.getFullYear(), today.getMonth(), 1 - first.getDay());
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const end = new Date(today.getFullYear(), today.getMonth(), last.getDate() + (6 - last.getDay()));
  const days: Date[] = [];
  for (let date = new Date(start); date <= end; date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)) days.push(date);
  return days;
}

type KeyboardMove = { item: RecipeProjection; targetDate: string; position: number };

export function Planner() {
  const planner = useQuery(api.data.usersPlanner, {});
  const params = useParams<{ date?: string; plannedRecipeId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const insertBeginning = useMutation(api.planner_exports.InsertRecipeAtBeginningOfDate);
  const moveBefore = useMutation(api.planner_exports.MoveRecipeOnTopOfOtherRecipe);
  const days = monthGridDays();
  const [amountItem, setAmountItem] = createSignal<RecipeProjection>();
  const [moveItem, setMoveItem] = createSignal<RecipeProjection>();
  const [keyboardMove, setKeyboardMove] = createSignal<KeyboardMove>();
  const [moveError, setMoveError] = createSignal("");
  const [pointerRetry, setPointerRetry] = createSignal<(() => Promise<void>)>();
  const [isRetryingMove, setIsRetryingMove] = createSignal(false);
  const dayButtons: HTMLButtonElement[] = [];
  const mealRows = new Map<string, HTMLLIElement>();

  const routeDate = createMemo(() => fromRouteDate(params.date));
  const selectedDate = () => routeDate() ?? today;
  const selectedDateStr = () => selectedDate().toDateString();
  const selectedRecipes = () => projection[selectedDateStr()] ?? [];
  const selectedDay = () => planner.data()?.[selectedDateStr()];
  const isCartOpen = () => location.pathname.endsWith("/cart");
  const routeRecipe = createMemo(() => params.plannedRecipeId ? selectedRecipes().find((item) => item.plannedRecipeReference.id === decodeURIComponent(params.plannedRecipeId!)) : undefined);
  const monthTitle = today.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const selectDay = (date: Date) => navigate(`/planner/day/${toRouteDate(date)}`);
  const openRecipe = (item: RecipeProjection) => navigate(`/planner/day/${toRouteDate(selectedDate())}/recipe/${encodeURIComponent(item.plannedRecipeReference.id)}`);
  const openCart = () => navigate(`/planner/day/${toRouteDate(selectedDate())}/cart`);
  const closeOverlay = () => navigate(`/planner/day/${toRouteDate(selectedDate())}`);
  const cartCount = (dateStr: string) => { const day = planner.data()?.[dateStr]; return day ? Object.keys(day.shoppingCart.toGet).length : undefined; };

  const focusDay = (index: number) => dayButtons[Math.max(0, Math.min(days.length - 1, index))]?.focus();
  const onDayFocusKey = (index: number, event: KeyboardEvent) => {
    let target: number | undefined;
    if (event.key === "ArrowLeft") target = index - 1;
    if (event.key === "ArrowRight") target = index + 1;
    if (event.key === "ArrowUp") target = index - 7;
    if (event.key === "ArrowDown") target = index + 7;
    if (event.key === "Home") target = index - (index % 7);
    if (event.key === "End") target = index + (6 - index % 7);
    if (target !== undefined) { event.preventDefault(); focusDay(target); }
  };

  const targetItems = (move: KeyboardMove) => (projection[move.targetDate] ?? []).filter((item) => item.plannedRecipeReference.id !== move.item.plannedRecipeReference.id);
  const announce = (message: string) => { const live = document.getElementById("app-live-region"); if (live) live.textContent = message; };
  const cancelKeyboardMove = () => {
    const move = keyboardMove();
    setKeyboardMove(undefined);
    if (move) queueMicrotask(() => document.querySelector<HTMLElement>(`[aria-label="Move ${CSS.escape(move.item.plannedRecipeReference.recipeId.title)}"]`)?.focus());
    announce("Move canceled.");
  };
  const dropKeyboardMove = async () => {
    const move = keyboardMove();
    if (!move || !planner.data()?.[move.targetDate]) { setMoveError("Choose a day that exists in the plan."); announce("Move failed. Choose a day that exists in the plan."); return; }
    const targets = targetItems(move);
    try {
      if (move.position === 0 || !targets[move.position - 1]) await insertBeginning.mutate({ recipeId: move.item.plannedRecipeReference.id, toDate: move.targetDate });
      else await moveBefore.mutate({ recipeId: move.item.plannedRecipeReference.id, otherRecipeId: targets[move.position - 1].plannedRecipeReference.id });
      const dateLabel = new Date(move.targetDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
      announce(`Moved ${move.item.plannedRecipeReference.recipeId.title} to ${dateLabel}, position ${move.position + 1}.`);
      setKeyboardMove(undefined);
      window.setTimeout(() => mealRows.get(move.item.plannedRecipeReference.id)?.focus(), 250);
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
      announce(`Lifted ${item.plannedRecipeReference.recipeId.title}. Use Left and Right to change day, Up and Down to change position, Space to drop, or Escape to cancel.`);
      return;
    }
    if (move.item.plannedRecipeReference.id !== item.plannedRecipeReference.id) return;
    if (event.key === "Escape") { event.preventDefault(); cancelKeyboardMove(); return; }
    if (event.key === " " || event.key === "Enter") { event.preventDefault(); void dropKeyboardMove(); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      const date = new Date(move.targetDate); date.setDate(date.getDate() + (event.key === "ArrowLeft" ? -1 : 1));
      setKeyboardMove({ ...move, targetDate: date.toDateString(), position: 0 });
    } else {
      const max = targetItems(move).length;
      setKeyboardMove({ ...move, position: Math.max(0, Math.min(max, move.position + (event.key === "ArrowUp" ? -1 : 1))) });
    }
  };
  const moveLabel = (item: RecipeProjection) => {
    const move = keyboardMove();
    if (!move || move.item.plannedRecipeReference.id !== item.plannedRecipeReference.id) return;
    return `${new Date(move.targetDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}, position ${move.position + 1}`;
  };
  const onPointerMoveFailure = (message: string, retry: () => Promise<void>) => { setMoveError(message); setPointerRetry(() => retry); };
  const retryPointerMove = async () => {
    const retry = pointerRetry();
    if (!retry) return;
    setIsRetryingMove(true);
    try { await retry(); setMoveError(""); setPointerRetry(undefined); announce("Meal moved."); }
    catch { setMoveError("The meal still didn’t move. Try again."); }
    finally { setIsRetryingMove(false); }
  };

  return (
    <main class="main" id="main">
      <header class="page-heading"><div><h1>{monthTitle}</h1><p class="supporting-copy">Plan meals from what is on hand.</p></div></header>
      <Show when={planner.isLoading()}><div aria-live="polite"><p>Loading your meal plan…</p><div class="skeleton skeleton-calendar"/></div></Show>
      <Show when={planner.error()}><div class="empty-state notice-error"><h2>Your meal plan couldn’t load.</h2><button class="button button-secondary" type="button" onClick={planner.refetch}>Try again</button></div></Show>
      <Show when={planner.data()}>
        <Show when={moveError()}><div class="inline-notice notice-error" role="alert"><p>{moveError()}</p><div class="notice-actions"><Show when={pointerRetry()}><button class="button button-secondary" type="button" disabled={isRetryingMove()} onClick={() => void retryPointerMove()}>{isRetryingMove() ? "Retrying…" : "Retry move"}</button></Show><button class="button button-quiet" type="button" onClick={() => { setMoveError(""); setPointerRetry(undefined); }}>Dismiss</button></div></div></Show>
        <div class="planner-layout">
          <section class="calendar-wrap" aria-labelledby="calendar-title">
            <div class="calendar-note"><strong id="calendar-title">Month plan</strong><span>Select a date. Use the Day Ticket for actions.</span></div>
            <table class="calendar" aria-label={`${monthTitle} meal plan`}><thead><tr><For each={WEEKDAYS}>{(weekday) => <th scope="col"><span class="weekday-long">{weekday}</span><span class="weekday-short" aria-hidden="true">{weekday[0]}</span></th>}</For></tr></thead><tbody><For each={Array.from({ length: days.length / 7 }, (_, row) => row)}>{(row) => <tr><For each={days.slice(row * 7, row * 7 + 7)}>{(date, column) => { const index = row * 7 + column(); const dateStr = date.toDateString(); const day = () => planner.data()?.[dateStr]; return <td><DayCell date={date} inMonth={date.getMonth() === today.getMonth()} isToday={dateStr === today.toDateString()} selected={dateStr === selectedDateStr()} recipes={projection[dateStr] ?? []} cartCount={cartCount(dateStr)} peopleCount={day()?.multiplier} onSelectDay={() => selectDay(date)} onFocusKey={(event) => onDayFocusKey(index, event)} registerButton={(element) => { dayButtons[index] = element; }} onMoveFailure={onPointerMoveFailure}/></td>; }}</For></tr>}</For></tbody></table>
          </section>
          <DayDetail dateStr={selectedDateStr()} plannedDay={selectedDay()} recipes={selectedRecipes()} onOpenRecipe={openRecipe} onOpenAmount={setAmountItem} onMoveRecipe={setMoveItem} onMoveKeyDown={onMoveKeyDown} isLifted={(item) => keyboardMove()?.item.plannedRecipeReference.id === item.plannedRecipeReference.id} moveLabel={moveLabel} registerRow={(item, element) => mealRows.set(item.plannedRecipeReference.id, element)} onOpenCart={openCart} onMoveFailure={onPointerMoveFailure}/>
        </div>
      </Show>
      <Show when={routeRecipe()}>{(item) => <RecipeModal item={item()} dateStr={selectedDateStr()} onClose={closeOverlay}/>}</Show>
      <Show when={params.plannedRecipeId && !routeRecipe() && !planner.isLoading()}><div class="inline-notice notice-error overlay-route-error"><Icon name="warning"/>That planned recipe is not available.<button class="button button-secondary" type="button" onClick={closeOverlay}>Back to day</button></div></Show>
      <Show when={isCartOpen() && planner.data()}><CartModal dateStr={selectedDateStr()} plannerData={planner.data()!} onClose={closeOverlay}/></Show>
      <Show when={amountItem()}>{(item) => <AmountToMakeSurface item={item()} onClose={() => setAmountItem(undefined)}/>}</Show>
      <Show when={moveItem()}>{(item) => <Show when={planner.data()}>{(plannerData) => <MoveMealModal item={item()} dateStr={selectedDateStr()} plannerData={plannerData()} onClose={() => setMoveItem(undefined)}/>}</Show>}</Show>
    </main>
  );
}
