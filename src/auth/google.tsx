import { Show, createContext, createEffect, createSignal, onMount, useContext, type Accessor, type JSX } from "solid-js";
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

type Identity = {
    oauthId: string;
    tokenIdentifier: string;
    email: string | null;
};

type AuthContextValue = {
    identity: Accessor<Identity | undefined>;
    signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>();

export function useAuth(): AuthContextValue {
    const value = useContext(AuthContext);
    if (!value) throw new Error("useAuth must be used inside GoogleAuthGate");
    return value;
}

function AuthenticatedApp(props: { children: JSX.Element; onSignOut(): void }) {
    const identity = useQuery(api.auth.getCurrentUserOAuthId, {});
    return (
        <AuthContext.Provider value={{ identity: identity.data, signOut: props.onSignOut }}>
            <Show
                when={!identity.error()}
                fallback={<main class="auth-page"><section class="sign-in-panel"><h1>Sign-in could not be confirmed.</h1><p>Return to sign-in and try again.</p><button class="button button-primary" type="button" onClick={props.onSignOut}>Return to sign-in</button></section></main>}
            >
                {props.children}
            </Show>
        </AuthContext.Provider>
    );
}

export function GoogleAuthGate(props: { children: JSX.Element }) {
    const [isAuthenticated, setIsAuthenticated] = createSignal(false);
    const [authError, setAuthError] = createSignal<string>();
    const [googleState, setGoogleState] = createSignal<"loading" | "ready" | "failed">("loading");
    const [isSigningIn, setIsSigningIn] = createSignal(false);
    let googleButton!: HTMLDivElement;
    let errorNotice: HTMLDivElement | undefined;

    const setupGoogle = async () => {
        if (!GOOGLE_CLIENT_ID) {
            setAuthError("Google sign-in is not configured for this app.");
            setGoogleState("failed");
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
                    setIsSigningIn(true);
                    convexClient.setAuth(
                        fetchGoogleIdToken,
                        (authenticated) => {
                            setIsAuthenticated(authenticated);
                            setIsSigningIn(false);
                            if (!authenticated) setAuthError("Sign-in could not be completed. Try again.");
                        },
                    );
                },
            });
            googleButton.replaceChildren();
            google.accounts.id.renderButton(googleButton, {
                theme: "outline",
                size: "large",
                shape: "rectangular",
                text: "signin_with",
            });
            setGoogleState("ready");

            if (restoreGoogleIdToken()) {
                setIsSigningIn(true);
                convexClient.setAuth(fetchGoogleIdToken, (authenticated) => {
                    setIsAuthenticated(authenticated);
                    setIsSigningIn(false);
                });
            }
        } catch (error) {
            void error;
            setAuthError("Google sign-in could not load. Check your connection and try again.");
            setGoogleState("failed");
        }
    };

    onMount(() => {
        void setupGoogle();
    });

    createEffect(() => {
        if (isAuthenticated() && window.location.pathname === "/sign-in") {
            window.history.replaceState(null, "", "/planner");
        }
    });

    createEffect(() => {
        if (authError()) queueMicrotask(() => errorNotice?.focus());
    });

    function signOut() {
        forgetGoogleIdToken();
        convexClient.setAuth(async () => null, setIsAuthenticated);
        setIsAuthenticated(false);
        window.google?.accounts.id.disableAutoSelect();
        window.history.replaceState(null, "", "/sign-in");
    }

    return (
        <Show when={isAuthenticated()} fallback={
            <main class="auth-page" id="main">
                <section class="auth-thesis" aria-labelledby="sign-in-title">
                    <a class="wordmark auth-wordmark" href="/sign-in"><span class="wordmark-mark" aria-hidden="true">99</span>Recipe 99</a>
                    <h1 id="sign-in-title">Plan meals from what’s already in your kitchen.</h1>
                    <p>Recipe 99 connects your pantry, recipes, calendar, and shopping needs.</p>
                    <div class="auth-chain" aria-hidden="true"><span>Pantry</span><span>Recipes</span><span>Plan</span><span>Shopping</span></div>
                </section>
                <section class="sign-in-panel" aria-labelledby="sign-in-panel-title">
                    <h2 id="sign-in-panel-title">Sign in to your kitchen plan</h2>
                    <p>Your pantry, recipes, and shopping amounts stay with your account.</p>
                    <div class="google-button-slot" classList={{ "is-loading": googleState() === "loading" }} ref={googleButton}/>
                    <Show when={googleState() === "loading"}><p class="auth-status">Loading Google sign-in…</p></Show>
                    <Show when={isSigningIn()}><p class="auth-status" aria-live="polite">Signing in…</p></Show>
                    <Show when={authError()}>{(message) => <div ref={errorNotice} class="inline-notice notice-error" role="alert" tabindex="-1"><p>{message()}</p><Show when={googleState() === "failed" && !!GOOGLE_CLIENT_ID}><button class="button button-secondary" type="button" onClick={() => { setGoogleState("loading"); setAuthError(undefined); void setupGoogle(); }}>Try again</button></Show></div>}</Show>
                </section>
            </main>
        }>
            <AuthenticatedApp onSignOut={signOut}>{props.children}</AuthenticatedApp>
        </Show>
    );
}
