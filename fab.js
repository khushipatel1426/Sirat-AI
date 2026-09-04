/**
 * SIRATAI SIGNATURE FLOATING ACTION BUTTON (THE BEST FAB)
 * Speed-dial quick actions: Instant Dhikr Tap, Ask AI, Daily Dua, Quick Reflection & Voice UI
 */

const FABModule = {
  isOpen: false,
  containerEl: null,
  triggerBtnEl: null,

  init() {
    this.containerEl = document.getElementById('fabContainer');
    this.triggerBtnEl = document.getElementById('fabTriggerBtn');

    if (this.triggerBtnEl) {
      this.triggerBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && this.containerEl && !this.containerEl.contains(e.target)) {
        this.close();
      }
    });

    // Keyboard shortcut: Alt + F toggles FAB
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        this.toggle();
      }
    });

    this.bindQuickActions();
  },

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.containerEl) {
      this.containerEl.classList.toggle('open', this.isOpen);
    }
    AudioService.playClick();
  },

  open() {
    this.isOpen = true;
    if (this.containerEl) this.containerEl.classList.add('open');
  },

  close() {
    this.isOpen = false;
    if (this.containerEl) this.containerEl.classList.remove('open');
  },

  bindQuickActions() {
    // 1. Quick Dhikr Count (+1 directly without leaving current page)
    const quickDhikrBtn = document.getElementById('fabActionDhikr');
    if (quickDhikrBtn) {
      quickDhikrBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        TasbeehModule.increment();
        App.showToast(`✨ Dhikr +1 recorded (${TasbeehModule.state.dhikrTitle}: ${TasbeehModule.state.count})`);
        AudioService.triggerHaptic(20);
      });
    }

    // 2. Ask SiratAI
    const quickAskBtn = document.getElementById('fabActionAsk');
    if (quickAskBtn) {
      quickAskBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        App.navigateTo('ask');
        const input = document.getElementById('chatInput');
        if (input) input.focus();
      });
    }

    // 3. Daily Dua Modal
    const quickDuaBtn = document.getElementById('fabActionDua');
    if (quickDuaBtn) {
      quickDuaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        App.openDailyDuaModal();
      });
    }

    // 4. Quick Reflection Capture
    const quickReflectBtn = document.getElementById('fabActionReflect');
    if (quickReflectBtn) {
      quickReflectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        App.openQuickReflectionModal();
      });
    }

    // 5. Voice Search UI
    const quickVoiceBtn = document.getElementById('fabActionVoice');
    if (quickVoiceBtn) {
      quickVoiceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
        App.openVoiceModal();
      });
    }
  }
};
