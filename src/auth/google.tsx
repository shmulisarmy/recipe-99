import { createSignal, onMount, Show, type JSX } from "solid-js";
import { useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { convexClient } from "../convex_client";

type GoogleCredentialResponse = {
    credential: string;
};

type GoogleIdentityServices = {
    accounts: {
        id: {
            initialize(config: {
                client_id: string;
                callback(response: GoogleCredentialResponse): void;
                ux_mode: "popup";
            }): void;
            renderButton(
                parent: HTMLElement,
                options: {
                    theme: "outline";
                    size: "large";
                    shape: "rectangular";
                    text: "signin_with";
                },
            ): void;
            disableAutoSelect(): void;
        };
    };
};

declare global {
    interface Window {
        google?: GoogleIdentityServices;
    }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_ID_TOKEN_SESSION_KEY = "recipe-99.google-id-token";
let currentGoogleIdToken: string | null = null;

function isUsableGoogleIdToken(token: string): boolean {
    try {
        const encodedPayload = token.split(".")[1];
        if (!encodedPayload) return false;

        const base64 = encodedPayload
            .replaceAll("-", "+")
            .replaceAll("_", "/")
            .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
        const payload = JSON.parse(atob(base64)) as {
            aud?: unknown;
            exp?: unknown;
        };

        return (
            payload.aud === GOOGLE_CLIENT_ID &&
            typeof payload.exp === "number" &&
            payload.exp * 1000 > Date.now() + 30_000
        );
    } catch {
        return false;
    }
}

function rememberGoogleIdToken(token: string): void {
    currentGoogleIdToken = token;
    sessionStorage.setItem(GOOGLE_ID_TOKEN_SESSION_KEY, token);
}

function forgetGoogleIdToken(): void {
    currentGoogleIdToken = null;
    sessionStorage.removeItem(GOOGLE_ID_TOKEN_SESSION_KEY);
}

function restoreGoogleIdToken(): string | null {
    const token = sessionStorage.getItem(GOOGLE_ID_TOKEN_SESSION_KEY);
    if (!token || !isUsableGoogleIdToken(token)) {
        forgetGoogleIdToken();
        return null;
    }

    currentGoogleIdToken = token;
    return token;
}

function fetchGoogleIdToken(): Promise<string | null> {
    if (!currentGoogleIdToken || !isUsableGoogleIdToken(currentGoogleIdToken)) {
        forgetGoogleIdToken();
        return Promise.resolve(null);
    }

    return Promise.resolve(currentGoogleIdToken);
}

function loadGoogleIdentityServices(): Promise<GoogleIdentityServices> {
    if (window.google) return Promise.resolve(window.google);

    return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            'script[src="https://accounts.google.com/gsi/client"]',
        );
        const script = existing ?? document.createElement("script");

        const handleLoad = () => {
            if (window.google) resolve(window.google);
            else reject(new Error("Google Identity Services did not initialize"));
        };

        script.addEventListener("load", handleLoad, { once: true });
        script.addEventListener(
            "error",
            () => reject(new Error("Could not load Google Identity Services")),
            { once: true },
        );

        if (!existing) {
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            document.head.append(script);
        }
    });
}

function AuthenticatedApp(props: { children: JSX.Element; onSignOut(): void }) {
    const identity = useQuery(api.data.getCurrentUserOAuthId, {});

    return (
        <>
            <header class="sticky top-0 z-50 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-stone-900">
                            Signed in{identity.data()?.email ? ` as ${identity.data()?.email}` : ""}
                        </p>
                        <p class="truncate text-xs text-stone-500">
                            Google OAuth ID: {identity.data()?.oauthId ?? "Checking…"}
                        </p>
                    </div>
                    <button
                        type="button"
                        class="shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
                        onClick={props.onSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </header>
            {props.children}
        </>
    );
}

export function GoogleAuthGate(props: { children: JSX.Element }) {
    const [isAuthenticated, setIsAuthenticated] = createSignal(false);
    const [authError, setAuthError] = createSignal<string>();
    let googleButton!: HTMLDivElement;

    onMount(async () => {
        if (!GOOGLE_CLIENT_ID) {
            setAuthError("VITE_GOOGLE_CLIENT_ID is not configured.");
            return;
        }

        try {
            const google = await loadGoogleIdentityServices();
            google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                ux_mode: "popup",
                callback: ({ credential }) => {
                    rememberGoogleIdToken(credential);
                    setAuthError(undefined);
                    convexClient.setAuth(
                        fetchGoogleIdToken,
                        setIsAuthenticated,
                    );
                },
            });
            google.accounts.id.renderButton(googleButton, {
                theme: "outline",
                size: "large",
                shape: "rectangular",
                text: "signin_with",
            });

            if (restoreGoogleIdToken()) {
                convexClient.setAuth(fetchGoogleIdToken, setIsAuthenticated);
            }
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : "Google sign-in failed to load.");
        }
    });

    function signOut() {
        forgetGoogleIdToken();
        convexClient.setAuth(async () => null, setIsAuthenticated);
        setIsAuthenticated(false);
        window.google?.accounts.id.disableAutoSelect();
    }

    return (
        <>
            <main
                class="grid min-h-screen place-items-center bg-stone-50 px-4"
                classList={{ hidden: isAuthenticated() }}
            >
                <section class="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-sm ring-1 ring-stone-200">
                    <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Recipe-99
                    </p>
                    <h1 class="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                        Sign in to your pantry
                    </h1>
                    <p class="mt-2 text-sm leading-6 text-stone-500">
                        Your Google identity keeps your pantry separate from other users.
                    </p>
                    <div class="mt-6 flex justify-center" ref={googleButton} />
                    <Show when={authError()}>
                        {(message) => (
                            <p class="mt-4 text-sm text-red-700" role="alert">
                                {message()}
                            </p>
                        )}
                    </Show>
                </section>
            </main>

            <Show when={isAuthenticated()}>
                <AuthenticatedApp onSignOut={signOut}>
                    {props.children}
                </AuthenticatedApp>
            </Show>
        </>
    );
}
