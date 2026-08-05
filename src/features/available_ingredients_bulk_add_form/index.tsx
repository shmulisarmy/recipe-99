import { For, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Measurement_GTE, Measurement_Min, Measurement_Minus, type Measurement, type Unit, ZeroedMeasurement } from "../../primitives/measurement";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../../convex/_generated/api";
import type { AvailableIngredientsBulkAddFormProps, ShoppingCartAlreadyGotDraft } from "./types";
import { ALL_UNITS, Amount, Icon } from "../../components/ui";
import { today } from "../planner/outside_feature_exports";

type IntakeRow = {
  id: string;
  name: string;
  amount: string;
  unit: Unit;
  nameError: string;
  amountError: string;
  cartSelected: boolean;
};

const newId = () => crypto.randomUUID();

export function AvailableIngredientsBulkAddForm(props: AvailableIngredientsBulkAddFormProps) {
  const initialRows = Object.entries(structuredClone(props.ingredientsToAdd)).map(([name, measurement]) => ({ id: newId(), name, amount: String(measurement.amount), unit: measurement.unit, nameError: "", amountError: "", cartSelected: false }));
  const [rows, setRows] = createStore<IntakeRow[]>(initialRows.length ? initialRows : [{ id: newId(), name: "", amount: "", unit: "grams", nameError: "", amountError: "", cartSelected: false }]);
  const [isAddingIngredient, setIsAddingIngredient] = createSignal(false);
  const [newName, setNewName] = createSignal("");
  const [newAmount, setNewAmount] = createSignal("1");
  const [newUnit, setNewUnit] = createSignal<Unit>("grams");
  const [newNameError, setNewNameError] = createSignal("");
  const [newAmountError, setNewAmountError] = createSignal("");
  const [submitError, setSubmitError] = createSignal("");
  const addPantryBatch = useMutation(api.data.AvailableIngredientsBulkAdd);
  const planner = useQuery(api.data.usersPlanner, {});
  let newNameInput!: HTMLInputElement;
  let newAmountInput!: HTMLInputElement;

  const plannedToday = () => planner.data()?.[today.toDateString()];
  const allocationFor = (row: IntakeRow): Measurement | undefined => {
    const name = row.name.trim().toLowerCase();
    const target = plannedToday()?.shoppingCart.toGet[name];
    if (!target) return;
    const amount = Number(row.amount);
    if (!Number.isFinite(amount) || amount < 0) return;
    const already = plannedToday()?.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement();
    if (Measurement_GTE(already, target)) return;
    return Measurement_Min(Measurement_Minus(target, already), { amount, unit: row.unit });
  };

  const normalizeRowName = (index: number) => {
    const name = rows[index].name.trim().toLowerCase();
    const duplicate = rows.some((row, candidate) => candidate !== index && row.name.trim().toLowerCase() === name && name !== "");
    setRows(index, "name", name);
    setRows(index, "nameError", !name ? "Enter an ingredient name." : duplicate ? `${name} is already in this batch.` : "");
    if (!allocationFor(rows[index])) setRows(index, "cartSelected", false);
  };

  const validateAmount = (index: number) => {
    const amount = Number(rows[index].amount);
    setRows(index, "amountError", !rows[index].amount.trim() || !Number.isFinite(amount) || amount < 0 ? "Enter an amount of 0 or more." : "");
    if (!allocationFor(rows[index])) setRows(index, "cartSelected", false);
  };

  const validateRows = () => {
    rows.forEach((_, index) => { normalizeRowName(index); validateAmount(index); });
    return rows.length > 0 && rows.every((row) => !row.nameError && !row.amountError && !!row.name.trim());
  };

  const removeIngredient = (index: number) => setRows(rows.filter((_, candidate) => candidate !== index));
  const openAddIngredient = () => { setIsAddingIngredient(true); queueMicrotask(() => newNameInput.focus()); };
  const closeAddIngredient = () => { setIsAddingIngredient(false); setNewName(""); setNewAmount("1"); setNewUnit("grams"); setNewNameError(""); setNewAmountError(""); };
  const addIngredient = () => {
    const name = newName().trim().toLowerCase();
    const amount = Number(newAmount());
    const nameError = !name ? "Enter an ingredient name." : rows.some((row) => row.name.trim().toLowerCase() === name) ? `${name} is already in this batch.` : "";
    const amountError = !newAmount().trim() || !Number.isFinite(amount) || amount < 0 ? "Enter an amount of 0 or more." : "";
    setNewNameError(nameError);
    setNewAmountError(amountError);
    if (nameError) { newNameInput.focus(); return; }
    if (amountError) { newAmountInput.focus(); return; }
    setRows(rows.length, { id: newId(), name, amount: newAmount(), unit: newUnit(), nameError: "", amountError: "", cartSelected: false });
    closeAddIngredient();
  };

  const submitIngredients = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!validateRows()) {
      queueMicrotask(() => document.querySelector<HTMLElement>(".intake-row [aria-invalid='true']")?.focus());
      return;
    }
    setSubmitError("");
    const ingredientsToAdd = rows.map((row) => ({ name: row.name.trim().toLowerCase(), Measurement: { amount: Number(row.amount), unit: row.unit } }));
    try {
      await addPantryBatch.mutate({ ingredientsToAdd });
      const allocations: ShoppingCartAlreadyGotDraft = {};
      for (const row of rows) {
        const allocation = allocationFor(row);
        if (row.cartSelected && allocation) allocations[row.name.trim().toLowerCase()] = allocation;
      }
      props.onComplete({ allocations });
    } catch {
      setSubmitError("The pantry wasn’t updated. Try again.");
    }
  };

  return (
    <main class="main workspace-narrow" id="main">
      <div class="stepper" aria-label="Intake progress"><div class="step active" aria-current="step">1 Review ingredients</div><div class="step">2 Reconcile today’s cart</div></div>
      <header class="page-heading"><div><h1>Add a batch</h1><p class="supporting-copy">Review what came into the kitchen before updating the pantry.</p></div></header>
      <form onSubmit={submitIngredients} novalidate>
        <div class="intake-list">
          <For each={rows}>{(row, index) => (
            <div class="intake-row">
              <label class="field ingredient-field"><span>Ingredient</span><input class="input" value={row.name} aria-invalid={!!row.nameError} aria-describedby={row.nameError ? `${row.id}-name-error` : undefined} onInput={(event) => setRows(index(), "name", event.currentTarget.value)} onBlur={() => normalizeRowName(index())}/><Show when={row.nameError}><span class="field-error" id={`${row.id}-name-error`}>{row.nameError}</span></Show></label>
              <label class="field"><span>Amount</span><input class="input" inputmode="decimal" value={row.amount} aria-invalid={!!row.amountError} aria-describedby={row.amountError ? `${row.id}-amount-error` : undefined} onInput={(event) => setRows(index(), "amount", event.currentTarget.value)} onBlur={() => validateAmount(index())}/><Show when={row.amountError}><span class="field-error" id={`${row.id}-amount-error`}>{row.amountError}</span></Show></label>
              <label class="field"><span>Unit</span><select class="select" value={row.unit} onChange={(event) => { setRows(index(), "unit", event.currentTarget.value as Unit); if (!allocationFor(rows[index()])) setRows(index(), "cartSelected", false); }}><For each={ALL_UNITS}>{(unit) => <option value={unit}>{unit}</option>}</For></select></label>
              <div class="remove-control"><button class="button button-quiet" type="button" aria-label={`Remove ${row.name || "ingredient"}`} onClick={() => removeIngredient(index())}>Remove</button></div>
              <Show when={allocationFor(row)}>{(allocation) => <label class="cart-match"><input type="checkbox" checked={row.cartSelected} onChange={(event) => setRows(index(), "cartSelected", event.currentTarget.checked)}/><span>Count up to <Amount measurement={allocation()}/> toward today’s cart</span></label>}</Show>
            </div>
          )}</For>
        </div>
        <Show when={rows.length === 0}><div class="empty-state"><h2>No ingredients in this batch.</h2><p>Add an ingredient before updating the pantry.</p></div></Show>
        <Show when={isAddingIngredient()}>
          <div class="add-ingredient-panel" role="dialog" aria-label="Add ingredient" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addIngredient(); } if (event.key === "Escape") closeAddIngredient(); }}>
            <div class="popover-head"><h2>Add ingredient</h2><button class="icon-button" type="button" aria-label="Close add ingredient" onClick={closeAddIngredient}><Icon name="close"/></button></div>
            <div class="add-ingredient-fields"><label class="field ingredient-field"><span>Name</span><input ref={newNameInput} class="input" value={newName()} aria-invalid={!!newNameError()} aria-describedby={newNameError() ? "new-ingredient-name-error" : undefined} onInput={(event) => { setNewName(event.currentTarget.value); setNewNameError(""); }}/><Show when={newNameError()}><span class="field-error" id="new-ingredient-name-error">{newNameError()}</span></Show></label><label class="field"><span>Amount</span><input ref={newAmountInput} class="input" inputmode="decimal" value={newAmount()} aria-invalid={!!newAmountError()} aria-describedby={newAmountError() ? "new-ingredient-amount-error" : undefined} onInput={(event) => { setNewAmount(event.currentTarget.value); setNewAmountError(""); }}/><Show when={newAmountError()}><span class="field-error" id="new-ingredient-amount-error">{newAmountError()}</span></Show></label><label class="field"><span>Unit</span><select class="select" value={newUnit()} onChange={(event) => setNewUnit(event.currentTarget.value as Unit)}><For each={ALL_UNITS}>{(unit) => <option value={unit}>{unit}</option>}</For></select></label></div>
            <button class="button button-primary" type="button" onClick={addIngredient}>Add ingredient</button>
          </div>
        </Show>
        <Show when={submitError()}><p class="inline-notice notice-error" role="alert">{submitError()}</p></Show>
        <div class="form-actions"><button class="button button-secondary" type="button" onClick={openAddIngredient}><Icon name="plus"/>Add ingredient</button><button class="button button-primary" type="submit" disabled={addPantryBatch.isLoading() || rows.length === 0}>{addPantryBatch.isLoading() ? "Adding to pantry…" : "Add to pantry"}</button></div>
      </form>
    </main>
  );
}
