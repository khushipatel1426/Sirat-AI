/**
 * SIRATAI TASBEEH SIGNATURE EXPERIENCE
 * High-precision circular counter, audio/haptic synthesis, presets & goal tracking
 */

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
    startTime: null,
    timerInterval: null,
    sessionSeconds: 0
  },

  init() {
    // Load persisted state
    const saved = StorageService.getTasbeehState();
    if (saved) {
      this.state.count = saved.count || 0;
      this.state.goal = saved.goal || 33;
      this.state.dhikrTitle = saved.dhikrTitle || 'SubhanAllah';
      this.state.dhikrArabic = saved.dhikrArabic || 'سُبْحَانَ اللَّهِ';
      this.state.todayTotal = saved.todayTotal || 127;
      this.state.weekTotal = saved.weekTotal || 840;
      this.state.monthTotal = saved.monthTotal || 3420;
      this.state.soundEnabled = saved.soundEnabled ?? true;
      this.state.hapticEnabled = saved.hapticEnabled ?? true;
    }

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

    // Keyboard support (Spacebar or Enter)
    window.addEventListener('keydown', (e) => {
      const activeView = document.querySelector('.app-view.active');
      if (activeView && activeView.id === 'view-tasbeeh') {
        if (e.code === 'Space' || e.code === 'Enter') {
          // Avoid triggering when in input or modal
          if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
          e.preventDefault();
          this.increment();
        }
      }
    });

    // Undo button
    const undoBtn = document.getElementById('tasbeehUndoBtn');
    if (undoBtn) undoBtn.addEventListener('click', () => this.undo());

    // Reset button
    const resetBtn = document.getElementById('tasbeehResetBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => this.reset());

    // Sound toggle
    const soundBtn = document.getElementById('tasbeehSoundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.state.soundEnabled = !this.state.soundEnabled;
        soundBtn.classList.toggle('active', this.state.soundEnabled);
        this.save();
        if (window.App) window.App.showToast(this.state.soundEnabled ? 'Tasbeeh audio enabled' : 'Tasbeeh audio muted');
      });
    }

    // Goal buttons
    const goalPills = document.querySelectorAll('.tasbeeh-goal-pill');
    goalPills.forEach(pill => {
      pill.addEventListener('click', () => {
        goalPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.setGoal(parseInt(pill.dataset.goal, 10));
      });
    });

    // Preset pills
    const presetPills = document.querySelectorAll('.tasbeeh-preset-pill');
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.setPreset(pill.dataset.title, pill.dataset.arabic);
      });
    });
  },

  increment() {
    this.state.count++;
    this.state.todayTotal++;
    this.state.weekTotal++;
    this.state.monthTotal++;

    // Audio & Haptic
    if (this.state.soundEnabled) AudioService.playClick();
    if (this.state.hapticEnabled) AudioService.triggerHaptic(15);

    // Visual pulse
    const dial = document.getElementById('tasbeehDialWrapper');
    if (dial) {
      dial.classList.remove('tasbeeh-pulse');
      void dial.offsetWidth; // Force reflow
      dial.classList.add('tasbeeh-pulse');
    }

    // Goal Reached Check
    if (this.state.count === this.state.goal) {
      if (this.state.soundEnabled) AudioService.playGoalChime();
      if (this.state.hapticEnabled) AudioService.triggerHaptic([30, 60, 30]);
      if (window.App) {
        window.App.showToast(`✨ Target reached: ${this.state.goal} repetitions completed!`);
      }
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

    // Calculate ring SVG offset (Circumference: 2 * PI * r = 2 * 3.14159 * 115 ~= 722.56)
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
    StorageService.saveTasbeehState({
      count: this.state.count,
      goal: this.state.goal,
      dhikrTitle: this.state.dhikrTitle,
      dhikrArabic: this.state.dhikrArabic,
      todayTotal: this.state.todayTotal,
      weekTotal: this.state.weekTotal,
      monthTotal: this.state.monthTotal,
      soundEnabled: this.state.soundEnabled,
      hapticEnabled: this.state.hapticEnabled
    });
  }
};
