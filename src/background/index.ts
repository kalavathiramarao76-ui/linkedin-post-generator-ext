/// <reference types="chrome" />

const API_URL = 'https://sai.sharedllm.com/v1/chat/completions';
const MODEL = 'gpt-oss:120b';

// Open side panel when extension icon is right-clicked or via context menu
chrome.runtime.onInstalled.addListener(() => {
  // Set side panel behavior
  if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(() => {});
  }
});

// Handle messages from popup, sidepanel, and content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GENERATE') {
    handleGenerate(message.payload, sendResponse);
    return true; // async response
  }

  if (message.type === 'GENERATE_STREAM') {
    handleStreamGenerate(message.payload, message.tabId);
    sendResponse({ status: 'streaming_started' });
    return false;
  }

  if (message.type === 'OPEN_SIDEPANEL') {
    if (chrome.sidePanel) {
      chrome.sidePanel.open({ tabId: message.tabId }).catch(console.error);
    }
    sendResponse({ status: 'ok' });
    return false;
  }

  if (message.type === 'COPY_TO_CLIPBOARD') {
    // Cannot directly copy in service worker; relay to the active tab
    sendResponse({ status: 'ok' });
    return false;
  }
});

async function handleGenerate(
  payload: { messages: Array<{ role: string; content: string }> },
  sendResponse: (response: unknown) => void
) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: payload.messages,
        stream: false,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      sendResponse({ error: `API error: ${response.status}` });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    sendResponse({ content });
  } catch (err: unknown) {
    sendResponse({ error: (err as Error).message });
  }
}

async function handleStreamGenerate(
  payload: { messages: Array<{ role: string; content: string }>; requestId: string },
  tabId?: number
) {
  const { messages, requestId } = payload;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        temperature: 0.8,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      broadcastStreamEvent(requestId, { type: 'error', error: `API error: ${response.status}` }, tabId);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      broadcastStreamEvent(requestId, { type: 'error', error: 'No response body' }, tabId);
      return;
    }

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
            broadcastStreamEvent(requestId, { type: 'chunk', content: fullText }, tabId);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    broadcastStreamEvent(requestId, { type: 'done', content: fullText }, tabId);
  } catch (err: unknown) {
    broadcastStreamEvent(requestId, { type: 'error', error: (err as Error).message }, tabId);
  }
}

function broadcastStreamEvent(
  requestId: string,
  event: { type: string; content?: string; error?: string },
  _tabId?: number
) {
  // Broadcast to all extension contexts (popup, sidepanel)
  chrome.runtime.sendMessage({ type: 'STREAM_EVENT', requestId, ...event }).catch(() => {});
}

export {};
