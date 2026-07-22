import { createPlannerProjection } from "../logic";

export type RecipeProjection =
  ReturnType<typeof createPlannerProjection>[string][number];
