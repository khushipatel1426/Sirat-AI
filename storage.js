/**
 * SIRATAI LOCAL STORAGE UTILITY
 * Robust client-side state management for prototype persistence
 */

const STORAGE_KEYS = {
  THEME: 'siratai_theme',
  LANGUAGE: 'siratai_language',
  BOOKMARKS: 'siratai_bookmarks',
  TASBEEH: 'siratai_tasbeeh',
  TASBEEH_SESSIONS: 'siratai_tasbeeh_sessions',
  REFLECTIONS: 'siratai_reflections',
  LEARNING_PROGRESS: 'siratai_learning_progress',
  QUIZ_RESULTS: 'siratai_quiz_results',
  HISTORY: 'siratai_history',
  SETTINGS: 'siratai_settings'
};

const StorageService = {
  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Language
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  },
  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Bookmarks
  getBookmarks() {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  },
  addBookmark(item) {
    const list = this.getBookmarks();
    if (!list.some(b => b.id === item.id && b.type === item.type)) {
      list.unshift({ ...item, savedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
      this.addHistory({ action: `Bookmarked ${item.title || item.type}`, type: 'bookmark', timestamp: new Date().toISOString() });
      return true;
    }
    return false;
  },
  removeBookmark(id, type) {
    const list = this.getBookmarks().filter(b => !(b.id === id && b.type === type));
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
  },
  isBookmarked(id, type) {
    return this.getBookmarks().some(b => b.id === id && b.type === type);
  },

  // Tasbeeh
  getTasbeehState() {
    const data = localStorage.getItem(STORAGE_KEYS.TASBEEH);
    return data ? JSON.parse(data) : {
      count: 0,
      goal: 33,
      dhikrId: 'subhanallah',
      todayTotal: 127,
      weekTotal: 840,
      monthTotal: 3420,
      soundEnabled: true,
      hapticEnabled: true
    };
  },
  saveTasbeehState(state) {
    localStorage.setItem(STORAGE_KEYS.TASBEEH, JSON.stringify(state));
  },
  getTasbeehSessions() {
    const data = localStorage.getItem(STORAGE_KEYS.TASBEEH_SESSIONS);
    return data ? JSON.parse(data) : [
      { date: '2026-09-01', count: 330, dhikr: 'SubhanAllah' },
      { date: '2026-09-02', count: 400, dhikr: 'Alhamdulillah' },
      { date: '2026-09-03', count: 290, dhikr: 'Allahu Akbar' },
      { date: '2026-09-04', count: 400, dhikr: 'Astaghfirullah' }
    ];
  },
  addTasbeehSession(session) {
    const sessions = this.getTasbeehSessions();
    sessions.unshift({ ...session, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.TASBEEH_SESSIONS, JSON.stringify(sessions));
  },

  // Reflections
  getReflections() {
    const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    return data ? JSON.parse(data) : [
      {
        id: 'ref-1',
        title: 'Contemplation on Sabr in Hardship',
        text: 'Reflecting on Surah Ash-Sharh (94:5-6) - Indeed with hardship comes ease. Patience is not passive resignation, but active constancy with trust.',
        themes: ['Sabr', 'Tawakkul', 'Ease'],
        date: '2026-09-02T14:30:00.000Z'
      },
      {
        id: 'ref-2',
        title: 'Gratitude for Hidden Blessings',
        text: 'Countless favors of Allah exist beyond what we actively notice. Shukr shifts focus from what is missing to what is bestowed.',
        themes: ['Shukr', 'Gratitude', 'Mindfulness'],
        date: '2026-09-04T09:15:00.000Z'
      }
    ];
  },
  saveReflection(reflection) {
    const list = this.getReflections();
    list.unshift({ ...reflection, id: 'ref-' + Date.now(), date: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(list));
    this.addHistory({ action: `Recorded reflection: "${reflection.title || 'Untitled'}"`, type: 'reflection', timestamp: new Date().toISOString() });
  },

  // History
  getHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [
      { action: 'Completed Sabr Knowledge Check (Score: 9/10)', type: 'quiz', timestamp: '2026-09-04T12:00:00.000Z' },
      { action: 'Completed Tasbeeh session (100 repetitions)', type: 'tasbeeh', timestamp: '2026-09-04T10:15:00.000Z' },
      { action: 'Explored Surah Al-Baqarah 2:153', type: 'quran', timestamp: '2026-09-03T18:20:00.000Z' },
      { action: 'Searched Hadith on Intentions in Sahih Bukhari', type: 'hadith', timestamp: '2026-09-03T15:40:00.000Z' }
    ];
  },
  addHistory(item) {
    const history = this.getHistory();
    history.unshift({ id: 'h-' + Date.now(), ...item });
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }
};
