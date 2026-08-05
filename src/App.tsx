import { createEffect, type Component } from 'solid-js';
import { useQuery } from 'convex-solidjs';
import { api } from '../convex/_generated/api';
import { createPlannerProjection, projection } from './features/planner/logic';
const App: Component = () => {
  const pantry = useQuery(api.data.getAvailableIngredients, {});
  const menu = useQuery(api.data.getAllRecipes, {});
  const planner = useQuery(api.data.usersPlanner, {});
  
  createEffect(() => {
    const pd = pantry.data()
    const md = menu.data()
    const plannerData = planner.data()
    if (!pd) {console.log("returning early"); return};
    if (!md) {console.log("returning early"); return};
    if (!plannerData) {console.log("returning early"); return};
      Object.assign(projection, createPlannerProjection(plannerData, pd, md));
  });
  return (<></>);
};





export default App;
