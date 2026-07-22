import { createMutable } from "solid-js/store";
import { Measurement, Measurement_GTE, Measurement_Minus, ZeroedMeasurement } from "../../primitives/measurement";
import { For, Show } from "solid-js";
import { todaysShoppingCart } from "../planner/outside_feature_exports";

export function AvailableIngredientsBulkAddForm() {
    const formData = createMutable<Record<string, Measurement>>({
        milk:         { amount: 1400,   unit: 'grams' },
        butter:       { amount: 100,   unit: 'grams' },
        flour:        { amount: 1,   unit: 'grams' },
        sugar:        { amount: 1,   unit: 'grams' },
        salt:         { amount: 1,   unit: 'grams' },
        'cocoa powder': { amount: 1175,  unit: 'grams' },    
        eggs:         { amount: 150, unit: 'grams' },
    });
    return (
        <section class="mx-4 my-8 max-w-3xl rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:mx-auto sm:p-6">
            <h1 class="text-2xl font-semibold tracking-tight text-stone-800">Add pantry ingredients</h1>
            <p class="mt-1 text-sm text-stone-500">Enter the amount you have for each ingredient.</p>
            <form class="mt-6 space-y-3">
                <For each={Object.keys(formData)}>
                    {(name) => (
                        <div class="grid gap-3 rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200 sm:grid-cols-[minmax(0,1fr)_8rem_10rem] sm:items-center">
                            <label class="font-medium capitalize text-stone-700" for={`${name}-amount`}>{name}</label>
                            <input
                                class="h-11 w-full rounded-lg bg-white px-3 text-right text-stone-800 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                id={`${name}-amount`}
                                type="number"
                                name={name}
                                value={formData[name].amount}
                            />
                            <select
                                aria-label={`${name} unit`}
                                class="h-11 w-full cursor-pointer rounded-lg bg-white px-3 text-stone-700 ring-1 ring-stone-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                name={name}
                                value={formData[name].unit}
                            >
                                <option value="grams">grams</option>
                                <option value="kilograms">kilograms</option>
                                <option value="ounces">ounces</option>
                                <option value="pounds">pounds</option>
                            </select>
                            <Show when={
                                todaysShoppingCart().toGet[name] && Measurement_GTE(todaysShoppingCart().toGet[name], todaysShoppingCart().alreadyGot[name]?? ZeroedMeasurement())
                            }>
                                <>
                                check off in shopping cart ({
                                    (function (){
                                        const stillNeedToGet = Measurement_Minus(todaysShoppingCart().toGet[name], todaysShoppingCart().alreadyGot[name]?? ZeroedMeasurement()).amount 
                                        
                                    })()
                                } {todaysShoppingCart().toGet[name].unit})
                                <input type="checkbox" checked/>
                                </>
                            </Show>
                        </div>
                    )}
                </For>
                <button
                    class="mt-2 min-h-11 w-full cursor-pointer rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto"
                    type="submit"
                >
                    Add ingredients
                </button>
            </form>
        </section>
    );
}
