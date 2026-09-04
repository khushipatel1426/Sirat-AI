/**
 * SIRATAI PERSONAL DASHBOARD & ANALYTICS MODULE
 * Time-sensitive greeting, Chart.js learning metrics, explainable recommendations & knowledge gaps
 */

const DashboardModule = {
  activityChart: null,
  topicsChart: null,

  init() {
    this.updateGreeting();
    this.renderKPIs();
    this.initCharts();
  },

  updateGreeting() {
    const greetingEl = document.getElementById('dashboardGreeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let timeText = 'Good evening';
    if (hour < 12) {
      timeText = 'Good morning';
    } else if (hour < 17) {
      timeText = 'Good afternoon';
    }

    greetingEl.innerHTML = `
      <h1 class="page-title">${timeText}.</h1>
      <p class="text-body" style="margin-top: 4px;">Continue your learning and reflection journey.</p>
    `;
  },

  renderKPIs() {
    const tasbeehState = StorageService.getTasbeehState();
    const bookmarks = StorageService.getBookmarks();
    const reflections = StorageService.getReflections();

    const tEl = document.getElementById('kpiTasbeehTotal');
    const bEl = document.getElementById('kpiSavedSources');
    const rEl = document.getElementById('kpiReflections');

    if (tEl) tEl.textContent = tasbeehState.todayTotal + tasbeehState.weekTotal;
    if (bEl) bEl.textContent = bookmarks.length + 38; // Seeded baseline
    if (rEl) rEl.textContent = reflections.length;
  },

  initCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Learning Activity Line/Bar Chart
    const activityCanvas = document.getElementById('dashboardActivityChart');
    if (activityCanvas) {
      if (this.activityChart) this.activityChart.destroy();

      const ctx = activityCanvas.getContext('2d');
      this.activityChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Learning Sessions',
              data: [3, 5, 2, 4, 6, 8, 5],
              backgroundColor: 'rgba(22, 163, 106, 0.85)',
              borderRadius: 6
            },
            {
              label: 'Reflections & Notes',
              data: [1, 2, 1, 3, 2, 4, 2],
              backgroundColor: 'rgba(200, 169, 81, 0.75)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#A8B0AA',
                font: { family: 'Inter', size: 12 }
              }
            },
            tooltip: {
              backgroundColor: '#18211C',
              titleColor: '#F5F3EA',
              bodyColor: '#A8B0AA',
              borderColor: '#26322C',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(38, 50, 44, 0.4)' },
              ticks: { color: '#6F7A73' }
            },
            y: {
              grid: { color: 'rgba(38, 50, 44, 0.4)' },
              ticks: { color: '#6F7A73' }
            }
          }
        }
      });
    }

    // 2. Topics Explored Donut Chart
    const topicsCanvas = document.getElementById('dashboardTopicsChart');
    if (topicsCanvas) {
      if (this.topicsChart) this.topicsChart.destroy();

      const ctx2 = topicsCanvas.getContext('2d');
      this.topicsChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Sabr', 'Salah', 'Tawakkul', 'Duas', 'Hadith', 'Quran'],
          datasets: [{
            data: [28, 22, 18, 14, 10, 8],
            backgroundColor: [
              '#16A36A',
              '#2BC982',
              '#C8A951',
              '#4E9BF5',
              '#8E6F24',
              '#36483F'
            ],
            borderColor: '#131A16',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: '#A8B0AA',
                font: { family: 'Inter', size: 11 }
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }
};
