/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_imageUtils from "../agents/imageUtils.js";
import type * as agents_initialIngredientBulkAddFormDraftAgent from "../agents/initialIngredientBulkAddFormDraftAgent.js";
import type * as auth from "../auth.js";
import type * as customUnit_exports from "../customUnit_exports.js";
import type * as pantry_exports from "../pantry_exports.js";
import type * as planner_exports from "../planner_exports.js";
import type * as recipe_exports from "../recipe_exports.js";
import type * as tables_customUnits_actions from "../tables/customUnits/actions.js";
import type * as tables_customUnits_queries from "../tables/customUnits/queries.js";
import type * as tables_customUnits_table from "../tables/customUnits/table.js";
import type * as tables_initialIngredientBulkAddFormDraft_actions from "../tables/initialIngredientBulkAddFormDraft/actions.js";
import type * as tables_initialIngredientBulkAddFormDraft_queries from "../tables/initialIngredientBulkAddFormDraft/queries.js";
import type * as tables_initialIngredientBulkAddFormDraft_table from "../tables/initialIngredientBulkAddFormDraft/table.js";
import type * as tables_initialIngredientBulkAddFormDraft_tools from "../tables/initialIngredientBulkAddFormDraft/tools.js";
import type * as tables_pantryItems_actions from "../tables/pantryItems/actions.js";
import type * as tables_pantryItems_queries from "../tables/pantryItems/queries.js";
import type * as tables_pantryItems_table from "../tables/pantryItems/table.js";
import type * as tables_planner_actions_cart from "../tables/planner/actions/cart.js";
import type * as tables_planner_actions_day from "../tables/planner/actions/day.js";
import type * as tables_planner_actions_recipe from "../tables/planner/actions/recipe.js";
import type * as tables_planner_queries from "../tables/planner/queries.js";
import type * as tables_planner_table from "../tables/planner/table.js";
import type * as tables_planner_types from "../tables/planner/types.js";
import type * as tables_recipes_actions from "../tables/recipes/actions.js";
import type * as tables_recipes_queries from "../tables/recipes/queries.js";
import type * as tables_recipes_table from "../tables/recipes/table.js";
import type * as types from "../types.js";
import type * as utils_auth from "../utils/auth.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/imageUtils": typeof agents_imageUtils;
  "agents/initialIngredientBulkAddFormDraftAgent": typeof agents_initialIngredientBulkAddFormDraftAgent;
  auth: typeof auth;
  customUnit_exports: typeof customUnit_exports;
  pantry_exports: typeof pantry_exports;
  planner_exports: typeof planner_exports;
  recipe_exports: typeof recipe_exports;
  "tables/customUnits/actions": typeof tables_customUnits_actions;
  "tables/customUnits/queries": typeof tables_customUnits_queries;
  "tables/customUnits/table": typeof tables_customUnits_table;
  "tables/initialIngredientBulkAddFormDraft/actions": typeof tables_initialIngredientBulkAddFormDraft_actions;
  "tables/initialIngredientBulkAddFormDraft/queries": typeof tables_initialIngredientBulkAddFormDraft_queries;
  "tables/initialIngredientBulkAddFormDraft/table": typeof tables_initialIngredientBulkAddFormDraft_table;
  "tables/initialIngredientBulkAddFormDraft/tools": typeof tables_initialIngredientBulkAddFormDraft_tools;
  "tables/pantryItems/actions": typeof tables_pantryItems_actions;
  "tables/pantryItems/queries": typeof tables_pantryItems_queries;
  "tables/pantryItems/table": typeof tables_pantryItems_table;
  "tables/planner/actions/cart": typeof tables_planner_actions_cart;
  "tables/planner/actions/day": typeof tables_planner_actions_day;
  "tables/planner/actions/recipe": typeof tables_planner_actions_recipe;
  "tables/planner/queries": typeof tables_planner_queries;
  "tables/planner/table": typeof tables_planner_table;
  "tables/planner/types": typeof tables_planner_types;
  "tables/recipes/actions": typeof tables_recipes_actions;
  "tables/recipes/queries": typeof tables_recipes_queries;
  "tables/recipes/table": typeof tables_recipes_table;
  types: typeof types;
  "utils/auth": typeof utils_auth;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  agent: import("@convex-dev/agent/_generated/component.js").ComponentApi<"agent">;
};
