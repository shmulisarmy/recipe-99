import { useBeforeLeave } from "@solidjs/router";
import { For, Show, createMemo, createSignal, type JSX } from "solid-js";
import type { IngredientSet } from "../../../data";
import {
  Measurement_Divide,
  Measurement_GTE,
  Measurement_Minus,
  Measurement_Plus,
  type Measurement,
  type Unit,
  ZeroedMeasurement,
} from "../../../primitives/measurement";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex-solidjs";
import type { PlannerType } from "../data";
import type { RecipeProjection } from "./types";
import { toRouteDate } from "../utils";
import { ALL_UNITS, Amount, ConfirmDialog, Icon, Overlay, StatusText } from "../../../components/ui";

function longDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function AmountToMakeSurface(props: { item: RecipeProjection; onClose: () => void }) {
  const initialOverride = props.item.plannedRecipeReference.overrideDayMultiplier;
  const [draft, setDraft] = createSignal(String(initialOverride ?? props.item.dayMultiplier));
  const [error, setError] = createSignal("");
  const [notice, setNotice] = createSignal("");
  const [saving, setSaving] = createSignal(false);
  const updateMultiplier = useMutation(api.planner_exports.updateRecipeOverrideMultiplier);
  const recipeId = () => props.item.plannedRecipeReference.id;

  const save = async (event: SubmitEvent) => {
    event.preventDefault();
    const multiplier = Number(draft());
    if (!draft().trim() || !Number.isFinite(multiplier) || multiplier <= 0) { setError("Enter an amount greater than 0."); return; }
    setSaving(true); setError(""); setNotice("");
    try { await updateMultiplier.mutate({ recipeId: recipeId(), multiplier }); setNotice("Amount updated."); window.setTimeout(props.onClose, 500); }
    catch { setError("Couldn’t update the amount. Try again."); }
    finally { setSaving(false); }
  };
  const useDefault = async () => {
    setSaving(true); setError(""); setNotice("");
    try { await updateMultiplier.mutate({ recipeId: recipeId(), multiplier: null }); setNotice("Using the day default."); setDraft(String(props.item.dayMultiplier)); window.setTimeout(props.onClose, 650); }
    catch { setError("Couldn’t update the amount. Try again."); }
    finally { setSaving(false); }
  };

  return (
    <Overlay kind="sheet" title="Amount to make" eyebrow={props.item.plannedRecipeReference.recipeId.title} onClose={props.onClose}>
      <form class="amount-form" onSubmit={save}>
        <p>{initialOverride === undefined ? `Using the day amount: ${props.item.dayMultiplier} people.` : `This meal overrides the day amount of ${props.item.dayMultiplier} people.`}</p>
        <label class="field"><span>People</span><input class="input" inputmode="decimal" value={draft()} aria-invalid={!!error()} onInput={(event) => setDraft(event.currentTarget.value)}/></label>
        <Show when={error()}><p class="field-error" role="alert">{error()}</p></Show><Show when={notice()}><p class="inline-notice notice-success" role="status">{notice()}</p></Show>
        <div class="form-actions"><Show when={initialOverride !== undefined}><button class="button button-quiet" type="button" disabled={saving()} onClick={() => void useDefault()}>Use day default</button></Show><button class="button button-primary" type="submit" disabled={saving()}>{saving() ? "Saving…" : "Save amount"}</button></div>
      </form>
    </Overlay>
  );
}

export function RecipeModal(props: { item: RecipeProjection; dateStr: string; onClose: () => void }): JSX.Element {
  const recipeId = () => props.item.plannedRecipeReference.recipeId;
  const [amountOpen, setAmountOpen] = createSignal(false);
  const [isAdding, setIsAdding] = createSignal(false);
  const [added, setAdded] = createSignal(false);
  const [addError, setAddError] = createSignal("");
  const recipe = useQuery(api.data.getRecipeByTitle, () => ({ recipeTitle: recipeId().title, version: recipeId().version }));
  const addIngredientsToCart = useMutation(api.planner_exports.BulkUpdateCartToGet);
  const coveredEntries = () => Object.entries(props.item.scratchPadOfIngredientsNeededToUse);

  const addMissing = async () => {
    const ingredients: IngredientSet = {};
    for (const item of props.item.unfulfilledIngredients) {
      const missing = Measurement_Minus(item.RequiredIngredient.Measurement, item.have);
      ingredients[item.RequiredIngredient.name] = ingredients[item.RequiredIngredient.name] ? Measurement_Plus(ingredients[item.RequiredIngredient.name], missing) : missing;
    }
    setIsAdding(true); setAddError(""); setAdded(false);
    try { await addIngredientsToCart.mutate({ date: props.dateStr, ingredients }); setAdded(true); }
    catch { setAddError("Couldn’t add the missing ingredients. Try again."); }
    finally { setIsAdding(false); }
  };

  return (
    <>
      <Overlay
        kind="inspection"
        title={recipeId().title}
        eyebrow={`${longDay(props.dateStr)} · ${props.item.multiplier} people`}
        onClose={props.onClose}
        footer={<button class="button button-secondary" type="button" onClick={props.onClose}>Close</button>}
      >
        <div class="section-head"><Show when={props.item.couldMake} fallback={<StatusText kind="missing"/>}><StatusText kind="ready"/></Show><button class="button button-secondary" type="button" onClick={() => setAmountOpen(true)}>Amount to make, {props.item.multiplier}</button></div>
        <Show when={recipe.isLoading()}><p>Checking the projected pantry…</p></Show>
        <Show when={recipe.error()}><div class="inline-notice notice-error"><p>Recipe details couldn’t load.</p><button class="button button-secondary" type="button" onClick={recipe.refetch}>Try again</button></div></Show>
        <Show when={recipe.data()}>{(recipeData) => <p class="recipe-detail-description">{recipeData().description}</p>}</Show>
        <details class="disclosure" open><summary>What this meal uses</summary><p>Amounts include the active serving amount for this planned meal.</p></details>
        <Show when={coveredEntries().length > 0}><section class="ingredient-group ready"><h3>Covered</h3><For each={coveredEntries()}>{([name, measurement]) => <div class="ingredient-line"><strong>{name}</strong><span>Use <Amount measurement={measurement}/></span><Show when={Object.values(props.item.substitutedIngredientUses).includes(name)}><span>Substitute</span></Show></div>}</For></section></Show>
        <Show when={Object.keys(props.item.substitutedIngredientUses).length > 0}><section class="ingredient-group"><h3>Substitutions</h3><For each={Object.entries(props.item.substitutedIngredientUses)}>{([primary, substitute]) => <p>Use {substitute} instead of {primary}.</p>}</For></section></Show>
        <Show when={props.item.unfulfilledIngredients.length > 0}><section class="ingredient-group missing"><h3>Still needed</h3><For each={props.item.unfulfilledIngredients}>{(item) => { const missing = () => Measurement_Minus(item.RequiredIngredient.Measurement, item.have); return <div class="ingredient-line"><strong>{item.RequiredIngredient.name}</strong><span>Need <Amount measurement={item.RequiredIngredient.Measurement}/></span><span>Available <Amount measurement={item.have}/></span><span>Missing <Amount measurement={missing()}/></span></div>; }}</For></section></Show>
        <Show when={!props.item.couldMake}>
          <div class="missing-cart-action"><button class="button button-primary" type="button" disabled={isAdding() || added()} onClick={() => void addMissing()}>{isAdding() ? "Adding missing ingredients…" : added() ? "Added to this day’s cart" : "Add missing ingredients to cart"}</button><Show when={added()}><p class="inline-notice notice-success" role="status">Added to this day’s cart.</p></Show><Show when={addError()}><p class="field-error" role="alert">{addError()}</p></Show></div>
        </Show>
      </Overlay>
      <Show when={amountOpen()}><AmountToMakeSurface item={props.item} onClose={() => setAmountOpen(false)}/></Show>
    </>
  );
}

export function MoveMealModal(props: { item: RecipeProjection; dateStr: string; plannerData: PlannerType; onMoved: (dateStr: string, position: number, total: number) => void; onClose: () => void }) {
  const [targetDate, setTargetDate] = createSignal(props.dateStr);
  const [position, setPosition] = createSignal("first");
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const insertBeginning = useMutation(api.planner_exports.InsertRecipeAtBeginningOfDate);
  const moveBefore = useMutation(api.planner_exports.MoveRecipeOnTopOfOtherRecipe);
  const selectedDay = () => props.plannerData[targetDate()];
  const targetMeals = () => selectedDay()?.recipes.filter((recipe) => recipe.id !== props.item.plannedRecipeReference.id) ?? [];
  const routeDates = () => Array.from({ length: 7 }, (_, index) => { const date = new Date(props.dateStr); date.setDate(date.getDate() + index - 3); return date; });

  const move = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!selectedDay()) { setError("Choose a day that is available in this plan."); return; }
    setSaving(true); setError("");
    try {
      if (position() === "first") await insertBeginning.mutate({ recipeId: props.item.plannedRecipeReference.id, toDate: targetDate() });
      else await moveBefore.mutate({ recipeId: props.item.plannedRecipeReference.id, otherRecipeId: position() });
      const targetPosition = position() === "first" ? 1 : targetMeals().findIndex((meal) => meal.id === position()) + 1;
      props.onMoved(targetDate(), targetPosition, targetMeals().length + 1);
      props.onClose();
    } catch { setError("Couldn’t move the meal. Try again."); }
    finally { setSaving(false); }
  };

  return (
    <Overlay kind="compact" title="Move meal" eyebrow={props.item.plannedRecipeReference.recipeId.title} onClose={props.onClose}>
      <form class="move-form" onSubmit={move}>
        <fieldset class="date-strip"><legend>Choose a day</legend><For each={routeDates()}>{(date) => { const key = date.toDateString(); return <button class="date-choice" classList={{ selected: targetDate() === key }} type="button" disabled={!props.plannerData[key]} onClick={() => { setTargetDate(key); setPosition("first"); }}><span>{date.toLocaleDateString(undefined, { weekday: "short" })}</span><strong>{date.getDate()}</strong></button>; }}</For></fieldset>
        <label class="field"><span>Date</span><input class="input" type="date" value={toRouteDate(new Date(targetDate()))} onChange={(event) => { const value = event.currentTarget.valueAsDate; if (value) { setTargetDate(new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()).toDateString()); setPosition("first"); } }}/></label>
        <fieldset class="radio-list"><legend class="field-label">Position</legend><label><input type="radio" name="move-position" value="first" checked={position() === "first"} onChange={() => setPosition("first")}/>First</label><For each={targetMeals()}>{(meal) => <label><input type="radio" name="move-position" value={meal.id} checked={position() === meal.id} onChange={() => setPosition(meal.id)}/>Before {meal.recipeId.title}</label>}</For></fieldset>
        <Show when={error()}><p class="field-error" role="alert">{error()}</p></Show>
        <div class="form-actions"><button class="button button-secondary" type="button" onClick={props.onClose}>Cancel</button><button class="button button-primary" type="submit" disabled={saving()}>{saving() ? "Moving…" : "Move meal"}</button></div>
      </form>
    </Overlay>
  );
}

export function CartModal(props: { dateStr: string; onClose: () => void; plannerData: PlannerType }): JSX.Element {
  type MeasurementDraft = { amount: string; unit: Unit };
  const [drafts, setDrafts] = createSignal<Record<string, MeasurementDraft>>({});
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal("");
  const [saved, setSaved] = createSignal(false);
  const [confirmOpen, setConfirmOpen] = createSignal(false);
  let pendingNavigation: (() => void) | undefined;
  const saveCart = useMutation(api.planner_exports.BulkSetCartToGet);
  const plannedDay = () => props.plannerData[props.dateStr];
  const entries = () => Object.entries(plannedDay()?.shoppingCart.toGet ?? {});
  const hasDrafts = () => Object.keys(drafts()).length > 0;
  const beginEdit = (name: string, measurement: Measurement) => setDrafts((current) => current[name] ? current : { ...current, [name]: { amount: String(measurement.amount), unit: measurement.unit } });
  const updateDraft = (name: string, update: Partial<MeasurementDraft>) => setDrafts((current) => ({ ...current, [name]: { ...current[name], ...update } }));
  const alreadyGot = (name: string) => plannedDay()?.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement();
  const percent = (name: string, target: Measurement) => {
    if (target.amount === 0 || Measurement_GTE(alreadyGot(name), target)) return 100;
    const covered = Measurement_Minus(target, Measurement_Minus(target, alreadyGot(name)));
    return Math.min(100, Math.max(0, Math.round(Measurement_Divide(covered, target.amount).amount * 100)));
  };
  const completedCount = () => entries().filter(([name, target]) => percent(name, target) === 100).length;

  const requestClose = () => { if (hasDrafts()) setConfirmOpen(true); else props.onClose(); };
  useBeforeLeave((event) => {
    if (!hasDrafts() || event.defaultPrevented) return;
    event.preventDefault();
    pendingNavigation = () => event.retry(true);
    setConfirmOpen(true);
  });
  const discard = () => {
    setDrafts({}); setErrors({}); setConfirmOpen(false);
    const retry = pendingNavigation; pendingNavigation = undefined;
    if (retry) retry(); else props.onClose();
  };
  const keepEditing = () => { pendingNavigation = undefined; setConfirmOpen(false); };

  const save = async () => {
    const nextErrors: Record<string, string> = {};
    const ingredients = Object.entries(drafts()).map(([name, draft]) => {
      const amount = Number(draft.amount);
      if (!draft.amount.trim() || !Number.isFinite(amount) || amount < 0) nextErrors[name] = "Enter a valid amount of 0 or more.";
      return { name, measurement: { amount, unit: draft.unit } };
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { queueMicrotask(() => document.querySelector<HTMLElement>(".cart-row [aria-invalid='true']")?.focus()); return; }
    setIsSaving(true); setSaveError(""); setSaved(false);
    try { await saveCart.mutate({ date: props.dateStr, ingredients }); setDrafts({}); setSaved(true); window.setTimeout(() => setSaved(false), 1800); }
    catch { setSaveError("Couldn’t save the shopping amounts. Try again."); }
    finally { setIsSaving(false); }
  };

  const footer = () => hasDrafts() ? <><p class="unsaved-count">{Object.keys(drafts()).length} unsaved {Object.keys(drafts()).length === 1 ? "change" : "changes"}</p><button class="button button-secondary" type="button" disabled={isSaving()} onClick={() => { setDrafts({}); setErrors({}); }}>Cancel edits</button><button class="button button-primary" type="button" disabled={isSaving()} onClick={() => void save()}>{isSaving() ? "Saving changes…" : "Save changes"}</button></> : <button class="button button-secondary" type="button" onClick={requestClose}>Close</button>;

  return (
    <>
      <Overlay kind="transaction" title={`Shopping for ${longDay(props.dateStr)}`} eyebrow={`${completedCount()} of ${entries().length} items complete`} onClose={requestClose} onEscape={requestClose} footer={footer()} wide={hasDrafts()}>
        <Show when={plannedDay()} fallback={<div class="empty-state"><h3>Nothing to buy for this day.</h3></div>}>
          <Show when={entries().length > 0} fallback={<div class="empty-state"><Icon name="cart"/><h3>Nothing to buy for this day.</h3></div>}>
            <div class="cart-list"><For each={entries()}>{([name, target]) => {
              const draft = () => drafts()[name]; const rowPercent = () => percent(name, target);
              return <section class="cart-row" aria-labelledby={`${name}-cart-title`}><div class="cart-row-head"><h3 id={`${name}-cart-title`}>{name}</h3><strong class="value">{rowPercent()}%</strong></div><div class="cart-values"><span>To get <Amount measurement={target}/></span><span>Obtained <Amount measurement={alreadyGot(name)}/></span></div><div class="progress" role="progressbar" aria-label={`${name} shopping progress`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={rowPercent()}><span style={{ width: `${rowPercent()}%` }}/></div>
                <Show when={draft()} fallback={<button class="button button-quiet edit-target" type="button" onClick={() => beginEdit(name, target)}><Icon name="edit"/>Edit target amount</button>}>
                  {(activeDraft) => <div class="draft-editor"><span class="draft-original"><Amount measurement={target}/></span><Icon name="arrow-right"/><label class="field"><span>Amount</span><input class="input" inputmode="decimal" value={activeDraft().amount} aria-invalid={!!errors()[name]} aria-describedby={errors()[name] ? `${name}-draft-error` : undefined} onInput={(event) => updateDraft(name, { amount: event.currentTarget.value })}/></label><label class="field"><span>Unit</span><select class="select" value={activeDraft().unit} onChange={(event) => updateDraft(name, { unit: event.currentTarget.value as Unit })}><For each={ALL_UNITS}>{(unit) => <option value={unit}>{unit}</option>}</For></select></label><Show when={errors()[name]}><p class="field-error" id={`${name}-draft-error`}>{errors()[name]}</p></Show></div>}
                </Show>
              </section>;
            }}</For></div>
          </Show>
          <Show when={saveError()}><p class="inline-notice notice-error" role="alert">{saveError()}</p></Show><Show when={saved()}><p class="inline-notice notice-success" role="status">Shopping amounts saved.</p></Show>
        </Show>
      </Overlay>
      <Show when={confirmOpen()}><ConfirmDialog title="Discard shopping changes?" body="Your edited amounts have not been saved." confirmLabel="Discard changes" onConfirm={discard} onCancel={keepEditing}/></Show>
    </>
  );
}
