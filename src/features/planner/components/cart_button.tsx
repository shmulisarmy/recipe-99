function CartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function CartButton(props: {
  count: number;
  onOpen: () => void;
  label: string;
  class?: string;
}) {
  return (
    <button
      type="button"
      class={`inline-flex items-center gap-1 rounded-md bg-stone-100 font-medium text-stone-600 hover:bg-stone-200 ${
        props.class ?? "px-1.5 py-0.5 text-[11px]"
      }`}
      onClick={() => props.onOpen()}
      aria-label={props.label}
    >
      <CartIcon />
      {props.count}
    </button>
  );
}
