module.exports = {
  timeoutMs: 18000,
  maxOutputTokens: 1500,
  providers: {
    groq: {
      enabled: Boolean(process.env.GROQ_API_KEY),
      model: 'llama-3.3-70b-versatile'
    },
    openrouter: {
      enabled: Boolean(process.env.OPENROUTER_API_KEY),
      model: 'google/gemma-4-31b-it:free'
    },
    gemini: {
      enabled: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-1.5-flash'
    }
  }
};
