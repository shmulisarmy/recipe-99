import { A } from "@solidjs/router";
import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  onMount,
} from "solid-js";
import { Measurement_Convert, type Unit } from "../primitives/measurement";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { BuiltinUnitOptions, Amount, Icon, Overlay, StatusText } from "./ui";
import { Select } from "../features/planner/components/Select";

function IngredientRow(props: { ingredient: Doc<"pantryItems"> }) {
  const updateIngredient = useMutation(
    api.pantry_exports.updateAvailableIngredient,
  );
  const [editing, setEditing] = createSignal(false);
  const [amountDraft, setAmountDraft] = createSignal(
    String(props.ingredient.Measurement.amount),
  );
  const [unitDraft, setUnitDraft] = createSignal<Unit>(
    props.ingredient.Measurement.unit,
  );
  const [fieldError, setFieldError] = createSignal("");
  const [saveError, setSaveError] = createSignal("");
  const [saved, setSaved] = createSignal(false);
  const [conversionOpen, setConversionOpen] = createSignal(false);
  const [convertUnit, setConvertUnit] = createSignal<Unit>(
    props.ingredient.Measurement.unit,
  );
  const [mobileConversion, setMobileConversion] = createSignal(false);
  const conversionId = createUniqueId();
  const conversionTitleId = `${conversionId}-title`;
  let amountInput!: HTMLInputElement;
  let convertButton!: HTMLButtonElement;
  let conversionSelect!: HTMLSelectElement;

  onMount(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateMobileConversion = () => setMobileConversion(media.matches);
    updateMobileConversion();
    media.addEventListener("change", updateMobileConversion);
    onCleanup(() =>
      media.removeEventListener("change", updateMobileConversion),
    );
  });

  createEffect(() => {
    if (editing()) return;
    setAmountDraft(String(props.ingredient.Measurement.amount));
    setUnitDraft(props.ingredient.Measurement.unit);
  });

  const beginEdit = () => {
    setAmountDraft(String(props.ingredient.Measurement.amount));
    setUnitDraft(props.ingredient.Measurement.unit);
    setFieldError("");
    setSaveError("");
    setEditing(true);
    queueMicrotask(() => amountInput.focus());
  };

  const cancelEdit = () => {
    if (updateIngredient.isLoading()) return;
    setEditing(false);
    setFieldError("");
    setSaveError("");
  };

  const saveAmount = async () => {
    const amount = Number(amountDraft());
    if (!amountDraft().trim() || !Number.isFinite(amount) || amount < 0) {
      setFieldError("Enter an amount of 0 or more.");
      amountInput.focus();
      return;
    }
    setFieldError("");
    setSaveError("");
    try {
      await updateIngredient.mutate({
        ingredientName: props.ingredient.name_,
        measurement: { amount, unit: unitDraft() },
      });
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaveError(`Couldn’t save ${props.ingredient.name_}. Try again.`);
    }
  };

  const onEditKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void saveAmount();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancelEdit();
    }
  };

  const convertedPreview = () =>
    Measurement_Convert(props.ingredient.Measurement, convertUnit());
  const openConversion = () => {
    setConvertUnit(props.ingredient.Measurement.unit);
    setConversionOpen(true);
    queueMicrotask(() => conversionSelect?.focus());
  };
  const closeConversion = () => {
    setConversionOpen(false);
    queueMicrotask(() => convertButton?.focus());
  };
  const applyConvert = async () => {
    if (convertUnit() === props.ingredient.Measurement.unit) return;
    setSaveError("");
    try {
      await updateIngredient.mutate({
        ingredientName: props.ingredient.name_,
        measurement: convertedPreview(),
      });
      closeConversion();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaveError(`Couldn’t convert ${props.ingredient.name_}. Try again.`);
    }
  };


  

  return (
    <tr>
      <th scope="row" data-label="Ingredient">
        {props.ingredient.name_}
      </th>
      <td classList={{ "has-editor": editing() }} data-label="Stored amount">
        <Show
          when={editing()}
          fallback={<Amount measurement={props.ingredient.Measurement} />}
        >
          <div class="inline-measurement" onKeyDown={onEditKeyDown}>
            <label class="field">
              <span>Amount</span>
              <input
                ref={amountInput}
                class="input"
                inputmode="decimal"
                value={amountDraft()}
                aria-invalid={!!fieldError()}
                aria-describedby={
                  fieldError()
                    ? `${props.ingredient._id}-amount-error`
                    : undefined
                }
                onInput={(event) => setAmountDraft(event.currentTarget.value)}
              />
            </label>
            <label class="field">
              <span>Unit</span>
           

              {function(){
                            const getCustomUnits = useQuery(api.customUnit_exports.getCustomUnits, {associatedIngredient: props.ingredient.name_})
                          return <Select
                          options={(BuiltinUnitOptions as Unit[]).concat(getCustomUnits.data()?.map(unit => ({type: 'custom', name: unit.unitName, gramsPerUnit: unit.gramsPerUnit})) || [])}
                          toString={(unit) => `${unit.type === 'builtin' ? unit.unit : unit.name}`}  
                          whenSelected={(unit) => setConvertUnit(unit)}
                          />
                        }()}
              
            </label>
          </div>
          <Show when={fieldError()}>
            <p class="field-error" id={`${props.ingredient._id}-amount-error`}>
              {fieldError()}
            </p>
          </Show>
        </Show>
        <Show when={saved()}>
          <StatusText kind="saved" />
        </Show>
        <Show when={saveError()}>
          <p class="field-error" role="alert">
            {saveError()}
          </p>
        </Show>
      </td>
      <td data-label="Actions">
        <div class="row-actions">
          <Show
            when={editing()}
            fallback={
              <>
                <button
                  class="button button-secondary"
                  type="button"
                  aria-label={`Edit ${props.ingredient.name_}`}
                  onClick={beginEdit}
                >
                  <Icon name="edit" />
                  Edit amount
                </button>
                <div class="anchored-control">
                  <button
                    ref={convertButton}
                    class="button button-quiet"
                    type="button"
                    aria-expanded={conversionOpen()}
                    aria-controls={conversionId}
                    onClick={() =>
                      conversionOpen() ? closeConversion() : openConversion()
                    }
                  >
                    Convert unit
                  </button>
                  <Show when={conversionOpen() && !mobileConversion()}>
                    <div
                      id={conversionId}
                      class="popover conversion-popover"
                      role="dialog"
                      aria-labelledby={conversionTitleId}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          closeConversion();
                        }
                      }}
                    >
                      <div class="popover-head">
                        <h3 id={conversionTitleId}>Convert unit</h3>
                        <button
                          class="icon-button"
                          type="button"
                          aria-label="Close unit conversion"
                          onClick={closeConversion}
                        >
                          <Icon name="close" />
                        </button>
                      </div>
                      <p>
                        Current amount:{" "}
                        <Amount measurement={props.ingredient.Measurement} />
                      </p>
                      <label class="field">
                        <span>Target unit</span>

                        {function(){
                            const getCustomUnits = useQuery(api.customUnit_exports.getCustomUnits, {associatedIngredient: props.ingredient.name_})
                          return <Select
                          options={(BuiltinUnitOptions as Unit[]).concat(getCustomUnits.data()?.map(unit => ({type: 'custom', name: unit.unitName, gramsPerUnit: unit.gramsPerUnit})) || [])}
                          toString={(unit) => `${unit.type === 'builtin' ? unit.unit : unit.name}`}  
                          whenSelected={(unit) => setConvertUnit(unit)}
                          />
                        }()}
                        


                      </label>
                      <p class="conversion-preview">
                        <Amount measurement={props.ingredient.Measurement} /> ={" "}
                        <Amount measurement={convertedPreview()} />
                      </p>
                      <p class="helper-text">
                        Conversion keeps the same quantity.
                      </p>
                      <button
                        class="button button-primary"
                        type="button"
                        disabled={
                          convertUnit() === props.ingredient.Measurement.unit ||
                          updateIngredient.isLoading()
                        }
                        onClick={() => void applyConvert()}
                      >
                        {updateIngredient.isLoading()
                          ? "Converting…"
                          : "Convert"}
                      </button>
                    </div>
                  </Show>
                  <Show when={conversionOpen() && mobileConversion()}>
                    <Overlay
                      title="Convert unit"
                      eyebrow={props.ingredient.name_}
                      kind="sheet"
                      onClose={closeConversion}
                      footer={
                        <button
                          class="button button-primary"
                          type="button"
                          disabled={
                            convertUnit() ===
                              props.ingredient.Measurement.unit ||
                            updateIngredient.isLoading()
                          }
                          onClick={() => void applyConvert()}
                        >
                          {updateIngredient.isLoading()
                            ? "Converting…"
                            : "Convert"}
                        </button>
                      }
                    >
                      <div id={conversionId} class="conversion-sheet-content">
                        <p>
                          Current amount:{" "}
                          <Amount measurement={props.ingredient.Measurement} />
                        </p>
                        <label class="field">
                          <span>Target unit</span>
                          {function(){
                            const getCustomUnits = useQuery(api.customUnit_exports.getCustomUnits, {associatedIngredient: props.ingredient.name_})
                          return <Select
                          options={(BuiltinUnitOptions as Unit[]).concat(getCustomUnits.data()?.map(unit => ({type: 'custom', name: unit.unitName, gramsPerUnit: unit.gramsPerUnit})) || [])}
                          toString={(unit) => `${unit.type === 'builtin' ? unit.unit : unit.name}`}
                          whenSelected={(unit) => setConvertUnit(unit)}
                          />
                        }()}
                        </label>
                        <p class="conversion-preview">
                          <Amount measurement={props.ingredient.Measurement} />{" "}
                          = <Amount measurement={convertedPreview()} />
                        </p>
                        <p class="helper-text">
                          Conversion keeps the same quantity.
                        </p>
                      </div>
                    </Overlay>
                  </Show>
                </div>
              </>
            }
          >
            <button
              class="button button-primary"
              type="button"
              disabled={updateIngredient.isLoading()}
              onClick={() => void saveAmount()}
            >
              {updateIngredient.isLoading() ? "Saving…" : "Save amount"}
            </button>
            <button
              class="button button-quiet"
              type="button"
              disabled={updateIngredient.isLoading()}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </Show>
        </div>
      </td>
    </tr>
  );
}

export function InventoryEditor() {
  const pantry = useQuery(api.pantry_exports.getAvailableIngredients, {});
  return (
    <main class="main" id="main">
      <header class="page-heading">
        <div>
          <h1>Pantry</h1>
          <p class="supporting-copy">
            Keep these amounts accurate so recipe readiness stays useful.
          </p>
        </div>
        <A class="button button-primary" href="/intake">
          <Icon name="intake" />
          Add a batch
        </A>
      </header>
      <section class="section" aria-labelledby="pantry-list-title">
        <div class="section-head">
          <div>
            <h2 id="pantry-list-title">Stored ingredients</h2>
            <Show when={pantry.data()}>
              {(items) => (
                <p>
                  {items().length}{" "}
                  {items().length === 1 ? "ingredient" : "ingredients"}
                </p>
              )}
            </Show>
          </div>
        </div>
        <Show when={pantry.isLoading()}>
          <div class="loading-ledger" aria-live="polite">
            <p>Checking your pantry…</p>
            <For each={[1, 2, 3, 4]}>
              {() => <div class="skeleton skeleton-row" />}
            </For>
          </div>
        </Show>
        <Show when={pantry.error()}>
          <div class="empty-state notice-error">
            <h2>Your pantry couldn’t load.</h2>
            <button
              class="button button-secondary"
              type="button"
              onClick={pantry.refetch}
            >
              Try again
            </button>
          </div>
        </Show>
        <Show when={pantry.data() && pantry.data()!.length === 0}>
          <div class="empty-state">
            <Icon name="pantry" />
            <h2>Your pantry is empty.</h2>
            <p>Add a batch to start checking recipes.</p>
            <A class="button button-primary" href="/intake">
              Start intake
            </A>
          </div>
        </Show>
        <Show when={pantry.data() && pantry.data()!.length > 0}>
          <table class="ledger">
            <thead>
              <tr>
                <th scope="col">Ingredient</th>
                <th scope="col">Stored amount</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <For each={pantry.data()}>
                {(ingredient) => <IngredientRow ingredient={ingredient} />}
              </For>
            </tbody>
          </table>
        </Show>
      </section>
    </main>
  );
}
