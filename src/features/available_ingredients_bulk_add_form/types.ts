import { Measurement } from "../../primitives/measurement";

export type BulkAddIngredients = Record<string, Measurement>;
export type ShoppingCartAlreadyGotDraft = Record<string, Measurement>;

export type IntakeHandoff = {
    allocations: ShoppingCartAlreadyGotDraft;
};

export type AvailableIngredientsBulkAddFormProps = {
    ingredientsToAdd: BulkAddIngredients;
    onComplete: (handoff: IntakeHandoff) => void;
};
