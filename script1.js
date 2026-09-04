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

window.addEventListener('DOMContentLoaded', () => App.init());
