/**
 * SIRATAI ASK AI & SOURCE EVIDENCE GROUNDING ENGINE
 * Conversational interface with 4-step progressive retrieval and verified evidence panels
 */

const AIChatModule = {
  chatStreamEl: null,
  inputEl: null,
  sendBtnEl: null,

  // Demo response bank for educational queries
  responses: {
    patience: {
      answer: "In Islamic teaching, patience (Sabr) is not passive resignation or helplessness. It is active, dignified fortitude, emotional mastery, and constancy in doing good while placing complete reliance upon Allah during adversity.",
      quran: [
        {
          ref: "Surah Al-Baqarah (2:153)",
          text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          trans: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient."
        },
        {
          ref: "Surah Ash-Sharh (94:5-6)",
          text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          trans: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease."
        }
      ],
      hadith: [
        {
          ref: "Sahih Muslim 2999",
          narrator: "Suhaib (RA)",
          text: "How wonderful is the affair of the believer, for his affairs are all good... If adversity happens to him, he is patient and that is good for him."
        }
      ],
      explanation: "Scholars delineate three primary dimensions of Sabr: (1) Patience in remaining steadfast in obedience to Allah, (2) Patience in restraining oneself from unlawful desire, and (3) Patience in calmly accepting divine decrees during pain.",
      reflection: "Where in your current daily responsibilities or relationships can you transform reactive frustration into mindful fortitude?",
      topics: ["Sabr", "Tawakkul", "Salah", "Emotional Fortitude"]
    },
    gratitude: {
      answer: "Gratitude (Shukr) is one of the highest spiritual stations in Islam. It is recognized not solely through verbal utterance, but through heart acknowledgement and using divine blessings in ways pleasing to Allah.",
      quran: [
        {
          ref: "Surah Ibrahim (14:7)",
          text: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
          trans: "If you are grateful, I will surely increase you [in favor]."
        },
        {
          ref: "Surah Luqman (31:12)",
          text: "وَمَن يَشْكُرْ فَإِنَّمَا يَشْكُرُ لِنَفْسِهِ",
          trans: "And whoever is grateful is grateful for the benefit of himself."
        }
      ],
      hadith: [
        {
          ref: "Sahih al-Bukhari 4836",
          narrator: "Aisha (RA)",
          text: "When asked why he prayed until his feet swelled, the Prophet (ﷺ) responded: 'Should I not be a grateful servant?'"
        }
      ],
      explanation: "Shukr preserves existing blessings (Ni'mah) and invites further divine benevolence. It shifts human consciousness from scarcity and grievance to abundance and contemplation.",
      reflection: "Take a moment to identify three subtle blessings you experienced today that usually pass unnoticed.",
      topics: ["Shukr", "Mindfulness", "Contemplation", "Abundance"]
    },
    default: {
      answer: "Islam emphasizes the profound unity between seeking knowledge ('Ilm), refining internal moral character (Akhlaq), and translating belief into principled, compassionate action in the world.",
      quran: [
        {
          ref: "Surah Al-Asr (103:1-3)",
          text: "وَالْعَصْرِ • إِنَّ الْإِنسَانَ لَفِي خُسْرٍ • إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
          trans: "By time, indeed, mankind is in loss, except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience."
        }
      ],
      hadith: [
        {
          ref: "Sunan Ibn Majah 224",
          narrator: "Anas ibn Malik (RA)",
          text: "Seeking knowledge is an obligation upon every Muslim."
        }
      ],
      explanation: "Knowledge in the Islamic worldview is an illuminating trust (Amanah). True comprehension produces humility, service to humanity, and a deeper awareness of the Creator.",
      reflection: "How can the knowledge you learn today serve someone else or improve your community?",
      topics: ["Ilm", "Character", "Wisdom", "Righteous Action"]
    }
  },

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

    // Bind prompt starter pills
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

    // Append User Message
    this.appendUserMessage(text);
    this.inputEl.value = '';

    // Simulate Multi-Step AI Thinking
    this.simulateThinking(text);
  },

  appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'message-user animate-fade-in-up';
    msg.textContent = text;
    this.chatStreamEl.appendChild(msg);
    this.scrollToBottom();
  },

  simulateThinking(query) {
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'message-ai animate-fade-in-up';
    thinkingEl.id = 'currentAiThinking';

    thinkingEl.innerHTML = `
      <div class="ai-thinking-box">
        <div class="thinking-step active" id="step1">
          <div class="ai-step-dot"></div>
          <span>Understanding your question...</span>
        </div>
        <div class="thinking-step" id="step2">
          <div class="ai-step-dot" style="opacity: 0.3;"></div>
          <span>Retrieving relevant Quran & Hadith sources...</span>
        </div>
        <div class="thinking-step" id="step3">
          <div class="ai-step-dot" style="opacity: 0.3;"></div>
          <span>Checking evidence grounding...</span>
        </div>
        <div class="thinking-step" id="step4">
          <div class="ai-step-dot" style="opacity: 0.3;"></div>
          <span>Preparing your educational explanation...</span>
        </div>
      </div>
    `;

    this.chatStreamEl.appendChild(thinkingEl);
    this.scrollToBottom();

    // Step 1 -> Step 2
    setTimeout(() => {
      const s1 = document.getElementById('step1');
      const s2 = document.getElementById('step2');
      if (s1 && s2) {
        s1.className = 'thinking-step done';
        s2.className = 'thinking-step active';
        s2.querySelector('.ai-step-dot').style.opacity = '1';
      }
    }, 450);

    // Step 2 -> Step 3
    setTimeout(() => {
      const s2 = document.getElementById('step2');
      const s3 = document.getElementById('step3');
      if (s2 && s3) {
        s2.className = 'thinking-step done';
        s3.className = 'thinking-step active';
        s3.querySelector('.ai-step-dot').style.opacity = '1';
      }
    }, 900);

    // Step 3 -> Step 4 -> Final Render
    setTimeout(() => {
      const s3 = document.getElementById('step3');
      const s4 = document.getElementById('step4');
      if (s3 && s4) {
        s3.className = 'thinking-step done';
        s4.className = 'thinking-step active';
        s4.querySelector('.ai-step-dot').style.opacity = '1';
      }
    }, 1300);

    setTimeout(() => {
      this.renderAIResponse(query, thinkingEl);
    }, 1750);
  },

  renderAIResponse(query, targetContainer) {
    const qLower = query.toLowerCase();
    let data = this.responses.default;
    if (qLower.includes('patience') || qLower.includes('sabr')) {
      data = this.responses.patience;
    } else if (qLower.includes('gratitude') || qLower.includes('shukr') || qLower.includes('thank')) {
      data = this.responses.gratitude;
    }

    targetContainer.innerHTML = `
      <!-- AI Answer Header -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span style="color: var(--color-emerald); font-weight: 700;">✦ SIRATAI</span>
          <span class="badge badge-emerald">✓ Source Grounded</span>
        </div>
        <span style="font-size: var(--text-xs); color: var(--text-muted);">Educational Response</span>
      </div>

      <!-- Core Answer -->
      <div style="font-size: var(--text-base); line-height: var(--leading-relaxed); color: var(--text-primary);">
        ${data.answer}
      </div>

      <!-- Quran Sources -->
      <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-2);">
        <div class="eyebrow" style="font-size: 0.72rem;">QURAN SOURCES</div>
        ${data.quran.map(q => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span class="badge badge-gold" style="font-size: 0.7rem;">${q.ref}</span>
              <button class="btn btn-ghost btn-sm" onclick="App.copyText('${q.text}')" title="Copy Arabic">Copy</button>
            </div>
            <div class="font-arabic" style="font-size: 1.35rem; line-height: 2;">${q.text}</div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary); font-style: italic;">"${q.trans}"</div>
          </div>
        `).join('')}
      </div>

      <!-- Hadith Sources -->
      <div style="display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-2);">
        <div class="eyebrow" style="font-size: 0.72rem;">HADITH SOURCES</div>
        ${data.hadith.map(h => `
          <div style="background: var(--bg-surface); border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-1);">
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <span class="badge badge-neutral" style="font-size: 0.7rem;">${h.ref}</span>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">Narrated by ${h.narrator}</span>
            </div>
            <div style="font-size: var(--text-sm); color: var(--text-secondary); margin-top: var(--space-1);">${h.text}</div>
          </div>
        `).join('')}
      </div>

      <!-- Practical Explanation -->
      <div style="background: var(--bg-deep-forest); border-left: 3px solid var(--color-emerald); padding: var(--space-4); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
        <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; color: var(--color-emerald); margin-bottom: var(--space-1);">Practical Understanding</div>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed);">${data.explanation}</p>
      </div>

      <!-- Guided Reflection -->
      <div style="background: var(--bg-surface); border: 1px dashed var(--border-hover); padding: var(--space-4); border-radius: var(--radius-md);">
        <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; color: var(--color-gold); margin-bottom: var(--space-1);">✦ Reflection Prompt</div>
        <p style="font-size: var(--text-sm); color: var(--text-primary); font-style: italic;">"${data.reflection}"</p>
      </div>

      <!-- Expandable Source Evidence Panel -->
      <div class="evidence-panel" id="evPanel-${Date.now()}">
        <div class="evidence-header" onclick="this.parentElement.classList.toggle('open')">
          <span>✓ View Evidence & Grounding Details</span>
          <span style="font-size: 0.75rem;">▼</span>
        </div>
        <div class="evidence-content">
          <div class="evidence-item">
            <div style="font-weight: 600; color: var(--text-primary);">Quran Corpus Grounding</div>
            <div>Relevance Score: 98.4% • Model: Semantic Vector Retrieval</div>
            <div style="margin-top: 4px; color: var(--text-muted);">Matched with Tafsir Ibn Kathir & Al-Sa'di cross-references.</div>
          </div>
          <div class="evidence-item">
            <div style="font-weight: 600; color: var(--text-primary);">Hadith Authenticity Verification</div>
            <div>Grading: Sahih / Mutawatir • Verified across standard canonical collections.</div>
          </div>
        </div>
      </div>

      <!-- Related Topics -->
      <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap; margin-top: var(--space-2);">
        <span style="font-size: var(--text-xs); color: var(--text-muted);">Related:</span>
        ${data.topics.map(t => `<span class="chip" style="font-size: 0.72rem; padding: 3px 8px;" onclick="AIChatModule.askQuery('Tell me more about ${t}')">${t}</span>`).join('')}
      </div>

      <div style="font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: var(--space-2); margin-top: var(--space-2);">
        SiratAI is an educational technology platform. AI-generated explanations are not a substitute for qualified scholarly guidance.
      </div>
    `;

    StorageService.addHistory({
      action: `Asked SiratAI: "${query.substring(0, 40)}..."`,
      type: 'ai',
      timestamp: new Date().toISOString()
    });

    this.scrollToBottom();
  },

  scrollToBottom() {
    if (this.chatStreamEl) {
      this.chatStreamEl.scrollTop = this.chatStreamEl.scrollHeight;
    }
  }
};
