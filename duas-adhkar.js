/**
 * SIRATAI DUAS & ADHKAR MODULE
 * Categorized supplications, integrated Tasbeeh counting & direct Adhkar counters
 */

const DuasAdhkarModule = {
  currentDuaCategory: 'all',

  init() {
    this.bindDuaFilters();
    this.renderDuas();
    this.renderAdhkar();
  },

  bindDuaFilters() {
    const pills = document.querySelectorAll('.dua-category-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentDuaCategory = pill.dataset.category;
        this.renderDuas();
      });
    });
  },

  renderDuas() {
    const gridEl = document.getElementById('duaGrid');
    if (!gridEl) return;

    const filtered = SIRAT_DATA.duas.filter(d => 
      this.currentDuaCategory === 'all' || d.category === this.currentDuaCategory
    );

    gridEl.innerHTML = filtered.map(d => {
      const isBookmarked = StorageService.isBookmarked(d.id, 'dua');
      return `
        <div class="dua-card animate-fade-in-up" id="dua-${d.id}">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span class="badge badge-emerald">${d.category}</span>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <button class="btn btn-ghost btn-sm" onclick="DuasAdhkarModule.toggleBookmark('${d.id}')" title="Bookmark">
                <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'var(--color-gold)' : 'none'}" stroke="${isBookmarked ? 'var(--color-gold)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button class="btn btn-primary btn-sm" onclick="DuasAdhkarModule.openInTasbeeh('${d.title}', '${d.arabic.replace(/'/g, "\\'")}', ${d.targetCount})">
                Count (${d.targetCount}x) →
              </button>
            </div>
          </div>

          <div style="font-size: var(--text-base); font-weight: 600; color: var(--text-primary);">${d.title}</div>
          <div class="font-arabic" style="font-size: 1.45rem; line-height: 2;">${d.arabic}</div>
          <div style="font-size: var(--text-xs); color: var(--color-emerald-light); font-family: var(--font-mono);">${d.transliteration}</div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed);">"${d.translation}"</div>

          <div style="font-size: var(--text-xs); color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: var(--space-2); display: flex; justify-content: space-between;">
            <span>${d.reference}</span>
            <span>${d.context}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  renderAdhkar() {
    const listEl = document.getElementById('adhkarGrid');
    if (!listEl) return;

    listEl.innerHTML = SIRAT_DATA.adhkar.map(a => `
      <div class="card card-hoverable animate-fade-in-up" id="adhkar-${a.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
          <span class="badge badge-neutral">${a.category}</span>
          <span style="font-size: var(--text-xs); font-family: var(--font-mono); color: var(--color-emerald-light);" id="adhkar-count-${a.id}">
            ${a.currentCount} / ${a.targetCount}
          </span>
        </div>

        <div style="display: flex; align-items: baseline; justify-content: space-between;">
          <div style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">${a.title}</div>
          <div class="font-arabic" style="font-size: 1.35rem; color: var(--color-emerald);">${a.arabic}</div>
        </div>

        <div style="font-size: var(--text-xs); color: var(--text-muted);">${a.transliteration} • ${a.meaning}</div>

        <!-- Progress Bar -->
        <div class="progress-bar" style="margin: var(--space-3) 0 var(--space-4);">
          <div class="progress-bar-fill" id="adhkar-bar-${a.id}" style="width: ${(a.currentCount / a.targetCount) * 100}%;"></div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between;">
          <button class="btn btn-secondary btn-sm" onclick="DuasAdhkarModule.openInTasbeeh('${a.title}', '${a.arabic.replace(/'/g, "\\'")}', ${a.targetCount})">
            Open in Tasbeeh
          </button>
          <button class="btn btn-primary btn-sm" onclick="DuasAdhkarModule.incrementAdhkar('${a.id}')">
            Count (+1)
          </button>
        </div>
      </div>
    `).join('');
  },

  incrementAdhkar(id) {
    const item = SIRAT_DATA.adhkar.find(a => a.id === id);
    if (!item) return;

    item.currentCount++;
    AudioService.playClick();
    AudioService.triggerHaptic(15);

    const countEl = document.getElementById(`adhkar-count-${id}`);
    const barEl = document.getElementById(`adhkar-bar-${id}`);

    if (countEl) countEl.textContent = `${item.currentCount} / ${item.targetCount}`;
    if (barEl) barEl.style.width = `${Math.min((item.currentCount / item.targetCount) * 100, 100)}%`;

    if (item.currentCount === item.targetCount) {
      AudioService.playGoalChime();
      App.showToast(`✨ Completed ${item.title} (${item.targetCount}x)!`);
      StorageService.addTasbeehSession({
        dhikr: item.title,
        count: item.targetCount,
        durationSeconds: 120
      });
    }
  },

  openInTasbeeh(title, arabic, targetCount) {
    App.navigateTo('tasbeeh');
    TasbeehModule.setCountWithDhikr(title, arabic, targetCount);
    App.showToast(`Opened ${title} in Tasbeeh (${targetCount} target)`);
  },

  toggleBookmark(id) {
    const d = SIRAT_DATA.duas.find(item => item.id === id);
    if (!d) return;

    if (StorageService.isBookmarked(id, 'dua')) {
      StorageService.removeBookmark(id, 'dua');
      App.showToast(`Removed "${d.title}" from library`);
    } else {
      StorageService.addBookmark({
        id: id,
        type: 'dua',
        title: d.title,
        arabic: d.arabic,
        translation: d.translation
      });
      App.showToast(`Saved "${d.title}" to library`);
    }

    this.renderDuas();
  }
};
