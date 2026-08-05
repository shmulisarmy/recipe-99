import { createSignal } from "solid-js";
import { Measurement_Convert, Unit } from "../primitives/measurement";
import { useMutation, useQuery } from "convex-solidjs";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

const ALL_UNITS: Unit[] = ["grams", "kilograms", "ounces", "pounds"];

function fmt(n: number): string {
  return parseFloat(n.toPrecision(4)).toString();
}

function IngredientRow(props: { ingredient: Doc<"pantryItems">}) {
  const updateIngredient = useMutation(api.data.updateAvailableIngredient);

  const [amount, setAmount] = createSignal(props.ingredient.Measurement.amount);
  const [targetUnit, setTargetUnit] = createSignal<Unit>(props.ingredient.Measurement.unit);

  const canConvert = () => targetUnit() !== props.ingredient.Measurement.unit;
  const convertedPreview = () =>
    canConvert() ? Measurement_Convert(props.ingredient.Measurement, targetUnit()) : null;

  function applyAmount() {
    const v = amount();
    if (isNaN(v) || v < 0) return;
    
    updateIngredient.mutate({
      ingredientName: props.ingredient.name_,
      measurement: { amount: v, unit: targetUnit() },
    });
  }

  function applyConvert() {
    const converted = convertedPreview();
    if (!converted) return;
    updateIngredient.mutate({
      ingredientName: props.ingredient.name_, 
      measurement: converted,
    });
    setAmount(converted.amount);
    setTargetUnit(converted.unit);
  }

  function updateAmount(value: string) {
    setAmount(Number.parseFloat(value));
  }

  function updateTargetUnit(unit: Unit) {
    setTargetUnit(unit);
  }

  function applyAmountOnEnter(event: KeyboardEvent) {
    if (event.key === "Enter") applyAmount();
  }

  void ALL_UNITS;
  void fmt;
  void updateAmount;
  void updateTargetUnit;
  void applyAmountOnEnter;
  void applyConvert;

  return (<></>);
}

export function InventoryEditor() {
  const pantry = useQuery(api.data.getAvailableIngredients, {});
  void pantry;
  return (<></>);
}
