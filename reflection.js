/**
 * SIRATAI REFLECTION JOURNAL MODULE
 * Private contemplation space with ethical, non-judgmental AI theme extraction
 */

const ReflectionModule = {
  init() {
    this.bindEvents();
    this.renderReflections();
  },

  bindEvents() {
    const saveBtn = document.getElementById('saveReflectionBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveCurrentReflection());
    }

    const analyzeBtn = document.getElementById('analyzeReflectionBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this.analyzeCurrentReflection());
    }
  },

  saveCurrentReflection() {
    const titleInput = document.getElementById('reflectionTitleInput');
    const textInput = document.getElementById('reflectionTextInput');

    const title = titleInput ? titleInput.value.trim() : '';
    const text = textInput ? textInput.value.trim() : '';

    if (!text) {
      App.showToast('Please enter your contemplation or reflection thoughts.');
      return;
    }

    // Extract basic themes automatically
    const themes = this.detectThemes(text);

    StorageService.saveReflection({
      title: title || 'Personal Reflection',
      text: text,
      themes: themes
    });

    if (titleInput) titleInput.value = '';
    if (textInput) textInput.value = '';

    App.showToast('✓ Reflection saved to your private journal');
    this.renderReflections();
  },

  analyzeCurrentReflection() {
    const textInput = document.getElementById('reflectionTextInput');
    const text = textInput ? textInput.value.trim() : '';

    if (!text) {
      App.showToast('Write a brief thought first to analyze with SiratAI.');
      return;
    }

    const panel = document.getElementById('reflectionAnalysisPanel');
    if (!panel) return;

    panel.style.display = 'block';
    panel.innerHTML = `
      <div class="card card-elevated animate-fade-in-up" style="border-left: 3px solid var(--color-emerald);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-3);">
          <div style="display: flex; align-items: center; gap: var(--space-2);">
            <span class="eyebrow" style="color: var(--color-emerald);">✦ SiratAI Reflection Analysis</span>
            <span class="badge badge-emerald">Educational Insights</span>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="this.closest('.card').parentElement.style.display='none'">✕</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-3); font-size: var(--text-sm);">
          <div>
            <strong style="color: var(--text-primary);">Identified Conceptual Themes:</strong>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-1);">
              ${this.detectThemes(text).map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
            </div>
          </div>

          <div>
            <strong style="color: var(--text-primary);">Related Quranic Passages:</strong>
            <p style="color: var(--text-secondary); margin-top: 4px;">
              Surah Ash-Sharh (94:5-6) and Surah Al-Baqarah (2:153) explore parallel themes of divine reassurance and purposeful fortitude.
            </p>
          </div>

          <div>
            <strong style="color: var(--text-primary);">Suggested Learning Pathway:</strong>
            <div style="margin-top: 4px;">
              <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('learn')">
                Continue "Understanding Sabr" Learning Path →
              </button>
            </div>
          </div>

          <div style="font-size: var(--text-xs); color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: var(--space-2);">
            SiratAI provides conceptual mapping and relevant source categories. It does not measure or judge personal faith, spirituality, or piety.
          </div>
        </div>
      </div>
    `;

    App.showToast('Reflection analyzed successfully');
  },

  detectThemes(text) {
    const lower = text.toLowerCase();
    const themes = [];
    if (lower.includes('patient') || lower.includes('sabr') || lower.includes('hard') || lower.includes('trial')) themes.push('Sabr');
    if (lower.includes('thank') || lower.includes('gratitude') || lower.includes('shukr') || lower.includes('bless')) themes.push('Shukr');
    if (lower.includes('trust') || lower.includes('reliance') || lower.includes('tawakkul') || lower.includes('worry')) themes.push('Tawakkul');
    if (lower.includes('pray') || lower.includes('salah') || lower.includes('focus') || lower.includes('peace')) themes.push('Salah');
    if (themes.length === 0) themes.push('Contemplation', 'Personal Growth');
    return themes;
  },

  renderReflections() {
    const listEl = document.getElementById('reflectionsList');
    if (!listEl) return;

    const reflections = StorageService.getReflections();
    if (reflections.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; color: var(--text-muted); padding: var(--space-8);">
          <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">✦</div>
          <div style="font-weight: 600; color: var(--text-primary);">Your Reflection Journal is Waiting</div>
          <p style="font-size: var(--text-sm); margin-top: 4px;">Write your thoughts, observations, and contemplated verses above.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = reflections.map(r => {
      const dateStr = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return `
        <div class="card card-hoverable animate-fade-in-up" style="margin-bottom: var(--space-4);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
            <div style="font-size: var(--text-base); font-weight: 600; color: var(--text-primary);">${r.title}</div>
            <span style="font-size: var(--text-xs); color: var(--text-muted);">${dateStr}</span>
          </div>

          <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: var(--space-3);">
            "${r.text}"
          </p>

          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: var(--space-2);">
              ${(r.themes || []).map(t => `<span class="badge badge-neutral">${t}</span>`).join('')}
            </div>
            <button class="btn btn-ghost btn-sm" onclick="AIChatModule.askQuery('Give me Quran and Hadith references related to this reflection: ${r.text.replace(/'/g, "\\'")}')">
              ✦ Deepen with SiratAI
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
};
