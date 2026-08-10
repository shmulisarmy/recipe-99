import { Navigate, Route, Router, useNavigate, useSearchParams } from "@solidjs/router";
import { Show, createEffect, createSignal, type Component } from "solid-js";
import { useQuery } from "convex-solidjs";
import { api } from "../convex/_generated/api";
import { createPlannerProjection, projection } from "./features/planner/logic";
import { AppShell } from "./components/app_shell";
import { InventoryEditor } from "./components/inventory_editor";
import { Menu } from "./components/menu";
import { Planner } from "./features/planner/components/planner";
import { AvailableIngredientsBulkAddForm, FormTemplateWithDataStructure, type IntakeHandoff } from "./features/available_ingredients_bulk_add_form/outside_feature_exports";
import { Icon } from "./components/ui";

function IntakeRoute(props: { onComplete: (handoff: IntakeHandoff) => void }) {
  const [searchParams] = useSearchParams<{ notice?: string }>();
  return <><Show when={searchParams.notice === "handoff"}><div class="route-notice inline-notice notice-neutral">Start or finish a pantry batch before reconciling today’s cart.</div></Show><AvailableIngredientsBulkAddForm ingredientsToAdd={{}} onComplete={props.onComplete}/></>;
}

function NotFound() {
  return <main class="main" id="main"><div class="empty-state not-found"><Icon name="warning"/><h1>That page is not in Recipe 99.</h1><a class="button button-primary" href="/planner">Go to planner</a></div></main>;
}

const App: Component = () => {
  const pantry = useQuery(api.pantry_exports.getAvailableIngredients, {});
  const menu = useQuery(api.recipe_exports.getAllRecipes, {});
  const planner = useQuery(api.planner_exports.usersPlanner, {});
  const [intakeHandoff, setIntakeHandoff] = createSignal<IntakeHandoff>();

  createEffect(() => {
    const pantryData = pantry.data();
    const menuData = menu.data();
    const plannerData = planner.data();
    if (!pantryData || !menuData || !plannerData) return;
    // for (const key of Object.keys(projection)) delete projection[key];
    Object.assign(projection, createPlannerProjection(plannerData, pantryData, menuData));
  });

  const IntakePage = () => {
    const navigate = useNavigate();
    return <IntakeRoute onComplete={(handoff) => { setIntakeHandoff(handoff); navigate("/intake/reconcile"); }}/>;
  };
  const ReconcilePage = () => {
    const navigate = useNavigate();
    const handoff = intakeHandoff();
    if (!handoff) return <Navigate href="/intake?notice=handoff"/>;
    return <FormTemplateWithDataStructure handoff={handoff} onBack={() => navigate("/intake")} onComplete={() => { setIntakeHandoff(undefined); navigate("/pantry"); }}/>;
  };


  return (
    <Router root={AppShell} scrollRestoration>
      
      <Route path="/" component={() => <Navigate href="/planner"/>}/>
      <Route path="/sign-in" component={() => <Navigate href="/planner"/>}/>
      <Route path="/planner" component={Planner}/>
      <Route path="/planner/day/:date" component={Planner}/>
      <Route path="/planner/day/:date/recipe/:plannedRecipeId" component={Planner}/>
      <Route path="/planner/day/:date/cart" component={Planner}/>
      <Route path="/recipes" component={Menu}/>
      <Route path="/recipes/:recipeKey" component={Menu}/>
      <Route path="/pantry" component={InventoryEditor}/>
      <Route path="/intake" component={IntakePage}/>
      <Route path="/intake/reconcile" component={ReconcilePage}/>
      <Route path="*404" component={NotFound}/>
    </Router>
  );
};




export default App;
