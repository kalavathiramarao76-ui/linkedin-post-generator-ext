import { POST_STYLES, LANGUAGES, TONES } from './constants';
import type { ChatMessage } from './api';

export function buildPostPrompt(
  topic: string,
  styleId: string,
  languageCode: string,
  toneId?: string
): ChatMessage[] {
  const style = POST_STYLES.find(s => s.id === styleId) || POST_STYLES[0];
  const language = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];
  const tone = toneId ? TONES.find(t => t.id === toneId) : null;

  const systemPrompt = `You are an expert LinkedIn content creator. Generate engaging, viral-worthy LinkedIn posts.

Rules:
- Write in ${language.label}
- Keep posts under 3000 characters
- Use line breaks for readability (LinkedIn style formatting)
- Include relevant emojis sparingly
- End with a call-to-action or question
- Do NOT use markdown headers or bold syntax
- Write the post content ONLY, no explanations or meta-commentary
${tone ? `- Use a ${tone.label.toLowerCase()} tone throughout` : ''}`;

  const userPrompt = `Write a LinkedIn post about: ${topic}

Style: ${style.label} - ${style.prompt}`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];
}

export function buildHookPrompt(topic: string, languageCode: string): ChatMessage[] {
  const language = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];

  return [
    {
      role: 'system',
      content: `You are a LinkedIn hook writing expert. Write in ${language.label}. Generate exactly 10 attention-grabbing opening lines (hooks) for LinkedIn posts. Each hook should be on a new line, numbered 1-10. Make them diverse: questions, bold statements, statistics, stories, contrarian views. Output ONLY the hooks, no explanations.`,
    },
    {
      role: 'user',
      content: `Generate 10 LinkedIn post hooks about: ${topic}`,
    },
  ];
}

export function buildHashtagPrompt(topic: string): ChatMessage[] {
  return [
    {
      role: 'system',
      content: `You are a LinkedIn hashtag strategist. Generate 15 relevant hashtags for the given topic. Mix popular broad hashtags with niche specific ones. Output ONLY hashtags, one per line, each starting with #. No explanations.`,
    },
    {
      role: 'user',
      content: `Generate 15 LinkedIn hashtags for: ${topic}`,
    },
  ];
}

export function buildToneAdjustPrompt(content: string, toneId: string, languageCode: string): ChatMessage[] {
  const tone = TONES.find(t => t.id === toneId) || TONES[0];
  const language = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];

  return [
    {
      role: 'system',
      content: `You are a LinkedIn content editor. Rewrite the given post to match the specified tone while keeping the core message and structure. Write in ${language.label}. Output ONLY the rewritten post, no explanations.`,
    },
    {
      role: 'user',
      content: `Rewrite this LinkedIn post in a ${tone.label.toLowerCase()} tone:\n\n${content}`,
    },
  ];
}
