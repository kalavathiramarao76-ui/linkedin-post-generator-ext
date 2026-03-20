/// <reference types="chrome" />

// LinkedIn Post Generator - Content Script
// Injects "Generate Post" button near LinkedIn's post composer

const BUTTON_ID = 'lpg-generate-btn';
const MODAL_ID = 'lpg-modal';

function injectStyles() {
  if (document.getElementById('lpg-styles')) return;

  const style = document.createElement('style');
  style.id = 'lpg-styles';
  style.textContent = `
    #${BUTTON_ID} {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(10, 102, 194, 0.3);
      z-index: 100;
      margin-left: 8px;
    }
    #${BUTTON_ID}:hover {
      background: linear-gradient(135deg, #004182, #003366);
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
      transform: translateY(-1px);
    }
    #${BUTTON_ID} .lpg-icon {
      font-size: 14px;
    }

    #${MODAL_ID} {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      animation: lpg-fade-in 0.2s ease;
    }
    @keyframes lpg-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .lpg-modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 520px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: lpg-slide-up 0.3s ease;
    }
    @keyframes lpg-slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .lpg-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #0a66c2, #004182);
      border-radius: 16px 16px 0 0;
    }
    .lpg-modal-header h2 {
      color: white;
      font-size: 16px;
      font-weight: 700;
      margin: 0;
    }
    .lpg-modal-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .lpg-modal-close:hover {
      background: rgba(255,255,255,0.3);
    }

    .lpg-modal-body {
      padding: 20px;
    }
    .lpg-modal-body label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .lpg-modal-body textarea,
    .lpg-modal-body select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
      outline: none;
      box-sizing: border-box;
    }
    .lpg-modal-body textarea:focus,
    .lpg-modal-body select:focus {
      border-color: #0a66c2;
      box-shadow: 0 0 0 3px rgba(10, 102, 194, 0.1);
    }
    .lpg-modal-body textarea {
      resize: vertical;
      min-height: 80px;
    }

    .lpg-style-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 16px;
    }
    .lpg-style-btn {
      padding: 8px 6px;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      background: white;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      text-align: center;
      transition: all 0.2s;
      font-family: inherit;
    }
    .lpg-style-btn:hover {
      border-color: #93c5fd;
    }
    .lpg-style-btn.active {
      border-color: #0a66c2;
      background: #e8f4fd;
      color: #0a66c2;
    }

    .lpg-generate-action {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #0a66c2, #004182);
      color: white;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      margin-top: 16px;
    }
    .lpg-generate-action:hover {
      opacity: 0.9;
    }
    .lpg-generate-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .lpg-output-area {
      margin-top: 16px;
      padding: 14px;
      background: #f9fafb;
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre-line;
      max-height: 200px;
      overflow-y: auto;
      color: #1f2937;
    }

    .lpg-action-bar {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .lpg-action-btn {
      flex: 1;
      padding: 10px;
      border-radius: 20px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .lpg-action-btn.primary {
      background: #0a66c2;
      color: white;
    }
    .lpg-action-btn.secondary {
      background: #f3f4f6;
      color: #4b5563;
    }
    .lpg-action-btn:hover {
      opacity: 0.85;
    }
  `;
  document.head.appendChild(style);
}

const STYLES = [
  { id: 'thought-leader', label: 'Thought Leader', icon: '🧠' },
  { id: 'story', label: 'Story', icon: '📖' },
  { id: 'how-to', label: 'How-To', icon: '📋' },
  { id: 'personal-brand', label: 'Personal', icon: '✨' },
  { id: 'hot-take', label: 'Hot Take', icon: '🔥' },
  { id: 'data-driven', label: 'Data', icon: '📊' },
];

function createModal() {
  if (document.getElementById(MODAL_ID)) return;

  const modal = document.createElement('div');
  modal.id = MODAL_ID;
  modal.innerHTML = `
    <div class="lpg-modal-content">
      <div class="lpg-modal-header">
        <h2>LinkedIn Post Generator</h2>
        <button class="lpg-modal-close" id="lpg-close">&times;</button>
      </div>
      <div class="lpg-modal-body">
        <label>Topic</label>
        <textarea id="lpg-topic" placeholder="What do you want to write about?"></textarea>

        <label style="margin-top: 14px;">Style</label>
        <div class="lpg-style-grid" id="lpg-styles">
          ${STYLES.map(
            (s, i) =>
              `<button class="lpg-style-btn ${i === 0 ? 'active' : ''}" data-style="${s.id}">${s.icon} ${s.label}</button>`
          ).join('')}
        </div>

        <label>Language</label>
        <select id="lpg-language">
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Spanish</option>
          <option value="fr">🇫🇷 French</option>
          <option value="de">🇩🇪 German</option>
          <option value="pt">🇧🇷 Portuguese</option>
          <option value="it">🇮🇹 Italian</option>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="zh">🇨🇳 Chinese</option>
          <option value="ja">🇯🇵 Japanese</option>
          <option value="ar">🇸🇦 Arabic</option>
        </select>

        <button class="lpg-generate-action" id="lpg-generate">Generate Post</button>

        <div id="lpg-output" class="lpg-output-area" style="display: none;"></div>

        <div id="lpg-actions" class="lpg-action-bar" style="display: none;">
          <button class="lpg-action-btn primary" id="lpg-insert">Insert into Post</button>
          <button class="lpg-action-btn secondary" id="lpg-copy">Copy</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  let selectedStyle = 'thought-leader';

  modal.querySelector('#lpg-close')!.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Style selection
  modal.querySelectorAll('.lpg-style-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.lpg-style-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStyle = (btn as HTMLElement).dataset.style || 'thought-leader';
    });
  });

  // Generate
  const generateBtn = modal.querySelector('#lpg-generate') as HTMLButtonElement;
  const outputDiv = modal.querySelector('#lpg-output') as HTMLDivElement;
  const actionsDiv = modal.querySelector('#lpg-actions') as HTMLDivElement;
  const topicEl = modal.querySelector('#lpg-topic') as HTMLTextAreaElement;
  const languageEl = modal.querySelector('#lpg-language') as HTMLSelectElement;

  generateBtn.addEventListener('click', async () => {
    const topic = topicEl.value.trim();
    if (!topic) return;

    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    outputDiv.style.display = 'block';
    outputDiv.textContent = '';
    actionsDiv.style.display = 'none';

    try {
      const response = await new Promise<{ content?: string; error?: string }>((resolve) => {
        chrome.runtime.sendMessage(
          {
            type: 'GENERATE',
            payload: {
              messages: buildMessages(topic, selectedStyle, languageEl.value),
            },
          },
          resolve
        );
      });

      if (response.error) {
        outputDiv.textContent = `Error: ${response.error}`;
      } else {
        outputDiv.textContent = response.content || '';
        actionsDiv.style.display = 'flex';
      }
    } catch (err) {
      outputDiv.textContent = `Error: ${(err as Error).message}`;
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generate Post';
    }
  });

  // Copy
  modal.querySelector('#lpg-copy')!.addEventListener('click', () => {
    navigator.clipboard.writeText(outputDiv.textContent || '');
    const copyBtn = modal.querySelector('#lpg-copy') as HTMLButtonElement;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
  });

  // Insert into LinkedIn composer
  modal.querySelector('#lpg-insert')!.addEventListener('click', () => {
    const text = outputDiv.textContent || '';
    insertIntoComposer(text);
    modal.remove();
  });
}

function buildMessages(topic: string, styleId: string, langCode: string) {
  const styleMap: Record<string, string> = {
    'thought-leader': 'Write as a thought leader sharing deep industry insights. Use confident, authoritative tone.',
    'story': 'Write a compelling personal story or narrative. Start with a hook. Build tension.',
    'how-to': 'Write a practical how-to guide. Use numbered steps or bullet points.',
    'personal-brand': 'Write a post that builds personal brand. Share unique experience.',
    'hot-take': 'Write a bold, contrarian hot take. Challenge conventional wisdom.',
    'data-driven': 'Write a data-driven post with statistics. Lead with a surprising data point.',
  };
  const langMap: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese',
    it: 'Italian', hi: 'Hindi', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic',
  };

  return [
    {
      role: 'system',
      content: `You are an expert LinkedIn content creator. Write in ${langMap[langCode] || 'English'}. Keep posts under 3000 characters. Use line breaks for readability. Include relevant emojis sparingly. End with a call-to-action. Do NOT use markdown. Write the post content ONLY.`,
    },
    {
      role: 'user',
      content: `Write a LinkedIn post about: ${topic}\n\nStyle: ${styleMap[styleId] || styleMap['thought-leader']}`,
    },
  ];
}

function insertIntoComposer(text: string) {
  // Try to find LinkedIn's post editor
  const selectors = [
    '.ql-editor[data-placeholder]',
    '.ql-editor',
    '[role="textbox"][contenteditable="true"]',
    '.editor-content [contenteditable="true"]',
    '.share-creation-state__text-editor .ql-editor',
  ];

  for (const selector of selectors) {
    const editor = document.querySelector(selector) as HTMLElement;
    if (editor) {
      editor.focus();
      // Clear existing content
      editor.innerHTML = '';
      // Insert text with proper formatting
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        const p = document.createElement('p');
        p.textContent = line || '\u200B'; // zero-width space for empty lines
        editor.appendChild(p);
      });
      // Trigger input event for LinkedIn to detect change
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
  }

  // Fallback: copy to clipboard
  navigator.clipboard.writeText(text);
  alert('Post copied to clipboard! Paste it into the LinkedIn editor.');
}

function injectButton() {
  if (document.getElementById(BUTTON_ID)) return;

  // LinkedIn's "Start a post" area selectors
  const composerSelectors = [
    '.share-box-feed-entry__trigger',
    '.share-box-feed-entry__top-bar',
    '.share-box-feed-entry__closed-share-box',
    '.artdeco-card .share-box',
  ];

  let container: Element | null = null;
  for (const selector of composerSelectors) {
    container = document.querySelector(selector);
    if (container) break;
  }

  if (!container) return;

  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.innerHTML = '<span class="lpg-icon">✨</span> Generate Post';
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createModal();
  });

  container.appendChild(btn);
}

// Initialize
function init() {
  injectStyles();
  injectButton();
}

// Run on load and watch for DOM changes (LinkedIn is an SPA)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// MutationObserver to re-inject button after LinkedIn SPA navigation
const observer = new MutationObserver(() => {
  if (!document.getElementById(BUTTON_ID)) {
    injectButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

export {};
