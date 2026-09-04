/**
 * SIRATAI HADITH EXPLORER MODULE
 * Canonical collections, topic filtration, verified grading & distinct AI explanation panels
 */

const HadithModule = {
  currentCollection: 'all',
  currentTopic: 'all',
  searchQuery: '',

  init() {
    this.bindFilters();
    this.renderHadiths();
  },

  bindFilters() {
    const collPills = document.querySelectorAll('.hadith-coll-pill');
    collPills.forEach(pill => {
      pill.addEventListener('click', () => {
        collPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentCollection = pill.dataset.collection;
        this.renderHadiths();
      });
    });

    const topicPills = document.querySelectorAll('.hadith-topic-pill');
    topicPills.forEach(pill => {
      pill.addEventListener('click', () => {
        topicPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentTopic = pill.dataset.topic;
        this.renderHadiths();
      });
    });

    const searchInput = document.getElementById('hadithSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase();
        this.renderHadiths();
      });
    }
  },

  renderHadiths() {
    const listEl = document.getElementById('hadithList');
    if (!listEl) return;

    const filtered = SIRAT_DATA.hadiths.filter(h => {
      const matchColl = this.currentCollection === 'all' || h.collection === this.currentCollection;
      const matchTopic = this.currentTopic === 'all' || h.topic === this.currentTopic;
      const matchSearch = !this.searchQuery || 
        h.english.toLowerCase().includes(this.searchQuery) ||
        h.arabic.includes(this.searchQuery) ||
        h.reference.toLowerCase().includes(this.searchQuery) ||
        h.narrator.toLowerCase().includes(this.searchQuery);
      return matchColl && matchTopic && matchSearch;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="card" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
          <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">⌕</div>
          <div style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-1);">No Hadiths Found</div>
          <div style="font-size: var(--text-sm);">Try adjusting your collection, topic filters, or search keywords.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(h => {
      const isBookmarked = StorageService.isBookmarked(h.id, 'hadith');
      return `
        <div class="hadith-card animate-fade-in-up" id="hadith-${h.id}">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-2);">
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span class="badge badge-neutral">${h.collection}</span>
              <span class="badge badge-emerald">${h.grade}</span>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">${h.bookNumber}</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <button class="btn btn-ghost btn-sm" onclick="HadithModule.toggleBookmark('${h.id}')" title="Bookmark">
                <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'var(--color-gold)' : 'none'}" stroke="${isBookmarked ? 'var(--color-gold)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button class="btn btn-outline btn-sm" onclick="HadithModule.toggleExplanation('${h.id}')">
                ✦ AI Context
              </button>
            </div>
          </div>

          <!-- Arabic -->
          <div class="font-arabic" style="font-size: 1.45rem; line-height: 2.1;">${h.arabic}</div>

          <!-- English Narrative -->
          <div style="font-size: var(--text-base); color: var(--text-primary); line-height: var(--leading-relaxed);">
            "${h.english}"
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: var(--space-3);">
            <span>Narrated by <strong>${h.narrator}</strong></span>
            <span>Reference: ${h.reference}</span>
          </div>

          <!-- AI Contextual Explanation (Visually Distinct) -->
          <div class="hadith-explanation-box" id="explanation-${h.id}">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
              <span class="eyebrow" style="color: var(--color-gold);">✦ SiratAI Contextual Commentary</span>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">Educational Summary</span>
            </div>
            <p style="font-size: var(--text-sm); color: var(--text-primary); line-height: var(--leading-relaxed);">
              ${h.explanation}
            </p>
            <div style="margin-top: var(--space-3);">
              <button class="btn btn-secondary btn-sm" onclick="AIChatModule.askQuery('Discuss the lessons and jurisprudence of ${h.reference}: ${h.english.replace(/'/g, "\\'")}')">
                Ask SiratAI about this Hadith →
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleExplanation(id) {
    const box = document.getElementById(`explanation-${id}`);
    if (box) box.classList.toggle('open');
  },

  toggleBookmark(id) {
    const h = SIRAT_DATA.hadiths.find(item => item.id === id);
    if (!h) return;

    if (StorageService.isBookmarked(id, 'hadith')) {
      StorageService.removeBookmark(id, 'hadith');
      App.showToast(`Removed ${h.reference} from library`);
    } else {
      StorageService.addBookmark({
        id: id,
        type: 'hadith',
        title: `${h.collection} (${h.reference})`,
        arabic: h.arabic,
        translation: h.english
      });
      App.showToast(`Saved ${h.reference} to library`);
    }

    this.renderHadiths();
  }
};
