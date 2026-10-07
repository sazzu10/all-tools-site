/**
 * AI Text Generator Service (AI-Powered with Local Heuristic Fallback)
 */
const { aiRouter } = require('../ai/ai-router');

const SYSTEM_PROMPT = `You are a versatile, professional AI writing assistant and copywriter.
You produce natural, eloquent, engaging text tailored to the requested format and tone.
Formatting rules:
- Respect the requested format (Paragraph, Bullet Points, Essay Outline, Creative Story, or Social Post).
- Adopt the chosen tone naturally without using cliched phrases or robotic phrasing.
- Provide clean, direct writing without meta-chatter like "Sure, here is your text:".`;

async function generateText({ prompt, format = 'Paragraph', tone = 'Engaging' }) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return { ok: false, error: 'Please enter a prompt or topic for the AI to write about.' };
  }

  const cleanPrompt = prompt.trim();

  const userPrompt = `Task: Write high-quality content based on the following instruction:
Topic / Prompt: "${cleanPrompt}"
Desired Format: ${format}
Desired Tone: ${tone}
Produce complete, polished, ready-to-use content.`;

  try {
    const aiResult = await aiRouter.generate({
      prompt: userPrompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.75
    });

    const generated = aiResult.content.trim();
    const stats = computeTextStats(generated);

    return {
      ok: true,
      prompt: cleanPrompt,
      format,
      tone,
      output: generated,
      stats,
      metadata: {
        provider: aiResult.provider,
        model: aiResult.model,
        executionTimeMs: aiResult.executionTimeMs,
        fallbacksAttempted: aiResult.fallbacksAttempted
      }
    };
  } catch (err) {
    console.warn(`[AITextGenerator] AI failed (${err.message}). Using local template fallback.`);
    const fallback = generateFallbackText(cleanPrompt, format, tone);
    const stats = computeTextStats(fallback);
    return {
      ok: true,
      prompt: cleanPrompt,
      format,
      tone,
      output: fallback,
      stats,
      metadata: {
        provider: 'local-heuristic-engine',
        model: 'content-writer-v1',
        warning: `AI Router notice: ${err.message}. Structured content draft provided.`
      }
    };
  }
}

function computeTextStats(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const readingTimeMin = Math.max(1, Math.ceil(words / 200));
  return {
    wordCount: words,
    characterCount: chars,
    estimatedReadingTime: `${readingTimeMin} min read`
  };
}

function generateFallbackText(prompt, format, tone) {
  switch (format.toLowerCase()) {
    case 'bullet points':
      return `Key Insights on ${prompt}:\n\n` +
        `• Core Principle: Master the fundamental dynamics of ${prompt} before scaling.\n` +
        `• Strategic Execution: Implement structured, iterative workflows to maintain high quality.\n` +
        `• Pitfall Prevention: Avoid common missteps by focusing on verified feedback and metrics.\n` +
        `• Long-term Advantage: Consistency and attention to detail produce compounded results.`;

    case 'essay outline':
      return `Essay Outline: ${prompt}\n\n` +
        `I. Introduction\n   A. Background and Context\n   B. Core Thesis Statement\n\n` +
        `II. Analytical Framework\n   A. Foundational Mechanisms\n   B. Modern Applications\n\n` +
        `III. Comparative Evaluation\n   A. Benefits & Opportunities\n   B. Challenges & Counter-arguments\n\n` +
        `IV. Conclusion & Forward Outlook\n   A. Synthesis of Findings\n   B. Final Strategic Recommendation`;

    case 'social post':
      return `💡 Quick perspective on ${prompt}:\n\n` +
        `Most people overcomplicate it. The real secret isn't more complexity—it's execution speed, clarity of thought, and relentless focus.\n\n` +
        `What is your biggest takeaway when approaching this?\n\n` +
        `#Growth #Strategy #Insights #DailyInspiration`;

    default: // Paragraph
      return `${prompt} represents a pivotal subject in modern creative and professional workflows. By breaking down complex challenges into manageable, intentional milestones, practitioners can achieve consistent and measurable momentum. Maintaining a ${tone.toLowerCase()} perspective fosters rapid iteration, clarity, and sustainable long-term success.`;
  }
}

module.exports = {
  generateText
};
