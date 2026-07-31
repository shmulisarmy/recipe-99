/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as data from "../data.js";
import type * as tables_planner_queries from "../tables/planner/queries.js";
import type * as tables_planner_table from "../tables/planner/table.js";
import type * as tables_planner_types from "../tables/planner/types.js";
import type * as types from "../types.js";
import type * as utils_auth from "../utils/auth.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  data: typeof data;
  "tables/planner/queries": typeof tables_planner_queries;
  "tables/planner/table": typeof tables_planner_table;
  "tables/planner/types": typeof tables_planner_types;
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
