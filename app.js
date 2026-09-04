/**
 * SIRATAI GLOBAL APPLICATION CONTROLLER
 * SPA Routing, Command Palette (Ctrl+K), Theme Switcher, RTL/Multilingual, Modals & Toast System
 */

const App = {
  currentView: 'home',

  init() {
    // 1. Initialize Theme
    const savedTheme = StorageService.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeToggleUI(savedTheme);

    // 2. Initialize Language & RTL
    const savedLang = StorageService.getLanguage();
    this.setLanguage(savedLang);

    // 3. Bind Global Navigation & Routing
    this.bindNavigation();
    this.bindCommandPalette();
    this.bindModals();

    // 4. Initialize Submodules
    TasbeehModule.init();
    AIChatModule.init();
    QuranModule.init();
    HadithModule.init();
    DuasAdhkarModule.init();
    ReflectionModule.init();
    LearningModule.init();
    QuizModule.init();
    KnowledgeGraphModule.init();
    DashboardModule.init();
    FABModule.init();

    // 5. Initial View via Hash or default
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      this.navigateTo(hash, false);
    } else {
      this.navigateTo('home', false);
    }

    // Hash change handler
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && document.getElementById(`view-${h}`)) {
        this.navigateTo(h, false);
      }
    });

    // 6. Bind Hero Search
    const heroInput = document.getElementById('heroSearchInput');
    const heroBtn = document.getElementById('heroSearchSubmit');
    if (heroBtn && heroInput) {
      const doHeroSearch = () => {
        const val = heroInput.value.trim();
        if (val) {
          this.navigateTo('ask');
          AIChatModule.askQuery(val);
        }
      };
      heroBtn.addEventListener('click', doHeroSearch);
      heroInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doHeroSearch();
      });
    }

    // 7. Rotating Hero Search Prompts
    this.initRotatingPrompts();
  },

  // Routing
  navigateTo(viewId, updateHash = true) {
    const targetView = document.getElementById(`view-${viewId}`);
    if (!targetView) return;

    // Remove active from all views
    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    targetView.classList.add('active');
    this.currentView = viewId;

    if (updateHash) {
      window.location.hash = viewId;
    }

    // Update Sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.view === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Mobile Nav active state
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      if (item.dataset.view === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Breadcrumb
    const breadcrumb = document.getElementById('topbarBreadcrumb');
    if (breadcrumb) {
      const formattedTitle = viewId.charAt(0).toUpperCase() + viewId.slice(1);
      breadcrumb.textContent = formattedTitle;
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-initialize specific view components if needed
    if (viewId === 'graph') {
      setTimeout(() => KnowledgeGraphModule.renderGraph(), 50);
    } else if (viewId === 'dashboard') {
      setTimeout(() => DashboardModule.initCharts(), 50);
    } else if (viewId === 'library') {
      this.renderLibrary();
    } else if (viewId === 'history') {
      this.renderHistory();
    }
  },

  bindNavigation() {
    // Desktop Sidebar Links
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Mobile Bottom Nav Links
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view) this.navigateTo(view);
      });
    });

    // Sidebar Collapse
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebar = document.getElementById('appSidebar');
    if (collapseBtn && sidebar) {
      collapseBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }

    // Mobile Menu Button
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn && sidebar) {
      mobileBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        StorageService.setTheme(next);
        this.updateThemeToggleUI(next);
        this.showToast(`Switched to ${next} theme`);
        DashboardModule.initCharts();
      });
    }

    // Notifications Drawer Toggle
    const notifBtn = document.getElementById('notificationsBtn');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const notifDrawer = document.getElementById('notificationDrawer');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');

    const toggleDrawer = () => {
      const isOpen = notifDrawer.classList.toggle('open');
      drawerBackdrop.classList.toggle('open', isOpen);
    };

    if (notifBtn) notifBtn.addEventListener('click', toggleDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', toggleDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', toggleDrawer);

    // Language Dropdown
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      langSelect.value = StorageService.getLanguage();
      langSelect.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }
  },

  setLanguage(lang) {
    StorageService.setLanguage(lang);
    if (lang === 'ar' || lang === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) langSelect.value = lang;
    this.showToast(`Language set to ${lang.toUpperCase()}`);
  },

  updateThemeToggleUI(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  },

  // Command Palette (Ctrl+K)
  bindCommandPalette() {
    const backdrop = document.getElementById('commandPalette');
    const input = document.getElementById('paletteInput');
    const list = document.getElementById('paletteResults');
    const searchTrigger = document.getElementById('globalSearchBtn');

    const openPalette = () => {
      backdrop.classList.add('open');
      if (input) {
        input.value = '';
        input.focus();
        this.renderPaletteResults('');
      }
    };

    const closePalette = () => {
      backdrop.classList.remove('open');
    };

    if (searchTrigger) searchTrigger.addEventListener('click', openPalette);

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        backdrop.classList.contains('open') ? closePalette() : openPalette();
      } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closePalette();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
      });
    }

    if (input) {
      input.addEventListener('input', (e) => {
        this.renderPaletteResults(e.target.value);
      });
    }
  },

  renderPaletteResults(query) {
    const list = document.getElementById('paletteResults');
    if (!list) return;

    const items = [
      { title: 'Ask SiratAI', view: 'ask', category: 'AI Assistant', icon: '✦' },
      { title: 'Quran Explorer', view: 'quran', category: 'Knowledge', icon: '◈' },
      { title: 'Hadith Explorer', view: 'hadith', category: 'Knowledge', icon: '▣' },
      { title: 'Dua Library', view: 'duas', category: 'Knowledge', icon: '◇' },
      { title: 'Adhkar Practice', view: 'adhkar', category: 'Practice', icon: '☼' },
      { title: 'Digital Tasbeeh Counter', view: 'tasbeeh', category: 'Practice', icon: '◉' },
      { title: 'Reflection Journal', view: 'reflection', category: 'Practice', icon: '✦' },
      { title: 'Learning Pathways', view: 'learn', category: 'Learning', icon: '◌' },
      { title: 'Knowledge Assessment Quiz', view: 'quiz', category: 'Learning', icon: '▤' },
      { title: 'D3 Knowledge Graph Map', view: 'graph', category: 'Learning', icon: '⌘' },
      { title: 'Personal Dashboard', view: 'dashboard', category: 'Personal', icon: '▥' },
      { title: 'Personal Library & Bookmarks', view: 'library', category: 'Personal', icon: '♡' }
    ];

    const q = query.toLowerCase().trim();
    const filtered = items.filter(it => !q || it.title.toLowerCase().includes(q) || it.category.toLowerCase().includes(q));

    list.innerHTML = filtered.map(it => `
      <div class="palette-item" onclick="App.navigateTo('${it.view}'); document.getElementById('commandPalette').classList.remove('open');">
        <span style="color: var(--color-emerald); font-weight: 700; width: 20px; text-align: center;">${it.icon}</span>
        <span style="font-weight: 500; color: var(--text-primary); flex: 1;">${it.title}</span>
        <span class="badge badge-neutral" style="font-size: 0.7rem;">${it.category}</span>
      </div>
    `).join('');
  },

  // Toast System
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
    toast.innerHTML = `
      <span style="color: var(--color-emerald); font-weight: 700;">✦</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  },

  copyText(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.showToast('Copied to clipboard');
    }
  },

  // Modals & Quick Dialogs
  bindModals() {
    // Auth Modal
    const authBtn = document.getElementById('userProfileBtn');
    const authModal = document.getElementById('authModal');
    const authClose = document.getElementById('authCloseBtn');

    if (authBtn && authModal) {
      authBtn.addEventListener('click', () => authModal.classList.add('open'));
    }
    if (authClose && authModal) {
      authClose.addEventListener('click', () => authModal.classList.remove('open'));
    }
  },

  openDailyDuaModal() {
    const modal = document.getElementById('genericModal');
    const body = document.getElementById('genericModalBody');
    const title = document.getElementById('genericModalTitle');
    if (!modal || !body || !title) return;

    const dua = SIRAT_DATA.duas[0];
    title.textContent = "Today's Featured Supplication";
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-4); text-align: center;">
        <span class="badge badge-emerald" style="align-self: center;">${dua.category}</span>
        <div class="font-arabic-lg">${dua.arabic}</div>
        <div style="font-size: var(--text-sm); color: var(--color-emerald-light); font-family: var(--font-mono);">${dua.transliteration}</div>
        <div style="font-size: var(--text-base); color: var(--text-primary); font-style: italic;">"${dua.translation}"</div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">${dua.reference}</div>
        <div style="margin-top: var(--space-2); display: flex; justify-content: center; gap: var(--space-3);">
          <button class="btn btn-primary" onclick="DuasAdhkarModule.openInTasbeeh('${dua.title}', '${dua.arabic.replace(/'/g, "\\'")}', ${dua.targetCount}); document.getElementById('genericModal').classList.remove('open');">
            Count in Tasbeeh (${dua.targetCount}x) →
          </button>
        </div>
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
      <div style="display: flex; flex-direction: column; gap: var(--space-3);">
        <input class="input-field" id="quickReflectTitle" placeholder="Title or Verse Reference..." />
        <textarea class="textarea-field" id="quickReflectText" placeholder="Capture your contemplation, spiritual insight or gratitude..." style="min-height: 110px;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2);">
          <button class="btn btn-secondary" onclick="document.getElementById('genericModal').classList.remove('open')">Cancel</button>
          <button class="btn btn-primary" onclick="App.submitQuickReflection()">Save Reflection</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
  },

  submitQuickReflection() {
    const titleInput = document.getElementById('quickReflectTitle');
    const textInput = document.getElementById('quickReflectText');
    const text = textInput ? textInput.value.trim() : '';
    if (!text) {
      this.showToast('Please enter your thought before saving.');
      return;
    }

    StorageService.saveReflection({
      title: (titleInput ? titleInput.value.trim() : '') || 'Quick Reflection',
      text: text,
      themes: ['Quick Contemplation']
    });

    document.getElementById('genericModal').classList.remove('open');
    this.showToast('✓ Quick reflection saved');
    ReflectionModule.renderReflections();
  },

  openVoiceModal() {
    const modal = document.getElementById('genericModal');
    const body = document.getElementById('genericModalBody');
    const title = document.getElementById('genericModalTitle');
    if (!modal || !body || !title) return;

    title.textContent = "Voice Query Interface";
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-5); padding: var(--space-4) 0;">
        <div style="font-size: var(--text-sm); color: var(--text-secondary);">Listening to your question...</div>
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; height: 50px;">
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
          <div class="waveform-bar"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">Try: "What does Islam teach about patience?"</div>
        <button class="btn btn-primary" onclick="App.simulateVoiceResult()">Complete Query</button>
      </div>
    `;
    modal.classList.add('open');
  },

  simulateVoiceResult() {
    document.getElementById('genericModal').classList.remove('open');
    this.navigateTo('ask');
    AIChatModule.askQuery('What does Islam teach about patience?');
  },

  // Library & History Views
  renderLibrary() {
    const listEl = document.getElementById('libraryList');
    if (!listEl) return;

    const bookmarks = StorageService.getBookmarks();
    if (bookmarks.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: var(--space-2);">♡</div>
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">Your Library is Waiting</div>
          <p style="font-size: var(--text-sm); margin-top: 4px;">Save verses, hadiths, duas and learning resources to build your personal collection.</p>
          <button class="btn btn-primary" style="margin-top: var(--space-4);" onclick="App.navigateTo('quran')">Explore Quran Explorer →</button>
        </div>
      `;
      return;
    }

    listEl.innerHTML = bookmarks.map(b => `
      <div class="card card-hoverable animate-fade-in-up" style="margin-bottom: var(--space-3); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
            <span class="badge badge-emerald">${b.type.toUpperCase()}</span>
            <strong style="color: var(--text-primary);">${b.title}</strong>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-secondary); max-width: 540px;">${b.translation || ''}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="StorageService.removeBookmark('${b.id}', '${b.type}'); App.renderLibrary(); App.showToast('Removed from library');">
          Remove
        </button>
      </div>
    `).join('');
  },

  renderHistory() {
    const listEl = document.getElementById('historyList');
    if (!listEl) return;

    const history = StorageService.getHistory();
    listEl.innerHTML = history.map(h => {
      const time = new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-3) 0; border-bottom: 1px solid var(--border-subtle);" class="animate-fade-in-up">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono); width: 60px;">${time}</span>
          <span class="badge badge-neutral" style="font-size: 0.7rem;">${h.type}</span>
          <span style="font-size: var(--text-sm); color: var(--text-primary); flex: 1;">${h.action}</span>
        </div>
      `;
    }).join('');
  },

  initRotatingPrompts() {
    const input = document.getElementById('heroSearchInput');
    if (!input) return;

    const prompts = [
      "What does Islam teach about patience?",
      "Explore verses about gratitude",
      "Help me understand Salah and Khushu",
      "Find authentic duas for anxiety",
      "Explain the wisdom of Surah Ash-Sharh"
    ];

    let idx = 0;
    setInterval(() => {
      if (document.activeElement !== input && !input.value) {
        idx = (idx + 1) % prompts.length;
        input.placeholder = `✦ Try: "${prompts[idx]}"`;
      }
    }, 4500);
  }
};

// Global Boot
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
