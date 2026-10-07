const BaseProvider = require('./base');

class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super('gemini', config);
    this.apiKey = process.env.GEMINI_API_KEY || config.apiKey || '';
    this.model = process.env.GEMINI_MODEL || config.model || 'gemini-1.5-flash';
  }

  isAvailable() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generate({ prompt, systemPrompt, temperature = 0.7, maxTokens }) {
    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured');
    }

    const sanitizedPrompt = this.sanitizeInput(prompt);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: sanitizedPrompt }]
        }
      ],
      generationConfig: {
        temperature: Math.min(Math.max(temperature, 0.1), 1.0),
        maxOutputTokens: maxTokens || this.maxOutputTokens
      }
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        parts: [{ text: this.sanitizeInput(systemPrompt, 2000) }]
      };
    }

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
      const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!content) {
        throw new Error('Gemini returned empty candidate response');
      }

      return {
        content,
        provider: 'gemini',
        model: this.model,
        usage: data.usageMetadata || null
      };
    } catch (err) {
      throw new Error(this.sanitizeError(err));
    }
  }
}

module.exports = GeminiProvider;
