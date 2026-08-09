/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as pantry_exports from "../pantry_exports.js";
import type * as planner_exports from "../planner_exports.js";
import type * as recipe_exports from "../recipe_exports.js";
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
  auth: typeof auth;
  pantry_exports: typeof pantry_exports;
  planner_exports: typeof planner_exports;
  recipe_exports: typeof recipe_exports;
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

export declare const components: {};
