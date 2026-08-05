import { For, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../../convex/_generated/api";
import { Measurement_Minus, Measurement_Plus, ZeroedMeasurement } from "../../primitives/measurement";
import { Amount, Icon } from "../../components/ui";
import type { IntakeHandoff } from "./types";
import { today } from "../planner/outside_feature_exports";

type ReconcileAction = "keep" | "move" | "remove";

export function FormTemplateWithDataStructure(props: { handoff: IntakeHandoff; onComplete: () => void; onBack: () => void }) {
  const planner = useQuery(api.data.usersPlanner, {});
  const updateAlreadyGot = useMutation(api.planner_exports.UpdateCartAlreadyGot);
  const pushToTomorrow = useMutation(api.planner_exports.PushOverIngredientShoppingItemsForTheNextDay);
  const setCartTargets = useMutation(api.planner_exports.BulkSetCartToGet);
  const [actions, setActions] = createStore<Record<string, ReconcileAction>>(Object.fromEntries(Object.keys(props.handoff.allocations).map((name) => [name, "keep"])));
  const [isSaving, setIsSaving] = createSignal(false);
  const [saveError, setSaveError] = createSignal("");
  const [complete, setComplete] = createSignal(false);
  const entries = () => Object.entries(props.handoff.allocations);
  const plannedToday = () => planner.data()?.[today.toDateString()];
  const stillNeeded = (name: string) => {
    const target = plannedToday()?.shoppingCart.toGet[name] ?? ZeroedMeasurement();
    const prior = plannedToday()?.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement();
    return Measurement_Minus(target, Measurement_Plus(prior, props.handoff.allocations[name]));
  };

  const finish = async (event: SubmitEvent) => {
    event.preventDefault();
    const day = plannedToday();
    if (!day) { setSaveError("Today’s shopping list couldn’t load. Try again."); return; }
    setIsSaving(true);
    setSaveError("");
    try {
      const updatedAlreadyGot: Record<string, ReturnType<typeof Measurement_Plus>> = {};
      for (const [name, obtained] of entries()) {
        const measurement = Measurement_Plus(day.shoppingCart.alreadyGot[name] ?? ZeroedMeasurement(), obtained);
        updatedAlreadyGot[name] = measurement;
        await updateAlreadyGot.mutate({ date: day.date, ingredient: { name, measurement } });
      }
      const moveNames = entries().filter(([name]) => actions[name] === "move").map(([name]) => name);
      if (moveNames.length) await pushToTomorrow.mutate({ ingredientNames: moveNames, dayAsString: day.date });
      const removals = entries().filter(([name]) => actions[name] === "remove").map(([name]) => ({ name, measurement: updatedAlreadyGot[name] }));
      if (removals.length) await setCartTargets.mutate({ date: day.date, ingredients: removals });
      setComplete(true);
    } catch {
      setSaveError("Shopping lists weren’t fully updated. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main class="main workspace-narrow" id="main">
      <div class="stepper" aria-label="Intake progress"><div class="step">1 Review ingredients</div><div class="step active" aria-current="step">2 Reconcile today’s cart</div></div>
      <Show when={!complete()} fallback={<div class="empty-state completion-state"><Icon name="check"/><h1>Pantry updated.</h1><p>Today’s shopping list is up to date.</p><button class="button button-primary" type="button" onClick={props.onComplete}>Back to pantry</button></div>}>
        <header class="page-heading"><div><h1>Finish today’s shopping list</h1><p class="supporting-copy">Choose what should happen to each amount that is still needed.</p></div></header>
        <Show when={entries().length > 0} fallback={<div class="empty-state completion-state"><Icon name="check"/><h2>Pantry updated. Today’s shopping list needs no follow-up.</h2><button class="button button-primary" type="button" onClick={props.onComplete}>Back to pantry</button></div>}>
          <Show when={planner.isLoading()}><p>Checking today’s shopping list…</p></Show>
          <Show when={planner.error()}><div class="inline-notice notice-error"><p>Today’s shopping list couldn’t load.</p><button class="button button-secondary" type="button" onClick={planner.refetch}>Try again</button></div></Show>
          <Show when={plannedToday()}>
            <form onSubmit={finish}>
              <div class="reconcile-list"><For each={entries()}>{([name, obtained]) => (
                <section class="reconcile-row" aria-labelledby={`${name}-reconcile-heading`}><div><h2 id={`${name}-reconcile-heading`}>{name}</h2><div class="amount-triplet"><span>Obtained <Amount measurement={obtained}/></span><span>Still needed <Amount measurement={stillNeeded(name)}/></span></div></div><fieldset class="radio-list"><legend class="field-label">What should happen to the remainder?</legend><label><input type="radio" name={`${name}-action`} checked={actions[name] === "keep"} onChange={() => setActions(name, "keep")}/>Keep on today’s cart</label><label><input type="radio" name={`${name}-action`} checked={actions[name] === "move"} onChange={() => setActions(name, "move")}/>Move to tomorrow’s cart</label><label><input type="radio" name={`${name}-action`} checked={actions[name] === "remove"} onChange={() => setActions(name, "remove")}/>Remove from today’s cart</label></fieldset></section>
              )}</For></div>
              <Show when={saveError()}><p class="inline-notice notice-error" role="alert">{saveError()}</p></Show>
              <div class="form-actions"><button class="button button-secondary" type="button" disabled={isSaving()} onClick={props.onBack}>Back</button><button class="button button-primary" type="submit" disabled={isSaving()}>{isSaving() ? "Updating shopping lists…" : "Finish reconciliation"}</button></div>
            </form>
          </Show>
        </Show>
      </Show>
    </main>
  );
}
