export interface FavoriteItem {
  id: string;
  type: 'post' | 'hook' | 'hashtag';
  content: string;
  timestamp: number;
  topic?: string;
}

const STORAGE_KEY = 'postcraft-favorites';
const MAX_FAVORITES = 50;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        resolve(result[STORAGE_KEY] || []);
      });
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        resolve(stored ? JSON.parse(stored) : []);
      } catch {
        resolve([]);
      }
    }
  });
}

async function saveFavorites(favorites: FavoriteItem[]): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: favorites }, () => resolve());
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch { /* ignore */ }
      resolve();
    }
  });
}

export async function addFavorite(
  type: FavoriteItem['type'],
  content: string,
  topic?: string
): Promise<FavoriteItem[]> {
  const favorites = await getFavorites();

  // Check for duplicates
  const exists = favorites.some((f) => f.content === content && f.type === type);
  if (exists) return favorites;

  const item: FavoriteItem = {
    id: generateId(),
    type,
    content,
    timestamp: Date.now(),
    topic,
  };

  const updated = [item, ...favorites].slice(0, MAX_FAVORITES);
  await saveFavorites(updated);
  return updated;
}

export async function removeFavorite(id: string): Promise<FavoriteItem[]> {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  await saveFavorites(updated);
  return updated;
}

export async function toggleFavorite(
  type: FavoriteItem['type'],
  content: string,
  topic?: string
): Promise<{ favorites: FavoriteItem[]; isFavorited: boolean }> {
  const favorites = await getFavorites();
  const existing = favorites.find((f) => f.content === content && f.type === type);

  if (existing) {
    const updated = favorites.filter((f) => f.id !== existing.id);
    await saveFavorites(updated);
    return { favorites: updated, isFavorited: false };
  } else {
    const updated = await addFavorite(type, content, topic);
    return { favorites: updated, isFavorited: true };
  }
}

export async function isFavorited(
  type: FavoriteItem['type'],
  content: string
): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some((f) => f.content === content && f.type === type);
}
