const BaseProvider = require('./base');

class GroqProvider extends BaseProvider {
  constructor(config = {}) {
    super('groq', config);
    this.apiKey = process.env.GROQ_API_KEY || config.apiKey || '';
    this.model = process.env.GROQ_MODEL || config.model || 'llama-3.3-70b-versatile';
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate({ prompt, systemPrompt, temperature = 0.7, maxTokens }) {
    if (!this.isAvailable()) {
      throw new Error('Groq API key is not configured');
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
          'Authorization': `Bearer ${this.apiKey}`
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
        throw new Error('Groq returned empty response content');
      }

      return {
        content,
        provider: 'groq',
        model: this.model,
        usage: data.usage || null
      };
    } catch (err) {
      throw new Error(this.sanitizeError(err));
    }
  }
}

module.exports = GroqProvider;
