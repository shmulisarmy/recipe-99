import { createSignal, For, JSX, Show, onCleanup } from "solid-js";
import { makeCacheKey, RequiredIngredient } from "../../../data";
import type { RecipeProjection } from "./types";
import {
    Measurement,
    Measurement_Convert,
    Measurement_Divide,
    Measurement_GTE,
    Measurement_Minus,
    Measurement_Times,
    ZeroedMeasurement,
} from "../../../primitives/measurement";
import { api } from "../../../../convex/_generated/api";
import { useMutation, useQuery } from "convex-solidjs";
import { PlannerType } from "../data";

// ---------- Formatting helpers ----------

function formatMeasurement(m: Measurement): string {
    return `${Number(m.amount.toFixed(1))} ${m.unit}`;
}

function dayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const diff = Math.round((startOfDay(date) - startOfDay(today)) / dayMs);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

// ---------- Modal shell ----------

function Modal(props: {
    title: string;
    onClose: () => void;
    headerAction?: JSX.Element;
    children: JSX.Element;
}) {
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));

    return (
        <div
            class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => props.onClose()}
        >
            <div
                class="w-full max-w-none rounded-t-2xl rounded-b-none bg-white p-6 shadow-xl sm:max-w-md sm:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div class="flex items-start justify-between gap-3">
                    <h2 class="text-lg font-semibold capitalize text-stone-900">{props.title}</h2>
                    <div class="flex items-center gap-1">
                        {props.headerAction}
                        <button
                            type="button"
                            class="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                            aria-label="Close"
                            onClick={() => props.onClose()}
                        >
                            ×
                        </button>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    );
}

// ---------- Recipe modal ----------

export function RecipeModal(props: {
    item: RecipeProjection;
    onClose: () => void;
}): JSX.Element {
    const recipeName = () => props.item.plannedRecipeReference.recipeId;
    const recipeId = () => props.item.plannedRecipeReference.id;
    const initialOverride = props.item.plannedRecipeReference.overrideDayMultiplier;
    const initialMultiplier = initialOverride ?? props.item.dayMultiplier;
    const [multiplierMenuOpen, setMultiplierMenuOpen] = createSignal(false);
    const [currentMultiplier, setCurrentMultiplier] = createSignal(initialMultiplier);
    const [multiplierDraft, setMultiplierDraft] = createSignal(String(initialMultiplier));
    const [usingDayDefault, setUsingDayDefault] = createSignal(initialOverride === undefined);
    const [isSavingMultiplier, setIsSavingMultiplier] = createSignal(false);
    const [multiplierError, setMultiplierError] = createSignal("");
    const updateRecipeMultiplier = useMutation(
        api.planner_exports.updateRecipeOverrideMultiplier,
    );

    const saveMultiplier = async (event: SubmitEvent) => {
        event.preventDefault();
        const multiplier = Number(multiplierDraft());
        if (!multiplierDraft().trim() || !Number.isFinite(multiplier) || multiplier <= 0) {
            setMultiplierError("Enter a multiplier greater than 0.");
            return;
        }

        setIsSavingMultiplier(true);
        setMultiplierError("");
        try {
            await updateRecipeMultiplier.mutate({
                recipeId: recipeId(),
                multiplier,
            });
            setCurrentMultiplier(multiplier);
            setUsingDayDefault(false);
            setMultiplierMenuOpen(false);
        } catch {
            setMultiplierError("Couldn't update the amount. Try again.");
        } finally {
            setIsSavingMultiplier(false);
        }
    };

    const useDayDefault = async () => {
        setIsSavingMultiplier(true);
        setMultiplierError("");
        try {
            await updateRecipeMultiplier.mutate({
                recipeId: recipeId(),
                multiplier: null,
            });
            setCurrentMultiplier(props.item.dayMultiplier);
            setMultiplierDraft(String(props.item.dayMultiplier));
            setUsingDayDefault(true);
            setMultiplierMenuOpen(false);
        } catch {
            setMultiplierError("Couldn't use the day default. Try again.");
        } finally {
            setIsSavingMultiplier(false);
        }
    };
    // const recipeInMenu = () => menu.get(recipeName());
    const recipeInMenu2 = useQuery(api.data.getRecipeByTitle, { recipeTitle: makeCacheKey(recipeName()) });
    const recipeInMenu = () => recipeInMenu2.data();

    const inScratchpad = (ingredient: RequiredIngredient) => {
        const pad = props.item.scratchPadOfIngredientsNeededToUse;
        return ingredient.name in pad || (ingredient.substitute !== undefined && ingredient.substitute.name in pad);
    };

    const missing = () => (recipeInMenu()?.requiredIngredients ?? []).filter((ing) => !inScratchpad(ing));
    const scratchpadEntries = () => Object.entries(props.item.scratchPadOfIngredientsNeededToUse);


    const pantry = useQuery(api.data.getAvailableIngredients, {});

    // function GetIngredientMeasurement(name: string): Measurement{
    //     const pantryItems = pantry.data();
    //     for (const ingredient of pantryItems) {
    //         if (ingredient.name_ === name) return ingredient.Measurement;
    //     }
    //     throw new Error(`Ingredient ${name} not found in pantry`);
    // }

    return (
        <Modal
            title={makeCacheKey(recipeName())}
            onClose={props.onClose}
            headerAction={
                <div
                    class="relative"
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && multiplierMenuOpen()) {
                            event.stopPropagation();
                            setMultiplierMenuOpen(false);
                        }
                    }}
                >
                    <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
                        aria-label="Recipe options"
                        aria-haspopup="dialog"
                        aria-expanded={multiplierMenuOpen()}
                        onClick={() => setMultiplierMenuOpen((open) => !open)}
                    >
                        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
                            <circle cx="4" cy="10" r="1.5" />
                            <circle cx="10" cy="10" r="1.5" />
                            <circle cx="16" cy="10" r="1.5" />
                        </svg>
                    </button>
                    <Show when={multiplierMenuOpen()}>
                        <div
                            role="dialog"
                            aria-label="Amount to make"
                            class="absolute right-0 top-9 z-10 w-64 rounded-xl border border-stone-200 bg-white p-3 shadow-lg"
                        >
                            <form onSubmit={saveMultiplier}>
                                <label
                                    for="recipe-amount-to-make"
                                    class="text-xs font-semibold uppercase tracking-wide text-stone-500"
                                >
                                    Amount to make
                                </label>
                                <p class="mt-1 text-xs text-stone-500">
                                    {usingDayDefault()
                                        ? `Using day default (×${currentMultiplier()})`
                                        : `Custom amount ×${currentMultiplier()}`}
                                </p>
                                <div class="mt-3 flex gap-2">
                                    <input
                                        id="recipe-amount-to-make"
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={multiplierDraft()}
                                        onInput={(event) => setMultiplierDraft(event.currentTarget.value)}
                                        class="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm tabular-nums text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
                                        aria-describedby={multiplierError() ? "recipe-multiplier-error" : undefined}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSavingMultiplier()}
                                        class="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-wait disabled:opacity-60"
                                    >
                                        {isSavingMultiplier() ? "Saving…" : "Save"}
                                    </button>
                                </div>
                                <Show when={multiplierError()}>
                                    <p id="recipe-multiplier-error" class="mt-2 text-xs text-red-600" role="alert">
                                        {multiplierError()}
                                    </p>
                                </Show>
                                <button
                                    type="button"
                                    disabled={isSavingMultiplier() || usingDayDefault()}
                                    class="mt-3 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:cursor-default disabled:text-stone-400"
                                    onClick={useDayDefault}
                                >
                                    {usingDayDefault() ? "Using day default" : "Use day default"}
                                </button>
                            </form>
                        </div>
                    </Show>
                </div>
            }
        >
            <div class="mt-1 flex items-center gap-2">
                <Show
                    when={props.item.couldMake}
                    fallback={
                        <span class="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Can't make
                        </span>
                    }
                >
                    <span class="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Can make
                    </span>
                </Show>
            </div>
            <Show when={recipeInMenu()}>
                {(recipe) => <p class="mt-2 text-sm text-stone-500">{recipe().description}</p>}
            </Show>

            <Show
                when={!props.item.couldMake}
                fallback={
                    <div class="mt-4">
                        <div class="text-xs font-medium uppercase tracking-wide text-stone-400">Will use</div>
                        <div class="mt-2 flex flex-wrap gap-1.5">
                            <For each={scratchpadEntries()}>
                                {([name, measurement]) => (
                                    <span class="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium capitalize text-green-700">
                                        {name} ({formatMeasurement(measurement)})
                                    </span>
                                )}
                            </For>
                        </div>
                    </div>
                }
            >
                <div class="mt-4">
                    <div class="text-xs font-medium uppercase tracking-wide text-stone-400">Missing</div>
                    <ul class="mt-2 flex flex-col gap-3">
                        <For each={props.item.unfulfilledIngredients}>
                            {(ingredient) => {
                                const need = () => Measurement_Times(ingredient.RequiredIngredient.Measurement, props.item.multiplier);
                                const haveInNeedUnit = () => Measurement_Convert(ingredient.have, need().unit);
                                const pct = () => need().amount === 0 ? 100
                                    : Math.min(100, Math.max(0, (haveInNeedUnit().amount / need().amount) * 100));

                                return (
                                    <li>
                                        <div class="flex items-baseline justify-between gap-2">
                                            <span class="font-medium capitalize text-red-700">{ingredient.RequiredIngredient.name}</span>
                                            <span class="text-sm tabular-nums text-red-700">
                                                {formatMeasurement(haveInNeedUnit())}
                                                <span class="text-red-400"> / {formatMeasurement(need())}</span>
                                            </span>
                                        </div>
                                        <div class="mt-1.5 h-2 w-full rounded-full bg-red-100">
                                            <div
                                                class="h-2 rounded-full bg-red-400 transition-all"
                                                style={{ width: `${pct()}%` }}
                                            />
                                        </div>
                                        <Show when={ingredient.RequiredIngredient.substitute}>
                                            {(substitute) => (
                                                <div class="mt-1 text-xs text-stone-500">
                                                    substitute: {substitute().name} ({formatMeasurement(substitute().Measurement)})
                                                </div>
                                            )}
                                        </Show>
                                    </li>
                                );
                            }}
                        </For>
                    </ul>
                </div>
                <Show when={scratchpadEntries().length > 0}>
                    <div class="mt-4">
                        <div class="text-xs font-medium uppercase tracking-wide text-stone-400">Covered</div>
                        <div class="mt-2 flex flex-wrap gap-1.5">
                            <For each={scratchpadEntries()}>
                                {([name, measurement]) => (
                                    <span class="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium capitalize text-green-700">
                                        {name} ({formatMeasurement(measurement)})
                                    </span>
                                )}
                            </For>
                        </div>
                    </div>
                </Show>
            </Show>
        </Modal>
    );
}

// ---------- Cart modal ----------

export function CartModal(props: {
    dateStr: string; // toDateString() key
    onClose: () => void;
    plannerData: PlannerType
}): JSX.Element {
    const plannedDay = () => {
        const day = props.plannerData[props.dateStr];
        if (!day) throw new Error(`Could not find planned day for ${props.dateStr}`);
        return day;
    };

    const toGetEntries = () => Object.entries(plannedDay().shoppingCart.toGet);

    const alreadyGot = (name: string) => plannedDay()?.shoppingCart.alreadyGot[name];

    const percentGot = (name: string, toGet: Measurement): number => {
        if (toGet.amount === 0) return 100;
        const got = alreadyGot(name) ?? ZeroedMeasurement();
        if (Measurement_GTE(got, toGet)) return 100;
        // Minus normalizes into toGet's unit; covered is alreadyGot in that unit.
        const remaining = Measurement_Minus(toGet, got);
        const covered = Measurement_Minus(toGet, remaining);
        const ratio = Measurement_Divide(covered, toGet.amount).amount;
        return Math.min(100, Math.max(0, Math.round(ratio * 100)));
    };

    return (
        <Modal title={`Shopping — ${dayLabel(props.dateStr)}`} onClose={props.onClose}>
            <Show
                when={toGetEntries().length > 0}
                fallback={
                    <p class="mt-4 text-center text-sm text-stone-500">Nothing to buy for this day.</p>
                }
            >
                <ul class="mt-4 flex flex-col gap-2">
                    <For each={toGetEntries()}>
                        {([name, measurement]) => (
                            <li>
                                <div class="flex items-baseline justify-between gap-2">
                                    <span class="text-sm font-medium capitalize text-stone-900">{name}</span>
                                    <span class="text-sm text-stone-600">{formatMeasurement(measurement)}</span>
                                </div>
                                <div
                                    role="progressbar"
                                    aria-valuenow={percentGot(name, measurement)}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    class="mt-1 h-1.5 w-full rounded-full bg-stone-100"
                                >
                                    <div
                                        class={`h-1.5 rounded-full ${percentGot(name, measurement) === 100 ? "bg-green-500" : "bg-sky-500"}`}
                                        style={{ width: `${percentGot(name, measurement)}%` }}
                                    />
                                </div>
                                <div class="flex items-baseline justify-between gap-2">
                                    <Show when={alreadyGot(name)} fallback={<span />}>
                                        {(got) => (
                                            <div class="text-xs text-stone-500">
                                                already got {formatMeasurement(got())}
                                            </div>
                                        )}
                                    </Show>
                                    <span class="text-xs tabular-nums text-stone-500">
                                        {percentGot(name, measurement)}%
                                    </span>
                                </div>
                            </li>
                        )}
                    </For>
                </ul>
            </Show>
        </Modal>
    );
}
