import { A, useLocation, type RouteSectionProps } from "@solidjs/router";
import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { useAuth } from "../auth/google";
import { Icon, type IconName } from "./ui";

const destinations: { href: string; label: string; icon: IconName }[] = [
  { href: "/planner", label: "Planner", icon: "calendar" },
  { href: "/recipes", label: "Recipes", icon: "recipes" },
  { href: "/pantry", label: "Pantry", icon: "pantry" },
  { href: "/intake", label: "Intake", icon: "intake" },
];

function activeDestination(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function routeLabel(pathname: string): string {
  return destinations.find((destination) => activeDestination(pathname, destination.href))?.label ?? "Captain Cook";
}

function documentTitle(pathname: string): string {
  const destination = destinations.find((d) => activeDestination(pathname, d.href));
  return destination ? `${destination.label} — Captain Cook` : "Captain Cook";
}

function routeDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppShell(props: RouteSectionProps) {
  const location = useLocation();
  const auth = useAuth();
  const [accountOpen, setAccountOpen] = createSignal(false);
  const email = () => auth.identity()?.email ?? "Signed in";
  const initials = createMemo(() => {
    const value = email();
    const parts = value.split(/[@.\s_-]+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "CC";
  });

  createEffect(() => {
    document.title = documentTitle(location.pathname);
  });

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") setAccountOpen(false);
  };
  window.addEventListener("keydown", closeOnEscape);
  onCleanup(() => window.removeEventListener("keydown", closeOnEscape));

  const Wordmark = () => (
    <A class="wordmark" href="/planner" aria-label="Captain Cook home">
      <img class="wordmark-mark" src="/brand/captain-cook-logo.png" alt="" />
      <span class="wordmark-copy">
        <strong>Captain Cook</strong>
        <small>Recipe app</small>
      </span>
    </A>
  );
  const NavLinks = (navProps: { mode: "primary" | "tablet" | "bottom" }) => (
    <For each={destinations}>{(destination) => (
      <A
        class={`${navProps.mode === "primary" ? "nav-link" : navProps.mode === "tablet" ? "tablet-link" : "bottom-link"}`}
        href={destination.href}
        aria-current={activeDestination(location.pathname, destination.href) ? "page" : undefined}
      >
        <Show when={navProps.mode !== "tablet"}><Icon name={destination.icon}/></Show>
        {destination.label}
      </A>
    )}</For>
  );
  const plannerDate = () =>
    location.pathname.match(/^\/planner\/day\/(\d{4}-\d{2}-\d{2})/)?.[1] ??
    routeDate(new Date());
  const PlannerBottomNav = () => (
    <>
      <A class="bottom-link" href="/pantry">
        <Icon name="pantry" />
        Pantry
      </A>
      <A class="bottom-link" href="/planner" aria-current="page">
        <Icon name="calendar" />
        Plan
      </A>
      <A
        class="bottom-link"
        href={`/planner/day/${plannerDate()}/cart`}
      >
        <Icon name="cart" />
        Groceries
      </A>
    </>
  );

  return (
    <>
      <a class="skip-link" href="#main">Skip to main content</a>
      <div class="app-shell">
        <aside class="sidebar" aria-label="Captain Cook navigation">
          <Wordmark/>
          <nav class="primary-nav" aria-label="Primary"><NavLinks mode="primary"/></nav>
          <p class="shell-note">Pantry to plate, one day at a time.</p>
        </aside>
        <div class="app-content">
          <header class="topbar">
            <div class="mobile-wordmark"><Wordmark/></div>
            <span class="route-label">{routeLabel(location.pathname)}</span>
            <nav class="tablet-nav" aria-label="Primary"><NavLinks mode="tablet"/></nav>
            <div class="account-wrap">
              <button
                class="account-button"
                type="button"
                aria-expanded={accountOpen()}
                aria-haspopup="menu"
                aria-label={`Open account menu for ${email()}`}
                onClick={() => setAccountOpen((open) => !open)}
              >
                <span class="avatar" aria-hidden="true">{initials()}</span>
                <span class="account-label">{email()}</span>
                <Icon name="chevron"/>
              </button>
              <Show when={accountOpen()}>
                <div class="account-menu">
                  <p>{email()}</p>
                  <button class="button button-quiet" type="button" onClick={auth.signOut}>Sign out</button>
                </div>
              </Show>
            </div>
          </header>
          {props.children}
        </div>
      </div>
      <nav
        class="bottom-nav"
        classList={{ "planner-bottom-nav": activeDestination(location.pathname, "/planner") }}
        aria-label={activeDestination(location.pathname, "/planner") ? "Captain Cook Planner navigation" : "Primary"}
      >
        <Show
          when={activeDestination(location.pathname, "/planner")}
          fallback={<NavLinks mode="bottom" />}
        >
          <PlannerBottomNav />
        </Show>
      </nav>
      <div class="sr-only" aria-live="polite" id="app-live-region"/>
    </>
  );
}
