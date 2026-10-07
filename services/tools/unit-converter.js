/**
 * Universal Unit Converter Service (Deterministic - NO AI)
 */

const UNIT_DEFINITIONS = {
  Length: {
    baseUnit: 'Meters',
    units: {
      'Meters': 1,
      'Kilometers': 1000,
      'Centimeters': 0.01,
      'Millimeters': 0.001,
      'Miles': 1609.344,
      'Yards': 0.9144,
      'Feet': 0.3048,
      'Inches': 0.0254
    }
  },
  'Weight / Mass': {
    baseUnit: 'Kilograms',
    units: {
      'Kilograms': 1,
      'Grams': 0.001,
      'Milligrams': 0.000001,
      'Pounds': 0.45359237,
      'Ounces': 0.028349523125,
      'Metric Tons': 1000
    }
  },
  'Digital Storage': {
    baseUnit: 'Bytes',
    units: {
      'Bytes': 1,
      'Kilobytes (KB)': 1024,
      'Megabytes (MB)': 1024 ** 2,
      'Gigabytes (GB)': 1024 ** 3,
      'Terabytes (TB)': 1024 ** 4,
      'Petabytes (PB)': 1024 ** 5
    }
  },
  Speed: {
    baseUnit: 'Meters per second (m/s)',
    units: {
      'Meters per second (m/s)': 1,
      'Kilometers per hour (km/h)': 1 / 3.6,
      'Miles per hour (mph)': 0.44704,
      'Knots': 0.514444
    }
  },
  Area: {
    baseUnit: 'Square Meters',
    units: {
      'Square Meters': 1,
      'Square Kilometers': 1000000,
      'Square Feet': 0.092903,
      'Acres': 4046.8564224,
      'Hectares': 10000,
      'Square Miles': 2589988.110336
    }
  },
  Volume: {
    baseUnit: 'Liters',
    units: {
      'Liters': 1,
      'Milliliters': 0.001,
      'Gallons (US)': 3.785411784,
      'Fluid Ounces (US)': 0.0295735295625,
      'Cups (US)': 0.2365882365
    }
  },
  Time: {
    baseUnit: 'Seconds',
    units: {
      'Seconds': 1,
      'Milliseconds': 0.001,
      'Minutes': 60,
      'Hours': 3600,
      'Days': 86400,
      'Weeks': 604800
    }
  }
};

function normalizeUnitName(name, categoryUnits) {
  if (!name) return null;
  const clean = name.trim().toLowerCase();

  // 1. Exact match (case-insensitive)
  for (const key of Object.keys(categoryUnits)) {
    if (key.toLowerCase() === clean) return key;
  }

  // 2. Exact match inside parentheses (e.g. "MB", "GB", "km/h")
  for (const key of Object.keys(categoryUnits)) {
    const parenMatch = key.match(/\(([^)]+)\)/);
    if (parenMatch && parenMatch[1].toLowerCase() === clean) {
      return key;
    }
  }

  // 3. Prefix match: key starts with input (e.g. "kilo" -> "Kilometers")
  for (const key of Object.keys(categoryUnits)) {
    if (key.toLowerCase().startsWith(clean)) {
      return key;
    }
  }

  // 4. Input starts with full key
  for (const key of Object.keys(categoryUnits)) {
    if (clean.startsWith(key.toLowerCase())) {
      return key;
    }
  }

  return null;
}

function convertTemperature(value, fromUnit, toUnit) {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  // Normalize to Celsius first
  let c;
  if (from.includes('celsius') || from === 'c') {
    c = value;
  } else if (from.includes('fahrenheit') || from === 'f') {
    c = (value - 32) * (5 / 9);
  } else if (from.includes('kelvin') || from === 'k') {
    c = value - 273.15;
  } else {
    throw new Error(`Unsupported source temperature unit: ${fromUnit}`);
  }

  // Convert Celsius to target
  let result;
  let formula;
  if (to.includes('celsius') || to === 'c') {
    result = c;
    formula = `${value}° ${fromUnit} = ${round(result, 4)}° Celsius`;
  } else if (to.includes('fahrenheit') || to === 'f') {
    result = (c * (9 / 5)) + 32;
    formula = `(${round(c, 2)}°C × 9/5) + 32 = ${round(result, 4)}° Fahrenheit`;
  } else if (to.includes('kelvin') || to === 'k') {
    result = c + 273.15;
    formula = `${round(c, 2)}°C + 273.15 = ${round(result, 4)} K`;
  } else {
    throw new Error(`Unsupported target temperature unit: ${toUnit}`);
  }

  return { result: round(result, 6), formula };
}

function round(num, decimals = 6) {
  if (Number.isInteger(num)) return num;
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
}

function convertUnits({ dimension = 'Length', amount = 1, fromUnit, toUnit }) {
  const val = parseFloat(amount);
  if (isNaN(val)) {
    return { ok: false, error: 'Please enter a valid numeric value to convert.' };
  }

  // Temperature special calculation
  if (dimension.toLowerCase().includes('temp')) {
    try {
      const from = fromUnit || 'Celsius';
      const to = toUnit || 'Fahrenheit';
      const converted = convertTemperature(val, from, to);
      return {
        ok: true,
        dimension: 'Temperature',
        inputValue: val,
        fromUnit: from,
        outputValue: converted.result,
        toUnit: to,
        formula: converted.formula,
        output: `${val} ${from} = ${converted.result} ${to}\nFormula: ${converted.formula}`
      };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // Standard linear dimension
  const categoryConfig = UNIT_DEFINITIONS[dimension] || UNIT_DEFINITIONS['Length'];
  const matchedFrom = normalizeUnitName(fromUnit, categoryConfig.units) || Object.keys(categoryConfig.units)[0];
  const matchedTo = normalizeUnitName(toUnit, categoryConfig.units) || Object.keys(categoryConfig.units)[1];

  const fromFactor = categoryConfig.units[matchedFrom];
  const toFactor = categoryConfig.units[matchedTo];

  if (!fromFactor || !toFactor) {
    return { ok: false, error: `Invalid units selected for dimension "${dimension}".` };
  }

  // Convert to base unit then to target unit
  const baseValue = val * fromFactor;
  const resultValue = baseValue / toFactor;
  const roundedResult = round(resultValue, 8);

  const formula = `1 ${matchedFrom} = ${round(fromFactor / toFactor, 8)} ${matchedTo}`;

  return {
    ok: true,
    dimension,
    inputValue: val,
    fromUnit: matchedFrom,
    outputValue: roundedResult,
    toUnit: matchedTo,
    formula,
    output: `${val} ${matchedFrom} = ${roundedResult} ${matchedTo}\nConversion Rate: ${formula}`
  };
}

module.exports = {
  convertUnits,
  UNIT_DEFINITIONS
};
