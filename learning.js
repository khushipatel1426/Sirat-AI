/**
 * SIRATAI LEARNING HUB & VERTICAL PATH MODULE
 * Structured, progressive educational journeys with vertical animated node timelines
 */

const LearningModule = {
  currentPathId: 'path-sabr',

  init() {
    this.renderPathCards();
    this.renderVerticalJourney(this.currentPathId);
  },

  renderPathCards() {
    const gridEl = document.getElementById('learningPathsGrid');
    if (!gridEl) return;

    gridEl.innerHTML = SIRAT_DATA.learningPaths.map(p => `
      <div class="card card-hoverable animate-fade-in-up" onclick="LearningModule.selectPath('${p.id}')" style="${p.id === this.currentPathId ? 'border-color: var(--color-emerald); background: var(--bg-surface-elevated);' : ''}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
          <span class="badge ${p.difficulty === 'Beginner' ? 'badge-neutral' : 'badge-emerald'}">${p.difficulty}</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">${p.duration} • ${p.sourcesCount} Sources</span>
        </div>

        <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1);">${p.title}</div>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4); line-height: 1.5;">${p.tagline}</p>

        <!-- Progress -->
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--text-xs); margin-bottom: var(--space-1);">
          <span style="color: var(--text-muted);">Journey Progress</span>
          <span style="font-weight: 600; color: var(--color-emerald-light); font-family: var(--font-mono);">${p.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${p.progress}%;"></div>
        </div>
      </div>
    `).join('');
  },

  selectPath(pathId) {
    this.currentPathId = pathId;
    this.renderPathCards();
    this.renderVerticalJourney(pathId);
  },

  renderVerticalJourney(pathId) {
    const journeyEl = document.getElementById('verticalJourneyTimeline');
    if (!journeyEl) return;

    const path = SIRAT_DATA.learningPaths.find(p => p.id === pathId) || SIRAT_DATA.learningPaths[0];

    journeyEl.innerHTML = `
      <div style="margin-bottom: var(--space-6);">
        <div class="eyebrow">ACTIVE LEARNING PATHWAY</div>
        <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: var(--space-1);">${path.title}</h2>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-1);">${path.tagline}</p>
      </div>

      <div style="position: relative; padding-left: var(--space-8); display: flex; flex-direction: column; gap: var(--space-6);">
        <!-- Vertical Connecting Line -->
        <div style="position: absolute; top: 12px; bottom: 12px; left: 14px; width: 2px; background: var(--border-default);"></div>

        ${path.nodes.map((n, i) => {
          let nodeIcon = '●';
          let nodeStyle = 'border: 2px solid var(--border-default); background: var(--bg-surface); color: var(--text-muted);';
          let badgeClass = 'badge-neutral';
          
          if (n.status === 'completed') {
            nodeIcon = '✓';
            nodeStyle = 'background: var(--color-emerald); border: 2px solid var(--color-emerald); color: #fff; box-shadow: 0 0 10px rgba(22, 163, 106, 0.4);';
            badgeClass = 'badge-emerald';
          } else if (n.status === 'in_progress') {
            nodeIcon = '◉';
            nodeStyle = 'background: var(--bg-surface-elevated); border: 2px solid var(--color-jade); color: var(--color-jade); box-shadow: 0 0 12px rgba(43, 201, 130, 0.35);';
            badgeClass = 'badge-gold';
          }

          return `
            <div style="position: relative;" class="animate-fade-in-up">
              <!-- Node Circle -->
              <div style="position: absolute; left: calc(-1 * var(--space-8) + 2px); top: 16px; width: 26px; height: 26px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; ${nodeStyle}">
                ${nodeIcon}
              </div>

              <!-- Node Card -->
              <div class="card card-elevated" style="cursor: pointer; transition: all var(--transition-fast);" onclick="LearningModule.handleNodeClick('${path.id}', ${n.id})">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-1);">
                  <span class="badge ${badgeClass}">${n.type.toUpperCase()}</span>
                  <span style="font-size: var(--text-xs); color: var(--text-muted);">Step 0${n.id}</span>
                </div>
                <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary);">${n.title}</div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-2);">
                  <span>Status: <strong>${n.status.replace('_', ' ')}</strong></span>
                  <span>• Click to inspect learning modules →</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  handleNodeClick(pathId, nodeId) {
    if (nodeId === 6 || nodeId === 5) {
      App.navigateTo('quiz');
      App.showToast('Opened Knowledge Assessment for this pathway');
    } else {
      App.showToast(`Exploring Step 0${nodeId} lesson content`);
    }
  }
};
