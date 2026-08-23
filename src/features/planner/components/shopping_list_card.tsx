import { For, Show, createMemo } from "solid-js";
import type { PlannedDay } from "../types";
import {
  Measurement_Divide,
  Measurement_GTE,
  Measurement_Minus,
  ZeroedMeasurement,
} from "../../../primitives/measurement";
import { Amount, Icon } from "../../../components/ui";

const ROWS_SHOWN = 4;

/**
 * The selected day's shopping need, summarised on the planner page: what is
 * still to get, how much of it is already obtained, and the way into the cart.
 */
export function ShoppingListCard(props: {
  dateStr: string;
  plannedDay: PlannedDay | undefined;
  onOpenCart: () => void;
}) {
  const entries = createMemo(() =>
    Object.entries(props.plannedDay?.shoppingCart.toGet ?? {}),
  );
  const longDate = () =>
    new Date(props.dateStr).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
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
    entries().length
      ? Math.round(
          entries().reduce((sum, [name]) => sum + itemPercent(name), 0) /
            entries().length,
        )
      : 100;
  const remaining = () => Math.max(0, entries().length - ROWS_SHOWN);

  return (
    <section class="shopping-card" aria-labelledby="shopping-card-title">
      <header class="shopping-card-head">
        <Icon name="cart" />
        <h2 id="shopping-card-title">Shopping list</h2>
        <span class="shopping-count">
          {entries().length} {entries().length === 1 ? "item" : "items"}
        </span>
      </header>
      <Show
        when={entries().length > 0}
        fallback={
          <p class="shopping-empty">Nothing to buy for {longDate()}.</p>
        }
      >
        <ul class="shopping-rows">
          <For each={entries().slice(0, ROWS_SHOWN)}>
            {([name, measurement]) => (
              <li class="shopping-row">
                <span class="shopping-name">{name}</span>
                <span class="shopping-amount">
                  <Amount measurement={measurement} />
                </span>
              </li>
            )}
          </For>
        </ul>
        <Show when={remaining() > 0}>
          <p class="shopping-more">
            + {remaining()} more {remaining() === 1 ? "item" : "items"}
          </p>
        </Show>
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
      </Show>
      <div class="shopping-actions">
        <button
          class="button button-secondary"
          type="button"
          onClick={props.onOpenCart}
        >
          Start shopping
        </button>
        <a class="button button-secondary" href="/intake">
          <Icon name="sparkle" />
          Scan receipt
        </a>
      </div>
    </section>
  );
}
