import { createSignal, For, Show } from "solid-js";
import { AvailableIngredients } from "../data";
import { reSimulatePlannerProjection } from "../features/planner/logic";
import { Measurement_Convert, Unit } from "../primitives/measurement";

const ALL_UNITS: Unit[] = ["grams", "kilograms", "ounces", "pounds"];

function fmt(n: number): string {
  return parseFloat(n.toPrecision(4)).toString();
}

function IngredientRow(props: { name: string }) {
  const stored = () => AvailableIngredients[props.name];

  const [amount, setAmount] = createSignal(stored().amount);
  const [targetUnit, setTargetUnit] = createSignal<Unit>(stored().unit);

  const canConvert = () => targetUnit() !== stored().unit;
  const convertedPreview = () =>
    canConvert() ? Measurement_Convert(stored(), targetUnit()) : null;

  function applyAmount() {
    const v = amount();
    if (isNaN(v) || v < 0) return;
    AvailableIngredients[props.name] = { amount: v, unit: stored().unit };
    reSimulatePlannerProjection();
  }

  function applyConvert() {
    const converted = convertedPreview();
    if (!converted) return;
    AvailableIngredients[props.name] = converted;
    setAmount(converted.amount);
    setTargetUnit(converted.unit);
    reSimulatePlannerProjection();
  }

  return (
    <div class="flex flex-col gap-1.5 py-3 border-b border-stone-100 last:border-0">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium capitalize text-stone-700">{props.name}</span>
        {/* Stored value — always visible so the "from" unit is never ambiguous */}
        <span class="text-xs text-stone-400">
          currently&nbsp;
          <span class="font-medium text-stone-500">
            {fmt(stored().amount)} {stored().unit}
          </span>
        </span>
      </div>

      <div class="flex items-center gap-2">
        <input
          type="number"
          min="0"
          class="w-24 shrink-0 rounded-md border border-stone-200 px-2 py-1 text-sm text-right focus:border-stone-400 focus:outline-none"
          value={amount()}
          onInput={(e) => setAmount(parseFloat(e.currentTarget.value))}
          onBlur={applyAmount}
          onKeyDown={(e) => e.key === "Enter" && applyAmount()}
        />

        <select
          class="rounded-md border border-stone-200 px-2 py-1 text-sm focus:border-stone-400 focus:outline-none"
          value={targetUnit()}
          onChange={(e) => setTargetUnit(e.currentTarget.value as Unit)}
        >
          <For each={ALL_UNITS}>
            {(u) => (
              <option value={u}>
                {u}{u === stored().unit ? " ✓" : ""}
              </option>
            )}
          </For>
        </select>

        <button
          type="button"
          disabled={!canConvert()}
          class="shrink-0 rounded-md px-3 py-1 text-xs font-medium transition-colors"
          classList={{
            "bg-stone-800 text-white hover:bg-stone-700 cursor-pointer": canConvert(),
            "bg-stone-100 text-stone-400 cursor-not-allowed": !canConvert(),
          }}
          onClick={applyConvert}
        >
          <Show
            when={convertedPreview()}
            fallback="convert"
          >
            {(preview) =>
              `${fmt(stored().amount)} ${stored().unit} → ${fmt(preview().amount)} ${preview().unit}`
            }
          </Show>
        </button>
      </div>
    </div>
  );
}

export function InventoryEditor() {
  return (
    <div class="mx-auto max-w-lg px-4 py-8">
      <h2 class="mb-1 text-lg font-semibold text-stone-900">Pantry</h2>
      <p class="mb-4 text-sm text-stone-500">
        Edit amounts directly, or pick a unit and click convert to re-express
        the same quantity.
      </p>
      <div class="rounded-2xl bg-white px-4 shadow-sm ring-1 ring-stone-200">
        <For each={Object.keys(AvailableIngredients)}>
          {(name) => <IngredientRow name={name} />}
        </For>
      </div>
    </div>
  );
}
