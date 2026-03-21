import { API_URL, MODEL, DEFAULT_API_URL, DEFAULT_MODEL } from './constants';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  messages: ChatMessage[];
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
}

async function getApiConfig(): Promise<{ url: string; model: string }> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get('li-post-gen-settings', (result) => {
          const s = result['li-post-gen-settings'] as { apiEndpoint?: string; model?: string } | undefined;
          const base = s?.apiEndpoint || DEFAULT_API_URL;
          const endpoint = base.endsWith('/') ? `${base}v1/chat/completions` : `${base}/v1/chat/completions`;
          resolve({ url: endpoint, model: s?.model || DEFAULT_MODEL });
        });
      });
    }
  } catch (_) {}
  return { url: API_URL, model: MODEL };
}

export async function generateStreaming({ messages, onChunk, signal }: GenerateOptions): Promise<string> {
  const config = await getApiConfig();
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: true,
      temperature: 0.8,
      max_tokens: 2048,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onChunk?.(fullText);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullText;
}

export async function generateNonStreaming(messages: ChatMessage[]): Promise<string> {
  const config = await getApiConfig();
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages,
      stream: false,
      temperature: 0.8,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
