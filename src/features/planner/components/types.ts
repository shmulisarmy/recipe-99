import { createPlannerProjection } from "../logic";


export type PlannerProjection = Awaited<ReturnType<typeof createPlannerProjection>>;
export type RecipeProjection =
  PlannerProjection[string][number];
