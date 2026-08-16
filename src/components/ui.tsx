import { For, Match, Show, Switch, createUniqueId, onCleanup, onMount, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import type { Measurement, Unit, BuiltinUnit } from "../primitives/measurement";

export const BuiltinUnitOptions: BuiltinUnit[] = [
  { type: "builtin", unit: "grams" },
  { type: "builtin", unit: "kilograms" },
  { type: "builtin", unit: "ounces" },
  { type: "builtin", unit: "pounds" },
];

export type IconName =
  | "calendar"
  | "cart"
  | "check"
  | "chevron"
  | "close"
  | "edit"
  | "grip"
  | "intake"
  | "more"
  | "pantry"
  | "people"
  | "plus"
  | "recipes"
  | "search"
  | "warning"
  | "arrow-right";

export function Icon(props: { name: IconName; class?: string; label?: string }) {
  return (
    <svg
      class={`icon ${props.class ?? ""}`}
      viewBox="0 0 24 24"
      aria-hidden={props.label ? undefined : "true"}
      aria-label={props.label}
      role={props.label ? "img" : undefined}
    >
      <Switch>
        <Match when={props.name === "calendar"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></g>
        </Match>
        <Match when={props.name === "cart"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.2 10.5h10.6L20 7H6M9 19h.01M17 19h.01"/></g>
        </Match>
        <Match when={props.name === "check"}>
          <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </Match>
        <Match when={props.name === "chevron"}>
          <path d="m8 10 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
        </Match>
        <Match when={props.name === "close"}>
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </Match>
        <Match when={props.name === "edit"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4"/></g>
        </Match>
        <Match when={props.name === "grip"}>
          <g fill="currentColor"><circle cx="8" cy="7" r="1.25"/><circle cx="16" cy="7" r="1.25"/><circle cx="8" cy="12" r="1.25"/><circle cx="16" cy="12" r="1.25"/><circle cx="8" cy="17" r="1.25"/><circle cx="16" cy="17" r="1.25"/></g>
        </Match>
        <Match when={props.name === "intake"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16l-2 11H6zM8 9l4-6 4 6M12 12v5M9.5 14.5h5"/></g>
        </Match>
        <Match when={props.name === "more"}>
          <g fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></g>
        </Match>
        <Match when={props.name === "pantry"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10l1 3H6zM7 7v14h10V7M9 11h6M9 15h6"/></g>
        </Match>
        <Match when={props.name === "people"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.5a3 3 0 0 1 0 5.5M16.5 14a5 5 0 0 1 4 4.9V20"/></g>
        </Match>
        <Match when={props.name === "plus"}>
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
        </Match>
        <Match when={props.name === "recipes"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 4.5v17M9 7h7M9 11h7M9 15h4"/></g>
        </Match>
        <Match when={props.name === "search"}>
          <g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></g>
        </Match>
        <Match when={props.name === "warning"}>
          <g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.8 20h18.4z"/><path d="M12 9v5M12 17.5h.01"/></g>
        </Match>
        <Match when={props.name === "arrow-right"}>
          <path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </Match>
      </Switch>
    </svg>
  );
}

export function StatusText(props: { kind: "ready" | "missing" | "checking" | "saved" | "error"; children?: JSX.Element }) {
  const icon = () => props.kind === "ready" || props.kind === "saved" ? "check" : props.kind === "checking" ? undefined : "warning";
  const fallback = () => ({ ready: "Ready", missing: "Missing", checking: "Checking", saved: "Saved", error: "Error" })[props.kind];
  return <span class={`status-text status-${props.kind}`}><Show when={icon()}>{(name) => <Icon name={name() as IconName}/>}</Show>{props.children ?? fallback()}</span>;
}

export function Amount(props: { measurement: Measurement | undefined }) {
  return <span class="amount-value">{props.measurement ? `${formatAmount(props.measurement.amount)} ${props.measurement.unit.type === 'builtin' ? props.measurement.unit.unit : props.measurement.unit.name}` : "0 grams"}</span>;
}

export function formatAmount(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : Number(amount.toFixed(2)).toString();
}



type OverlayKind = "inspection" | "transaction" | "compact" | "sheet";

const activeOverlayRoots: HTMLElement[] = [];
const originalBodyChildInert = new Map<HTMLElement, boolean>();

function syncOverlayBackgroundInert() {
  for (const [element, inert] of originalBodyChildInert) {
    if (element.isConnected) element.inert = inert;
  }

  const activeRoot = activeOverlayRoots[activeOverlayRoots.length - 1];
  if (!activeRoot) {
    originalBodyChildInert.clear();
    return;
  }

  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (!originalBodyChildInert.has(child)) originalBodyChildInert.set(child, child.inert);
    child.inert = !child.contains(activeRoot);
  }
}

export function Overlay(props: {
  title: string;
  eyebrow?: string;
  kind: OverlayKind;
  onClose: () => void;
  onEscape?: () => void;
  footer?: JSX.Element;
  wide?: boolean;
  children: JSX.Element;
}) {
  const titleId = createUniqueId();
  let dialog!: HTMLElement;
  let overlayRoot!: HTMLDivElement;
  let backdropDown = false;
  let opener: Element | null = null;
  let previousOverflow = "";
  let registered = false;
  let disposed = false;

  const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  const onKeyDown = (event: KeyboardEvent) => {
    const overlays = document.querySelectorAll(".overlay");
    if (overlays[overlays.length - 1] !== overlayRoot) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      (props.onEscape ?? props.onClose)();
      return;
    }
    if (event.key !== "Tab") return;
    const items = focusable();
    if (items.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  onMount(() => {
    opener = document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown, true);
    queueMicrotask(() => {
      if (disposed) return;
      activeOverlayRoots.push(overlayRoot);
      registered = true;
      syncOverlayBackgroundInert();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus() ?? dialog.focus();
    });
  });

  onCleanup(() => {
    disposed = true;
    document.body.style.overflow = previousOverflow;
    if (registered) {
      const index = activeOverlayRoots.lastIndexOf(overlayRoot);
      if (index >= 0) activeOverlayRoots.splice(index, 1);
      syncOverlayBackgroundInert();
    }
    window.removeEventListener("keydown", onKeyDown, true);
    const elementToRestore = opener;
    if (elementToRestore instanceof HTMLElement && elementToRestore.isConnected) queueMicrotask(() => elementToRestore.focus());
  });

  return (
    <Portal>
      <div
        ref={overlayRoot}
        class={`overlay overlay-${props.kind}`}
        onPointerDown={(event) => { backdropDown = event.target === event.currentTarget; }}
        onPointerUp={(event) => { if (backdropDown && event.target === event.currentTarget) props.onClose(); backdropDown = false; }}
      >
        <section
          ref={dialog}
          class={`overlay-surface ${props.wide ? "is-wide" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabindex="-1"
        >
          <header class="overlay-head">
            <div><Show when={props.eyebrow}><p>{props.eyebrow}</p></Show><h2 id={titleId}>{props.title}</h2></div>
            <button class="icon-button" type="button" aria-label={`Close ${props.title}`} onClick={props.onClose}><Icon name="close"/></button>
          </header>
          <div class="overlay-body">{props.children}</div>
          <Show when={props.footer}><footer class="overlay-footer">{props.footer}</footer></Show>
        </section>
      </div>
    </Portal>
  );
}

export function ConfirmDialog(props: { title: string; body: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void }) {
  const titleId = createUniqueId();
  let dialog!: HTMLElement;
  let opener: Element | null = null;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); props.onCancel(); return; }
    if (event.key !== "Tab") return;
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled])"));
    if (!controls.length) return;
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls[controls.length - 1].focus(); }
    else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) { event.preventDefault(); controls[0].focus(); }
  };
  onMount(() => { opener = document.activeElement; window.addEventListener("keydown", onKeyDown, true); queueMicrotask(() => dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus()); });
  onCleanup(() => {
    window.removeEventListener("keydown", onKeyDown, true);
    const elementToRestore = opener;
    if (elementToRestore instanceof HTMLElement && elementToRestore.isConnected) queueMicrotask(() => elementToRestore.focus());
  });
  return (
    <Portal>
      <div class="overlay overlay-confirm">
        <section ref={dialog} class="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId} tabindex="-1">
          <h2 id={titleId}>{props.title}</h2>
          <p>{props.body}</p>
          <div class="confirm-actions"><button class="button button-secondary" type="button" data-autofocus onClick={props.onCancel}>Keep editing</button><button class="button button-danger" type="button" onClick={props.onConfirm}>{props.confirmLabel}</button></div>
        </section>
      </div>
    </Portal>
  );
}
