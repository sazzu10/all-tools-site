/**
 * Base AI Provider
 * Unified interface for LLM provider implementations
 */
class BaseProvider {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.timeoutMs = config.timeoutMs || 15000;
    this.maxOutputTokens = config.maxOutputTokens || 1500;
  }

  /**
   * Check if provider is configured and available
   */
  isAvailable() {
    return false;
  }

  /**
   * Execute chat completion
   * @param {Object} options
   * @param {string} options.prompt
   * @param {string} [options.systemPrompt]
   * @param {number} [options.temperature=0.7]
   * @param {number} [options.maxTokens]
   * @returns {Promise<{ content: string, provider: string, model: string, usage?: Object }>}
   */
  async generate(options) {
    throw new Error(`generate() not implemented for provider ${this.name}`);
  }

  /**
   * Truncate and sanitize input prompt to respect limits
   */
  sanitizeInput(prompt, maxChars = 4000) {
    if (typeof prompt !== 'string') {
      prompt = String(prompt || '');
    }
    const trimmed = prompt.trim();
    if (trimmed.length > maxChars) {
      return trimmed.slice(0, maxChars) + '... [truncated]';
    }
    return trimmed;
  }

  /**
   * Sanitize error message to prevent leaking credentials or internal URLs
   */
  sanitizeError(error) {
    let msg = error?.message || 'Unknown provider error';
    // Remove any API keys matching standard patterns
    msg = msg.replace(/(?:sk-[a-zA-Z0-9_-]{10,}|AIza[a-zA-Z0-9_-]{10,}|gsk_[a-zA-Z0-9_-]{10,})/g, '[REDACTED_KEY]');
    return `[${this.name}] ${msg}`;
  }

  /**
   * Fetch with timeout using native fetch & AbortController
   */
  async fetchWithTimeout(url, fetchOptions, timeoutMs = this.timeoutMs) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError' || controller.signal.aborted) {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw err;
    }
  }
}

module.exports = BaseProvider;
