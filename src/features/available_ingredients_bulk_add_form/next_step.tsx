import { createSignal } from "solid-js";
import { ShoppingCartAlreadyGotDraft } from "./types";
import { today } from "../planner/outside_feature_exports";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex-solidjs";




type IngredientName = keyof ShoppingCartAlreadyGotDraft;
const actions: Record<IngredientName, "keep in todays cart" | "move to tomorrows cart" | "remove from todays cart"> = {}


function handleActions(){
    const toPushOver: string[] = [];
    const toKeepInTodaysCart: string[] = [];
    const toRemoveFromTodaysCart: string[] = [];

    for (const [name, action] of Object.entries(actions)) {
        switch (action) {
            case "keep in todays cart":
                toKeepInTodaysCart.push(name);
                break;
            case "move to tomorrows cart":
                toPushOver.push(name);
                break;
            case "remove from todays cart":
                toRemoveFromTodaysCart.push(name);
                break;
        }
    }

    const m = useMutation(api.planner_exports.PushOverIngredientShoppingItemsForTheNextDay);
    m.mutate({
        ingredientNames: toPushOver,
        dayAsString: today.toDateString(),
    });

}

function setIngredientAction(
    name: IngredientName,
    action: "keep in todays cart" | "move to tomorrows cart" | "remove from todays cart",
) {
    actions[name] = action;
}


export function FormTemplateWithDataStructure(props: {shoppingCartAlreadyGot: ShoppingCartAlreadyGotDraft}) {
    const [actionsHandled, setActionsHandled] = createSignal(false);

    function finishShoppingCart(){
        handleActions();
        setActionsHandled(true);
    }

    void props;
    void actionsHandled;
    void setIngredientAction;
    void finishShoppingCart;


    return (<></>);
}
