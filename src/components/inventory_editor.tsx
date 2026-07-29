import { createSignal, For, Show } from "solid-js";
import { reSimulatePlannerProjection } from "../features/planner/logic";
import { Measurement_Convert, Unit } from "../primitives/measurement";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const ALL_UNITS: Unit[] = ["grams", "kilograms", "ounces", "pounds"];

function fmt(n: number): string {
  return parseFloat(n.toPrecision(4)).toString();
}

function IngredientRow(props: { ingredient: Doc<"pantryItems">}) {
  const updateIngredient = useMutation(api.data.updateAvailableIngredient);

  const [amount, setAmount] = createSignal(props.ingredient.Measurement.amount);
  const [targetUnit, setTargetUnit] = createSignal<Unit>(props.ingredient.Measurement.unit);

  const canConvert = () => targetUnit() !== props.ingredient.Measurement.unit;
  const convertedPreview = () =>
    canConvert() ? Measurement_Convert(props.ingredient.Measurement, targetUnit()) : null;

  function applyAmount() {
    const v = amount();
    if (isNaN(v) || v < 0) return;
    
    updateIngredient.mutate({
      ingredientName: props.ingredient.name_,
      measurement: { amount: v, unit: targetUnit() },
    });
  }

  function applyConvert() {
    const converted = convertedPreview();
    if (!converted) return;
    updateIngredient.mutate({
      ingredientName: props.ingredient.name_, 
      measurement: converted,
    });
    setAmount(converted.amount);
    setTargetUnit(converted.unit);
  }

  return (
    <div class="flex flex-col gap-1.5 py-3 border-b border-stone-100 last:border-0">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium capitalize text-stone-700">{props.ingredient.name_}</span>
        {/* Stored value — always visible so the "from" unit is never ambiguous */}
        <span class="text-xs text-stone-400">
          currently&nbsp;
          <span class="font-medium text-stone-500">
            {fmt(props.ingredient.Measurement.amount)} {props.ingredient.Measurement.unit}
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
                {u}{u === targetUnit() ? " ✓" : ""}
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
              `${fmt(props.ingredient.Measurement.amount)} ${props.ingredient.Measurement.unit} → ${fmt(preview().amount)} ${preview().unit}`
            }
          </Show>
        </button>
      </div>
    </div>
  );
}

export function InventoryEditor() {
  const pantry = useQuery(api.data.getAvailableIngredients, {});
  return (
    <div class="mx-auto max-w-lg px-4 py-8">
      <h2 class="mb-1 text-lg font-semibold text-stone-900">Pantry</h2>
      <p class="mb-4 text-sm text-stone-500">
        Edit amounts directly, or pick a unit and click convert to re-express
        the same quantity.
      </p>
      <div class="rounded-2xl bg-white px-4 shadow-sm ring-1 ring-stone-200">
        <For each={pantry.data()}>
          {(name) => <IngredientRow ingredient={name} />}
        </For>
      </div>
    </div>
  );
}
