import { createMutable } from "solid-js/store";
import { Measurement } from "./primitives/measurement";

type Ingredient = {
    name: string;
    Measurement: Measurement;
  };
  
  
  export type RequiredIngredient = Ingredient & {
    substitute?: Ingredient;
  };
  
  export type Recipe = {
    title: string;
    description: string;
    requiredIngredients: RequiredIngredient[];
  };



  export type RecipeName = string;
  
  export type IngredientSet = Record<string, Measurement>;
  
  export const AvailableIngredients = createMutable<IngredientSet>({
    milk:         { amount: 1400,   unit: 'grams' },
    butter:       { amount: 100,   unit: 'grams' },
    flour:        { amount: 1,   unit: 'grams' },
    sugar:        { amount: 1,   unit: 'grams' },
    salt:         { amount: 1,   unit: 'grams' },
    'cocoa powder': { amount: 1175,  unit: 'grams' },
    eggs:         { amount: 150, unit: 'grams' },
  });
  
  
  
  
  
  export const menu = new Map<RecipeName, Recipe>([
    [
      'chocolate cake',
      {
        title: 'chocolate cake',
        description: 'A rich and moist chocolate cake.',
        requiredIngredients: [
          {
            name: 'flour',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'almond flour',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'sugar',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'brown sugar',
              Measurement: {
                amount: 200,
                unit: 'grams',
              },
            },
          },
          {
            name: 'cocoa powder',
            Measurement: {
              amount: 75,
              unit: 'grams',
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 125,
              unit: 'grams',
            },
            substitute: {
              name: 'coconut oil',
              Measurement: {
                amount: 100,
                unit: 'grams',
              },
            },
          },
          {
            name: 'milk',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'oat milk',
              Measurement: {
                amount: 200,
                unit: 'grams',
              },
            },
          },
          {
            name: 'eggs',
            Measurement: {
              amount: 150,
              unit: 'grams',
            },
            substitute: {
              name: 'applesauce',
              Measurement: {
                amount: 180,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'pancakes',
      {
        title: 'pancakes',
        description: 'Soft and fluffy breakfast pancakes.',
        requiredIngredients: [
          {
            name: 'flour',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'oat flour',
              Measurement: {
                amount: 200,
                unit: 'grams',
              },
            },
          },
          {
            name: 'milk',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'almond milk',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'eggs',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'mashed banana',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
          {
            name: 'sugar',
            Measurement: {
              amount: 30,
              unit: 'grams',
            },
            substitute: {
              name: 'honey',
              Measurement: {
                amount: 25,
                unit: 'grams',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 40,
              unit: 'grams',
            },
            substitute: {
              name: 'vegetable oil',
              Measurement: {
                amount: 35,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'scrambled eggs',
      {
        title: 'scrambled eggs',
        description: 'Creamy scrambled eggs cooked with butter and milk.',
        requiredIngredients: [],
      },
    ],
  
    [
      'grilled cheese',
      {
        title: 'grilled cheese',
        description: 'Crispy toasted bread filled with melted cheese.',
        requiredIngredients: [
          {
            name: 'bread',
            Measurement: {
              amount: 120,
              unit: 'grams',
            },
            substitute: {
              name: 'gluten free bread',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
          {
            name: 'cheddar cheese',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'mozzarella cheese',
              Measurement: {
                amount: 100,
                unit: 'grams',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 25,
              unit: 'grams',
            },
            substitute: {
              name: 'mayonnaise',
              Measurement: {
                amount: 25,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'macaroni and cheese',
      {
        title: 'macaroni and cheese',
        description: 'Pasta covered in a creamy cheese sauce.',
        requiredIngredients: [
          {
            name: 'macaroni',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'shell pasta',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'cheddar cheese',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'gouda cheese',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'milk',
            Measurement: {
              amount: 400,
              unit: 'grams',
            },
            substitute: {
              name: 'oat milk',
              Measurement: {
                amount: 400,
                unit: 'grams',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 50,
              unit: 'grams',
            },
            substitute: {
              name: 'margarine',
              Measurement: {
                amount: 50,
                unit: 'grams',
              },
            },
          },
          {
            name: 'flour',
            Measurement: {
              amount: 40,
              unit: 'grams',
            },
            substitute: {
              name: 'cornstarch',
              Measurement: {
                amount: 20,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'tomato pasta',
      {
        title: 'tomato pasta',
        description: 'Pasta served with a simple tomato and garlic sauce.',
        requiredIngredients: [
          {
            name: 'spaghetti',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'penne',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'tomatoes',
            Measurement: {
              amount: 500,
              unit: 'grams',
            },
            substitute: {
              name: 'canned tomatoes',
              Measurement: {
                amount: 500,
                unit: 'grams',
              },
            },
          },
          {
            name: 'olive oil',
            Measurement: {
              amount: 40,
              unit: 'grams',
            },
            substitute: {
              name: 'vegetable oil',
              Measurement: {
                amount: 40,
                unit: 'grams',
              },
            },
          },
          {
            name: 'garlic',
            Measurement: {
              amount: 15,
              unit: 'grams',
            },
            substitute: {
              name: 'garlic powder',
              Measurement: {
                amount: 4,
                unit: 'grams',
              },
            },
          },
          {
            name: 'salt',
            Measurement: {
              amount: 5,
              unit: 'grams',
            },
          },
        ],
      },
    ],
  
    [
      'mashed potatoes',
      {
        title: 'mashed potatoes',
        description: 'Creamy mashed potatoes made with butter and milk.',
        requiredIngredients: [
          {
            name: 'potatoes',
            Measurement: {
              amount: 1,
              unit: 'kilograms',
            },
            substitute: {
              name: 'sweet potatoes',
              Measurement: {
                amount: 1,
                unit: 'kilograms',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 75,
              unit: 'grams',
            },
            substitute: {
              name: 'olive oil',
              Measurement: {
                amount: 60,
                unit: 'grams',
              },
            },
          },
          {
            name: 'milk',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'cream',
              Measurement: {
                amount: 150,
                unit: 'grams',
              },
            },
          },
          {
            name: 'salt',
            Measurement: {
              amount: 8,
              unit: 'grams',
            },
          },
        ],
      },
    ],
  
    [
      'chicken soup',
      {
        title: 'chicken soup',
        description: 'A hearty chicken soup with vegetables.',
        requiredIngredients: [
          {
            name: 'chicken',
            Measurement: {
              amount: 1,
              unit: 'kilograms',
            },
            substitute: {
              name: 'turkey',
              Measurement: {
                amount: 1,
                unit: 'kilograms',
              },
            },
          },
          {
            name: 'carrots',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'sweet potatoes',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'celery',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'fennel',
              Measurement: {
                amount: 200,
                unit: 'grams',
              },
            },
          },
          {
            name: 'onions',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'leeks',
              Measurement: {
                amount: 200,
                unit: 'grams',
              },
            },
          },
          {
            name: 'water',
            Measurement: {
              amount: 2,
              unit: 'kilograms',
            },
          },
          {
            name: 'salt',
            Measurement: {
              amount: 15,
              unit: 'grams',
            },
          },
        ],
      },
    ],
  
    [
      'tuna sandwich',
      {
        title: 'tuna sandwich',
        description: 'A simple tuna salad sandwich.',
        requiredIngredients: [
          {
            name: 'tuna',
            Measurement: {
              amount: 150,
              unit: 'grams',
            },
            substitute: {
              name: 'chickpeas',
              Measurement: {
                amount: 180,
                unit: 'grams',
              },
            },
          },
          {
            name: 'mayonnaise',
            Measurement: {
              amount: 40,
              unit: 'grams',
            },
            substitute: {
              name: 'greek yogurt',
              Measurement: {
                amount: 40,
                unit: 'grams',
              },
            },
          },
          {
            name: 'bread',
            Measurement: {
              amount: 120,
              unit: 'grams',
            },
            substitute: {
              name: 'wrap',
              Measurement: {
                amount: 100,
                unit: 'grams',
              },
            },
          },
          {
            name: 'celery',
            Measurement: {
              amount: 30,
              unit: 'grams',
            },
            substitute: {
              name: 'cucumber',
              Measurement: {
                amount: 30,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'peanut butter cookies',
      {
        title: 'peanut butter cookies',
        description: 'Soft cookies with a strong peanut butter flavor.',
        requiredIngredients: [
          {
            name: 'peanut butter',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'almond butter',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'sugar',
            Measurement: {
              amount: 180,
              unit: 'grams',
            },
            substitute: {
              name: 'brown sugar',
              Measurement: {
                amount: 180,
                unit: 'grams',
              },
            },
          },
          {
            name: 'eggs',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'applesauce',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
          {
            name: 'flour',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'oat flour',
              Measurement: {
                amount: 100,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'banana bread',
      {
        title: 'banana bread',
        description: 'A moist sweet bread made with ripe bananas.',
        requiredIngredients: [
          {
            name: 'bananas',
            Measurement: {
              amount: 350,
              unit: 'grams',
            },
            substitute: {
              name: 'applesauce',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'flour',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'whole wheat flour',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'sugar',
            Measurement: {
              amount: 150,
              unit: 'grams',
            },
            substitute: {
              name: 'honey',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'coconut oil',
              Measurement: {
                amount: 80,
                unit: 'grams',
              },
            },
          },
          {
            name: 'eggs',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'greek yogurt',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'rice and beans',
      {
        title: 'rice and beans',
        description: 'A filling meal made with seasoned rice and beans.',
        requiredIngredients: [
          {
            name: 'rice',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'quinoa',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'black beans',
            Measurement: {
              amount: 400,
              unit: 'grams',
            },
            substitute: {
              name: 'kidney beans',
              Measurement: {
                amount: 400,
                unit: 'grams',
              },
            },
          },
          {
            name: 'onions',
            Measurement: {
              amount: 150,
              unit: 'grams',
            },
            substitute: {
              name: 'shallots',
              Measurement: {
                amount: 150,
                unit: 'grams',
              },
            },
          },
          {
            name: 'tomatoes',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'canned tomatoes',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'olive oil',
            Measurement: {
              amount: 30,
              unit: 'grams',
            },
            substitute: {
              name: 'vegetable oil',
              Measurement: {
                amount: 30,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  
    [
      'roasted vegetables',
      {
        title: 'roasted vegetables',
        description: 'Mixed vegetables roasted with oil and seasoning.',
        requiredIngredients: [
          {
            name: 'potatoes',
            Measurement: {
              amount: 400,
              unit: 'grams',
            },
            substitute: {
              name: 'sweet potatoes',
              Measurement: {
                amount: 400,
                unit: 'grams',
              },
            },
          },
          {
            name: 'carrots',
            Measurement: {
              amount: 250,
              unit: 'grams',
            },
            substitute: {
              name: 'parsnips',
              Measurement: {
                amount: 250,
                unit: 'grams',
              },
            },
          },
          {
            name: 'broccoli',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'cauliflower',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'olive oil',
            Measurement: {
              amount: 60,
              unit: 'grams',
            },
            substitute: {
              name: 'avocado oil',
              Measurement: {
                amount: 60,
                unit: 'grams',
              },
            },
          },
          {
            name: 'salt',
            Measurement: {
              amount: 8,
              unit: 'grams',
            },
          },
        ],
      },
    ],
  
    [
      'chicken and rice',
      {
        title: 'chicken and rice',
        description: 'Seasoned chicken served over cooked rice.',
        requiredIngredients: [
          {
            name: 'chicken',
            Measurement: {
              amount: 600,
              unit: 'grams',
            },
            substitute: {
              name: 'turkey',
              Measurement: {
                amount: 600,
                unit: 'grams',
              },
            },
          },
          {
            name: 'rice',
            Measurement: {
              amount: 300,
              unit: 'grams',
            },
            substitute: {
              name: 'quinoa',
              Measurement: {
                amount: 300,
                unit: 'grams',
              },
            },
          },
          {
            name: 'onions',
            Measurement: {
              amount: 150,
              unit: 'grams',
            },
            substitute: {
              name: 'shallots',
              Measurement: {
                amount: 150,
                unit: 'grams',
              },
            },
          },
          {
            name: 'olive oil',
            Measurement: {
              amount: 40,
              unit: 'grams',
            },
            substitute: {
              name: 'vegetable oil',
              Measurement: {
                amount: 40,
                unit: 'grams',
              },
            },
          },
          {
            name: 'salt',
            Measurement: {
              amount: 8,
              unit: 'grams',
            },
          },
        ],
      },
    ],
  
    [
      'vegetable omelette',
      {
        title: 'vegetable omelette',
        description: 'An egg omelette filled with vegetables and cheese.',
        requiredIngredients: [
          {
            name: 'eggs',
            Measurement: {
              amount: 200,
              unit: 'grams',
            },
            substitute: {
              name: 'chickpea flour',
              Measurement: {
                amount: 120,
                unit: 'grams',
              },
            },
          },
          {
            name: 'bell peppers',
            Measurement: {
              amount: 100,
              unit: 'grams',
            },
            substitute: {
              name: 'tomatoes',
              Measurement: {
                amount: 100,
                unit: 'grams',
              },
            },
          },
          {
            name: 'onions',
            Measurement: {
              amount: 60,
              unit: 'grams',
            },
            substitute: {
              name: 'scallions',
              Measurement: {
                amount: 60,
                unit: 'grams',
              },
            },
          },
          {
            name: 'cheddar cheese',
            Measurement: {
              amount: 75,
              unit: 'grams',
            },
            substitute: {
              name: 'mozzarella cheese',
              Measurement: {
                amount: 75,
                unit: 'grams',
              },
            },
          },
          {
            name: 'butter',
            Measurement: {
              amount: 20,
              unit: 'grams',
            },
            substitute: {
              name: 'olive oil',
              Measurement: {
                amount: 15,
                unit: 'grams',
              },
            },
          },
        ],
      },
    ],
  ]);
  