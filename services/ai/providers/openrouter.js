const BaseProvider = require('./base');

class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super('openrouter', config);
    this.apiKey = process.env.OPENROUTER_API_KEY || config.apiKey || '';
    this.model = process.env.OPENROUTER_MODEL || config.model || 'google/gemma-4-31b-it:free';
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate({ prompt, systemPrompt, temperature = 0.7, maxTokens }) {
    if (!this.isAvailable()) {
      throw new Error('OpenRouter API key is not configured');
    }

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: this.sanitizeInput(systemPrompt, 2000) });
    }
    messages.push({ role: 'user', content: sanitizedPrompt });

    const payload = {
      model: this.model,
      messages,
      temperature: Math.min(Math.max(temperature, 0.1), 1.0),
      max_tokens: maxTokens || this.maxOutputTokens
    };

    try {
      const response = await this.fetchWithTimeout(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:4000',
          'X-Title': 'All Tools Multi-Tool Suite'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (_) {}
        const errorMsg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('OpenRouter returned empty response content');
      }

      return {
        content,
        provider: 'openrouter',
        model: this.model,
        usage: data.usage || null
      };
    } catch (err) {
      throw new Error(this.sanitizeError(err));
    }
  }
}

module.exports = OpenRouterProvider;
