import { createSignal } from "solid-js";
import { projection } from "../logic";
import { today } from "../types";
import type { RecipeProjection } from "./types";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex-solidjs";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type OpenRecipe = {
  item: RecipeProjection;
  dateStr: string;
};

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

  const [openRecipe, setOpenRecipe] = createSignal<OpenRecipe | null>(null);
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

  function selectDay(dateStr: string) {
    setSelectedDay(dateStr);
  }

  function openRecipeForDay(item: RecipeProjection, dateStr: string) {
    setOpenRecipe({ item, dateStr });
  }

  function openCart(dateStr: string) {
    setOpenCartDay(dateStr);
  }

  function closeRecipe() {
    setOpenRecipe(null);
  }

  function closeCart() {
    setOpenCartDay(null);
  }

  function cartCount(dateStr: string) {
    const day = planner.data()?.[dateStr];
    return day ? Object.keys(day.shoppingCart.toGet).length : undefined;
  }

  void projection;
  void days;
  void WEEKDAYS;
  void openRecipe;
  void openCartDay;
  void selectedDay;
  void monthTitle;
  void selectDay;
  void openRecipeForDay;
  void openCart;
  void closeRecipe;
  void closeCart;
  void cartCount;

  return (<></>);
}
