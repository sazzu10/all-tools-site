module.exports = {
  id: 'unit-converter',
  slug: 'unit-converter',
  name: 'Universal Unit Converter',
  category: 'utility-calculator',
  badges: ['Math', 'Instant'],
  icon: 'fa-solid fa-calculator',
  description: 'Convert length, weight, temperature, digital storage, volume, and area measurements with instant calculation.',
  processingType: 'deterministic',
  outputType: 'text',
  enabled: true,
  featured: false,
  popular: true,

  inputs: [
    {
      name: 'dimension',
      label: 'Measurement Category',
      type: 'select',
      options: ['Length', 'Weight / Mass', 'Temperature', 'Digital Storage', 'Speed', 'Area'],
      default: 'Length'
    },
    {
      name: 'amount',
      label: 'Value to Convert',
      type: 'number',
      placeholder: 'e.g. 100',
      required: true,
      default: 1
    },
    {
      name: 'fromUnit',
      label: 'From Unit',
      type: 'select',
      options: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
      default: 'Kilometers'
    },
    {
      name: 'toUnit',
      label: 'To Unit',
      type: 'select',
      options: ['Miles', 'Kilometers', 'Meters', 'Feet', 'Inches', 'Yards'],
      default: 'Miles'
    }
  ],

  seo: {
    h1: 'Universal Unit Converter Online',
    title: 'Free Unit Converter Online • Metric to Imperial Measurement Calculator',
    metaDescription: 'Convert length, mass, weight, temperature, digital storage, speed, and area measurements instantly. Fast, accurate metric to imperial calculator online.',
    keywords: ['unit converter', 'metric converter', 'length converter', 'weight conversion', 'online measurement converter', 'convert units online']
  },

  useCases: [
    'Metric to Imperial Distance: Convert kilometers to miles, meters to feet, and centimeters to inches with high precision.',
    'Weight & Mass Calculations: Quickly calculate kilograms to pounds, grams to ounces, and metric tons.',
    'Digital Storage Calculations: Convert between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes for IT systems.',
    'Temperature Conversion: Accurately switch between Celsius, Fahrenheit, and Kelvin for science and cooking.'
  ],

  faq: [
    {
      q: 'Are conversions updated in real-time?',
      a: 'Yes, conversions calculate instantly as you type numbers or switch measurement units.'
    },
    {
      q: 'Does it support metric to imperial conversions?',
      a: 'Yes, including meters to feet, kilograms to pounds, Celsius to Fahrenheit, and gigabytes to megabytes.'
    },
    {
      q: 'Can I convert digital storage units like GB to MB?',
      a: 'Yes, select "Digital Storage" to convert between Bytes, KB, MB, GB, and TB using binary 1,024 byte standards.'
    },
    {
      q: 'Is this unit converter mobile-friendly?',
      a: 'Yes, the interface is optimized for rapid touch inputs and high readability on smartphones and tablets.'
    }
  ],

  relatedTools: ['qrcode-generator', 'json-formatter', 'image-compressor']
};
