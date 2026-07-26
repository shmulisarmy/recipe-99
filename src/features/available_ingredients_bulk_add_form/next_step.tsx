import { onMount } from "solid-js";
import { ShoppingCartAlreadyGotDraft } from "./types";

export function FormTemplateWithDataStructure(props: {shoppingCartAlreadyGot: ShoppingCartAlreadyGotDraft}) {
    let heading!: HTMLHeadingElement;

    onMount(() => heading.focus());

    return (
        <section class="mx-auto max-w-2xl px-4 py-10">
            <div class="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-stone-200 sm:p-8">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg aria-hidden="true" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                    </svg>
                </div>
                <p class="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    form template with dataStrcuture
                </p>
                <h1 ref={heading} tabindex="-1" class="mt-2 text-2xl font-semibold tracking-tight text-stone-900 outline-none">
                    Pantry updated
                </h1>
                <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                    {Object.keys(props.shoppingCartAlreadyGot).length} shopping-list {Object.keys(props.shoppingCartAlreadyGot).length === 1 ? "item is" : "items are"} ready for the next step.
                </p>
            </div>
        </section>
    );
}