import { createSignal, For, Show } from "solid-js";
import { projection } from "../logic";
import { PlannerType, UsersPlannerQueryResult } from "../data";
import { today } from "../types";
import { RecipeModal, CartModal } from "./planner_modals";
import { DayCell } from "./day_cell";
import { DayDetail } from "./day_detail";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex-solidjs";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** All days of the current month's full weeks (leading/trailing out-of-month included). */
function monthGridDays(): Date[] {
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    1 - firstOfMonth.getDay()
  );
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const end = new Date(
    today.getFullYear(),
    today.getMonth(),
    lastOfMonth.getDate() + (6 - lastOfMonth.getDay())
  );
  const days: Date[] = [];
  for (
    let d = new Date(start);
    d.getTime() <= end.getTime();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
  ) {
    days.push(d);
  }
  return days;
}

/** Cart entry count per planner day, keyed by the planner map's key `toDateString()`. */
// function cartCounts(): Map<string, number> {
//   const counts = new Map<string, number>();
//   for (const [date, plannedDay] of Object.entries(planner)) {
//     counts.set(date, Object.keys(plannedDay.shoppingCart.toGet).length);
//   }
//   return counts;
// }

export function Planner() {
  // Static data — compute the projection once.
  // const carts = cartCounts();
  const planner = useQuery(api.data.usersPlanner, {})
  const days = monthGridDays();
  const todayStr = today.toDateString();

  const [openRecipe, setOpenRecipe] = createSignal<RecipeProjection | null>(null);
  const [openCartDay, setOpenCartDay] = createSignal<string | null>(null);
  const [selectedDay, setSelectedDay] = createSignal<string>(todayStr);


//   function addToCart(day: string, ingredient: string, measurement: Measurement) { 
//     const cart = carts.get(day) ?? new Map<string, Measurement>();
//     cart.set(ingredient, measurement);
//     carts.set(day, cart);
//   }

  const monthTitle = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <Show when={planner.data()}>
      {(plannerData) => (
      <div class="min-h-screen bg-stone-50">
      <div class="mx-auto max-w-6xl px-4 py-8">
        {/* Calendar header */}
        <header class="mb-4">
          <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
            {monthTitle}
          </h1>
          <p class="text-sm text-stone-500">
            Green means you'll have the ingredients that day; red means you
            won't.
          </p>
        </header>

        {/* Weekday header row */}
        <div class="grid grid-cols-7">
          <For each={WEEKDAYS}>
            {(day) => (
              <div class="py-2 text-center text-xs font-medium uppercase tracking-wide text-stone-500">
                {day}
              </div>
            )}
          </For>
        </div>

        {/* Month grid */}
        <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
          <div class="grid grid-cols-7">
            <For each={days}>
              {(date) => {
                const dateStr = date.toDateString();
                return (
                  <DayCell
                    date={date}
                    inMonth={date.getMonth() === today.getMonth()}
                    isToday={dateStr === todayStr}
                    selected={selectedDay() === dateStr}
                    recipes={projection[dateStr] ?? []}
                    cartCount={plannerData()[dateStr]? Object.keys(plannerData()[dateStr].shoppingCart.toGet).length: undefined} 
                    onSelectDay={() => setSelectedDay(dateStr)}
                    onOpenRecipe={(item) => setOpenRecipe(item)}
                    onOpenCart={() => setOpenCartDay(dateStr)}
                  />
                );
              }}
            </For>
          </div>
        </div>

        {/* Mobile day-detail panel */}
        <DayDetail
          dateStr={selectedDay()}
          recipes={projection[selectedDay()] ?? []}
          cartCount={plannerData()[selectedDay()] ? Object.keys(plannerData()[selectedDay()].shoppingCart.toGet).length : undefined}
          onOpenRecipe={(item) => setOpenRecipe(item)}
          onOpenCart={() => setOpenCartDay(selectedDay())}
        />
      </div>

      {/* Modals */}
      <Show when={openRecipe()}>
        {(item) => <RecipeModal item={item()} onClose={() => setOpenRecipe(null)} />}
      </Show>
      <Show when={openCartDay()}>
        {(dateStr) => (
          <CartModal dateStr={dateStr()} onClose={() => setOpenCartDay(null)} plannerData={plannerData()} />
        )}
      </Show>
    </div>
      )}
    </Show>
  );
}
