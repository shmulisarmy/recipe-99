function convertToGrams(measurement: Measurement): number {
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
    return convertToGrams(a) > convertToGrams(b);
  }
  
  export  function Measurement_LT(a: Measurement, b: Measurement): boolean {
    return convertToGrams(a) < convertToGrams(b);
  }
  
  export  function Measurement_EQ(a: Measurement, b: Measurement): boolean {
    return convertToGrams(a) === convertToGrams(b);
  }
  
  export  function Measurement_GTE(a: Measurement, b: Measurement): boolean {
    return convertToGrams(a) >= convertToGrams(b);
  }
  
  export  function Measurement_LTE(a: Measurement, b: Measurement): boolean {
    return convertToGrams(a) <= convertToGrams(b);
  }
  
  
  export  function Measurement_Plus(a: Measurement, b: Measurement): Measurement {
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
      return {
        amount: a.amount * multiplier,
        unit: a.unit,
      };
   
  }

  export  function Measurement_Divide(a: Measurement,  divider: number): Measurement {
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

  export type Measurement = {
    amount: number;
    unit: Unit;
  };

  export function Measurement_Convert(m: Measurement, to: Unit): Measurement {
    return convertFromGrams(convertToGrams(m), to);
  }


  export function Measurement_Max(a: Measurement, b: Measurement): Measurement {
    if (Measurement_GTE(a, b)) return a;
    return b;
  }


  export function Measurement_Min(a: Measurement, b: Measurement): Measurement {
    if (Measurement_LTE(a, b)) return a;
    return b;
  }

  export function Measurement_ToString(measurement: Measurement): string {
    return `${measurement.amount} ${measurement.unit}`
  }


  function removePluralS(s: string): string {
    console.assert(s.endsWith('s'));
    return s.slice(0, -1);
  }