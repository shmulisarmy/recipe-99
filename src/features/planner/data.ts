import { createMutable } from "solid-js/store";
import type { FunctionReturnType } from "convex/server";
import { api } from "../../../convex/_generated/api";
import {PlannedDay } from "./types";
import { genId } from "../../utils/id";
import { Morrow } from "./utils";



export type UsersPlannerQueryResult = FunctionReturnType<
    typeof api.planner_exports.usersPlanner
>;
// export const planner: UsersPlannerQueryResult = {} as Record<string, PlannedDay>;
export type PlannerType = Record<string, PlannedDay>;

// {
//     [Morrow(-22).toDateString()]: {
//         date: Morrow(-22).toDateString(),
//         _id: genId(),
//         _creationTime: Date.now(),
//         userId: 'user-1',
//         recipes: [
//             { recipeId: {title: 'mashed potatoes', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//             { recipeId: {title: 'chicken soup', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//         ],
//         multiplier: 1,
//         shoppingCart: {
//             toGet: {
//                 milk:   { amount: 1, unit: 'grams' },
//                 butter: { amount: 1, unit: 'grams' },
//                 flour:  { amount: 1, unit: 'grams' },
//                 sugar:  { amount: 1, unit: 'grams' },
//                 salt:   { amount: 1, unit: 'grams' },
//             },
//             alreadyGot: {},
//         },
//     },
//     [Morrow(0).toDateString()]: {
//         date: Morrow(0).toDateString(),
//         _id: genId(),
//         _creationTime: Date.now(),
//         userId: 'user-1',
//         recipes: [
//             { recipeId: {title: 'chocolate cake', version: 1}, id: genId() },
//             { recipeId: {title: 'pancakes', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//         ],
//         multiplier: 2,
//         shoppingCart: {
//             toGet: {
//                 flour: { amount: 250, unit: 'grams' },
//                 sugar: { amount: 200, unit: 'grams' },
//             },
//             alreadyGot: {
//                 milk: { amount: 500, unit: 'grams' },
//             },
//         },
//     },
//     [Morrow(1).toDateString()]: {
//         date: Morrow(1).toDateString(),
//         _id: genId(),
//         _creationTime: Date.now(),
//         userId: 'user-1',
//         recipes: [
//             { recipeId: {title: 'scrambled eggs', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//             { recipeId: {title: 'grilled cheese', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//         ],
//         multiplier: 1,
//         shoppingCart: {
//             toGet: {
//                 butter: { amount: 100, unit: 'grams' },
//                 salt:   { amount: 10, unit: 'grams' },
//             },
//             alreadyGot: {
//                 butter: { amount: 50, unit: 'grams' },
//                 salt:   { amount: 3, unit: 'grams' },
//             },
//         },
//     },
//     [Morrow(2).toDateString()]: {
//         date: Morrow(2).toDateString(),
//         _id: genId(),
//         _creationTime: Date.now(),
//         userId: 'user-1',
//         recipes: [
//             { recipeId: {title: 'macaroni and cheese', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//             { recipeId: {title: 'tomato pasta', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//         ],
//         multiplier: 1,
//         shoppingCart: {
//             toGet: {
//                 flour: { amount: 1, unit: 'pounds' },
//             },
//             alreadyGot: {
//                 salt:   { amount: 20, unit: 'grams' },
//                 butter: { amount: 4, unit: 'ounces' },
//             },
//         },
//     },
//     [Morrow(3).toDateString()]: {
//         date: Morrow(3).toDateString(),
//         _id: genId(),
//         _creationTime: Date.now(),
//         userId: 'user-1',
//         recipes: [
//             { recipeId: {title: 'mashed potatoes', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//             { recipeId: {title: 'chicken soup', version: 1}, overrideDayMultiplier: 1.5, id: genId() },
//         ],
//         multiplier: 1,
//         shoppingCart: {
//             toGet: {
//                 milk:   { amount: 1, unit: 'kilograms' },
//                 butter: { amount: 150, unit: 'grams' },
//             },
//             alreadyGot: {
//                 sugar: { amount: 50, unit: 'grams' },
//             },
//         },
//     },
// }
