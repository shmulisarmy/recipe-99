import { createMutable } from "solid-js/store";
import {PlannedDay } from "./types";
import { genId } from "../../utils/id";
import { Morrow } from "./utils";


export const planner = createMutable<Record<string, PlannedDay>>({
    [Morrow(-22).toDateString()]: {
        date: Morrow(-22),
        recipes: [
            { recipe: 'mashed potatoes', overrideDayMultiplier: 1.5, id: genId() },
            { recipe: 'chicken soup', overrideDayMultiplier: 1.5, id: genId() },
        ],
        multiplier: 1,
        shoppingCart: {
            toGet: {
                milk:   { amount: 1, unit: 'grams' },
                butter: { amount: 1, unit: 'grams' },
                flour:  { amount: 1, unit: 'grams' },
                sugar:  { amount: 1, unit: 'grams' },
                salt:   { amount: 1, unit: 'grams' },
            },
            alreadyGot: {},
        },
    },
    [Morrow(0).toDateString()]: {
        date: Morrow(0),
        recipes: [
            { recipe: 'chocolate cake', id: genId() },
            { recipe: 'pancakes', overrideDayMultiplier: 1.5, id: genId() },
        ],
        multiplier: 2,
        shoppingCart: {
            toGet: {
                flour: { amount: 250, unit: 'grams' },
                sugar: { amount: 200, unit: 'grams' },
            },
            alreadyGot: {
                milk: { amount: 500, unit: 'grams' },
            },
        },
    },
    [Morrow(1).toDateString()]: {
        date: Morrow(1),
        recipes: [
            { recipe: 'scrambled eggs', overrideDayMultiplier: 1.5, id: genId() },
            { recipe: 'grilled cheese', overrideDayMultiplier: 1.5, id: genId() },
        ],
        multiplier: 1,
        shoppingCart: {
            toGet: {
                butter: { amount: 100, unit: 'grams' },
                salt:   { amount: 10, unit: 'grams' },
            },
            alreadyGot: {
                butter: { amount: 50, unit: 'grams' },
                salt:   { amount: 3, unit: 'grams' },
            },
        },
    },
    [Morrow(2).toDateString()]: {
        date: Morrow(2),
        recipes: [
            { recipe: 'macaroni and cheese', overrideDayMultiplier: 1.5, id: genId() },
            { recipe: 'tomato pasta', overrideDayMultiplier: 1.5, id: genId() },
        ],
        multiplier: 1,
        shoppingCart: {
            toGet: {
                flour: { amount: 1, unit: 'pounds' },
            },
            alreadyGot: {
                salt:   { amount: 20, unit: 'grams' },
                butter: { amount: 4, unit: 'ounces' },
            },
        },
    },
    [Morrow(3).toDateString()]: {
        date: Morrow(3),
        recipes: [
            { recipe: 'mashed potatoes', overrideDayMultiplier: 1.5, id: genId() },
            { recipe: 'chicken soup', overrideDayMultiplier: 1.5, id: genId() },
        ],
        multiplier: 1,
        shoppingCart: {
            toGet: {
                milk:   { amount: 1, unit: 'kilograms' },
                butter: { amount: 150, unit: 'grams' },
            },
            alreadyGot: {
                sugar: { amount: 50, unit: 'grams' },
            },
        },
    },
});
