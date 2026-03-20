export const API_URL = 'https://sai.sharedllm.com/v1/chat/completions';
export const MODEL = 'gpt-oss:120b';

export interface PostStyle {
  id: string;
  label: string;
  icon: string;
  description: string;
  prompt: string;
}

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export interface Tone {
  id: string;
  label: string;
  icon: string;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  content: string;
}

export const POST_STYLES: PostStyle[] = [
  {
    id: 'thought-leader',
    label: 'Thought Leader',
    icon: '🧠',
    description: 'Authoritative insights that position you as an industry expert',
    prompt: 'Write as a thought leader sharing deep industry insights. Use confident, authoritative tone. Include a contrarian or unique perspective. End with a thought-provoking question.',
  },
  {
    id: 'story',
    label: 'Story',
    icon: '📖',
    description: 'Personal narrative that connects emotionally with readers',
    prompt: 'Write a compelling personal story or narrative. Start with a hook. Build tension or curiosity. Share a lesson learned. Make it relatable and authentic.',
  },
  {
    id: 'how-to',
    label: 'How-To',
    icon: '📋',
    description: 'Step-by-step guide with actionable takeaways',
    prompt: 'Write a practical how-to guide. Use numbered steps or bullet points. Include specific, actionable advice. Make each step clear and concise.',
  },
  {
    id: 'personal-brand',
    label: 'Personal Brand',
    icon: '✨',
    description: 'Showcase your unique expertise and personality',
    prompt: 'Write a post that builds personal brand. Share a unique experience or achievement. Be authentic and vulnerable. Show expertise while staying approachable.',
  },
  {
    id: 'hot-take',
    label: 'Hot Take',
    icon: '🔥',
    description: 'Bold, controversial opinion that sparks discussion',
    prompt: 'Write a bold, contrarian hot take. Challenge conventional wisdom. Be provocative but professional. Back up claims with reasoning. Invite debate.',
  },
  {
    id: 'data-driven',
    label: 'Data Driven',
    icon: '📊',
    description: 'Insights backed by numbers, stats, and research',
    prompt: 'Write a data-driven post with statistics and research. Lead with a surprising data point. Analyze what the numbers mean. Draw actionable conclusions.',
  },
];

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'pt', label: 'Portuguese', flag: '🇧🇷' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', label: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
];

export const TONES: Tone[] = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'casual', label: 'Casual', icon: '😊' },
  { id: 'inspirational', label: 'Inspirational', icon: '🌟' },
  { id: 'humorous', label: 'Humorous', icon: '😄' },
  { id: 'urgent', label: 'Urgent', icon: '⚡' },
  { id: 'empathetic', label: 'Empathetic', icon: '💛' },
];

export const TEMPLATES: Template[] = [
  {
    id: 'achievement',
    title: 'Achievement Announcement',
    category: 'Personal Brand',
    content: `I'm thrilled to share that [ACHIEVEMENT].\n\nThis journey taught me:\n\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]\n\nGrateful to [people/org] who made this possible.\n\nWhat's a recent win you're proud of? 👇`,
  },
  {
    id: 'lesson-learned',
    title: 'Lesson Learned',
    category: 'Story',
    content: `[X] years ago, I [situation].\n\nI thought [assumption].\n\nI was wrong.\n\nHere's what actually happened:\n\n[Story]\n\nThe lesson? [Key takeaway]\n\nHave you experienced something similar?`,
  },
  {
    id: 'industry-insight',
    title: 'Industry Insight',
    category: 'Thought Leader',
    content: `Everyone says [common belief].\n\nBut after [experience/research], I've learned:\n\n[Insight 1]\n[Insight 2]\n[Insight 3]\n\nThe industry is shifting, and here's why it matters:\n\n[Analysis]\n\nAgree or disagree? I'd love to hear your perspective.`,
  },
  {
    id: 'step-by-step',
    title: 'Step-by-Step Guide',
    category: 'How-To',
    content: `Want to [desired outcome]? Here's exactly how:\n\nStep 1: [Action]\n→ [Detail]\n\nStep 2: [Action]\n→ [Detail]\n\nStep 3: [Action]\n→ [Detail]\n\nStep 4: [Action]\n→ [Detail]\n\nStep 5: [Action]\n→ [Detail]\n\nBookmark this for later. 🔖\n\nWhich step do you find most challenging?`,
  },
  {
    id: 'hot-take',
    title: 'Controversial Opinion',
    category: 'Hot Take',
    content: `Unpopular opinion:\n\n[Bold statement]\n\nHere's why:\n\n1. [Reason with evidence]\n2. [Reason with evidence]\n3. [Reason with evidence]\n\nI know this might ruffle some feathers, but [supporting argument].\n\nChange my mind. 👇`,
  },
  {
    id: 'data-insight',
    title: 'Data-Backed Insight',
    category: 'Data Driven',
    content: `[Shocking statistic] 📊\n\nLet that sink in.\n\nHere's what the data tells us:\n\n→ [Data point 1]: [Implication]\n→ [Data point 2]: [Implication]\n→ [Data point 3]: [Implication]\n\nThe takeaway?\n\n[Actionable conclusion]\n\nWhat patterns are you seeing in your industry?`,
  },
  {
    id: 'career-advice',
    title: 'Career Advice',
    category: 'Personal Brand',
    content: `If I could go back and give my younger self career advice:\n\n1. [Advice] — because [reason]\n2. [Advice] — because [reason]\n3. [Advice] — because [reason]\n4. [Advice] — because [reason]\n5. [Advice] — because [reason]\n\nWhat would you tell YOUR younger self?`,
  },
  {
    id: 'myth-busting',
    title: 'Myth Busting',
    category: 'Thought Leader',
    content: `"[Common myth]"\n\nI hear this all the time. Let's break it down:\n\nMyth: [Myth]\nReality: [Truth]\n\nMyth: [Myth]\nReality: [Truth]\n\nMyth: [Myth]\nReality: [Truth]\n\nStop believing everything you hear. Start questioning.\n\nWhat's a myth in YOUR industry that needs busting?`,
  },
];

export const LINKEDIN_CHAR_LIMIT = 3000;
export const CHAR_WARNING_THRESHOLD = 2500;
export const CHAR_DANGER_THRESHOLD = 2900;
