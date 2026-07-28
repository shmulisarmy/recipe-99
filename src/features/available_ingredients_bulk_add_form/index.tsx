import { createMutable } from "solid-js/store";
import { createSignal, For, onMount, Show } from "solid-js";
import {
    Measurement,
    Measurement_GTE,
    Measurement_Min,
    Measurement_Minus,
    Measurement_Plus,
    Measurement_ToString,
    Unit,
    ZeroedMeasurement,
} from "../../primitives/measurement";
import {
    reSimulatePlannerProjection,
    todaysShoppingCart,
} from "../planner/outside_feature_exports";
import { AvailableIngredientsBulkAddFormProps, BulkAddIngredients, ShoppingCartAlreadyGotDraft } from "./types";
import { FormTemplateWithDataStructure } from "./next_step";
import { useMutation } from "convex-solidjs";
import { api } from "../../../convex/_generated/api";

const UNITS: Unit[] = ["grams", "kilograms", "ounces", "pounds"];


function UpdateShoppingCartAlreadyGot(ShoppingCartAlreadyGotUpdateDraft: ShoppingCartAlreadyGotDraft) { 
    //for each ingredient in ShoppingCartAlreadyGotUpdateDraft it adds the amount to the shopping cart already got
    for (const [name, amount] of Object.entries(ShoppingCartAlreadyGotUpdateDraft)) {
        todaysShoppingCart().alreadyGot[name] = Measurement_Plus(todaysShoppingCart().alreadyGot[name]||ZeroedMeasurement(), amount);
    }
}



export function AvailableIngredientsBulkAddForm(props: AvailableIngredientsBulkAddFormProps) {
    const formData = createMutable<BulkAddIngredients>(structuredClone(props.ingredientsToAdd));
    const ShoppingCartAlreadyGotUpdateDraft = createMutable<ShoppingCartAlreadyGotDraft>({});
    const [step, setStep] = createSignal<"bulk-add" | "form-template-with-data-structure">("bulk-add");
    const [isAddingIngredient, setIsAddingIngredient] = createSignal(false);
    const [newIngredientName, setNewIngredientName] = createSignal("");
    const [newIngredientAmount, setNewIngredientAmount] = createSignal(1);
    const [newIngredientUnit, setNewIngredientUnit] = createSignal<Unit>("grams");
    const [addIngredientError, setAddIngredientError] = createSignal("");
    const m = useMutation(api.data.AvailableIngredientsBulkAdd);
    let newIngredientNameInput!: HTMLInputElement;

    function amountForShoppingCart(name: string): Measurement | undefined {
        const cart = todaysShoppingCart();
        const toGet = cart.toGet[name];
        if (!toGet) return;

        const alreadyGot = cart.alreadyGot[name] ?? ZeroedMeasurement();
        if (Measurement_GTE(alreadyGot, toGet)) return;

        return Measurement_Min(Measurement_Minus(toGet, alreadyGot), formData[name]);
    }

    function setShoppingCartSelection(name: string, selected: boolean) {
        if (!selected) {
            delete ShoppingCartAlreadyGotUpdateDraft[name];
            return;
        }

        const amount = amountForShoppingCart(name);
        if (amount) ShoppingCartAlreadyGotUpdateDraft[name] = { ...amount };
    }

    function refreshShoppingCartSelection(ingredientName: string) {
        if (ShoppingCartAlreadyGotUpdateDraft[ingredientName]) setShoppingCartSelection(ingredientName, true);
    }

    for (const name of Object.keys(formData)) {
        setShoppingCartSelection(name, true);
    }

    function removeIngredient(name: string) {
        delete formData[name];
        delete ShoppingCartAlreadyGotUpdateDraft[name];
    }

    function openAddIngredient() {
        setIsAddingIngredient(true);
        queueMicrotask(() => newIngredientNameInput.focus());
    }

    function closeAddIngredient() {
        setIsAddingIngredient(false);
        setNewIngredientName("");
        setNewIngredientAmount(1);
        setNewIngredientUnit("grams");
        setAddIngredientError("");
    }

    function addIngredient() {
        const name = newIngredientName().trim().toLowerCase();
        if (!name) {
            setAddIngredientError("Enter an ingredient name.");
            newIngredientNameInput.focus();
            return;
        }
        if (formData[name]) {
            setAddIngredientError(`${name} is already in this batch.`);
            newIngredientNameInput.focus();
            return;
        }
        if (!Number.isFinite(newIngredientAmount()) || newIngredientAmount() < 0) {
            setAddIngredientError("Enter an amount of zero or more.");
            return;
        }

        formData[name] = {
            amount: newIngredientAmount(),
            unit: newIngredientUnit(),
        };
        setShoppingCartSelection(name, true);
        closeAddIngredient();
    }

    function addIngredientOnEnter(event: KeyboardEvent) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        addIngredient();
    }

    function submitIngredients(event: SubmitEvent) {
        event.preventDefault();
        const entries = Object.entries(formData);
        if (entries.some(([, measurement]) => !Number.isFinite(measurement.amount) || measurement.amount < 0)) return;
        m.mutate({
            userId: "shmuli",
            ingredientsToAdd: entries.map(([name, measurement]) => ({ name, Measurement: measurement })),
        });

        //
        UpdateShoppingCartAlreadyGot(ShoppingCartAlreadyGotUpdateDraft);
        //

        setStep("form-template-with-data-structure");
    }

    return (
        <Show
            when={step() === "bulk-add"}
            fallback={<FormTemplateWithDataStructure shoppingCartAlreadyGot={ShoppingCartAlreadyGotUpdateDraft} />}
        >
            <section class="mx-auto max-w-2xl px-4 py-8 sm:py-10">
                <div class="mb-5 flex items-center gap-3" aria-label="Step 1 of 2">
                    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">1</span>
                    <span class="h-px flex-1 bg-stone-200" />
                    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-400">2</span>
                </div>

                <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
                    <header class="border-b border-stone-100 px-5 py-5 sm:px-6">
                        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Pantry intake</p>
                        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-stone-900">Review what came home</h1>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                            Adjust the quantities, remove anything that does not belong, and choose what should count toward today’s shopping list.
                        </p>
                    </header>

                    <form onSubmit={submitIngredients}>
                        <Show
                            when={Object.keys(formData).length > 0}
                            fallback={<p class="px-6 py-10 text-center text-sm text-stone-500">No ingredients in this batch.</p>}
                        >
                            <div class="divide-y divide-stone-100">
                                <For each={Object.keys(formData)}>
                                    {(name) => (
                                        <div class="px-4 py-4 sm:px-6">
                                            <div class="flex items-center justify-between gap-3">
                                                <label class="font-medium capitalize text-stone-800" for={`${name}-amount`}>{name}</label>
                                                <button
                                                    aria-label={`Remove ${name}`}
                                                    class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                                    type="button"
                                                    onClick={() => removeIngredient(name)}
                                                >
                                                    <svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div class="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(8.5rem,0.8fr)] gap-2">
                                                <input
                                                    class="h-11 w-full rounded-lg bg-white px-3 text-right text-base tabular-nums text-stone-800 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                    id={`${name}-amount`}
                                                    inputmode="decimal"
                                                    min="0"
                                                    name={`${name}-amount`}
                                                    required
                                                    step="any"
                                                    type="number"
                                                    value={formData[name].amount}
                                                    onInput={(event) => {
                                                        formData[name].amount = Number(event.currentTarget.value);
                                                        refreshShoppingCartSelection(name);
                                                    }}
                                                />
                                                <select
                                                    aria-label={`${name} unit`}
                                                    class="h-11 w-full cursor-pointer rounded-lg bg-white px-3 text-base text-stone-700 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                    name={`${name}-unit`}
                                                    value={formData[name].unit}
                                                    onChange={(event) => {
                                                        formData[name].unit = event.currentTarget.value as Unit;
                                                        refreshShoppingCartSelection(name);
                                                    }}
                                                >
                                                    <For each={UNITS}>{(unit) => <option value={unit}>{unit}</option>}</For>
                                                </select>
                                            </div>

                                            <Show when={amountForShoppingCart(name)}>
                                                {(amount) => (
                                                    <label class="mt-3 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
                                                        <input
                                                            class="h-4 w-4 shrink-0 accent-emerald-600"
                                                            type="checkbox"
                                                            checked={Boolean(ShoppingCartAlreadyGotUpdateDraft[name])}
                                                            onChange={(event) => setShoppingCartSelection(name, event.currentTarget.checked)}
                                                        />
                                                        <span>
                                                            Count <strong class="font-semibold">{Measurement_ToString(amount())}</strong> toward today’s shopping list
                                                        </span>
                                                    </label>
                                                )}
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>

                        <div class="border-t border-stone-100 px-4 py-4 sm:px-6">
                            <Show
                                when={isAddingIngredient()}
                                fallback={
                                    <button
                                        class="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 px-4 py-2.5 font-medium text-stone-600 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                        type="button"
                                        onClick={openAddIngredient}
                                    >
                                        <svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                                            <path stroke-linecap="round" d="M12 5v14M5 12h14" />
                                        </svg>
                                        Add ingredient
                                    </button>
                                }
                            >
                                <fieldset class="rounded-xl bg-stone-50 p-4 ring-1 ring-stone-200">
                                    <legend class="px-1 text-sm font-semibold text-stone-800">New ingredient</legend>
                                    <div class="mt-2 grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(7rem,0.7fr)_minmax(8.5rem,0.9fr)]">
                                        <label class="grid gap-1.5 text-sm font-medium text-stone-700">
                                            Name
                                            <input
                                                ref={newIngredientNameInput}
                                                class="h-11 w-full rounded-lg bg-white px-3 text-base font-normal text-stone-800 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                autocomplete="off"
                                                value={newIngredientName()}
                                                onInput={(event) => {
                                                    setNewIngredientName(event.currentTarget.value);
                                                    setAddIngredientError("");
                                                }}
                                                onKeyDown={addIngredientOnEnter}
                                            />
                                        </label>
                                        <label class="grid gap-1.5 text-sm font-medium text-stone-700">
                                            Amount
                                            <input
                                                class="h-11 w-full rounded-lg bg-white px-3 text-right text-base font-normal tabular-nums text-stone-800 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                inputmode="decimal"
                                                min="0"
                                                step="any"
                                                type="number"
                                                value={newIngredientAmount()}
                                                onInput={(event) => {
                                                    setNewIngredientAmount(Number(event.currentTarget.value));
                                                    setAddIngredientError("");
                                                }}
                                                onKeyDown={addIngredientOnEnter}
                                            />
                                        </label>
                                        <label class="grid gap-1.5 text-sm font-medium text-stone-700">
                                            Unit
                                            <select
                                                class="h-11 w-full cursor-pointer rounded-lg bg-white px-3 text-base font-normal text-stone-700 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                                value={newIngredientUnit()}
                                                onChange={(event) => setNewIngredientUnit(event.currentTarget.value as Unit)}
                                            >
                                                <For each={UNITS}>{(unit) => <option value={unit}>{unit}</option>}</For>
                                            </select>
                                        </label>
                                    </div>

                                    <Show when={addIngredientError()}>
                                        <p class="mt-2 text-sm font-medium text-rose-700" role="alert">{addIngredientError()}</p>
                                    </Show>

                                    <div class="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                        <button
                                            class="min-h-11 cursor-pointer rounded-xl px-4 py-2.5 font-medium text-stone-600 transition-colors hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
                                            type="button"
                                            onClick={closeAddIngredient}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            class="min-h-11 cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                                            type="button"
                                            onClick={addIngredient}
                                        >
                                            Add ingredient
                                        </button>
                                    </div>
                                </fieldset>
                            </Show>
                        </div>

                        <footer class="flex flex-col gap-3 border-t border-stone-100 bg-stone-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p class="text-sm text-stone-500">
                                {Object.keys(formData).length} {Object.keys(formData).length === 1 ? "ingredient" : "ingredients"} will be added to your pantry.
                            </p>
                            <button
                                class="min-h-11 cursor-pointer rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-stone-300"
                                disabled={Object.keys(formData).length === 0 || isAddingIngredient()}
                                type="submit"
                            >
                                Add to pantry
                            </button>
                        </footer>
                    </form>
                </div>
            </section>
        </Show>
    );
}
