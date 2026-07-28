import { createEffect, createSignal, type Component } from 'solid-js';
import { InventoryEditor } from './components/inventory_editor';
import { Menu } from './components/menu';
import { Planner } from './features/planner/components/planner';
import {
  AvailableIngredientsBulkAddForm,
  type BulkAddIngredients,
} from './features/available_ingredients_bulk_add_form/outside_feature_exports';
import { useQuery } from 'convex-solidjs';
import { api } from '../convex/_generated/api';
import { createPlannerProjection, projection } from './features/planner/logic';
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
  const menu = useQuery(api.data.getAllRecipes, {});
  
  createEffect(() => {
    const pd = pantry.data()
    const md = menu.data()
    if (!pd) {console.log("returning early"); return};
    if (!md) {console.log("returning early"); return};
      Object.assign(projection, createPlannerProjection(pd, md));
  });
  return (
    <>
    <AvailableIngredientsBulkAddForm ingredientsToAdd={ingredientsToAdd} />
    <Planner />
    <InventoryEditor />
    <Menu pantry={pantry.data()} />
    </>
  );
};

export default App;
