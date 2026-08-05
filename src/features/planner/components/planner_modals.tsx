import { createSignal, type JSX, onCleanup } from "solid-js";
import { IngredientSet, makeCacheKey, RequiredIngredient } from "../../../data";
import type { RecipeProjection } from "./types";
import {
    Measurement,
    Measurement_Convert,
    Measurement_Divide,
    Measurement_GTE,
    Measurement_Minus,
    Measurement_Plus,
    type Unit,
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
    confirmEscape?: () => boolean;
    headerAction?: JSX.Element;
    wide?: boolean;
    children: JSX.Element;
}) {
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Escape") return;
        if (props.confirmEscape && !props.confirmEscape()) return;
        props.onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    onCleanup(() => window.removeEventListener("keydown", onKeyDown));

    return (<></>);
}

// ---------- Recipe modal ----------

export function RecipeModal(props: {
    item: RecipeProjection;
    dateStr: string;
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
    const [isAddingMissingIngredients, setIsAddingMissingIngredients] = createSignal(false);
    const [missingIngredientsAdded, setMissingIngredientsAdded] = createSignal(false);
    const [addMissingIngredientsError, setAddMissingIngredientsError] = createSignal("");
    const updateRecipeMultiplier = useMutation(
        api.planner_exports.updateRecipeOverrideMultiplier,
    );
    const addIngredientsToCart = useMutation(
        api.planner_exports.BulkUpdateCartToGet,
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
    const addMissingIngredientsToCart = async () => {
        const ingredients: IngredientSet = {};
        for (const { RequiredIngredient: requiredIngredient, have } of props.item.unfulfilledIngredients) {
            const missingAmount = Measurement_Minus(requiredIngredient.Measurement, have);
            const existingAmount = ingredients[requiredIngredient.name];
            ingredients[requiredIngredient.name] = existingAmount
                ? Measurement_Plus(existingAmount, missingAmount)
                : missingAmount;
        }

        setIsAddingMissingIngredients(true);
        setAddMissingIngredientsError("");
        try {
            await addIngredientsToCart.mutate({
                date: props.dateStr,
                ingredients,
            });
            setMissingIngredientsAdded(true);
        } catch {
            setAddMissingIngredientsError("Couldn't add the missing ingredients. Try again.");
        } finally {
            setIsAddingMissingIngredients(false);
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

    const toggleMultiplierMenu = () => setMultiplierMenuOpen((open) => !open);
    const closeMultiplierMenuOnEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || !multiplierMenuOpen()) return;
        event.stopPropagation();
        setMultiplierMenuOpen(false);
    };

    const updateMultiplierDraft = (value: string) => setMultiplierDraft(value);

    void formatMeasurement;
    void dayLabel;
    void currentMultiplier;
    void usingDayDefault;
    void isSavingMultiplier;
    void multiplierError;
    void isAddingMissingIngredients;
    void missingIngredientsAdded;
    void addMissingIngredientsError;
    void saveMultiplier;
    void addMissingIngredientsToCart;
    void useDayDefault;
    void missing;
    void scratchpadEntries;
    void pantry;
    void toggleMultiplierMenu;
    void closeMultiplierMenuOnEscape;
    void updateMultiplierDraft;

    // function GetIngredientMeasurement(name: string): Measurement{
    //     const pantryItems = pantry.data();
    //     for (const ingredient of pantryItems) {
    //         if (ingredient.name_ === name) return ingredient.Measurement;
    //     }
    //     throw new Error(`Ingredient ${name} not found in pantry`);
    // }

    return (<></>);
}

// ---------- Cart modal ----------

export function CartModal(props: {
    dateStr: string; // toDateString() key
    onClose: () => void;
    plannerData: PlannerType
}): JSX.Element {
    type MeasurementDraft = {
        amount: string;
        unit: Unit;
    };

    const [measurementDrafts, setMeasurementDrafts] = createSignal<Record<string, MeasurementDraft>>({});
    const [isSavingCart, setIsSavingCart] = createSignal(false);
    const [cartSaveError, setCartSaveError] = createSignal("");
    const saveCartMeasurements = useMutation(api.planner_exports.BulkSetCartToGet);

    const plannedDay = () => {
        const day = props.plannerData[props.dateStr];
        if (!day) throw new Error(`Could not find planned day for ${props.dateStr}`);
        return day;
    };

    const toGetEntries = () => Object.entries(plannedDay().shoppingCart.toGet);
    const hasMeasurementDrafts = () => Object.keys(measurementDrafts()).length > 0;

    const beginMeasurementEdit = (name: string, measurement: Measurement) => {
        setMeasurementDrafts((drafts) => drafts[name]
            ? drafts
            : {
                ...drafts,
                [name]: {
                    amount: String(measurement.amount),
                    unit: measurement.unit,
                },
            });
    };

    const updateMeasurementDraft = (name: string, update: Partial<MeasurementDraft>) => {
        setMeasurementDrafts((drafts) => ({
            ...drafts,
            [name]: {
                ...drafts[name],
                ...update,
            },
        }));
    };

    const saveMeasurementDrafts = async () => {
        const ingredients = Object.entries(measurementDrafts()).map(([name, draft]) => ({
            name,
            measurement: {
                amount: Number(draft.amount),
                unit: draft.unit,
            },
        }));

        if (ingredients.some(({ measurement }) =>
            !Number.isFinite(measurement.amount) || measurement.amount < 0
        )) {
            setCartSaveError("Enter a valid amount of 0 or more.");
            return;
        }

        setIsSavingCart(true);
        setCartSaveError("");
        try {
            await saveCartMeasurements.mutate({
                date: props.dateStr,
                ingredients,
            });
            setMeasurementDrafts({});
        } catch {
            setCartSaveError("Couldn't save the shopping amounts. Try again.");
        } finally {
            setIsSavingCart(false);
        }
    };

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

    const confirmDiscardDrafts = () =>
        !hasMeasurementDrafts() || window.confirm("Discard unsaved shopping changes?");

    void toGetEntries;
    void isSavingCart;
    void cartSaveError;
    void beginMeasurementEdit;
    void updateMeasurementDraft;
    void saveMeasurementDrafts;
    void percentGot;
    void confirmDiscardDrafts;

    return (<></>);
}
