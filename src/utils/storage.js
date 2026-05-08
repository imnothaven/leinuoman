const STORAGE_KEY = "lenormand_history";
const MAX_HISTORY = 50;

export function saveReading(record) {
  try {
    const history = getHistory();
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      timestamp: new Date().toISOString(),
      question: record.question || "",
      spread: record.spread || {},
      cards: record.cards || [],
      reading: record.reading || [],
      summary: record.summary || {},
    };

    history.unshift(entry);

    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return entry;
  } catch (e) {
    console.warn("历史记录保存失败:", e);
    return null;
  }
}

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("历史记录读取失败:", e);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.warn("历史记录清除失败:", e);
    return false;
  }
}

export function deleteHistoryEntry(id) {
  try {
    const history = getHistory().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.warn("历史记录删除失败:", e);
    return false;
  }
}
