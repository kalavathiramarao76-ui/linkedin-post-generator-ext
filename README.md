<p align="center"><img src="src/assets/icons/logo.svg" width="128" height="128" alt="Quillnova Logo"></p>

# Quillnova — AI-Powered LinkedIn Post Generator

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

> Craft high-engagement LinkedIn posts with AI-driven writing styles, hooks, hashtags, and multi-language support — directly inside LinkedIn.

---

## Features

- :pencil2: **6 Writing Styles** — Thought Leader, Story, How-To, Personal Brand, Hot Take, Data-Driven
- :hook: **Hook Generator** — AI-crafted opening lines that stop the scroll
- :hash: **Hashtag Engine** — Smart hashtag suggestions tailored to your content and audience
- :art: **Tone Adjustment** — Fine-tune voice and tone to match your personal brand
- :globe_with_meridians: **10 Languages** — Generate posts in English, Spanish, French, German, Portuguese, Hindi, Chinese, Japanese, Korean, and Arabic
- :syringe: **LinkedIn Composer Injection** — Seamlessly injects into the native LinkedIn post composer
- :page_facing_up: **8 Templates** — Pre-built post templates for common LinkedIn content patterns
- :star: **Favorites** — Save up to 50 favorite posts for quick reuse
- :blue_heart: **Blue Theme** — Clean, professional UI that matches LinkedIn's design language

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Build tool & dev server |
| **Firebase** | Backend services |
| **Marked** | Markdown rendering |
| **Chrome Extensions API** | Browser integration |

---

## Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/linkedin-post-generator-ext.git
   cd linkedin-post-generator-ext
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load into Chrome**
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `dist/` folder

### Development Mode

```bash
npm run dev
```
This runs Vite in watch mode, automatically rebuilding on file changes.

---

## Usage

### Generating a Post
1. Click the Quillnova icon in your Chrome toolbar to open the popup
2. Select one of the **6 writing styles** (e.g., Thought Leader, Story, How-To)
3. Enter your topic or key points
4. Adjust **tone** and **language** settings as needed
5. Click **Generate** to create your post

### Using the Hook Generator
1. Navigate to the **Hooks** section
2. Enter your post topic
3. Browse generated hooks and select one to insert into your post

### Hashtag Engine
1. After generating a post, view the suggested hashtags
2. Toggle hashtags on or off to customize your selection
3. Hashtags are automatically appended to your post

### LinkedIn Integration
1. Open LinkedIn and start creating a new post
2. The Quillnova button appears in the LinkedIn composer
3. Click it to open the side panel and generate content directly into the editor

### Templates & Favorites
- Browse **8 pre-built templates** for quick post creation
- **Star** any generated post to save it to Favorites (up to 50)

---

## Architecture

```
linkedin-post-generator-ext/
├── src/
│   ├── popup/              # Extension popup UI
│   ├── sidepanel/          # Side panel for full editing experience
│   ├── background/         # Service worker & event handling
│   ├── content/            # Content scripts for LinkedIn injection
│   ├── shared/             # Shared utilities, types, and constants
│   ├── ui/                 # Reusable UI components
│   └── assets/
│       └── icons/          # Extension icons (16, 48, 128px)
├── dist/                   # Built extension output
├── vite.config.ts          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── manifest.json           # Chrome extension manifest
```

---

## Screenshots

<p align="center">
  <img src="src/assets/icons/logo.svg" alt="Quillnova Logo" width="128" height="128" />
</p>

| Icon | Path |
|---|---|
| SVG Logo | `src/assets/icons/logo.svg` |
| 16x16 | `src/assets/icons/icon-16.png` |
| 48x48 | `src/assets/icons/icon-48.png` |
| 128x128 | `src/assets/icons/icon-128.png` |

---

## License

ISC
