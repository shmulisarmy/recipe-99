import {z} from "zod";


function convertToGrams(measurement: Measurement): number {
  zMeasurement.parse(measurement);
  switch (measurement.unit) {
    case 'grams':
      return measurement.amount;

    case 'kilograms':
      return measurement.amount * 1000;

    case 'ounces':
      return measurement.amount * 28.3495;

    case 'pounds':
      return measurement.amount * 453.59237;
  }
}

function convertFromGrams(
  gramAmount: number,
  convertTo: Unit,
): Measurement {
  zBuiltinUnit.parse(convertTo);
  switch (convertTo) {
    case 'grams':
      return {
        amount: gramAmount,
        unit: 'grams',
      };

    case 'kilograms':
      return {
        amount: gramAmount / 1000,
        unit: 'kilograms',
      };

    case 'ounces':
      return {
        amount: gramAmount / 28.3495,
        unit: 'ounces',
      };

    case 'pounds':
      return {
        amount: gramAmount / 453.59237,
        unit: 'pounds',
      };
  }
}
  
  
  
  export  function Measurement_GT(a: Measurement, b: Measurement): boolean {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    return convertToGrams(a) > convertToGrams(b);
  }
  
  export  function Measurement_LT(a: Measurement, b: Measurement): boolean {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    return convertToGrams(a) < convertToGrams(b);
  }
  
  export  function Measurement_EQ(a: Measurement, b: Measurement): boolean {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    return convertToGrams(a) === convertToGrams(b);
  }
  
  export  function Measurement_GTE(a: Measurement, b: Measurement): boolean {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    return convertToGrams(a) >= convertToGrams(b);
  }
  
  export  function Measurement_LTE(a: Measurement, b: Measurement): boolean {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    return convertToGrams(a) <= convertToGrams(b);
  }
  
  
  export  function Measurement_Plus(a: Measurement, b: Measurement): Measurement {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    if (a.unit === b.unit) {
      return {
        amount: a.amount + b.amount,
        unit: a.unit,
      };
    } else {
      const aGrams = convertToGrams(a);
      const bGrams = convertToGrams(b);
      const combinedGrams = aGrams + bGrams;
      return convertFromGrams(combinedGrams, a.unit);
    }
  }
  
  
   export function Measurement_Minus(a: Measurement, b: Measurement): Measurement {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    if (a.unit === b.unit) {
      return {
        amount: a.amount - b.amount,
        unit: a.unit,
      };
    } else {
      const aGrams = convertToGrams(a);
      const bGrams = convertToGrams(b);
      const combinedGrams = aGrams - bGrams;
      return convertFromGrams(combinedGrams, a.unit);
    }
  }
  export  function Measurement_Times(a: Measurement,  multiplier: number): Measurement {
    zMeasurement.parse(a);
      return {
        amount: a.amount * multiplier,
        unit: a.unit,
      };
   
  }

  export  function Measurement_Divide(a: Measurement,  divider: number): Measurement {    
    zMeasurement.parse(a);
    return {
        amount: a.amount / divider,
        unit: a.unit,
      };
}
  
  
  export  function ZeroedMeasurement(): Measurement {
    return {
      amount: 0,
      unit: "grams",
    };
  }
  
  export type Unit = 'grams' | 'kilograms' | 'ounces' | 'pounds';

const zBuiltinUnit = z.enum(['grams', 'kilograms', 'ounces', 'pounds']);
const zCustomUnit = z.object({
  name: z.string(),
  gramsPerUnit: z.number(),
});

  const zMeasurement = z.object({
    amount: z.number(),
    unit: zBuiltinUnit,
  });


  export type Measurement = z.infer<typeof zMeasurement>;

  export function Measurement_Convert(m: Measurement, to: Unit): Measurement {
    zMeasurement.parse(m);
    zBuiltinUnit.parse(to);
    return convertFromGrams(convertToGrams(m), to);
  }


  export function Measurement_Max(a: Measurement, b: Measurement): Measurement {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    if (Measurement_GTE(a, b)) return a;
    return b;
  }


  export function Measurement_Min(a: Measurement, b: Measurement): Measurement {
    zMeasurement.parse(a);
    zMeasurement.parse(b);
    if (Measurement_LTE(a, b)) return a;
    return b;
  }

  export function Measurement_ToString(measurement: Measurement): string {
    zMeasurement.parse(measurement);
    return `${measurement.amount} ${measurement.unit}`
  }


  function removePluralS(s: string): string {
    console.assert(s.endsWith('s'));
    return s.slice(0, -1);
  }
