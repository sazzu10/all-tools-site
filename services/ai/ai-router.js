const GroqProvider = require('./providers/groq');
const OpenRouterProvider = require('./providers/openrouter');
const GeminiProvider = require('./providers/gemini');

class AIRouter {
  constructor(options = {}) {
    this.timeoutMs = parseInt(process.env.AI_TIMEOUT_MS, 10) || options.timeoutMs || 15000;
    this.maxOutputTokens = parseInt(process.env.AI_MAX_TOKENS, 10) || options.maxOutputTokens || 1500;

    // Initialize all providers with common config
    this.providers = {
      groq: new GroqProvider({ timeoutMs: this.timeoutMs, maxOutputTokens: this.maxOutputTokens }),
      openrouter: new OpenRouterProvider({ timeoutMs: this.timeoutMs, maxOutputTokens: this.maxOutputTokens }),
      gemini: new GeminiProvider({ timeoutMs: this.timeoutMs, maxOutputTokens: this.maxOutputTokens })
    };

    // Configurable provider cascade order
    this.providerOrder = this.resolveProviderOrder();
  }

  resolveProviderOrder() {
    const rawOrder = process.env.AI_PROVIDER_ORDER || 'groq,openrouter,gemini';
    const parsed = rawOrder
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(p => ['groq', 'openrouter', 'gemini'].includes(p));

    // Ensure all 3 exist in the order list
    const defaults = ['groq', 'openrouter', 'gemini'];
    defaults.forEach(d => {
      if (!parsed.includes(d)) parsed.push(d);
    });

    return parsed;
  }

  getAvailableProviders() {
    return this.providerOrder.filter(name => {
      const p = this.providers[name];
      return p && p.isAvailable();
    });
  }

  getStatus() {
    return {
      order: this.providerOrder,
      timeoutMs: this.timeoutMs,
      maxOutputTokens: this.maxOutputTokens,
      providers: {
        groq: { available: this.providers.groq.isAvailable(), model: this.providers.groq.model },
        openrouter: { available: this.providers.openrouter.isAvailable(), model: this.providers.openrouter.model },
        gemini: { available: this.providers.gemini.isAvailable(), model: this.providers.gemini.model }
      }
    };
  }

  /**
   * Execute prompt through the cascading router
   * @param {Object} options
   * @param {string} options.prompt
   * @param {string} [options.systemPrompt]
   * @param {number} [options.temperature]
   * @param {number} [options.maxTokens]
   * @returns {Promise<{ content: string, provider: string, model: string, executionTimeMs: number, fallbacksAttempted: string[] }>}
   */
  async generate({ prompt, systemPrompt, temperature = 0.7, maxTokens }) {
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    const startTime = Date.now();
    const order = this.resolveProviderOrder();
    const errors = [];
    const attempted = [];

    for (const providerName of order) {
      const provider = this.providers[providerName];
      if (!provider) continue;

      if (!provider.isAvailable()) {
        errors.push(`[${providerName}] Missing API key`);
        continue;
      }

      attempted.push(providerName);

      try {
        const result = await provider.generate({
          prompt,
          systemPrompt,
          temperature,
          maxTokens: maxTokens || this.maxOutputTokens
        });

        return {
          content: result.content,
          provider: result.provider,
          model: result.model,
          executionTimeMs: Date.now() - startTime,
          fallbacksAttempted: attempted.slice(0, -1),
          usage: result.usage || null
        };
      } catch (err) {
        errors.push(`[${providerName}] ${err.message}`);
        console.warn(`[AIRouter] ${providerName} failed: ${err.message}. Trying next provider...`);
      }
    }

    const elapsed = Date.now() - startTime;
    const sanitizedSummary = errors.map(e => e.replace(/(?:sk-[a-zA-Z0-9_-]{10,}|AIza[a-zA-Z0-9_-]{10,})/g, '[REDACTED]')).join('; ');
    throw new Error(`All AI providers failed (${elapsed}ms): ${sanitizedSummary || 'No providers available'}`);
  }
}

// Singleton instance
const aiRouter = new AIRouter();

module.exports = {
  AIRouter,
  aiRouter
};
