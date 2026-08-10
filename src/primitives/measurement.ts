import {z} from "zod";


function convertToGrams(measurement: Measurement): number {
  zMeasurement.parse(measurement);
  if (measurement.unit.type === 'custom') {
    return measurement.amount * measurement.unit.gramsPerUnit;
  }
  switch (measurement.unit.unit) {
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
  zUnit.parse(convertTo);

  if (convertTo.type === 'custom') {
    return {
      amount: gramAmount / convertTo.gramsPerUnit,
      unit: convertTo,
    };
  }


  switch (convertTo.unit) {
    case 'grams':
      return {
        amount: gramAmount,
        unit : {
          type: 'builtin',
          unit: 'grams',
        },
      };

    case 'kilograms':
      return {
        amount: gramAmount / 1000,
        unit: {
          type: 'builtin',
          unit: 'kilograms',
        },
      };

    case 'ounces':
      return {
        amount: gramAmount / 28.3495,
        unit: {
          type: 'builtin',
          unit: 'ounces',
        },
      };

    case 'pounds':
      return {
        amount: gramAmount / 453.59237,
        unit: {
          type: 'builtin',
          unit: 'pounds',
        },
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
      unit: {
        type: 'builtin',
        unit: 'grams',
      },
    };
  }
  
  export type Unit = z.infer<typeof zUnit>;
  export type BuiltinUnit = z.infer<typeof zBuiltinUnit>;

const zBuiltinUnit = z.object({
  type: z.literal('builtin'),
  unit: z.enum(['grams', 'kilograms', 'ounces', 'pounds']),
});
const zCustomUnit = z.object({
  type: z.literal('custom'),
  name: z.string(),
  gramsPerUnit: z.number(),
});



const zUnit = z.union([zBuiltinUnit, zCustomUnit]);

  const zMeasurement = z.object({
    amount: z.number(),
    unit: zUnit,
  });


  export type Measurement = z.infer<typeof zMeasurement>;

  export function Measurement_Convert(m: Measurement, to: Unit): Measurement {
    console.log("converting", m, to);
    zMeasurement.parse(m);
    zUnit.parse(to);
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

  export function Unit_ToString(unit: Unit): string {
    zUnit.parse(unit);
    if (unit.type === 'builtin') {
      return `${unit.unit}`;
    } 
    return `${unit.name}`;

  }
  export function Measurement_ToString(measurement: Measurement): string {
    zMeasurement.parse(measurement);
    return `${measurement.amount} ${Unit_ToString(measurement.unit)}`;
  }


  function removePluralS(s: string): string {
    console.assert(s.endsWith('s'));
    return s.slice(0, -1);
  }
