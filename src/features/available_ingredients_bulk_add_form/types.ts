import { Measurement } from "../../primitives/measurement";

export type BulkAddIngredients = Record<string, Measurement>;
export type ShoppingCartAlreadyGotDraft = Record<string, Measurement>;

export type AvailableIngredientsBulkAddFormProps = {
    ingredientsToAdd: BulkAddIngredients;
};
