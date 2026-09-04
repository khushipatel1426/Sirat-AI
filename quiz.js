/**
 * SIRATAI ADAPTIVE QUIZ MODULE
 * Knowledge Assessment & Conceptual Retention (Strictly Educational - Never an "Iman Score")
 */

const QuizModule = {
  currentIndex: 0,
  score: 0,
  selectedAnswer: null,
  isAnswered: false,
  timerSeconds: 0,
  timerInterval: null,

  init() {
    this.resetQuiz();
  },

  resetQuiz() {
    this.currentIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.timerSeconds = 0;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.renderQuestion();
    this.startTimer();
  },

  startTimer() {
    const timerEl = document.getElementById('quizTimer');
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      if (timerEl) {
        const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
        const secs = String(this.timerSeconds % 60).padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  },

  renderQuestion() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const questions = SIRAT_DATA.quizQuestions;
    if (this.currentIndex >= questions.length) {
      this.renderSummary();
      return;
    }

    const q = questions[this.currentIndex];
    this.isAnswered = false;
    this.selectedAnswer = null;

    // Update progress bar
    const progressEl = document.getElementById('quizProgressBar');
    if (progressEl) {
      progressEl.style.width = `${((this.currentIndex) / questions.length) * 100}%`;
    }

    container.innerHTML = `
      <div class="card card-elevated animate-fade-in-up" style="max-width: 720px; margin: 0 auto;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
          <span class="badge badge-emerald">${q.topic}</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
            Question ${this.currentIndex + 1} of ${questions.length}
          </span>
        </div>

        <!-- Question Prompt -->
        <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin-bottom: var(--space-6);">
          ${q.question}
        </h3>

        <!-- Options -->
        <div style="display: flex; flex-direction: column; gap: var(--space-3);" id="quizOptionsList">
          ${q.options.map((opt, i) => `
            <button class="btn btn-secondary" style="justify-content: flex-start; text-align: left; padding: var(--space-4); border-radius: var(--radius-md); width: 100%; transition: all var(--transition-fast);" onclick="QuizModule.selectOption(${i})">
              <span style="font-weight: 700; width: 26px; height: 26px; border-radius: var(--radius-full); background: var(--bg-surface); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: var(--space-3); flex-shrink: 0;">
                ${String.fromCharCode(65 + i)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>

        <!-- Explanation Drawer (Hidden until answered) -->
        <div id="quizExplanationBox" style="display: none; margin-top: var(--space-6); padding: var(--space-4); background: var(--bg-deep-forest); border-left: 3px solid var(--color-emerald); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
          <div style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; color: var(--color-emerald); margin-bottom: var(--space-1);">Source Grounding & Explanation</div>
          <p style="font-size: var(--text-sm); color: var(--text-primary); line-height: var(--leading-relaxed);" id="quizExplanationText">
            ${q.explanation}
          </p>
          <div style="margin-top: var(--space-4); display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="QuizModule.nextQuestion()">
              Continue →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  selectOption(index) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    this.selectedAnswer = index;

    const q = SIRAT_DATA.quizQuestions[this.currentIndex];
    const isCorrect = (index === q.correctIndex);
    if (isCorrect) {
      this.score++;
      AudioService.playGoalChime();
    } else {
      AudioService.playClick();
    }

    // Highlight options
    const optionBtns = document.querySelectorAll('#quizOptionsList button');
    optionBtns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) {
        btn.style.borderColor = 'var(--color-emerald)';
        btn.style.background = 'var(--color-emerald-dim)';
        btn.style.color = 'var(--color-emerald-light)';
      } else if (i === index && !isCorrect) {
        btn.style.borderColor = 'var(--color-danger)';
        btn.style.background = 'rgba(224, 82, 82, 0.15)';
      }
    });

    // Show Explanation
    const explBox = document.getElementById('quizExplanationBox');
    if (explBox) explBox.style.display = 'block';
  },

  nextQuestion() {
    this.currentIndex++;
    this.renderQuestion();
  },

  renderSummary() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const container = document.getElementById('quizContainer');
    if (!container) return;

    const total = SIRAT_DATA.quizQuestions.length;
    const pct = Math.round((this.score / total) * 100);

    StorageService.addHistory({
      action: `Completed Knowledge Assessment: ${this.score}/${total} (${pct}%)`,
      type: 'quiz',
      timestamp: new Date().toISOString()
    });

    container.innerHTML = `
      <div class="card card-elevated animate-fade-in-up" style="max-width: 640px; margin: 0 auto; text-align: center; padding: var(--space-8);">
        <div style="width: 72px; height: 72px; border-radius: var(--radius-full); background: var(--color-emerald-dim); color: var(--color-emerald); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto var(--space-4); box-shadow: var(--shadow-emerald-glow);">
          ✦
        </div>

        <span class="badge badge-emerald" style="margin-bottom: var(--space-2);">Knowledge Assessment Complete</span>
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: var(--space-1);">
          ${this.score} / ${total} Correct
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); max-width: 440px; margin: 0 auto var(--space-6);">
          Demonstrated strong comprehension in Sabr foundations and Prophetic Hadith principles.
        </p>

        <div style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: var(--space-4); text-align: left; margin-bottom: var(--space-6); display: flex; flex-direction: column; gap: var(--space-2);">
          <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
            <span style="color: var(--text-muted);">Strong Retention:</span>
            <strong style="color: var(--color-emerald-light);">Sabr & Intentions (Bukhari 1)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--text-sm);">
            <span style="color: var(--text-muted);">Recommended Revision:</span>
            <strong style="color: var(--color-gold);">Tawakkul & Action Harmonies</strong>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: center; gap: var(--space-4);">
          <button class="btn btn-secondary" onclick="QuizModule.resetQuiz()">
            Retake Assessment
          </button>
          <button class="btn btn-primary" onclick="App.navigateTo('dashboard')">
            View Learning Dashboard →
          </button>
        </div>

        <div style="font-size: var(--text-xs); color: var(--text-muted); margin-top: var(--space-6); border-top: 1px solid var(--border-subtle); padding-top: var(--space-3);">
          Assessment measures educational content comprehension and conceptual recall. It does not measure personal faith or spiritual stature.
        </div>
      </div>
    `;
  }
};
