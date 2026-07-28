import { createEffect, createSignal, type Component } from 'solid-js';
import { InventoryEditor } from './components/inventory_editor';
import { Menu } from './components/menu';
import { Planner } from './features/planner/components/planner';
import {
  AvailableIngredientsBulkAddForm,
  type BulkAddIngredients,
} from './features/available_ingredients_bulk_add_form/outside_feature_exports';
import { useMutation, useQuery } from 'convex-solidjs';
import { api } from '../convex/_generated/api';
import { secretPantryAssign } from './data';
const ingredientsToAdd: BulkAddIngredients = {
  milk: { amount: 1400, unit: 'grams' },
  butter: { amount: 100, unit: 'grams' },
  flour: { amount: 1, unit: 'grams' },
  sugar: { amount: 1, unit: 'grams' },
  salt: { amount: 1, unit: 'grams' },
  'cocoa powder': { amount: 1175, unit: 'grams' },
  eggs: { amount: 150, unit: 'grams' },
};



const App: Component = () => {
  const pantry = useQuery(api.data.getAvailableIngredients, {userId: "shmuli"});

  createEffect(() => {
    const pantryItems = pantry.data();
    if (pantryItems) secretPantryAssign(pantryItems);
  });
  pantry.isLoading
  return (
    <>
    <AvailableIngredientsBulkAddForm ingredientsToAdd={ingredientsToAdd} />
    <Planner />
    <InventoryEditor />
    <Menu />
    </>
  );
};

export default App;
