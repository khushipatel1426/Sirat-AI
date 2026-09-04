/**
 * SIRATAI QURAN EXPLORER MODULE
 * Surah selector, Ayah reading, Audio Player UI, Bookmarking & Reflection
 */

const QuranModule = {
  currentSurahId: 1,
  isPlaying: false,
  audioTimer: null,
  audioSeconds: 0,

  init() {
    this.renderSurahList();
    this.renderAyahs(this.currentSurahId);
    this.bindAudioControls();
  },

  renderSurahList() {
    const listEl = document.getElementById('surahListItems');
    if (!listEl) return;

    listEl.innerHTML = SIRAT_DATA.surahs.map(s => `
      <div class="surah-item ${s.id === this.currentSurahId ? 'active' : ''}" data-id="${s.id}" onclick="QuranModule.selectSurah(${s.id})">
        <div style="display: flex; align-items: center; gap: var(--space-3);">
          <span style="font-size: var(--text-xs); font-weight: 600; width: 22px; height: 22px; border-radius: var(--radius-full); background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-family: var(--font-mono);">
            ${s.id}
          </span>
          <div>
            <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">${s.name}</div>
            <div style="font-size: var(--text-xs); color: var(--text-muted);">${s.meaning} • ${s.versesCount} verses</div>
          </div>
        </div>
        <div class="font-arabic" style="font-size: 1.1rem; color: var(--color-emerald);">${s.arabic}</div>
      </div>
    `).join('');
  },

  selectSurah(id) {
    this.currentSurahId = id;
    this.renderSurahList();
    this.renderAyahs(id);
    
    // Update player title
    const surah = SIRAT_DATA.surahs.find(s => s.id === id);
    const titleEl = document.getElementById('playerSurahTitle');
    if (titleEl && surah) titleEl.textContent = `${surah.name} (${surah.meaning})`;
  },

  renderAyahs(surahId) {
    const viewerEl = document.getElementById('ayahViewer');
    if (!viewerEl) return;

    const surah = SIRAT_DATA.surahs.find(s => s.id === surahId);
    if (!surah) return;

    viewerEl.innerHTML = `
      <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-6); text-align: center; margin-bottom: var(--space-4);">
        <span class="badge badge-emerald" style="margin-bottom: var(--space-2);">${surah.revelation} • ${surah.versesCount} Verses</span>
        <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--text-primary);">${surah.name}</h2>
        <div style="font-size: var(--text-sm); color: var(--text-muted);">${surah.meaning}</div>
        <div class="font-arabic" style="font-size: 2.2rem; color: var(--color-emerald); margin-top: var(--space-2);">${surah.arabic}</div>
      </div>

      ${surah.ayahs.map(a => {
        const isBookmarked = StorageService.isBookmarked(`quran-${surah.id}-${a.number}`, 'quran');
        return `
          <div class="ayah-card animate-fade-in-up" id="ayah-${surah.id}-${a.number}">
            <div class="ayah-header">
              <span class="badge badge-neutral">${surah.name} ${a.reference}</span>
              <div class="ayah-actions">
                <button class="btn btn-ghost btn-sm" onclick="QuranModule.playAyahAudio(${surah.id}, ${a.number})" title="Recite">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>Play</span>
                </button>
                <button class="btn btn-ghost btn-sm" onclick="QuranModule.toggleBookmark(${surah.id}, ${a.number})" title="Bookmark">
                  <svg viewBox="0 0 24 24" fill="${isBookmarked ? 'var(--color-gold)' : 'none'}" stroke="${isBookmarked ? 'var(--color-gold)' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
                <button class="btn btn-ghost btn-sm" onclick="QuranModule.askAiAboutAyah('${surah.name} ${a.reference}: ${a.translation.replace(/'/g, "\\'")}')">
                  Ask AI
                </button>
              </div>
            </div>

            <!-- Arabic Ayah -->
            <div class="font-arabic-lg">${a.arabic}</div>

            <!-- Transliteration -->
            <div style="font-size: var(--text-sm); color: var(--color-emerald-light); font-family: var(--font-mono);">${a.transliteration}</div>

            <!-- English Translation -->
            <div style="font-size: var(--text-base); line-height: var(--leading-relaxed); color: var(--text-primary);">
              ${a.translation}
            </div>
          </div>
        `;
      }).join('')}
    `;
  },

  toggleBookmark(surahId, ayahNum) {
    const surah = SIRAT_DATA.surahs.find(s => s.id === surahId);
    const ayah = surah.ayahs.find(a => a.number === ayahNum);
    const id = `quran-${surahId}-${ayahNum}`;

    if (StorageService.isBookmarked(id, 'quran')) {
      StorageService.removeBookmark(id, 'quran');
      App.showToast(`Removed Ayah ${ayah.reference} from library`);
    } else {
      StorageService.addBookmark({
        id: id,
        type: 'quran',
        title: `${surah.name} (${ayah.reference})`,
        arabic: ayah.arabic,
        translation: ayah.translation
      });
      App.showToast(`Saved Ayah ${ayah.reference} to library`);
    }

    this.renderAyahs(this.currentSurahId);
  },

  askAiAboutAyah(ayahContext) {
    App.navigateTo('ask');
    AIChatModule.askQuery(`Help me understand the wisdom, context and lessons of ${ayahContext}`);
  },

  bindAudioControls() {
    const playBtn = document.getElementById('audioPlayPauseBtn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playBtn.innerHTML = this.isPlaying
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
        
        if (this.isPlaying) {
          AudioService.playClick();
          App.showToast('Recitation playback started');
          this.startAudioTimer();
        } else {
          clearInterval(this.audioTimer);
          App.showToast('Recitation paused');
        }
      });
    }
  },

  playAyahAudio(surahId, ayahNum) {
    AudioService.playClick();
    App.showToast(`Playing recitation for Ayah ${surahId}:${ayahNum}`);
    const playBtn = document.getElementById('audioPlayPauseBtn');
    if (playBtn) {
      this.isPlaying = true;
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      this.startAudioTimer();
    }
  },

  startAudioTimer() {
    if (this.audioTimer) clearInterval(this.audioTimer);
    const timeEl = document.getElementById('playerTime');
    const barEl = document.getElementById('playerProgressBar');
    this.audioTimer = setInterval(() => {
      this.audioSeconds++;
      if (timeEl) {
        const mins = String(Math.floor(this.audioSeconds / 60)).padStart(2, '0');
        const secs = String(this.audioSeconds % 60).padStart(2, '0');
        timeEl.textContent = `${mins}:${secs} / 03:45`;
      }
      if (barEl) {
        barEl.style.width = `${Math.min((this.audioSeconds / 225) * 100, 100)}%`;
      }
    }, 1000);
  }
};
