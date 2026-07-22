import type { Component } from 'solid-js';
import { InventoryEditor } from './components/inventory_editor';
import { Menu } from './components/menu';
import { Planner } from './features/planner/components/planner';
import { AvailableIngredientsBulkAddForm } from './features/available_ingredients_bulk_add_form';




const App: Component = () => {
  return (
    <>
    <AvailableIngredientsBulkAddForm/>
    <Planner />
    <InventoryEditor />
    <Menu />
    </>
  );
};

export default App;
