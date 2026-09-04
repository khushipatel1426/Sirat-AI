/**
 * ==========================================================================
 * SIRATAI — MASTER CONSOLIDATED APPLICATION ENGINE
 * All-In-One Unified Architecture (Storage, Audio, Data, AI, Quran, Hadith,
 * Duas, Adhkar, Tasbeeh, Reflection, Learning, Quiz, D3 Graph, Dashboard, FAB)
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. LOCAL STORAGE SERVICE
// --------------------------------------------------------------------------
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
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  getLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  },
  setLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },
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
  getTasbeehState() {
    const data = localStorage.getItem(STORAGE_KEYS.TASBEEH);
    return data ? JSON.parse(data) : {
      count: 0,
      goal: 33,
      dhikrId: 'subhanallah',
      dhikrTitle: 'SubhanAllah',
      dhikrArabic: 'سُبْحَانَ اللَّهِ',
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
  getReflections() {
    const data = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    return data ? JSON.parse(data) : [
      {
        id: 'ref-1',
        title: 'Contemplation on Sabr in Hardship',
        text: 'Reflecting on Surah Ash-Sharh (94:5-6) - Indeed with hardship comes ease. Patience is active constancy with trust.',
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

// --------------------------------------------------------------------------
// 2. AUDIO & HAPTIC SYNTHESIZER
// --------------------------------------------------------------------------
const AudioService = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  },
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {}
  },
  playGoalChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.08);
        osc.stop(this.ctx.currentTime + i * 0.08 + 0.45);
      });
    } catch (e) {}
  },
  triggerHaptic(pattern = 15) {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }
};

// --------------------------------------------------------------------------
// 3. KNOWLEDGE DATASETS
// --------------------------------------------------------------------------
const SIRAT_DATA = {
  surahs: [
    {
      id: 1,
      name: "Al-Fatihah",
      arabic: "الفاتحة",
      meaning: "The Opening",
      versesCount: 7,
      revelation: "Meccan",
      ayahs: [
        { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Bismillāhir-Raḥmānir-Raḥīm", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", reference: "1:1" },
        { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn", translation: "[All] praise is [due] to Allah, Lord of the worlds.", reference: "1:2" },
        { number: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", transliteration: "Ar-Raḥmānir-Raḥīm", translation: "The Entirely Merciful, the Especially Merciful,", reference: "1:3" },
        { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", transliteration: "Māliki Yawmid-Dīn", translation: "Sovereign of the Day of Recompense.", reference: "1:4" },
        { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", transliteration: "Iyyāka na'budu wa iyyāka nasta'īn", translation: "It is You we worship and You we ask for help.", reference: "1:5" },
        { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", transliteration: "Ihdināṣ-ṣirāṭal-mustaqīm", translation: "Guide us to the straight path -", reference: "1:6" },
        { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", transliteration: "Ṣirāṭalladhīna an'amta 'alayhim...", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked anger or are astray.", reference: "1:7" }
      ]
    },
    {
      id: 2,
      name: "Al-Baqarah",
      arabic: "البقرة",
      meaning: "The Cow",
      versesCount: 286,
      revelation: "Medinan",
      ayahs: [
        { number: 153, arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", transliteration: "Yā ayyuhalladhīna āmanūsta'īnū biṣ-ṣabri waṣ-ṣalāh; innallāha ma'aṣ-ṣābirīn", translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.", reference: "2:153" },
        { number: 255, arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", transliteration: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm...", translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence.", reference: "2:255" }
      ]
    },
    {
      id: 94,
      name: "Ash-Sharh",
      arabic: "الشرح",
      meaning: "The Relief",
      versesCount: 8,
      revelation: "Meccan",
      ayahs: [
        { number: 1, arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", transliteration: "A-lam nashraḥ laka ṣadrak", translation: "Did We not expand for you your breast?", reference: "94:1" },
        { number: 5, arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", transliteration: "Fa-inna ma'al-'usri yusrā", translation: "For indeed, with hardship [will be] ease.", reference: "94:5" },
        { number: 6, arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", transliteration: "Inna ma'al-'usri yusrā", translation: "Indeed, with hardship [will be] ease.", reference: "94:6" }
      ]
    }
  ],
  hadiths: [
    {
      id: "h-1",
      collection: "Sahih al-Bukhari",
      bookNumber: "Book 1, Hadith 1",
      narrator: "Umar bin Al-Khattab (RA)",
      grade: "Sahih (Authentic)",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      english: "Actions are but by intentions, and every person will only have what they intended.",
      topic: "Intentions",
      reference: "Sahih al-Bukhari 1",
      explanation: "This fundamental principle establishes that the spiritual and moral weight of every deed depends upon the purity of the inward motive."
    },
    {
      id: "h-2",
      collection: "Sahih Muslim",
      bookNumber: "Book 55, Hadith 82",
      narrator: "Suhaib (RA)",
      grade: "Sahih (Authentic)",
      arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ...",
      english: "How wonderful is the affair of the believer, for his affairs are all good... If ease happens to him, he is grateful; and if adversity happens, he is patient.",
      topic: "Patience",
      reference: "Sahih Muslim 2999",
      explanation: "The believer’s spiritual equilibrium transforms both prosperity (through Shukr) and trial (through Sabr) into continuous proximity to Allah."
    },
    {
      id: "h-3",
      collection: "Jami` at-Tirmidhi",
      bookNumber: "Book 37, Hadith 2516",
      narrator: "Ibn Abbas (RA)",
      grade: "Hasan Sahih",
      arabic: "احْفَظِ اللَّهَ يَحْفَظْكَ...",
      english: "Be mindful of Allah, and He will protect you. If you ask, ask Allah; and if you seek help, seek help from Allah.",
      topic: "Tawakkul",
      reference: "Jami` at-Tirmidhi 2516",
      explanation: "A foundational discourse on maintaining moral vigilance in prosperity and cultivating reliance on Allah."
    }
  ],
  duas: [
    {
      id: "dua-1",
      title: "Dua for Knowledge & Understanding",
      category: "Knowledge",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidnī 'ilmā",
      translation: "My Lord, increase me in knowledge.",
      reference: "Surah Ta-Ha (20:114)",
      targetCount: 33,
      context: "Recited before study, reflection, or entering demanding intellectual tasks."
    },
    {
      id: "dua-2",
      title: "Dua of Absolute Reliance (Tawakkul)",
      category: "Difficulty",
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      transliteration: "Ḥasbunallāhu wa ni'mal-wakīl",
      translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
      reference: "Surah Ali 'Imran (3:173)",
      targetCount: 33,
      context: "Uttered in moments of profound trials and uncertainties."
    },
    {
      id: "dua-3",
      title: "Dua in Distress (Yunusiya)",
      category: "Difficulty",
      arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration: "Lā ilāha illā Anta subḥānaka...",
      translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      reference: "Surah Al-Anbiya (21:87)",
      targetCount: 40,
      context: "The invocation of Prophet Yunus (AS) in the whale, affirming divine oneness."
    }
  ],
  adhkar: [
    { id: "dhikr-1", title: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", transliteration: "Subḥānallāh", meaning: "Glory be to Allah", targetCount: 33, currentCount: 0, category: "After Salah" },
    { id: "dhikr-2", title: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", transliteration: "Al-ḥamdulillāh", meaning: "All praise belongs to Allah", targetCount: 33, currentCount: 0, category: "After Salah" },
    { id: "dhikr-3", title: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", transliteration: "Allāhu Akbar", meaning: "Allah is the Greatest", targetCount: 34, currentCount: 0, category: "After Salah" },
    { id: "dhikr-4", title: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", transliteration: "Astaghfirullāh", meaning: "I seek forgiveness from Allah", targetCount: 100, currentCount: 0, category: "Morning" }
  ],
  learningPaths: [
    {
      id: "path-sabr",
      title: "Understanding Sabr: Depth, Balance & Practice",
      tagline: "Move beyond passive endurance to active fortitude grounded in divine wisdom.",
      progress: 78,
      duration: "45 mins",
      difficulty: "Intermediate",
      sourcesCount: 14,
      nodes: [
        { id: 1, title: "Linguistic & Conceptual Core", type: "concept", status: "completed" },
        { id: 2, title: "The Quranic Perspective (2:153)", type: "quran", status: "completed" },
        { id: 3, title: "Prophetic Fortitude in Hadith", type: "hadith", status: "completed" },
        { id: 4, title: "Sabr vs Passivity in Daily Life", type: "practice", status: "in_progress" },
        { id: 5, title: "Personal Contemplation", type: "reflection", status: "locked" },
        { id: 6, title: "Knowledge Assessment Check", type: "quiz", status: "locked" }
      ]
    },
    {
      id: "path-tawakkul",
      title: "Tawakkul: Divine Trust & Human Agency",
      tagline: "Master the harmony between taking practical means and placing reliance on Allah.",
      progress: 42,
      duration: "35 mins",
      difficulty: "Beginner",
      sourcesCount: 9,
      nodes: [
        { id: 1, title: "Defining Tawakkul vs Tawaakul", type: "concept", status: "completed" },
        { id: 2, title: "Tying the Camel: The Prophetic Balance", type: "hadith", status: "completed" },
        { id: 3, title: "Duas of Reliance in Quran", type: "dua", status: "in_progress" },
        { id: 4, title: "Knowledge Assessment Check", type: "quiz", status: "locked" }
      ]
    }
  ],
  quizQuestions: [
    {
      id: "q-1",
      topic: "Sabr",
      question: "According to Surah Al-Baqarah (2:153), what two means are believers instructed to seek help through?",
      options: [
        "Knowledge and Solitude",
        "Patience and Prayer (Sabr & Salah)",
        "Charity and Fasting",
        "Silence and Seclusion"
      ],
      correctIndex: 1,
      explanation: "Surah Al-Baqarah 2:153 explicitly commands: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.'"
    },
    {
      id: "q-2",
      topic: "Hadith Principles",
      question: "The celebrated first Hadith of Sahih al-Bukhari narrates that the value of deeds is judged by:",
      options: [
        "Their physical magnitude",
        "Their public recognition",
        "The intentions (Niyyah) behind them",
        "The speed of their completion"
      ],
      correctIndex: 2,
      explanation: "Umar bin Al-Khattab (RA) reported that the Messenger of Allah (ﷺ) said: 'Actions are but by intentions, and every person will only have what they intended.' (Bukhari 1)"
    }
  ],
  knowledgeGraph: {
    nodes: [
      { id: "Sabr", label: "Sabr (Patience & Fortitude)", group: "concept", size: 30 },
      { id: "Tawakkul", label: "Tawakkul (Reliance on Allah)", group: "concept", size: 28 },
      { id: "Shukr", label: "Shukr (Gratitude)", group: "concept", size: 26 },
      { id: "Salah", label: "Salah (Prayer)", group: "concept", size: 28 },
      { id: "Q2:153", label: "Quran 2:153 (Sabr & Salah)", group: "quran", size: 20 },
      { id: "Bukhari-1", label: "Bukhari 1 (Intentions)", group: "hadith", size: 22 },
      { id: "Dua-Hasbunallah", label: "Hasbunallah wa ni'mal wakeel", group: "dua", size: 18 }
    ],
    links: [
      { source: "Sabr", target: "Salah", relationship: "Companions in Quran 2:153" },
      { source: "Sabr", target: "Q2:153", relationship: "Primary Source" },
      { source: "Salah", target: "Q2:153", relationship: "Primary Source" },
      { source: "Tawakkul", target: "Sabr", relationship: "Reinforcing Principle" },
      { source: "Tawakkul", target: "Dua-Hasbunallah", relationship: "Supplication" }
    ]
  }
};

// --------------------------------------------------------------------------
// 4. TASBEEH SIGNATURE EXPERIENCE
// --------------------------------------------------------------------------
const TasbeehModule = {
  state: {
    count: 0,
    goal: 33,
    dhikrTitle: 'SubhanAllah',
    dhikrArabic: 'سُبْحَانَ اللَّهِ',
    todayTotal: 127,
    weekTotal: 840,
    monthTotal: 3420,
    soundEnabled: true,
    hapticEnabled: true,
    sessionSeconds: 0,
    timerInterval: null
  },
  init() {
    const saved = StorageService.getTasbeehState();
    if (saved) Object.assign(this.state, saved);
    this.bindEvents();
    this.updateUI();
    this.startSessionTimer();
  },
  bindEvents() {
    const dial = document.getElementById('tasbeehDialWrapper');
    if (dial) {
      dial.addEventListener('click', (e) => {
        e.preventDefault();
        this.increment();
      });
    }
    window.addEventListener('keydown', (e) => {
      const activeView = document.querySelector('.app-view.active');
      if (activeView && activeView.id === 'view-tasbeeh') {
        if (e.code === 'Space' || e.code === 'Enter') {
          if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
          e.preventDefault();
          this.increment();
        }
      }
    });
    const undoBtn = document.getElementById('tasbeehUndoBtn');
    if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
    const resetBtn = document.getElementById('tasbeehResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    const soundBtn = document.getElementById('tasbeehSoundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.state.soundEnabled = !this.state.soundEnabled;
        soundBtn.classList.toggle('active', this.state.soundEnabled);
        this.save();
        if (window.App) window.App.showToast(this.state.soundEnabled ? 'Tasbeeh audio enabled' : 'Tasbeeh audio muted');
      });
    }
    document.querySelectorAll('.tasbeeh-goal-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.tasbeeh-goal-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.setGoal(parseInt(pill.dataset.goal, 10));
      });
    });
    document.querySelectorAll('.tasbeeh-preset-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.tasbeeh-preset-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.setPreset(pill.dataset.title, pill.dataset.arabic);
      });
    });
  },
  increment() {
    this.state.count++;
    this.state.todayTotal++;
    this.state.weekTotal++;
    if (this.state.soundEnabled) AudioService.playClick();
    if (this.state.hapticEnabled) AudioService.triggerHaptic(15);
    const dial = document.getElementById('tasbeehDialWrapper');
    if (dial) {
      dial.classList.remove('tasbeeh-pulse');
      void dial.offsetWidth;
      dial.classList.add('tasbeeh-pulse');
    }
    if (this.state.count === this.state.goal) {
      if (this.state.soundEnabled) AudioService.playGoalChime();
      if (this.state.hapticEnabled) AudioService.triggerHaptic([30, 60, 30]);
      if (window.App) window.App.showToast(`✨ Target reached: ${this.state.goal} repetitions completed!`);
      StorageService.addTasbeehSession({
        dhikr: this.state.dhikrTitle,
        count: this.state.goal,
        durationSeconds: this.state.sessionSeconds
      });
    }
    this.updateUI();
    this.save();
  },
  undo() {
    if (this.state.count > 0) {
      this.state.count--;
      this.state.todayTotal = Math.max(0, this.state.todayTotal - 1);
      this.updateUI();
      this.save();
      if (this.state.soundEnabled) AudioService.playClick();
    }
  },
  reset() {
    this.state.count = 0;
    this.updateUI();
    this.save();
    if (window.App) window.App.showToast('Tasbeeh counter reset');
  },
  setGoal(goalNum) {
    this.state.goal = goalNum;
    this.updateUI();
    this.save();
  },
  setPreset(title, arabic) {
    this.state.dhikrTitle = title;
    this.state.dhikrArabic = arabic;
    this.state.count = 0;
    this.updateUI();
    this.save();
    if (window.App) window.App.showToast(`Selected: ${title}`);
  },
  setCountWithDhikr(title, arabic, targetCount) {
    this.state.dhikrTitle = title;
    this.state.dhikrArabic = arabic;
    this.state.goal = targetCount;
    this.state.count = 0;
    this.updateUI();
    this.save();
  },
  updateUI() {
    const countEl = document.getElementById('tasbeehCountDisplay');
    const goalEl = document.getElementById('tasbeehGoalDisplay');
    const titleEl = document.getElementById('tasbeehDhikrTitle');
    const arabicEl = document.getElementById('tasbeehDhikrArabic');
    const ringEl = document.getElementById('tasbeehRingProgress');
    const todayEl = document.getElementById('tasbeehStatToday');
    const weekEl = document.getElementById('tasbeehStatWeek');
    if (countEl) countEl.textContent = this.state.count;
    if (goalEl) goalEl.textContent = `${this.state.count} / ${this.state.goal}`;
    if (titleEl) titleEl.textContent = this.state.dhikrTitle;
    if (arabicEl) arabicEl.textContent = this.state.dhikrArabic;
    if (todayEl) todayEl.textContent = this.state.todayTotal;
    if (weekEl) weekEl.textContent = this.state.weekTotal;
    if (ringEl) {
      const radius = 115;
      const circumference = 2 * Math.PI * radius;
      const progress = Math.min(this.state.count / this.state.goal, 1);
      const offset = circumference - progress * circumference;
      ringEl.style.strokeDasharray = `${circumference}`;
      ringEl.style.strokeDashoffset = `${offset}`;
    }
  },
  startSessionTimer() {
    this.state.sessionSeconds = 0;
    if (this.state.timerInterval) clearInterval(this.state.timerInterval);
    this.state.timerInterval = setInterval(() => {
      this.state.sessionSeconds++;
      const timerEl = document.getElementById('tasbeehSessionTimer');
      if (timerEl) {
        const mins = String(Math.floor(this.state.sessionSeconds / 60)).padStart(2, '0');
        const secs = String(this.state.sessionSeconds % 60).padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  },
  save() {
    StorageService.saveTasbeehState(this.state);
  }
};

// --------------------------------------------------------------------------
// 5. ASK SIRATAI CONVERSATION & GROUNDING
// --------------------------------------------------------------------------
const AIChatModule = {
  chatStreamEl: null,
  inputEl: null,
  sendBtnEl: null,
  init() {
    this.chatStreamEl = document.getElementById('chatStream');
    this.inputEl = document.getElementById('chatInput');
    this.sendBtnEl = document.getElementById('chatSendBtn');
    if (this.sendBtnEl && this.inputEl) {
      this.sendBtnEl.addEventListener('click', () => this.handleSend());
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }
    document.querySelectorAll('.chat-starter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (this.inputEl) {
          this.inputEl.value = pill.textContent.trim();
          this.handleSend();
        }
      });
    });
  },
  askQuery(query) {
    if (this.inputEl) {
      this.inputEl.value = query;
      this.handleSend();
    }
  },
  handleSend() {
    const text = this.inputEl.value.trim();
    if (!text) return;
    const msg = document.createElement('div');
    msg.className = 'message-user animate-fade-in-up';
    msg.textContent = text;
    this.chatStreamEl.appendChild(msg);
    this.inputEl.value = '';
    this.scrollToBottom();

    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'message-ai animate-fade-in-up';
    thinkingEl.innerHTML = `
      <div class="ai-thinking-box">
        <div class="thinking-step active"><div class="ai-step-dot"></div><span>Retrieving Quran & Hadith sources...</span></div>
      </div>
    `;
    this.chatStreamEl.appendChild(thinkingEl);
    this.scrollToBottom();

    setTimeout(() => {
      thinkingEl.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="color: var(--color-emerald); font-weight: 700;">✦ SIRATAI</span>
          <span class="badge badge-emerald">✓ Source Grounded</span>
        </div>
        <div style="font-size: var(--text-base); color: var(--text-primary); line-height: var(--leading-relaxed); margin-top: var(--space-2);">
          In Islamic teaching, patience (Sabr) is purposeful fortitude and trust in Allah during both adversity and prosperity. It is paired directly with prayer in Surah Al-Baqarah (2:153).
        </div>
        <div class="evidence-panel" style="margin-top: var(--space-3);">
          <div class="evidence-header" onclick="this.parentElement.classList.toggle('open')">
            <span>✓ View Evidence & Grounding Details</span>
            <span>▼</span>
          </div>
          <div class="evidence-content">
            <div class="evidence-item">
              <strong>Quran 2:153 & Sahih Muslim 2999</strong>
              <div>Verified authentic corpus match (98.4% retrieval confidence).</div>
            </div>
          </div>
        </div>
      `;
      this.scrollToBottom();
    }, 1200);
  },
  scrollToBottom() {
    if (this.chatStreamEl) this.chatStreamEl.scrollTop = this.chatStreamEl.scrollHeight;
  }
};

// --------------------------------------------------------------------------
// 6. QURAN EXPLORER
// --------------------------------------------------------------------------
const QuranModule = {
  currentSurahId: 1,
  init() {
    this.renderSurahList();
    this.renderAyahs(this.currentSurahId);
  },
  renderSurahList() {
    const listEl = document.getElementById('surahListItems');
    if (!listEl) return;
    listEl.innerHTML = SIRAT_DATA.surahs.map(s => `
      <div class="surah-item ${s.id === this.currentSurahId ? 'active' : ''}" onclick="QuranModule.selectSurah(${s.id})">
        <div>
          <strong style="color: var(--text-primary); font-size: var(--text-sm);">${s.id}. ${s.name}</strong>
          <div style="font-size: var(--text-xs); color: var(--text-muted);">${s.meaning} • ${s.versesCount} verses</div>
        </div>
        <div class="font-arabic" style="font-size: 1.1rem; color: var(--color-emerald);">${s.arabic}</div>
      </div>
    `).join('');
  },
  selectSurah(id) {
    this.currentSurahId = id;
    this.renderSurahList();
    this.renderAyahs(id);
    const surah = SIRAT_DATA.surahs.find(s => s.id === id);
    const titleEl = document.getElementById('playerSurahTitle');
    if (titleEl && surah) titleEl.textContent = `${surah.name} (${surah.meaning})`;
  },
  renderAyahs(surahId) {
    const viewerEl = document.getElementById('ayahViewer');
    if (!viewerEl) return;
    const surah = SIRAT_DATA.surahs.find(s => s.id === surahId);
    if (!surah) return;
    viewerEl.innerHTML = surah.ayahs.map(a => `
      <div class="ayah-card animate-fade-in-up">
        <div class="ayah-header">
          <span class="badge badge-neutral">${surah.name} ${a.reference}</span>
          <button class="btn btn-ghost btn-sm" onclick="App.showToast('Reciting ${surah.name} ${a.reference}')">Recite</button>
        </div>
        <div class="font-arabic-lg">${a.arabic}</div>
        <div style="font-size: var(--text-sm); color: var(--color-emerald-light); font-family: var(--font-mono);">${a.transliteration}</div>
        <div style="font-size: var(--text-base); color: var(--text-primary);">${a.translation}</div>
      </div>
    `).join('');
  }
};

// --------------------------------------------------------------------------
// 7. HADITH EXPLORER
// --------------------------------------------------------------------------
const HadithModule = {
  init() {
    this.renderHadiths();
  },
  renderHadiths() {
    const listEl = document.getElementById('hadithList');
    if (!listEl) return;
    listEl.innerHTML = SIRAT_DATA.hadiths.map(h => `
      <div class="hadith-card animate-fade-in-up">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="badge badge-emerald">${h.collection} • ${h.grade}</span>
          <button class="btn btn-outline btn-sm" onclick="document.getElementById('expl-${h.id}').classList.toggle('open')">✦ AI Context</button>
        </div>
        <div class="font-arabic" style="font-size: 1.45rem;">${h.arabic}</div>
        <div style="font-size: var(--text-base); color: var(--text-primary);">"${h.english}"</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: var(--space-2);">
          Narrated by ${h.narrator} (${h.reference})
        </div>
        <div class="hadith-explanation-box" id="expl-${h.id}">
          <div class="eyebrow" style="color: var(--color-gold); margin-bottom: 4px;">✦ SiratAI Commentary</div>
          <p style="font-size: var(--text-sm); color: var(--text-primary);">${h.explanation}</p>
        </div>
      </div>
    `).join('');
  }
};

// --------------------------------------------------------------------------
// 8. DUAS & ADHKAR
// --------------------------------------------------------------------------
const DuasAdhkarModule = {
  init() {
    this.renderDuas();
    this.renderAdhkar();
  },
  renderDuas() {
    const gridEl = document.getElementById('duaGrid');
    if (!gridEl) return;
    gridEl.innerHTML = SIRAT_DATA.duas.map(d => `
      <div class="dua-card animate-fade-in-up">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="badge badge-emerald">${d.category}</span>
          <button class="btn btn-primary btn-sm" onclick="DuasAdhkarModule.openInTasbeeh('${d.title}', '${d.arabic.replace(/'/g, "\\'")}', ${d.targetCount})">
            Count (${d.targetCount}x) →
          </button>
        </div>
        <strong style="color: var(--text-primary); font-size: var(--text-base);">${d.title}</strong>
        <div class="font-arabic" style="font-size: 1.45rem;">${d.arabic}</div>
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">"${d.translation}"</div>
      </div>
    `).join('');
  },
  renderAdhkar() {
    const listEl = document.getElementById('adhkarGrid');
    if (!listEl) return;
    listEl.innerHTML = SIRAT_DATA.adhkar.map(a => `
      <div class="card card-hoverable animate-fade-in-up">
        <div style="display: flex; justify-content: space-between;">
          <span class="badge badge-neutral">${a.category}</span>
          <span style="font-size: var(--text-xs); font-family: var(--font-mono); color: var(--color-emerald-light);" id="adhkar-cnt-${a.id}">0 / ${a.targetCount}</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${a.title}</div>
        <div class="font-arabic" style="color: var(--color-emerald); font-size: 1.3rem;">${a.arabic}</div>
        <div style="margin-top: var(--space-3); display: flex; justify-content: space-between;">
          <button class="btn btn-secondary btn-sm" onclick="DuasAdhkarModule.openInTasbeeh('${a.title}', '${a.arabic.replace(/'/g, "\\'")}', ${a.targetCount})">Open in Tasbeeh</button>
          <button class="btn btn-primary btn-sm" onclick="DuasAdhkarModule.incrementAdhkar('${a.id}')">Count (+1)</button>
        </div>
      </div>
    `).join('');
  },
  incrementAdhkar(id) {
    const item = SIRAT_DATA.adhkar.find(a => a.id === id);
    if (!item) return;
    item.currentCount++;
    AudioService.playClick();
    const cntEl = document.getElementById(`adhkar-cnt-${id}`);
    if (cntEl) cntEl.textContent = `${item.currentCount} / ${item.targetCount}`;
    if (item.currentCount === item.targetCount) {
      AudioService.playGoalChime();
      App.showToast(`✨ Completed ${item.title} (${item.targetCount}x)!`);
    }
  },
  openInTasbeeh(title, arabic, targetCount) {
    App.navigateTo('tasbeeh');
    TasbeehModule.setCountWithDhikr(title, arabic, targetCount);
    App.showToast(`Opened ${title} in Tasbeeh`);
  }
};

// --------------------------------------------------------------------------
// 9. REFLECTION JOURNAL
// --------------------------------------------------------------------------
const ReflectionModule = {
  init() {
    const saveBtn = document.getElementById('saveReflectionBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const text = document.getElementById('reflectionTextInput').value.trim();
        if (!text) return App.showToast('Please enter your thoughts first.');
        StorageService.saveReflection({ title: 'Personal Contemplation', text, themes: ['Sabr', 'Mindfulness'] });
        document.getElementById('reflectionTextInput').value = '';
        App.showToast('✓ Reflection saved to your journal');
        this.renderReflections();
      });
    }
    this.renderReflections();
  },
  renderReflections() {
    const listEl = document.getElementById('reflectionsList');
    if (!listEl) return;
    const reflections = StorageService.getReflections();
    listEl.innerHTML = reflections.map(r => `
      <div class="card card-hoverable animate-fade-in-up" style="margin-bottom: var(--space-4);">
        <div style="font-weight: 600; color: var(--text-primary);">${r.title}</div>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin: var(--space-2) 0;">"${r.text}"</p>
        <div style="display: flex; gap: var(--space-2);">
          ${(r.themes || []).map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
};

// --------------------------------------------------------------------------
// 10. LEARNING HUB
// --------------------------------------------------------------------------
const LearningModule = {
  init() {
    const gridEl = document.getElementById('learningPathsGrid');
    if (gridEl) {
      gridEl.innerHTML = SIRAT_DATA.learningPaths.map(p => `
        <div class="card card-hoverable" style="border-color: var(--color-emerald);">
          <span class="badge badge-emerald">${p.difficulty}</span>
          <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin: var(--space-2) 0;">${p.title}</div>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-3);">${p.tagline}</p>
          <div class="progress-bar"><div class="progress-bar-fill" style="width: ${p.progress}%;"></div></div>
        </div>
      `).join('');
    }
  }
};

// --------------------------------------------------------------------------
// 11. ADAPTIVE QUIZ
// --------------------------------------------------------------------------
const QuizModule = {
  init() {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    const q = SIRAT_DATA.quizQuestions[0];
    container.innerHTML = `
      <div class="card card-elevated" style="max-width: 680px; margin: 0 auto;">
        <span class="badge badge-emerald">${q.topic}</span>
        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin: var(--space-4) 0;">${q.question}</h3>
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${q.options.map((opt, i) => `
            <button class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: var(--space-4);" onclick="App.showToast('Correct answer! 2:153 commands patience & prayer.'); AudioService.playGoalChime();">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
};

// --------------------------------------------------------------------------
// 12. D3 KNOWLEDGE GRAPH
// --------------------------------------------------------------------------
const KnowledgeGraphModule = {
  renderGraph() {
    const container = document.getElementById('knowledgeGraphSvg');
    if (!container || typeof d3 === 'undefined') return;
    container.innerHTML = '';
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const svg = d3.select(container).append('svg').attr('width', '100%').attr('height', '100%').attr('viewBox', [0, 0, width, height]);
    const g = svg.append('g');
    svg.call(d3.zoom().on('zoom', (event) => g.attr('transform', event.transform)));

    const data = JSON.parse(JSON.stringify(SIRAT_DATA.knowledgeGraph));
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = g.append('g').selectAll('line').data(data.links).join('line').attr('stroke', '#26322C').attr('stroke-width', 2);
    const node = g.append('g').selectAll('circle').data(data.nodes).join('circle').attr('r', 16).attr('fill', '#16A36A').attr('cursor', 'pointer');
    const text = g.append('g').selectAll('text').data(data.nodes).join('text').text(d => d.id).attr('fill', '#F5F3EA').attr('font-size', '11px').attr('text-anchor', 'middle').attr('dy', 26);

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      text.attr('x', d => d.x).attr('y', d => d.y);
    });
  }
};

// --------------------------------------------------------------------------
// 13. DASHBOARD & CHARTS
// --------------------------------------------------------------------------
const DashboardModule = {
  initCharts() {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('dashboardActivityChart');
    if (canvas) {
      new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{ label: 'Sessions', data: [3, 5, 2, 4, 6, 8, 5], backgroundColor: '#16A36A', borderRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }
};

// --------------------------------------------------------------------------
// 14. SIGNATURE FLOATING ACTION BUTTON (THE BEST FAB)
// --------------------------------------------------------------------------
const FABModule = {
  isOpen: false,
  init() {
    const trigger = document.getElementById('fabTriggerBtn');
    const container = document.getElementById('fabContainer');
    if (trigger && container) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        container.classList.toggle('open', this.isOpen);
        AudioService.playClick();
      });
    }
    document.addEventListener('click', (e) => {
      if (this.isOpen && container && !container.contains(e.target)) {
        this.isOpen = false;
        container.classList.remove('open');
      }
    });
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        this.isOpen = !this.isOpen;
        if (container) container.classList.toggle('open', this.isOpen);
      }
    });

    const dhikrBtn = document.getElementById('fabActionDhikr');
    if (dhikrBtn) {
      dhikrBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        TasbeehModule.increment();
        App.showToast(`✨ Dhikr +1 recorded (${TasbeehModule.state.dhikrTitle}: ${TasbeehModule.state.count})`);
      });
    }
    const askBtn = document.getElementById('fabActionAsk');
    if (askBtn) {
      askBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container) container.classList.remove('open');
        App.navigateTo('ask');
      });
    }
    const duaBtn = document.getElementById('fabActionDua');
    if (duaBtn) {
      duaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container) container.classList.remove('open');
        App.openDailyDuaModal();
      });
    }
    const reflectBtn = document.getElementById('fabActionReflect');
    if (reflectBtn) {
      reflectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container) container.classList.remove('open');
        App.openQuickReflectionModal();
      });
    }
    const voiceBtn = document.getElementById('fabActionVoice');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (container) container.classList.remove('open');
        App.openVoiceModal();
      });
    }
  }
};

// --------------------------------------------------------------------------
// 15. GLOBAL APP CONTROLLER
// --------------------------------------------------------------------------
const App = {
  currentView: 'home',
  init() {
    const savedTheme = StorageService.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.bindNavigation();
    this.bindCommandPalette();

    TasbeehModule.init();
    AIChatModule.init();
    QuranModule.init();
    HadithModule.init();
    DuasAdhkarModule.init();
    ReflectionModule.init();
    LearningModule.init();
    QuizModule.init();
    FABModule.init();

    const hash = window.location.hash.replace('#', '');
    this.navigateTo(hash && document.getElementById(`view-${hash}`) ? hash : 'home', false);
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && document.getElementById(`view-${h}`)) this.navigateTo(h, false);
    });

    const heroBtn = document.getElementById('heroSearchSubmit');
    const heroInput = document.getElementById('heroSearchInput');
    if (heroBtn && heroInput) {
      heroBtn.addEventListener('click', () => {
        const val = heroInput.value.trim();
        if (val) {
          this.navigateTo('ask');
          AIChatModule.askQuery(val);
        }
      });
    }
  },
  navigateTo(viewId, updateHash = true) {
    const target = document.getElementById(`view-${viewId}`);
    if (!target) return;
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    target.classList.add('active');
    this.currentView = viewId;
    if (updateHash) window.location.hash = viewId;

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    const b = document.getElementById('topbarBreadcrumb');
    if (b) b.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);

    const s = document.getElementById('appSidebar');
    if (s) s.classList.remove('mobile-open');

    if (viewId === 'graph') setTimeout(() => KnowledgeGraphModule.renderGraph(), 50);
    if (viewId === 'dashboard') setTimeout(() => DashboardModule.initCharts(), 50);
  },
  bindNavigation() {
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view) this.navigateTo(view);
      });
    });
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebar = document.getElementById('appSidebar');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
    }
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        StorageService.setTheme(next);
        this.showToast(`Switched to ${next} theme`);
      });
    }
  },
  bindCommandPalette() {
    const backdrop = document.getElementById('commandPalette');
    const input = document.getElementById('paletteInput');
    const searchTrigger = document.getElementById('globalSearchBtn');
    if (searchTrigger && backdrop) {
      searchTrigger.addEventListener('click', () => {
        backdrop.classList.add('open');
        if (input) input.focus();
      });
    }
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (backdrop) backdrop.classList.toggle('open');
      } else if (e.key === 'Escape' && backdrop) {
        backdrop.classList.remove('open');
      }
    });
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('open');
      });
    }
  },
  showToast(message) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--color-emerald); font-weight: 700;">✦</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  },
  openDailyDuaModal() {
    const modal = document.getElementById('genericModal');
    const body = document.getElementById('genericModalBody');
    const title = document.getElementById('genericModalTitle');
    if (!modal || !body || !title) return;
    const dua = SIRAT_DATA.duas[0];
    title.textContent = "Today's Featured Supplication";
    body.innerHTML = `
      <div style="text-align: center; display: flex; flex-direction: column; gap: var(--space-3);">
        <span class="badge badge-emerald" style="align-self: center;">${dua.category}</span>
        <div class="font-arabic-lg">${dua.arabic}</div>
        <div style="font-size: var(--text-sm); color: var(--color-emerald-light);">${dua.transliteration}</div>
        <div style="font-size: var(--text-base); color: var(--text-primary); font-style: italic;">"${dua.translation}"</div>
        <button class="btn btn-primary" style="margin-top: var(--space-2);" onclick="DuasAdhkarModule.openInTasbeeh('${dua.title}', '${dua.arabic.replace(/'/g, "\\'")}', ${dua.targetCount}); document.getElementById('genericModal').classList.remove('open');">
          Count in Tasbeeh (${dua.targetCount}x) →
        </button>
      </div>
    `;
    modal.classList.add('open');
  },
  openQuickReflectionModal() {
    const modal = document.getElementById('genericModal');
    const body = document.getElementById('genericModalBody');
    const title = document.getElementById('genericModalTitle');
    if (!modal || !body || !title) return;
    title.textContent = "Quick Reflection Capture";
    body.innerHTML = `
      <textarea class="textarea-field" id="quickReflectText" placeholder="Capture your reflection..."></textarea>
      <div style="display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-3);">
        <button class="btn btn-secondary" onclick="document.getElementById('genericModal').classList.remove('open')">Cancel</button>
        <button class="btn btn-primary" onclick="App.submitQuickReflection()">Save</button>
      </div>
    `;
    modal.classList.add('open');
  },
  submitQuickReflection() {
    const text = document.getElementById('quickReflectText').value.trim();
    if (!text) return this.showToast('Please enter your thought.');
    StorageService.saveReflection({ title: 'Quick Reflection', text, themes: ['Contemplation'] });
    document.getElementById('genericModal').classList.remove('open');
    this.showToast('✓ Quick reflection saved');
  },
  openVoiceModal() {
    const modal = document.getElementById('genericModal');
    const body = document.getElementById('genericModalBody');
    const title = document.getElementById('genericModalTitle');
    if (!modal || !body || !title) return;
    title.textContent = "Voice Query Interface";
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-4); padding: var(--space-4) 0;">
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">Listening to your question...</div>
        <div style="display: flex; gap: 6px; height: 40px; align-items: center;">
          <div class="waveform-bar"></div><div class="waveform-bar"></div><div class="waveform-bar"></div>
          <div class="waveform-bar"></div><div class="waveform-bar"></div><div class="waveform-bar"></div>
        </div>
        <button class="btn btn-primary" onclick="document.getElementById('genericModal').classList.remove('open'); App.navigateTo('ask'); AIChatModule.askQuery('What does Islam teach about patience?');">
          Complete Query
        </button>
      </div>
    `;
    modal.classList.add('open');
  }
};


/* ==========================================================================
   SIRATAI — COMPLETE FRONTEND INTERACTION / V2 ENGINE
   --------------------------------------------------------------------------
   This layer keeps the existing visual design and data model, while making
   the frontend genuinely interactive: navigation, search, chat, Quran,
   Hadith, bookmarks, Tasbeeh persistence, reflections, learning, quiz,
   knowledge graph controls, dashboard charts, drawers, profile modal,
   language/theme persistence, keyboard shortcuts and mobile behaviour.
   ========================================================================== */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const escapeHTML = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const safeJSON = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  };

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (seconds) => {
    seconds = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  /* ------------------------------------------------------------------------
     Storage hardening
     ------------------------------------------------------------------------ */
  const StorageV2 = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : safeJSON(raw, fallback);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch {}
    }
  };

  /* ------------------------------------------------------------------------
     Existing service hardening
     ------------------------------------------------------------------------ */
  const originalAddHistory = StorageService.addHistory.bind(StorageService);
  StorageService.addHistory = function (item) {
    try { originalAddHistory(item); } catch {}
  };

  const originalSaveReflection = StorageService.saveReflection.bind(StorageService);
  StorageService.saveReflection = function (reflection) {
    try { originalSaveReflection(reflection); } catch {}
  };

  /* ------------------------------------------------------------------------
     Toast / modal helpers
     ------------------------------------------------------------------------ */
  const UI = {
    toast(message, type = "success") {
      if (window.App && typeof window.App.showToast === "function") {
        window.App.showToast(message);
        return;
      }

      let container = $("toastContainer");
      if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span style="color:var(--color-emerald);font-weight:700;">✦</span><span>${escapeHTML(message)}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add("toast-exit");
        setTimeout(() => toast.remove(), 250);
      }, 2800);
    },

    openModal(title, body) {
      const modal = $("genericModal");
      if (!modal) return;
      if ($("genericModalTitle")) $("genericModalTitle").textContent = title;
      if ($("genericModalBody")) $("genericModalBody").innerHTML = body;
      modal.classList.add("open");
    },

    closeModal() {
      $("genericModal")?.classList.remove("open");
    },

    closeAllOverlays() {
      $("genericModal")?.classList.remove("open");
      $("authModal")?.classList.remove("open");
      $("commandPalette")?.classList.remove("open");
      $("notificationDrawer")?.classList.remove("open");
      $("drawerBackdrop")?.classList.remove("open");
      $("graphDetailDrawer")?.classList.remove("open");
    }
  };

  /* ------------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------------ */
  const NAV_LABELS = {
    home: "Home",
    ask: "Ask SiratAI",
    search: "Smart Search",
    quran: "Quran",
    hadith: "Hadith",
    duas: "Duas",
    adhkar: "Adhkar",
    tasbeeh: "Tasbeeh",
    reflection: "Reflection",
    learn: "Learning Paths",
    quiz: "Knowledge Check",
    graph: "Knowledge Map",
    library: "My Library",
    history: "History",
    dashboard: "My Dashboard",
    settings: "Settings"
  };

  const NavigationV2 = {
    navigate(viewId, updateHash = true) {
      const target = $(`view-${viewId}`);
      if (!target) return;

      $$(".app-view").forEach(v => v.classList.remove("active"));
      target.classList.add("active");

      $$(".nav-item, .mobile-nav-item").forEach(item => {
        item.classList.toggle("active", item.dataset.view === viewId);
      });

      const breadcrumb = $("topbarBreadcrumb");
      if (breadcrumb) breadcrumb.textContent = NAV_LABELS[viewId] || viewId;

      if (updateHash && location.hash !== `#${viewId}`) {
        history.replaceState(null, "", `#${viewId}`);
      }

      $("appSidebar")?.classList.remove("mobile-open");

      if (viewId === "dashboard") DashboardV2.render();
      if (viewId === "graph") KnowledgeGraphV2.render();
      if (viewId === "library") LibraryV2.render();
      if (viewId === "history") HistoryV2.render();
      if (viewId === "reflection") ReflectionV2.renderList();
      if (viewId === "tasbeeh") TasbeehV2.render();
      if (viewId === "learn") LearningV2.render();
      if (viewId === "quran") QuranV2.render();
    },

    bind() {
      $$(".nav-item, .mobile-nav-item").forEach(item => {
        item.addEventListener("click", (event) => {
          event.preventDefault();
          this.navigate(item.dataset.view);
        });
      });

      $("sidebarCollapseBtn")?.addEventListener("click", () => {
        $("appSidebar")?.classList.toggle("collapsed");
        const collapsed = $("appSidebar")?.classList.contains("collapsed");
        StorageV2.set("siratai_sidebar_collapsed", !!collapsed);
      });

      if (StorageV2.get("siratai_sidebar_collapsed", false)) {
        $("appSidebar")?.classList.add("collapsed");
      }

      $("mobileMenuBtn")?.addEventListener("click", () => {
        $("appSidebar")?.classList.toggle("mobile-open");
      });
    }
  };

  /* ------------------------------------------------------------------------
     Theme + language
     ------------------------------------------------------------------------ */
  const PreferencesV2 = {
    language: StorageService.getLanguage ? StorageService.getLanguage() : "en",

    init() {
      const savedTheme = StorageService.getTheme ? StorageService.getTheme() : "dark";
      document.documentElement.setAttribute("data-theme", savedTheme);

      const lang = localStorage.getItem("siratai_language") || "en";
      this.language = lang;

      const select = $("languageSelect");
      if (select) select.value = lang;

      $("themeToggleBtn")?.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        StorageService.setTheme?.(next);
        UI.toast(`${next === "dark" ? "Dark" : "Light"} theme activated`);
        DashboardV2.refreshCharts();
      });

      select?.addEventListener("change", () => {
        this.language = select.value;
        localStorage.setItem("siratai_language", select.value);
        StorageService.setLanguage?.(select.value);
        document.documentElement.dir = ["ar", "ur"].includes(select.value) ? "rtl" : "ltr";
        UI.toast(`Language preference saved: ${select.options[select.selectedIndex].text}`);
      });
    }
  };

  /* ------------------------------------------------------------------------
     Smart Search
     ------------------------------------------------------------------------ */
  const SearchV2 = {
    init() {
      const smart = $("smartSearchInput");
      if (smart) {
        smart.addEventListener("keydown", e => {
          if (e.key === "Enter") {
            e.preventDefault();
            this.search(smart.value);
          }
          this.renderLive(smart.value);
        });
        smart.addEventListener("input", () => this.renderLive(smart.value));
      }

      const hadith = $("hadithSearchInput");
      if (hadith) {
        hadith.addEventListener("input", () => HadithV2.render(hadith.value));
        hadith.addEventListener("keydown", e => {
          if (e.key === "Enter") {
            e.preventDefault();
            HadithV2.render(hadith.value);
          }
        });
      }

      const hero = $("heroSearchInput");
      const heroButton = $("heroSearchSubmit");
      heroButton?.addEventListener("click", () => {
        const query = hero?.value.trim();
        if (query) {
          NavigationV2.navigate("ask");
          AIChatV2.askQuery(query);
        }
      });
      hero?.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          heroButton?.click();
        }
      });
    },

    collect(query) {
      const q = String(query || "").toLowerCase().trim();
      if (!q) return [];

      const results = [];

      (SIRAT_DATA.surahs || []).forEach(surah => {
        surah.ayahs.forEach(ayah => {
          const haystack = [
            surah.name, surah.meaning, surah.arabic,
            ayah.translation, ayah.transliteration, ayah.reference
          ].join(" ").toLowerCase();

          if (haystack.includes(q)) {
            results.push({
              type: "Quran",
              ref: ayah.reference,
              title: `${surah.name} — ${ayah.reference}`,
              text: ayah.translation,
              action: () => NavigationV2.navigate("quran")
            });
          }
        });
      });

      (SIRAT_DATA.hadiths || []).forEach(h => {
        const haystack = [
          h.collection, h.reference, h.topic, h.english, h.narrator, h.explanation
        ].join(" ").toLowerCase();

        if (haystack.includes(q)) {
          results.push({
            type: "Hadith",
            ref: h.reference,
            title: `${h.collection} — ${h.topic}`,
            text: h.english,
            action: () => NavigationV2.navigate("hadith")
          });
        }
      });

      (SIRAT_DATA.duas || []).forEach(d => {
        const haystack = [d.title, d.category, d.translation, d.transliteration, d.reference].join(" ").toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            type: "Dua",
            ref: d.reference,
            title: d.title,
            text: d.translation,
            action: () => NavigationV2.navigate("duas")
          });
        }
      });

      (SIRAT_DATA.adhkar || []).forEach(a => {
        const haystack = [a.title, a.category, a.meaning, a.transliteration].join(" ").toLowerCase();
        if (haystack.includes(q)) {
          results.push({
            type: "Dhikr",
            ref: a.category,
            title: a.title,
            text: a.meaning,
            action: () => NavigationV2.navigate("adhkar")
          });
        }
      });

      (SIRAT_DATA.learningPaths || []).forEach(p => {
        if ([p.title, p.tagline, p.difficulty].join(" ").toLowerCase().includes(q)) {
          results.push({
            type: "Learning",
            ref: p.difficulty,
            title: p.title,
            text: p.tagline,
            action: () => NavigationV2.navigate("learn")
          });
        }
      });

      return results.slice(0, 20);
    },

    search(query) {
      const results = this.collect(query);
      const container = $("view-search");
      if (!container) return;

      let resultHost = $("smartSearchResults");
      if (!resultHost) {
        resultHost = document.createElement("div");
        resultHost.id = "smartSearchResults";
        resultHost.style.cssText = "display:flex;flex-direction:column;gap:var(--space-4);";
        const searchBox = $("smartSearchInput");
        searchBox?.closest(".hero-search-box")?.parentElement?.appendChild(resultHost);
      }

      resultHost.innerHTML = results.length
        ? results.map((r, i) => `
          <div class="card card-hoverable animate-fade-in-up" data-result-index="${i}" style="cursor:pointer;">
            <div style="display:flex;justify-content:space-between;gap:var(--space-3);">
              <span class="badge ${r.type === "Quran" ? "badge-emerald" : "badge-neutral"}">${escapeHTML(r.type)}</span>
              <span class="text-xs">${escapeHTML(r.ref)}</span>
            </div>
            <div class="card-title" style="margin-top:var(--space-2);">${escapeHTML(r.title)}</div>
            <p class="text-sm" style="margin-top:var(--space-2);">${escapeHTML(r.text)}</p>
          </div>
        `).join("")
        : `<div class="card"><p class="text-sm">No matching source found. Try <strong>Sabr</strong>, <strong>patience</strong>, <strong>intentions</strong>, <strong>Tawakkul</strong>, or a reference such as <strong>2:153</strong>.</p></div>`;

      $$("#smartSearchResults [data-result-index]").forEach(el => {
        el.addEventListener("click", () => results[Number(el.dataset.resultIndex)]?.action());
      });

      NavigationV2.navigate("search");
      StorageService.addHistory?.({
        action: `Searched SiratAI for "${query}"`,
        type: "search",
        timestamp: new Date().toISOString()
      });
    },

    renderLive(query) {
      const q = String(query || "").trim();
      if (!q) return;
      const results = this.collect(q).slice(0, 4);
      let host = $("smartSearchResults");
      if (!host) return;
      host.innerHTML = results.map(r => `
        <div class="card" style="padding:var(--space-4);">
          <span class="badge badge-neutral">${escapeHTML(r.type)}</span>
          <div style="font-weight:600;margin-top:6px;">${escapeHTML(r.title)}</div>
          <div class="text-sm" style="margin-top:4px;">${escapeHTML(r.text)}</div>
        </div>
      `).join("");
    }
  };

  /* ------------------------------------------------------------------------
     Command Palette
     ------------------------------------------------------------------------ */
  const CommandPaletteV2 = {
    index: 0,
    items: [],

    init() {
      const palette = $("commandPalette");
      const input = $("paletteInput");
      const results = $("paletteResults");
      if (!palette || !input || !results) return;

      const open = () => {
        palette.classList.add("open");
        input.focus();
        this.render("");
      };

      $("globalSearchBtn")?.addEventListener("click", open);

      input.addEventListener("input", () => this.render(input.value));
      input.addEventListener("keydown", e => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this.index = Math.min(this.index + 1, Math.max(0, this.items.length - 1));
          this.highlight();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this.index = Math.max(this.index - 1, 0);
          this.highlight();
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.items[this.index]?.action();
          palette.classList.remove("open");
        } else if (e.key === "Escape") {
          palette.classList.remove("open");
        }
      });

      palette.addEventListener("click", e => {
        if (e.target === palette) palette.classList.remove("open");
      });

      window.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          open();
        }
        if (e.key === "Escape") {
          palette.classList.remove("open");
          $("genericModal")?.classList.remove("open");
          $("authModal")?.classList.remove("open");
          $("notificationDrawer")?.classList.remove("open");
          $("drawerBackdrop")?.classList.remove("open");
        }
      });
    },

    render(query) {
      const q = String(query || "").toLowerCase().trim();
      const base = Object.entries(NAV_LABELS).map(([id, label]) => ({
        label,
        type: "Navigate",
        action: () => NavigationV2.navigate(id)
      }));

      const searchResults = q
        ? SearchV2.collect(q).slice(0, 8).map(r => ({
            label: r.title,
            type: r.type,
            action: r.action
          }))
        : [];

      this.items = [...base, ...searchResults];
      this.index = 0;

      const host = $("paletteResults");
      if (!host) return;

      host.innerHTML = this.items.map((item, i) => `
        <button class="palette-result ${i === 0 ? "active" : ""}" data-index="${i}" style="width:100%;text-align:left;padding:var(--space-3);display:flex;justify-content:space-between;align-items:center;">
          <span>${escapeHTML(item.label)}</span>
          <span class="badge badge-neutral">${escapeHTML(item.type)}</span>
        </button>
      `).join("");

      $$(".palette-result", host).forEach(el => {
        el.addEventListener("mouseenter", () => {
          this.index = Number(el.dataset.index);
          this.highlight();
        });
        el.addEventListener("click", () => {
          this.items[this.index]?.action();
          $("commandPalette")?.classList.remove("open");
        });
      });
    },

    highlight() {
      $$(".palette-result").forEach((el, i) => el.classList.toggle("active", i === this.index));
    }
  };

  /* ------------------------------------------------------------------------
     AI chat — local source-grounded demo engine
     ------------------------------------------------------------------------ */
  const AIChatV2 = {
    messages: [],

    init() {
      const input = $("chatInput");
      const button = $("chatSendBtn");

      button?.addEventListener("click", () => this.send());
      input?.addEventListener("keydown", e => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });

      $$(".chat-starter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          if (input) input.value = pill.textContent.trim();
          this.send();
        });
      });
    },

    askQuery(query) {
      NavigationV2.navigate("ask");
      const input = $("chatInput");
      if (input) input.value = query;
      this.send();
    },

    send() {
      const input = $("chatInput");
      const stream = $("chatStream");
      if (!input || !stream) return;

      const query = input.value.trim();
      if (!query) return;

      this.appendUser(query);
      input.value = "";

      const thinking = document.createElement("div");
      thinking.className = "message-ai animate-fade-in-up";
      thinking.innerHTML = `
        <div class="ai-thinking-box">
          <div class="thinking-step active">
            <div class="ai-step-dot"></div>
            <span>Searching the available Quran, Hadith and learning sources...</span>
          </div>
        </div>
      `;
      stream.appendChild(thinking);
      this.scroll();

      setTimeout(() => {
        const answer = this.answer(query);
        thinking.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);">
            <span style="color:var(--color-emerald);font-weight:700;">✦ SIRATAI</span>
            <span class="badge badge-emerald">✓ Source Grounded</span>
          </div>
          <div style="font-size:var(--text-base);color:var(--text-primary);line-height:var(--leading-relaxed);margin-top:var(--space-3);">
            ${answer.text}
          </div>
          <div class="evidence-panel open" style="margin-top:var(--space-3);">
            <div class="evidence-header">
              <span>✓ Evidence & Grounding</span>
              <span>${escapeHTML(answer.reference)}</span>
            </div>
            <div class="evidence-content">
              ${answer.sources.map(s => `<div class="evidence-item"><strong>${escapeHTML(s)}</strong></div>`).join("")}
            </div>
          </div>
        `;
        this.scroll();

        StorageService.addHistory?.({
          action: `Asked SiratAI: "${query.slice(0, 70)}${query.length > 70 ? "…" : ""}"`,
          type: "ai",
          timestamp: new Date().toISOString()
        });
      }, 650);
    },

    appendUser(text) {
      const stream = $("chatStream");
      if (!stream) return;
      const el = document.createElement("div");
      el.className = "message-user animate-fade-in-up";
      el.textContent = text;
      stream.appendChild(el);
      this.scroll();
    },

    answer(query) {
      const q = query.toLowerCase();

      if (q.includes("patien") || q.includes("sabr")) {
        return {
          text: `In the available SiratAI sources, <strong>Sabr</strong> is presented as purposeful patience and fortitude. The clearest source in this dataset pairs patience with prayer: <strong>“seek help through patience and prayer.”</strong>`,
          reference: "Quran 2:153",
          sources: ["Quran 2:153", "Sahih Muslim 2999", "Learning Path: Understanding Sabr"]
        };
      }

      if (q.includes("intention") || q.includes("niyyah")) {
        return {
          text: `The available Hadith source states that deeds are evaluated in relation to their <strong>intentions</strong>. This is presented as a foundational principle in the supplied Bukhari entry.`,
          reference: "Sahih al-Bukhari 1",
          sources: ["Sahih al-Bukhari 1", "Topic: Intentions"]
        };
      }

      if (q.includes("tawakkul") || q.includes("reliance")) {
        return {
          text: `The supplied sources connect <strong>Tawakkul</strong> with reliance upon Allah while still engaging with practical human agency. The learning pathway describes this as balancing practical means with reliance.`,
          reference: "Jami` at-Tirmidhi 2516",
          sources: ["Jami` at-Tirmidhi 2516", "Learning Path: Tawakkul"]
        };
      }

      const results = SearchV2.collect(query).slice(0, 3);
      if (results.length) {
        return {
          text: `I found ${results.length} relevant source${results.length > 1 ? "s" : ""} in the current SiratAI knowledge dataset. The strongest match is <strong>${escapeHTML(results[0].title)}</strong>: ${escapeHTML(results[0].text)}`,
          reference: results[0].ref,
          sources: results.map(r => `${r.type}: ${r.title}`)
        };
      }

      return {
        text: `I can help you explore the information currently included in this frontend. Try asking about <strong>Sabr</strong>, <strong>Tawakkul</strong>, <strong>intentions</strong>, Quran 2:153, the supplied Hadith, Duas, Adhkar, or the learning paths.`,
        reference: "SiratAI local knowledge dataset",
        sources: ["Available Quran entries", "Available Hadith entries", "Available Duas & Adhkar", "Learning paths"]
      };
    },

    scroll() {
      const stream = $("chatStream");
      if (stream) stream.scrollTop = stream.scrollHeight;
    }
  };

  /* ------------------------------------------------------------------------
     Quran
     ------------------------------------------------------------------------ */
  const QuranV2 = {
    currentSurahId: 1,
    currentAyahIndex: 0,

    init() {
      this.bindSearch();
      this.bindAudio();
      this.render();
    },

    bindSearch() {
      const input = $("view-quran")?.querySelector(".surah-search-box input");
      input?.addEventListener("input", () => this.renderList(input.value));
    },

    render(filter = "") {
      this.renderList(filter);
      this.renderAyahs(this.currentSurahId);
    },

    renderList(filter = "") {
      const host = $("surahListItems");
      if (!host) return;

      const q = filter.toLowerCase().trim();
      const list = (SIRAT_DATA.surahs || []).filter(s =>
        !q || `${s.id} ${s.name} ${s.meaning} ${s.arabic}`.toLowerCase().includes(q)
      );

      host.innerHTML = list.length
        ? list.map(s => `
          <div class="surah-item ${s.id === this.currentSurahId ? "active" : ""}" data-surah="${s.id}" style="cursor:pointer;">
            <div>
              <strong style="color:var(--text-primary);font-size:var(--text-sm);">${s.id}. ${escapeHTML(s.name)}</strong>
              <div style="font-size:var(--text-xs);color:var(--text-muted);">${escapeHTML(s.meaning)} • ${s.versesCount} verses</div>
            </div>
            <div class="font-arabic" style="font-size:1.1rem;color:var(--color-emerald);">${escapeHTML(s.arabic)}</div>
          </div>
        `).join("")
        : `<div class="card"><p class="text-sm">No Surah matched your search.</p></div>`;

      $$("[data-surah]", host).forEach(el => {
        el.addEventListener("click", () => this.select(Number(el.dataset.surah)));
      });
    },

    select(id) {
      if (!SIRAT_DATA.surahs.some(s => s.id === id)) return;
      this.currentSurahId = id;
      this.currentAyahIndex = 0;
      this.render();
      const surah = SIRAT_DATA.surahs.find(s => s.id === id);
      if (surah) {
        $("playerSurahTitle").textContent = `${surah.name} (${surah.meaning})`;
        StorageService.addHistory?.({
          action: `Explored ${surah.name}`,
          type: "quran",
          timestamp: new Date().toISOString()
        });
      }
    },

    renderAyahs(id) {
      const host = $("ayahViewer");
      const surah = SIRAT_DATA.surahs.find(s => s.id === id);
      if (!host || !surah) return;

      host.innerHTML = surah.ayahs.map((ayah, index) => {
        const bookmarked = StorageService.isBookmarked?.(ayah.reference, "quran");
        return `
          <div class="ayah-card animate-fade-in-up" data-ayah="${index}">
            <div class="ayah-header">
              <span class="badge badge-neutral">${escapeHTML(surah.name)} ${escapeHTML(ayah.reference)}</span>
              <div style="display:flex;gap:var(--space-2);">
                <button class="btn btn-ghost btn-sm ayah-bookmark" data-ref="${escapeHTML(ayah.reference)}">
                  ${bookmarked ? "★ Saved" : "☆ Save"}
                </button>
                <button class="btn btn-ghost btn-sm ayah-speak" data-index="${index}">▶ Listen</button>
              </div>
            </div>
            <div class="font-arabic-lg">${escapeHTML(ayah.arabic)}</div>
            <div style="font-size:var(--text-sm);color:var(--color-emerald-light);font-family:var(--font-mono);">${escapeHTML(ayah.transliteration)}</div>
            <div style="font-size:var(--text-base);color:var(--text-primary);">${escapeHTML(ayah.translation)}</div>
          </div>
        `;
      }).join("");

      $$(".ayah-bookmark", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const ref = btn.dataset.ref;
          const ayah = surah.ayahs.find(a => a.reference === ref);
          if (!ayah) return;

          if (StorageService.isBookmarked?.(ref, "quran")) {
            StorageService.removeBookmark?.(ref, "quran");
            btn.textContent = "☆ Save";
            UI.toast("Removed from My Library");
          } else {
            StorageService.addBookmark?.({
              id: ref,
              type: "quran",
              title: `${surah.name} ${ref}`,
              text: ayah.translation,
              arabic: ayah.arabic
            });
            btn.textContent = "★ Saved";
            UI.toast("Saved to My Library");
          }
          LibraryV2.render();
          DashboardV2.updateKpis();
        });
      });

      $$(".ayah-speak", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const ayah = surah.ayahs[Number(btn.dataset.index)];
          if (!ayah) return;
          this.speak(ayah.arabic);
        });
      });
    },

    speak(text) {
      if (!("speechSynthesis" in window)) {
        UI.toast("Speech playback is not supported in this browser.");
        return;
      }
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
      UI.toast("Playing Arabic recitation preview");
    },

    bindAudio() {
      const button = $("audioPlayPauseBtn");
      if (!button) return;

      let playing = false;
      let timer = null;
      let elapsed = 0;
      const duration = 225;

      const update = () => {
        $("playerProgressBar")?.style.setProperty("width", `${Math.min(elapsed / duration * 100, 100)}%`);
        const time = $("playerTime");
        if (time) time.textContent = `${formatTime(elapsed)} / ${formatTime(duration)}`;
      };

      button.addEventListener("click", () => {
        playing = !playing;
        button.setAttribute("aria-pressed", String(playing));

        if (playing) {
          button.innerHTML = `<span style="font-size:18px;">❚❚</span>`;
          timer = setInterval(() => {
            elapsed++;
            update();
            if (elapsed >= duration) {
              playing = false;
              clearInterval(timer);
              button.innerHTML = `<span style="font-size:18px;">▶</span>`;
              elapsed = 0;
              update();
            }
          }, 1000);
          UI.toast("Quran audio preview started");
        } else {
          clearInterval(timer);
          button.innerHTML = `<span style="font-size:18px;">▶</span>`;
          UI.toast("Quran audio paused");
        }
      });

      const playerBar = $("playerProgressBar")?.parentElement;
      playerBar?.addEventListener("click", e => {
        const rect = playerBar.getBoundingClientRect();
        elapsed = Math.round(((e.clientX - rect.left) / rect.width) * duration);
        update();
      });
    }
  };

  /* ------------------------------------------------------------------------
     Hadith
     ------------------------------------------------------------------------ */
  const HadithV2 = {
    init() {
      this.render("");
    },

    render(filter = "") {
      const host = $("hadithList");
      if (!host) return;

      const q = String(filter || "").toLowerCase().trim();
      const list = (SIRAT_DATA.hadiths || []).filter(h =>
        !q || [h.collection, h.reference, h.topic, h.english, h.narrator, h.arabic]
          .join(" ").toLowerCase().includes(q)
      );

      host.innerHTML = list.length
        ? list.map(h => {
          const saved = StorageService.isBookmarked?.(h.id, "hadith");
          return `
            <div class="hadith-card animate-fade-in-up">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-2);">
                <span class="badge badge-emerald">${escapeHTML(h.collection)} • ${escapeHTML(h.grade)}</span>
                <div style="display:flex;gap:var(--space-2);">
                  <button class="btn btn-ghost btn-sm hadith-save" data-id="${escapeHTML(h.id)}">${saved ? "★ Saved" : "☆ Save"}</button>
                  <button class="btn btn-outline btn-sm hadith-context" data-id="${escapeHTML(h.id)}">✦ AI Context</button>
                </div>
              </div>
              <div class="font-arabic" style="font-size:1.45rem;">${escapeHTML(h.arabic)}</div>
              <div style="font-size:var(--text-base);color:var(--text-primary);">"${escapeHTML(h.english)}"</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted);border-top:1px solid var(--border-subtle);padding-top:var(--space-2);">
                Narrated by ${escapeHTML(h.narrator)} (${escapeHTML(h.reference)})
              </div>
              <div class="hadith-explanation-box" id="expl-${escapeHTML(h.id)}">
                <div class="eyebrow" style="color:var(--color-gold);margin-bottom:4px;">✦ SiratAI Commentary</div>
                <p style="font-size:var(--text-sm);color:var(--text-primary);">${escapeHTML(h.explanation)}</p>
              </div>
            </div>
          `;
        }).join("")
        : `<div class="card"><p class="text-sm">No Hadith matched your search.</p></div>`;

      $$(".hadith-context", host).forEach(btn => {
        btn.addEventListener("click", () => $(`expl-${btn.dataset.id}`)?.classList.toggle("open"));
      });

      $$(".hadith-save", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const h = SIRAT_DATA.hadiths.find(x => x.id === btn.dataset.id);
          if (!h) return;

          if (StorageService.isBookmarked?.(h.id, "hadith")) {
            StorageService.removeBookmark?.(h.id, "hadith");
            btn.textContent = "☆ Save";
            UI.toast("Removed from My Library");
          } else {
            StorageService.addBookmark?.({
              id: h.id,
              type: "hadith",
              title: `${h.collection} — ${h.topic}`,
              text: h.english,
              reference: h.reference
            });
            btn.textContent = "★ Saved";
            UI.toast("Hadith saved to My Library");
          }
          LibraryV2.render();
          DashboardV2.updateKpis();
        });
      });
    }
  };

  /* ------------------------------------------------------------------------
     Duas / Adhkar
     ------------------------------------------------------------------------ */
  const DuasV2 = {
    init() {
      this.renderDuas();
      this.renderAdhkar();
    },

    renderDuas() {
      const host = $("duaGrid");
      if (!host) return;

      host.innerHTML = SIRAT_DATA.duas.map(d => `
        <div class="dua-card animate-fade-in-up">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-2);">
            <span class="badge badge-emerald">${escapeHTML(d.category)}</span>
            <button class="btn btn-primary btn-sm dua-count" data-id="${escapeHTML(d.id)}">Count (${d.targetCount}x) →</button>
          </div>
          <strong style="color:var(--text-primary);font-size:var(--text-base);">${escapeHTML(d.title)}</strong>
          <div class="font-arabic" style="font-size:1.45rem;">${escapeHTML(d.arabic)}</div>
          <div style="font-size:var(--text-sm);color:var(--text-secondary);">"${escapeHTML(d.translation)}"</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-2);">${escapeHTML(d.reference)}</div>
        </div>
      `).join("");

      $$(".dua-count", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const d = SIRAT_DATA.duas.find(x => x.id === btn.dataset.id);
          if (d) {
            TasbeehV2.setDhikr(d.title, d.arabic, d.targetCount);
            NavigationV2.navigate("tasbeeh");
          }
        });
      });
    },

    renderAdhkar() {
      const host = $("adhkarGrid");
      if (!host) return;

      const state = StorageV2.get("siratai_adhkar_counts", {});
      SIRAT_DATA.adhkar.forEach(a => a.currentCount = Number(state[a.id] || 0));

      host.innerHTML = SIRAT_DATA.adhkar.map(a => `
        <div class="card card-hoverable animate-fade-in-up">
          <div style="display:flex;justify-content:space-between;">
            <span class="badge badge-neutral">${escapeHTML(a.category)}</span>
            <span style="font-size:var(--text-xs);font-family:var(--font-mono);color:var(--color-emerald-light);" id="adhkar-cnt-${escapeHTML(a.id)}">${a.currentCount} / ${a.targetCount}</span>
          </div>
          <div style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-top:4px;">${escapeHTML(a.title)}</div>
          <div class="font-arabic" style="color:var(--color-emerald);font-size:1.3rem;">${escapeHTML(a.arabic)}</div>
          <div style="font-size:var(--text-xs);color:var(--text-secondary);margin-top:4px;">${escapeHTML(a.meaning)}</div>
          <div style="margin-top:var(--space-3);display:flex;justify-content:space-between;gap:var(--space-2);">
            <button class="btn btn-secondary btn-sm adhkar-open" data-id="${escapeHTML(a.id)}">Open in Tasbeeh</button>
            <button class="btn btn-primary btn-sm adhkar-count" data-id="${escapeHTML(a.id)}">Count (+1)</button>
          </div>
        </div>
      `).join("");

      $$(".adhkar-count", host).forEach(btn => {
        btn.addEventListener("click", () => this.increment(btn.dataset.id));
      });

      $$(".adhkar-open", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const a = SIRAT_DATA.adhkar.find(x => x.id === btn.dataset.id);
          if (a) {
            TasbeehV2.setDhikr(a.title, a.arabic, a.targetCount);
            NavigationV2.navigate("tasbeeh");
          }
        });
      });
    },

    increment(id) {
      const a = SIRAT_DATA.adhkar.find(x => x.id === id);
      if (!a) return;

      a.currentCount = Math.min(a.currentCount + 1, a.targetCount);
      const state = StorageV2.get("siratai_adhkar_counts", {});
      state[id] = a.currentCount;
      StorageV2.set("siratai_adhkar_counts", state);

      const countEl = $(`adhkar-cnt-${id}`);
      if (countEl) countEl.textContent = `${a.currentCount} / ${a.targetCount}`;

      AudioService.playClick?.();

      if (a.currentCount >= a.targetCount) {
        AudioService.playGoalChime?.();
        UI.toast(`✨ ${a.title} completed (${a.targetCount}x)`);
      }
    }
  };

  /* ------------------------------------------------------------------------
     Tasbeeh
     ------------------------------------------------------------------------ */
  const TasbeehV2 = {
    initialized: false,

    init() {
      if (this.initialized) return;
      this.initialized = true;

      const saved = StorageService.getTasbeehState?.();
      if (saved) Object.assign(TasbeehModule.state, saved);

      $("tasbeehDialWrapper")?.addEventListener("click", e => {
        e.preventDefault();
        this.increment();
      });

      $("tasbeehUndoBtn")?.addEventListener("click", () => this.undo());
      $("tasbeehResetBtn")?.addEventListener("click", () => this.reset());

      $("tasbeehSoundBtn")?.addEventListener("click", () => {
        TasbeehModule.state.soundEnabled = !TasbeehModule.state.soundEnabled;
        $("tasbeehSoundBtn").classList.toggle("active", TasbeehModule.state.soundEnabled);
        this.save();
        UI.toast(TasbeehModule.state.soundEnabled ? "Tasbeeh sound enabled" : "Tasbeeh sound muted");
      });

      $$(".tasbeeh-goal-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          $$(".tasbeeh-goal-pill").forEach(x => x.classList.remove("active"));
          pill.classList.add("active");
          const goal = Number(pill.dataset.goal);
          if (goal > 0) {
            TasbeehModule.state.goal = goal;
            this.render();
            this.save();
          }
        });
      });

      $$(".tasbeeh-preset-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          $$(".tasbeeh-preset-pill").forEach(x => x.classList.remove("active"));
          pill.classList.add("active");
          this.setDhikr(pill.dataset.title || "Dhikr", pill.dataset.arabic || "", TasbeehModule.state.goal);
        });
      });

      window.addEventListener("keydown", e => {
        if (!document.querySelector("#view-tasbeeh.active")) return;
        if ((e.code === "Space" || e.code === "Enter") &&
            !["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(document.activeElement?.tagName)) {
          e.preventDefault();
          this.increment();
        }
      });

      this.render();
    },

    increment() {
      const state = TasbeehModule.state;
      const previous = state.count;
      state.count = Math.min(state.count + 1, Math.max(1, Number(state.goal) || 33));
      state.todayTotal = Number(state.todayTotal || 0) + 1;
      state.weekTotal = Number(state.weekTotal || 0) + 1;

      if (state.soundEnabled) AudioService.playClick?.();
      if (state.hapticEnabled) AudioService.triggerHaptic?.(12);

      const dial = $("tasbeehDialWrapper");
      if (dial) {
        dial.classList.remove("tasbeeh-pulse");
        void dial.offsetWidth;
        dial.classList.add("tasbeeh-pulse");
      }

      if (state.count === state.goal && previous < state.goal) {
        if (state.soundEnabled) AudioService.playGoalChime?.();
        StorageService.addTasbeehSession?.({
          dhikr: state.dhikrTitle,
          count: state.goal,
          durationSeconds: state.sessionSeconds || 0
        });
        UI.toast(`✨ ${state.goal} repetitions completed!`);
      }

      this.render();
      this.save();
      DashboardV2.updateKpis();
    },

    undo() {
      const state = TasbeehModule.state;
      if (state.count <= 0) return;

      state.count--;
      state.todayTotal = Math.max(0, Number(state.todayTotal || 0) - 1);
      state.weekTotal = Math.max(0, Number(state.weekTotal || 0) - 1);
      this.render();
      this.save();
    },

    reset() {
      TasbeehModule.state.count = 0;
      this.render();
      this.save();
      UI.toast("Tasbeeh counter reset");
    },

    setDhikr(title, arabic, goal = 33) {
      TasbeehModule.state.dhikrTitle = title;
      TasbeehModule.state.dhikrArabic = arabic;
      TasbeehModule.state.goal = Number(goal) || 33;
      TasbeehModule.state.count = 0;
      this.render();
      this.save();
      UI.toast(`${title} selected`);
    },

    render() {
      const state = TasbeehModule.state;
      const count = Number(state.count || 0);
      const goal = Math.max(1, Number(state.goal || 33));

      if ($("tasbeehCountDisplay")) $("tasbeehCountDisplay").textContent = count;
      if ($("tasbeehGoalDisplay")) $("tasbeehGoalDisplay").textContent = `${count} / ${goal}`;
      if ($("tasbeehDhikrTitle")) $("tasbeehDhikrTitle").textContent = state.dhikrTitle || "SubhanAllah";
      if ($("tasbeehDhikrArabic")) $("tasbeehDhikrArabic").textContent = state.dhikrArabic || "";

      if ($("tasbeehStatToday")) $("tasbeehStatToday").textContent = Number(state.todayTotal || 0).toLocaleString();
      if ($("tasbeehStatWeek")) $("tasbeehStatWeek").textContent = Number(state.weekTotal || 0).toLocaleString();

      const ring = $("tasbeehRingProgress");
      if (ring) {
        const radius = 115;
        const circumference = 2 * Math.PI * radius;
        ring.style.strokeDasharray = `${circumference}`;
        ring.style.strokeDashoffset = `${circumference * (1 - Math.min(count / goal, 1))}`;
      }

      const sound = $("tasbeehSoundBtn");
      sound?.classList.toggle("active", !!state.soundEnabled);
    },

    save() {
      StorageService.saveTasbeehState?.(TasbeehModule.state);
    }
  };

  /* ------------------------------------------------------------------------
     Reflection
     ------------------------------------------------------------------------ */
  const ReflectionV2 = {
    init() {
      $("saveReflectionBtn")?.addEventListener("click", () => this.save());
      $("analyzeReflectionBtn")?.addEventListener("click", () => this.analyze());
      this.renderList();
    },

    save() {
      const title = $("reflectionTitleInput")?.value.trim() || "Personal Contemplation";
      const text = $("reflectionTextInput")?.value.trim();

      if (!text) {
        UI.toast("Please write your reflection first.");
        $("reflectionTextInput")?.focus();
        return;
      }

      StorageService.saveReflection?.({
        title,
        text,
        themes: this.extractThemes(text)
      });

      if ($("reflectionTitleInput")) $("reflectionTitleInput").value = "";
      if ($("reflectionTextInput")) $("reflectionTextInput").value = "";

      UI.toast("✓ Reflection saved to your journal");
      this.renderList();
      DashboardV2.updateKpis();
    },

    extractThemes(text) {
      const lower = text.toLowerCase();
      const themes = [];
      if (/sabr|patien/.test(lower)) themes.push("Sabr");
      if (/tawakkul|trust|reliance/.test(lower)) themes.push("Tawakkul");
      if (/shukr|gratitude|thank/.test(lower)) themes.push("Shukr");
      if (/prayer|salah/.test(lower)) themes.push("Salah");
      if (!themes.length) themes.push("Contemplation");
      return [...new Set(themes)].slice(0, 4);
    },

    analyze() {
      const text = $("reflectionTextInput")?.value.trim();
      const panel = $("reflectionAnalysisPanel");
      if (!panel) return;

      if (!text) {
        UI.toast("Write something first so SiratAI can analyze the themes.");
        return;
      }

      const themes = this.extractThemes(text);
      panel.style.display = "block";
      panel.innerHTML = `
        <div class="card" style="border-left:3px solid var(--color-emerald);">
          <div class="eyebrow" style="margin-bottom:var(--space-2);">SIRATAI REFLECTION ANALYSIS</div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-bottom:var(--space-3);">
            ${themes.map(t => `<span class="badge badge-emerald">${escapeHTML(t)}</span>`).join("")}
          </div>
          <p class="text-sm">
            Your reflection currently centers on ${themes.map(t => `<strong>${escapeHTML(t)}</strong>`).join(", ")}.
            Use these themes as prompts for further personal study; this analysis is an educational reflection aid, not a religious ruling.
          </p>
        </div>
      `;
    },

    renderList() {
      const host = $("reflectionsList");
      if (!host) return;

      const reflections = StorageService.getReflections?.() || [];
      host.innerHTML = reflections.length
        ? reflections.map(r => `
          <div class="card card-hoverable animate-fade-in-up" style="margin-bottom:var(--space-4);">
            <div style="display:flex;justify-content:space-between;gap:var(--space-3);">
              <div style="font-weight:600;color:var(--text-primary);">${escapeHTML(r.title || "Reflection")}</div>
              <span class="text-xs">${formatDate(r.date)}</span>
            </div>
            <p style="font-size:var(--text-sm);color:var(--text-secondary);margin:var(--space-2) 0;">"${escapeHTML(r.text)}"</p>
            <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;">
              ${(r.themes || []).map(t => `<span class="badge badge-neutral">${escapeHTML(t)}</span>`).join("")}
            </div>
          </div>
        `).join("")
        : `<div class="card"><p class="text-sm">No saved reflections yet. Your reflections will appear here.</p></div>`;
    }
  };

  /* ------------------------------------------------------------------------
     Learning
     ------------------------------------------------------------------------ */
  const LearningV2 = {
    selectedPath: "path-sabr",

    init() {
      this.render();
    },

    render() {
      const grid = $("learningPathsGrid");
      if (grid) {
        const saved = StorageV2.get("siratai_learning_progress", {});
        grid.innerHTML = SIRAT_DATA.learningPaths.map(p => {
          const progress = Number(saved[p.id] ?? p.progress);
          return `
            <div class="card card-hoverable" style="border-color:var(--color-emerald);">
              <span class="badge badge-emerald">${escapeHTML(p.difficulty)}</span>
              <div style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:var(--space-2) 0;">${escapeHTML(p.title)}</div>
              <p style="font-size:var(--text-xs);color:var(--text-secondary);margin-bottom:var(--space-3);">${escapeHTML(p.tagline)}</p>
              <div class="progress-bar"><div class="progress-bar-fill" style="width:${Math.min(100, progress)}%;"></div></div>
              <div style="display:flex;justify-content:space-between;margin-top:var(--space-2);">
                <span class="text-xs">${progress}% complete</span>
                <button class="btn btn-primary btn-sm learning-open" data-id="${escapeHTML(p.id)}">Open</button>
              </div>
            </div>
          `;
        }).join("");

        $$(".learning-open", grid).forEach(btn => {
          btn.addEventListener("click", () => this.selectPath(btn.dataset.id));
        });
      }

      const timeline = $("verticalJourneyTimeline");
      const path = SIRAT_DATA.learningPaths.find(p => p.id === this.selectedPath) || SIRAT_DATA.learningPaths[0];
      if (timeline && path) {
        timeline.innerHTML = `
          <div class="eyebrow" style="margin-bottom:var(--space-2);">CURRENT JOURNEY</div>
          <h2 class="section-title">${escapeHTML(path.title)}</h2>
          <p class="text-sm" style="margin-top:var(--space-2);">${escapeHTML(path.tagline)}</p>
          <div style="margin-top:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);">
            ${path.nodes.map((node, i) => `
              <div class="card" style="display:flex;gap:var(--space-4);align-items:center;">
                <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${node.status === "completed" ? "var(--color-emerald)" : "var(--bg-surface-hover)"};color:var(--text-primary);font-weight:700;">${node.status === "completed" ? "✓" : i + 1}</div>
                <div style="flex:1;">
                  <div style="font-weight:600;color:var(--text-primary);">${escapeHTML(node.title)}</div>
                  <div class="text-xs">${escapeHTML(node.type)} • ${escapeHTML(node.status.replace("_", " "))}</div>
                </div>
              </div>
            `).join("")}
          </div>
        `;
      }
    },

    selectPath(id) {
      const path = SIRAT_DATA.learningPaths.find(p => p.id === id);
      if (!path) return;

      this.selectedPath = id;
      this.render();

      UI.openModal(path.title, `
        <div class="badge badge-emerald">${escapeHTML(path.difficulty)} • ${escapeHTML(path.duration)}</div>
        <p class="text-sm" style="margin:var(--space-3) 0;">${escapeHTML(path.tagline)}</p>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${path.progress}%;"></div></div>
        <div style="margin-top:var(--space-4);display:flex;flex-direction:column;gap:var(--space-2);">
          ${path.nodes.map((n, i) => `
            <button class="btn btn-secondary learning-step" data-index="${i}" style="justify-content:flex-start;">
              ${n.status === "completed" ? "✓" : "○"} ${escapeHTML(n.title)}
            </button>
          `).join("")}
        </div>
        <button class="btn btn-primary" id="completeLearningStep" style="width:100%;margin-top:var(--space-4);">Mark Next Step Complete</button>
      `);

      $$(".learning-step").forEach(btn => {
        btn.addEventListener("click", () => UI.toast(`Opened learning step ${Number(btn.dataset.index) + 1}`));
      });

      $("completeLearningStep")?.addEventListener("click", () => {
        const progress = StorageV2.get("siratai_learning_progress", {});
        progress[id] = Math.min(100, Number(progress[id] ?? path.progress) + 5);
        StorageV2.set("siratai_learning_progress", progress);
        UI.closeModal();
        UI.toast("✓ Learning progress updated");
        this.render();
        DashboardV2.updateKpis();
      });

      StorageService.addHistory?.({
        action: `Opened learning path "${path.title}"`,
        type: "learning",
        timestamp: new Date().toISOString()
      });
    }
  };

  /* ------------------------------------------------------------------------
     Quiz
     ------------------------------------------------------------------------ */
  const QuizV2 = {
    current: 0,
    score: 0,
    startedAt: null,
    timer: null,
    selected: null,

    init() {
      this.start();
    },

    start() {
      this.current = 0;
      this.score = 0;
      this.startedAt = Date.now();
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - this.startedAt) / 1000);
        if ($("quizTimer")) $("quizTimer").textContent = formatTime(seconds);
      }, 1000);
      this.render();
    },

    render() {
      const host = $("quizContainer");
      const questions = SIRAT_DATA.quizQuestions || [];
      if (!host || !questions.length) return;

      if (this.current >= questions.length) {
        clearInterval(this.timer);
        const percent = Math.round(this.score / questions.length * 100);
        StorageV2.set("siratai_quiz_results", {
          score: this.score,
          total: questions.length,
          percent,
          completedAt: new Date().toISOString()
        });

        if ($("quizProgressBar")) $("quizProgressBar").style.width = "100%";

        host.innerHTML = `
          <div class="card card-elevated" style="max-width:680px;margin:0 auto;text-align:center;">
            <div class="eyebrow">ASSESSMENT COMPLETE</div>
            <div style="font-size:3rem;font-weight:800;color:var(--color-emerald);margin:var(--space-3) 0;">${percent}%</div>
            <div class="text-body">You answered ${this.score} of ${questions.length} questions correctly.</div>
            <button class="btn btn-primary" id="quizRetry" style="margin-top:var(--space-5);">Try Again</button>
          </div>
        `;
        $("quizRetry")?.addEventListener("click", () => this.start());

        StorageService.addHistory?.({
          action: `Completed Knowledge Check (Score: ${this.score}/${questions.length})`,
          type: "quiz",
          timestamp: new Date().toISOString()
        });
        return;
      }

      const q = questions[this.current];
      const progress = this.current / questions.length * 100;
      if ($("quizProgressBar")) $("quizProgressBar").style.width = `${progress}%`;

      host.innerHTML = `
        <div class="card card-elevated" style="max-width:680px;margin:0 auto;">
          <div style="display:flex;justify-content:space-between;gap:var(--space-3);">
            <span class="badge badge-emerald">${escapeHTML(q.topic)}</span>
            <span class="text-xs">Question ${this.current + 1} / ${questions.length}</span>
          </div>
          <h3 style="font-size:1.25rem;font-weight:600;color:var(--text-primary);margin:var(--space-4) 0;">${escapeHTML(q.question)}</h3>
          <div style="display:flex;flex-direction:column;gap:var(--space-3);">
            ${q.options.map((opt, i) => `
              <button class="btn btn-secondary quiz-option" data-index="${i}" style="justify-content:flex-start;text-align:left;padding:var(--space-4);">
                <span style="width:26px;height:26px;border:1px solid var(--border-default);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">${String.fromCharCode(65 + i)}</span>
                ${escapeHTML(opt)}
              </button>
            `).join("")}
          </div>
        </div>
      `;

      $$(".quiz-option", host).forEach(btn => {
        btn.addEventListener("click", () => this.answer(Number(btn.dataset.index)));
      });
    },

    answer(index) {
      const q = SIRAT_DATA.quizQuestions[this.current];
      if (!q) return;

      const correct = index === q.correctIndex;
      if (correct) this.score++;

      $$(".quiz-option").forEach(btn => {
        btn.disabled = true;
        const i = Number(btn.dataset.index);
        if (i === q.correctIndex) {
          btn.style.borderColor = "var(--color-success)";
          btn.style.background = "var(--color-emerald-dim)";
        } else if (i === index) {
          btn.style.borderColor = "var(--color-danger)";
        }
      });

      UI.toast(correct ? "✓ Correct answer" : "Not quite — review the explanation.");

      setTimeout(() => {
        this.current++;
        this.render();
      }, 800);
    }
  };

  /* ------------------------------------------------------------------------
     Knowledge Graph
     ------------------------------------------------------------------------ */
  const KnowledgeGraphV2 = {
    svg: null,
    zoom: null,
    group: null,

    render() {
      const host = $("knowledgeGraphSvg");
      if (!host || typeof d3 === "undefined") return;

      host.innerHTML = "";
      const width = Math.max(500, host.clientWidth || 800);
      const height = Math.max(420, host.clientHeight || 600);

      this.svg = d3.select(host)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr("aria-label", "SiratAI knowledge graph");

      this.group = this.svg.append("g");

      this.zoom = d3.zoom()
        .scaleExtent([0.4, 3])
        .on("zoom", event => this.group.attr("transform", event.transform));

      this.svg.call(this.zoom);

      const data = JSON.parse(JSON.stringify(SIRAT_DATA.knowledgeGraph));
      const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(125))
        .force("charge", d3.forceManyBody().strength(-260))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(d => Number(d.size || 20) + 12));

      const links = this.group.append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.25)
        .attr("stroke-width", 1.5);

      const nodes = this.group.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", d => Math.max(10, Number(d.size || 18) / 1.4))
        .attr("fill", d => d.group === "quran" ? "var(--color-gold)" : "var(--color-emerald)")
        .attr("cursor", "pointer")
        .on("click", (_, d) => this.showDetail(d));

      const labels = this.group.append("g")
        .selectAll("text")
        .data(data.nodes)
        .join("text")
        .text(d => d.id)
        .attr("fill", "currentColor")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", 28)
        .style("pointer-events", "none");

      simulation.on("tick", () => {
        links
          .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x).attr("y2", d => d.target.y);

        nodes.attr("cx", d => d.x).attr("cy", d => d.y);
        labels.attr("x", d => d.x).attr("y", d => d.y);
      });

      this.simulation = simulation;
    },

    showDetail(node) {
      const drawer = $("graphDetailDrawer");
      if (!drawer) return;

      const related = (SIRAT_DATA.knowledgeGraph.links || [])
        .filter(l => l.source === node.id || l.target === node.id ||
          (l.source?.id === node.id) || (l.target?.id === node.id))
        .map(l => l.relationship);

      drawer.innerHTML = `
        <div style="padding:var(--space-5);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="badge badge-emerald">${escapeHTML(node.group)}</span>
            <button class="btn btn-ghost btn-sm" id="closeGraphDetail">✕</button>
          </div>
          <h3 style="margin-top:var(--space-3);color:var(--text-primary);">${escapeHTML(node.label)}</h3>
          <p class="text-sm" style="margin-top:var(--space-2);">Connected concepts and sources in the current SiratAI knowledge map.</p>
          ${related.length ? `<div style="margin-top:var(--space-4);display:flex;flex-direction:column;gap:var(--space-2);">${related.map(r => `<div class="card" style="padding:var(--space-3);">${escapeHTML(r)}</div>`).join("")}</div>` : ""}
        </div>
      `;
      drawer.classList.add("open");
      $("closeGraphDetail")?.addEventListener("click", () => drawer.classList.remove("open"));
    },

    bind() {
      $("graphZoomIn")?.addEventListener("click", () => {
        if (this.svg && this.zoom) this.svg.transition().call(this.zoom.scaleBy, 1.25);
      });
      $("graphZoomOut")?.addEventListener("click", () => {
        if (this.svg && this.zoom) this.svg.transition().call(this.zoom.scaleBy, 0.8);
      });
      $("graphZoomReset")?.addEventListener("click", () => {
        if (this.svg && this.zoom) this.svg.transition().call(this.zoom.transform, d3.zoomIdentity);
      });
    }
  };

  /* ------------------------------------------------------------------------
     Dashboard
     ------------------------------------------------------------------------ */
  const DashboardV2 = {
    charts: {},

    init() {
      this.updateGreeting();
      this.updateKpis();
    },

    updateGreeting() {
      const host = $("dashboardGreeting");
      if (!host) return;

      const hour = new Date().getHours();
      const greeting = hour < 5 ? "Good night." : hour < 12 ? "Good morning." : hour < 17 ? "Good afternoon." : "Good evening.";
      host.querySelector("h1")?.replaceChildren(document.createTextNode(greeting));
    },

    updateKpis() {
      const saved = StorageService.getBookmarks?.().length || 0;
      const tasbeeh = Number(TasbeehModule.state?.weekTotal || 0);
      const reflections = StorageService.getReflections?.().length || 0;
      const quiz = StorageV2.get("siratai_quiz_results", null);

      if ($("kpiSavedSources")) $("kpiSavedSources").textContent = saved;
      if ($("kpiTasbeehTotal")) $("kpiTasbeehTotal").textContent = tasbeeh.toLocaleString();

      const kpis = $$(".kpi-card");
      if (kpis[0]) kpis[0].querySelector(".kpi-value")?.replaceChildren(document.createTextNode(String((StorageService.getHistory?.() || []).filter(x => ["learning", "quran", "hadith", "ai"].includes(x.type)).length)));
      if (kpis[3]) kpis[3].querySelector(".kpi-value")?.replaceChildren(document.createTextNode(String(quiz?.total || 0)));
      if (kpis[1]) kpis[1].querySelector(".kpi-value")?.replaceChildren(document.createTextNode(String(Math.max(0, new Set((StorageService.getHistory?.() || []).map(x => x.type)).size))));
      void reflections;
    },

    render() {
      this.updateGreeting();
      this.updateKpis();
      this.initCharts();
    },

    initCharts() {
      if (typeof Chart === "undefined") return;

      const activityCanvas = $("dashboardActivityChart");
      const topicsCanvas = $("dashboardTopicsChart");

      if (activityCanvas) {
        if (this.charts.activity) this.charts.activity.destroy();

        const history = StorageService.getHistory?.() || [];
        const labels = [];
        const values = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - i);
          labels.push(d.toLocaleDateString(undefined, { weekday: "short" }));
          const key = d.toDateString();
          values.push(history.filter(h => new Date(h.timestamp).toDateString() === key).length);
        }

        this.charts.activity = new Chart(activityCanvas.getContext("2d"), {
          type: "bar",
          data: {
            labels,
            datasets: [{
              label: "Activity",
              data: values,
              backgroundColor: "rgba(22,163,106,.75)",
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } }
            }
          }
        });
      }

      if (topicsCanvas) {
        if (this.charts.topics) this.charts.topics.destroy();

        const history = StorageService.getHistory?.() || [];
        const counts = {};
        history.forEach(h => {
          const type = h.type || "other";
          counts[type] = (counts[type] || 0) + 1;
        });

        this.charts.topics = new Chart(topicsCanvas.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: Object.keys(counts).map(x => x.toUpperCase()),
            datasets: [{
              data: Object.values(counts),
              backgroundColor: [
                "#16A36A", "#C8A951", "#4E9BF5", "#E5A83B", "#E05252", "#2BC982"
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: "bottom" } }
          }
        });
      }
    },

    refreshCharts() {
      if (document.querySelector("#view-dashboard.active")) this.initCharts();
    }
  };

  /* ------------------------------------------------------------------------
     Library + History
     ------------------------------------------------------------------------ */
  const LibraryV2 = {
    render() {
      const host = $("libraryList");
      if (!host) return;

      const bookmarks = StorageService.getBookmarks?.() || [];

      host.innerHTML = bookmarks.length
        ? bookmarks.map((b, i) => `
          <div class="card card-hoverable animate-fade-in-up" style="margin-bottom:var(--space-3);">
            <div style="display:flex;justify-content:space-between;gap:var(--space-3);">
              <span class="badge ${b.type === "quran" ? "badge-emerald" : "badge-neutral"}">${escapeHTML(b.type)}</span>
              <button class="btn btn-ghost btn-sm library-remove" data-index="${i}">Remove</button>
            </div>
            <div style="font-weight:600;color:var(--text-primary);margin-top:var(--space-2);">${escapeHTML(b.title || "Saved source")}</div>
            ${b.arabic ? `<div class="font-arabic" style="margin-top:var(--space-2);">${escapeHTML(b.arabic)}</div>` : ""}
            <p class="text-sm" style="margin-top:var(--space-2);">${escapeHTML(b.text || "")}</p>
            <div class="text-xs" style="margin-top:var(--space-2);">Saved ${formatDate(b.savedAt)}</div>
          </div>
        `).join("")
        : `<div class="card card-elevated"><p class="text-sm">Your library is empty. Save a Quran ayah or Hadith and it will appear here.</p></div>`;

      $$(".library-remove", host).forEach(btn => {
        btn.addEventListener("click", () => {
          const b = bookmarks[Number(btn.dataset.index)];
          if (!b) return;
          StorageService.removeBookmark?.(b.id, b.type);
          UI.toast("Removed from My Library");
          this.render();
          DashboardV2.updateKpis();
        });
      });
    }
  };

  const HistoryV2 = {
    render() {
      const host = $("historyList");
      if (!host) return;

      const history = StorageService.getHistory?.() || [];

      host.innerHTML = history.length
        ? history.map(h => `
          <div style="display:flex;gap:var(--space-3);padding:var(--space-3) 0;border-bottom:1px solid var(--border-subtle);">
            <div style="width:10px;height:10px;border-radius:50%;background:var(--color-emerald);margin-top:7px;flex-shrink:0;"></div>
            <div style="flex:1;">
              <div style="color:var(--text-primary);font-size:var(--text-sm);">${escapeHTML(h.action)}</div>
              <div class="text-xs" style="margin-top:3px;">${escapeHTML(h.type || "activity")} • ${formatDate(h.timestamp)}</div>
            </div>
          </div>
        `).join("")
        : `<p class="text-sm">No activity recorded yet.</p>`;
    }
  };

  /* ------------------------------------------------------------------------
     Notifications + profile
     ------------------------------------------------------------------------ */
  const DrawerV2 = {
    init() {
      $("notificationsBtn")?.addEventListener("click", () => this.openNotifications());
      $("drawerCloseBtn")?.addEventListener("click", () => this.close());
      $("drawerBackdrop")?.addEventListener("click", () => this.close());

      $("userProfileBtn")?.addEventListener("click", () => {
        const modal = $("authModal");
        if (modal) modal.classList.add("open");
      });

      $("authCloseBtn")?.addEventListener("click", () => $("authModal")?.classList.remove("open"));
      $("authModal")?.addEventListener("click", e => {
        if (e.target === $("authModal")) $("authModal").classList.remove("open");
      });

      $("genericModal")?.addEventListener("click", e => {
        if (e.target === $("genericModal")) $("genericModal").classList.remove("open");
      });
    },

    openNotifications() {
      $("notificationDrawer")?.classList.add("open");
      $("drawerBackdrop")?.classList.add("open");
    },

    close() {
      $("notificationDrawer")?.classList.remove("open");
      $("drawerBackdrop")?.classList.remove("open");
    }
  };

  /* ------------------------------------------------------------------------
     FAB
     ------------------------------------------------------------------------ */
  const FABV2 = {
    init() {
      const trigger = $("fabTriggerBtn");
      const container = $("fabContainer");
      if (!trigger || !container) return;

      trigger.addEventListener("click", e => {
        e.stopPropagation();
        container.classList.toggle("open");
      });

      document.addEventListener("click", e => {
        if (!container.contains(e.target)) container.classList.remove("open");
      });

      $("fabActionDhikr")?.addEventListener("click", e => {
        e.stopPropagation();
        TasbeehV2.increment();
        UI.toast("✦ Dhikr +1");
      });

      $("fabActionAsk")?.addEventListener("click", () => {
        container.classList.remove("open");
        NavigationV2.navigate("ask");
        $("chatInput")?.focus();
      });

      $("fabActionDua")?.addEventListener("click", () => {
        container.classList.remove("open");
        AppV2.openDailyDua();
      });

      $("fabActionReflect")?.addEventListener("click", () => {
        container.classList.remove("open");
        AppV2.openQuickReflection();
      });

      $("fabActionVoice")?.addEventListener("click", () => {
        container.classList.remove("open");
        AppV2.openVoice();
      });

      window.addEventListener("keydown", e => {
        if (e.altKey && e.key.toLowerCase() === "f") {
          e.preventDefault();
          container.classList.toggle("open");
        }
      });
    }
  };

  /* ------------------------------------------------------------------------
     App controller
     ------------------------------------------------------------------------ */
  const AppV2 = {
    init() {
      PreferencesV2.init();
      NavigationV2.bind();
      CommandPaletteV2.init();
      SearchV2.init();
      AIChatV2.init();
      QuranV2.init();
      HadithV2.init();
      DuasV2.init();
      TasbeehV2.init();
      ReflectionV2.init();
      LearningV2.init();
      QuizV2.init();
      KnowledgeGraphV2.bind();
      DashboardV2.init();
      DrawerV2.init();
      FABV2.init();

      const closeButtons = $$('[data-close-modal]');
      closeButtons.forEach(btn => btn.addEventListener("click", UI.closeModal));

      const initial = location.hash.replace("#", "");
      NavigationV2.navigate($(`view-${initial}`) ? initial : "home", false);

      window.addEventListener("hashchange", () => {
        const view = location.hash.replace("#", "");
        if ($(`view-${view}`)) NavigationV2.navigate(view, false);
      });

      // Refresh live views when storage changes in another browser tab.
      window.addEventListener("storage", () => {
        LibraryV2.render();
        HistoryV2.render();
        ReflectionV2.renderList();
        DashboardV2.updateKpis();
        TasbeehV2.render();
      });

      // Keep library/history/dashboard current after first paint.
      LibraryV2.render();
      HistoryV2.render();
      DashboardV2.updateKpis();

      // Expose all public modules for existing inline HTML handlers.
      window.App = AppV2;
      window.StorageService = StorageService;
      window.AudioService = AudioService;
      window.TasbeehModule = TasbeehModule;
      window.AIChatModule = AIChatV2;
      window.QuranModule = QuranV2;
      window.HadithModule = HadithV2;
      window.DuasAdhkarModule = {
        ...DuasV2,
        openInTasbeeh(title, arabic, target) {
          TasbeehV2.setDhikr(title, arabic, target);
          NavigationV2.navigate("tasbeeh");
        },
        incrementAdhkar: id => DuasV2.increment(id)
      };
      window.LearningModule = LearningV2;
      window.QuizModule = QuizV2;
      window.KnowledgeGraphModule = KnowledgeGraphV2;
      window.DashboardModule = DashboardV2;
    },

    navigateTo(view, updateHash = true) {
      NavigationV2.navigate(view, updateHash);
    },

    showToast(message) {
      UI.toast(message);
    },

    openDailyDua() {
      const dua = SIRAT_DATA.duas?.[0];
      if (!dua) return;
      UI.openModal("Today's Featured Supplication", `
        <div style="text-align:center;display:flex;flex-direction:column;gap:var(--space-3);">
          <span class="badge badge-emerald" style="align-self:center;">${escapeHTML(dua.category)}</span>
          <div class="font-arabic-lg">${escapeHTML(dua.arabic)}</div>
          <div style="font-size:var(--text-sm);color:var(--color-emerald-light);">${escapeHTML(dua.transliteration)}</div>
          <div style="font-size:var(--text-base);color:var(--text-primary);font-style:italic;">"${escapeHTML(dua.translation)}"</div>
          <div class="text-xs">${escapeHTML(dua.reference)}</div>
          <button class="btn btn-primary" id="dailyDuaCount">Count in Tasbeeh (${dua.targetCount}x) →</button>
        </div>
      `);
      $("dailyDuaCount")?.addEventListener("click", () => {
        TasbeehV2.setDhikr(dua.title, dua.arabic, dua.targetCount);
        UI.closeModal();
        NavigationV2.navigate("tasbeeh");
      });
    },

    openQuickReflection() {
      UI.openModal("Quick Reflection Capture", `
        <textarea class="textarea-field" id="quickReflectText" placeholder="Capture your reflection..."></textarea>
        <div style="display:flex;justify-content:flex-end;gap:var(--space-2);margin-top:var(--space-3);">
          <button class="btn btn-secondary" id="quickReflectCancel">Cancel</button>
          <button class="btn btn-primary" id="quickReflectSave">Save</button>
        </div>
      `);

      $("quickReflectCancel")?.addEventListener("click", UI.closeModal);
      $("quickReflectSave")?.addEventListener("click", () => {
        const text = $("quickReflectText")?.value.trim();
        if (!text) return UI.toast("Please enter your thought.");
        StorageService.saveReflection?.({
          title: "Quick Reflection",
          text,
          themes: ReflectionV2.extractThemes(text)
        });
        UI.closeModal();
        ReflectionV2.renderList();
        UI.toast("✓ Quick reflection saved");
      });

      setTimeout(() => $("quickReflectText")?.focus(), 50);
    },

    openVoice() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        UI.openModal("Voice Query Interface", `
          <div style="text-align:center;padding:var(--space-4);">
            <div class="font-arabic-lg" style="margin-bottom:var(--space-3);">صَوْت</div>
            <p class="text-sm">Voice recognition is not available in this browser. You can type your question instead.</p>
            <button class="btn btn-primary" id="voiceFallback">Open Ask SiratAI</button>
          </div>
        `);
        $("voiceFallback")?.addEventListener("click", () => {
          UI.closeModal();
          NavigationV2.navigate("ask");
          $("chatInput")?.focus();
        });
        return;
      }

      UI.openModal("Voice Query Interface", `
        <div style="display:flex;flex-direction:column;align-items:center;gap:var(--space-4);padding:var(--space-4) 0;text-align:center;">
          <div class="eyebrow">VOICE INPUT</div>
          <div style="font-size:var(--text-sm);color:var(--text-secondary);" id="voiceStatus">Press Start and speak your question.</div>
          <div style="display:flex;gap:6px;height:40px;align-items:center;">
            <div class="waveform-bar"></div><div class="waveform-bar"></div><div class="waveform-bar"></div>
            <div class="waveform-bar"></div><div class="waveform-bar"></div><div class="waveform-bar"></div>
          </div>
          <button class="btn btn-primary" id="voiceStart">Start Listening</button>
        </div>
      `);

      $("voiceStart")?.addEventListener("click", () => {
        const recognition = new SpeechRecognition();
        recognition.lang = PreferencesV2.language === "hi" ? "hi-IN" :
                           PreferencesV2.language === "ur" ? "ur-PK" :
                           PreferencesV2.language === "ar" ? "ar-SA" : "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        $("voiceStatus").textContent = "Listening…";
        recognition.onresult = event => {
          const transcript = event.results?.[0]?.[0]?.transcript || "";
          UI.closeModal();
          NavigationV2.navigate("ask");
          AIChatV2.askQuery(transcript);
        };
        recognition.onerror = () => {
          $("voiceStatus").textContent = "Could not capture the voice input. Please try again.";
        };
        recognition.onend = () => {
          if ($("voiceStatus") && $("voiceStatus").textContent === "Listening…") {
            $("voiceStatus").textContent = "Listening ended.";
          }
        };
        recognition.start();
      });
    }
  };

  // Public API methods expected by existing inline handlers.
  window.App = AppV2;

  AppV2.openVoiceModal = AppV2.openVoice;
  AppV2.openQuickReflectionModal = AppV2.openQuickReflection;
  AppV2.submitQuickReflection = () => {
    const text = $("quickReflectText")?.value.trim();
    if (!text) return UI.toast("Please enter your thought.");
    StorageService.saveReflection?.({
      title: "Quick Reflection",
      text,
      themes: ReflectionV2.extractThemes(text)
    });
    UI.closeModal();
    ReflectionV2.renderList();
    UI.toast("✓ Quick reflection saved");
  };

  // Boot once DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => AppV2.init(), { once: true });
  } else {
    AppV2.init();
  }

})();

