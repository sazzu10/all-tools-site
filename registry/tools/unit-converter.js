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
    title: 'Free Unit Converter • Instant Length, Weight & Data Conversions',
    metaDescription: 'Convert between metric and imperial units instantly. Free calculator for length, mass, temperature, data storage, and area.',
    keywords: ['unit converter', 'metric converter', 'length converter', 'weight conversion', 'online measurement converter']
  },

  faq: [
    {
      q: 'Are conversions updated in real-time?',
      a: 'Yes, conversions calculate instantly as you type numbers or switch measurement units.'
    },
    {
      q: 'Does it support metric to imperial conversions?',
      a: 'Yes, including meters to feet, kilograms to pounds, Celsius to Fahrenheit, and gigabytes to megabytes.'
    }
  ],

  relatedTools: ['qrcode-generator', 'json-formatter', 'image-compressor']
};
