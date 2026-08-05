import { createMutable } from "solid-js/store";
import { createSignal } from "solid-js";
import {
    Measurement,
    Measurement_GTE,
    Measurement_Min,
    Measurement_Minus,
    Measurement_Plus,
    Unit,
    ZeroedMeasurement,
} from "../../primitives/measurement";
import { todaysShoppingCart } from "../planner/outside_feature_exports";
import { AvailableIngredientsBulkAddFormProps, BulkAddIngredients, ShoppingCartAlreadyGotDraft } from "./types";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../../convex/_generated/api";
import { PlannerType } from "../planner/data";

function UpdateShoppingCartAlreadyGot(plannerData: PlannerType, ShoppingCartAlreadyGotUpdateDraft: ShoppingCartAlreadyGotDraft) { 
    //for each ingredient in ShoppingCartAlreadyGotUpdateDraft it adds the amount to the shopping cart already got
    for (const [name, amount] of Object.entries(ShoppingCartAlreadyGotUpdateDraft)) {
        todaysShoppingCart(plannerData).alreadyGot[name] = Measurement_Plus(todaysShoppingCart(plannerData).alreadyGot[name]||ZeroedMeasurement(), amount);
    }
}



export function AvailableIngredientsBulkAddForm(props: AvailableIngredientsBulkAddFormProps) {
    const formData = createMutable<BulkAddIngredients>(structuredClone(props.ingredientsToAdd));
    const ShoppingCartAlreadyGotUpdateDraft = createMutable<ShoppingCartAlreadyGotDraft>({});
    const [step, setStep] = createSignal<"bulk-add" | "form-template-with-data-structure">("bulk-add");
    const [isAddingIngredient, setIsAddingIngredient] = createSignal(false);
    const [newIngredientName, setNewIngredientName] = createSignal("");
    const [newIngredientAmount, setNewIngredientAmount] = createSignal(1);
    const [newIngredientUnit, setNewIngredientUnit] = createSignal<Unit>("grams");
    const [addIngredientError, setAddIngredientError] = createSignal("");
    const m = useMutation(api.data.AvailableIngredientsBulkAdd);
    let newIngredientNameInput!: HTMLInputElement;

    const planner = useQuery(api.data.usersPlanner, {});

    function amountForShoppingCart(plannerData: PlannerType, name: string): Measurement | undefined {
        const cart = todaysShoppingCart(plannerData);
        const toGet = cart.toGet[name];
        if (!toGet) return;

        const alreadyGot = cart.alreadyGot[name] ?? ZeroedMeasurement();
        if (Measurement_GTE(alreadyGot, toGet)) return;

        return Measurement_Min(Measurement_Minus(toGet, alreadyGot), formData[name]);
    }

    function setShoppingCartSelection(name: string, selected: boolean) {
        if (!selected) {
            delete ShoppingCartAlreadyGotUpdateDraft[name];
            return;
        }

        const amount = amountForShoppingCart(planner.data()!, name);
        if (amount) ShoppingCartAlreadyGotUpdateDraft[name] = { ...amount };
    }

    function refreshShoppingCartSelection(ingredientName: string) {
        if (ShoppingCartAlreadyGotUpdateDraft[ingredientName]) setShoppingCartSelection(ingredientName, true);
    }

    // for (const name of Object.keys(formData)) {
    //     setShoppingCartSelection(name, true);
    // }

    function removeIngredient(name: string) {
        delete formData[name];
        delete ShoppingCartAlreadyGotUpdateDraft[name];
    }

    function updateIngredientAmount(name: string, amount: number) {
        formData[name].amount = amount;
        refreshShoppingCartSelection(name);
    }

    function updateIngredientUnit(name: string, unit: Unit) {
        formData[name].unit = unit;
        refreshShoppingCartSelection(name);
    }

    function openAddIngredient() {
        setIsAddingIngredient(true);
        queueMicrotask(() => newIngredientNameInput.focus());
    }

    function closeAddIngredient() {
        setIsAddingIngredient(false);
        setNewIngredientName("");
        setNewIngredientAmount(1);
        setNewIngredientUnit("grams");
        setAddIngredientError("");
    }

    function addIngredient() {
        const name = newIngredientName().trim().toLowerCase();
        if (!name) {
            setAddIngredientError("Enter an ingredient name.");
            newIngredientNameInput.focus();
            return;
        }
        if (formData[name]) {
            setAddIngredientError(`${name} is already in this batch.`);
            newIngredientNameInput.focus();
            return;
        }
        if (!Number.isFinite(newIngredientAmount()) || newIngredientAmount() < 0) {
            setAddIngredientError("Enter an amount of zero or more.");
            return;
        }

        formData[name] = {
            amount: newIngredientAmount(),
            unit: newIngredientUnit(),
        };
        setShoppingCartSelection(name, true);
        closeAddIngredient();
    }

    function addIngredientOnEnter(event: KeyboardEvent) {
        if (event.key !== "Enter") return;
        event.preventDefault();
        addIngredient();
    }

    function submitIngredients(event: SubmitEvent) {
        event.preventDefault();
        const entries = Object.entries(formData);
        if (entries.some(([, measurement]) => !Number.isFinite(measurement.amount) || measurement.amount < 0)) return;
        m.mutate({
            ingredientsToAdd: entries.map(([name, measurement]) => ({ name, Measurement: measurement })),
        });

        //
        UpdateShoppingCartAlreadyGot(planner.data()!, ShoppingCartAlreadyGotUpdateDraft);
        //

        setStep("form-template-with-data-structure");
    }

    void step;
    void isAddingIngredient;
    void addIngredientError;
    void removeIngredient;
    void updateIngredientAmount;
    void updateIngredientUnit;
    void openAddIngredient;
    void closeAddIngredient;
    void addIngredient;
    void addIngredientOnEnter;
    void submitIngredients;

    return (<></>);
}
