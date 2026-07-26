import { createSignal, For, onMount, Show } from "solid-js";
import { ShoppingCartAlreadyGotDraft } from "./types";
import { StillNeedToGetToday, today, todaysShoppingCart } from "../planner/outside_feature_exports";
import { Measurement_GT, Measurement_ToString, ZeroedMeasurement } from "../../primitives/measurement";
import { PushOverIngredientShoppingItemForTheNextDay } from "../planner/actions/cart";




type IngredientName = keyof ShoppingCartAlreadyGotDraft;
const actions: Record<IngredientName, "keep in todays cart" | "move to tomorrows cart" | "remove from todays cart"> = {}


function handleActions(){
    for (const [name, action] of Object.entries(actions)){
        if (action === "keep in todays cart") continue;
        if (action === "move to tomorrows cart") PushOverIngredientShoppingItemForTheNextDay(name);
        if (action === "remove from todays cart") todaysShoppingCart().toGet[name] = JSON.parse(JSON.stringify(todaysShoppingCart().alreadyGot[name]));
    }
}


export function FormTemplateWithDataStructure(props: {shoppingCartAlreadyGot: ShoppingCartAlreadyGotDraft}) {
    let heading!: HTMLHeadingElement;
    const todaysShoppingCart_ = todaysShoppingCart();
    const [actionsHandled, setActionsHandled] = createSignal(false);
    

    onMount(() => heading.focus());

    function finishShoppingCart(){
        handleActions();
        setActionsHandled(true);
    }
    

    return (
        <section class="mx-auto max-w-2xl px-4 py-8 sm:py-10">
            <div class="mb-5 flex items-center gap-3" aria-label="Step 2 of 2">
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <svg aria-hidden="true" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                    </svg>
                </span>
                <span class="h-px flex-1 bg-emerald-200" />
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">2</span>
            </div>

            <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
                <header class="border-b border-stone-100 px-5 py-5 sm:px-6">
                    <div class="flex items-start gap-4">
                        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                            <svg aria-hidden="true" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Pantry intake</p>
                            <h1 ref={heading} tabindex="-1" class="mt-1 text-2xl font-semibold tracking-tight text-stone-900 outline-none">
                                Pantry updated
                            </h1>
                            <p class="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                                These came home with you, but today’s list still has some left.
                            </p>
                        </div>
                    </div>
                </header>

                <div class="divide-y divide-stone-100">
                    <For each={Object.keys(props.shoppingCartAlreadyGot)}>
                        {(name: string) => (
                            <Show when={Measurement_GT(StillNeedToGetToday(name), ZeroedMeasurement())}>
                                <fieldset class="px-4 py-4 sm:px-6">
                                    <legend class="w-full">
                                        <span class="flex items-baseline justify-between gap-3">
                                            <span class="font-semibold capitalize text-stone-900">{name}</span>
                                            <span class="shrink-0 text-right text-xs text-stone-500 sm:text-sm">
                                                Just Got <strong class="font-semibold text-emerald-700">{Measurement_ToString(props.shoppingCartAlreadyGot[name])}</strong>
                                                <span aria-hidden="true"> · </span>
                                                <span class="sr-only">, </span>
                                                <strong class="font-semibold text-stone-700">{Measurement_ToString(StillNeedToGetToday(name))}</strong> in shopping cart
                                            </span>
                                        </span>
                                    </legend>

                                    <div class="mt-3 grid gap-2 min-[480px]:grid-cols-3">
                                        <label class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-stone-200 transition-colors hover:bg-stone-50 has-[:checked]:bg-emerald-50 has-[:checked]:ring-2 has-[:checked]:ring-emerald-600">
                                            <input
                                                class="h-4 w-4 shrink-0 accent-emerald-600"
                                                name={`shopping-cart-action-${name}`}
                                                type="radio"
                                                value="move to tomorrows cart"
                                                onChange={() => actions[name] = "move to tomorrows cart"}
                                            />
                                            <span class="text-sm font-semibold text-stone-800">push to Tomorrow's cart</span>
                                        </label>

                                        <label class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-stone-200 transition-colors hover:bg-stone-50 has-[:checked]:bg-emerald-50 has-[:checked]:ring-2 has-[:checked]:ring-emerald-600">
                                            <input
                                                class="h-4 w-4 shrink-0 accent-emerald-600"
                                                name={`shopping-cart-action-${name}`}
                                                type="radio"
                                                value="keep in todays cart"
                                                onChange={() => actions[name] = "keep in todays cart"}
                                            />
                                            <span class="text-sm font-semibold text-stone-800">Keep in today's cart</span>
                                        </label>

                                        <label class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-stone-200 transition-colors hover:bg-stone-50 has-[:checked]:bg-emerald-50 has-[:checked]:ring-2 has-[:checked]:ring-emerald-600">
                                            <input
                                                class="h-4 w-4 shrink-0 accent-emerald-600"
                                                name={`shopping-cart-action-${name}`}
                                                type="radio"
                                                value="remove from todays cart"
                                                onChange={() => actions[name] = "remove from todays cart"}
                                            />
                                            <span class="text-sm font-semibold text-stone-800">Remove the rest from cart</span>
                                        </label>
                                    </div>
                                </fieldset>
                            </Show>
                        )}
                    </For>
                </div>

                <footer class="border-t border-stone-100 bg-stone-50 px-4 py-4 sm:px-6">
                    <Show
                        when={actionsHandled()}
                        fallback={
                            <button
                                class="min-h-11 w-full cursor-pointer rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2"
                                type="button"
                                onClick={finishShoppingCart}
                            >
                                Save cart choices
                            </button>
                        }
                    >
                        <div class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200" role="status" aria-live="polite">
                            <svg aria-hidden="true" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                            </svg>
                            Shopping carts updated
                        </div>
                    </Show>
                </footer>
            </div>
        </section>
    );
}
