/**
 * SIRATAI D3.JS INTERACTIVE KNOWLEDGE GRAPH
 * Force-directed conceptual network connecting Quran, Hadith, Duas, and Islamic Principles
 */

const KnowledgeGraphModule = {
  svg: null,
  simulation: null,
  containerId: 'knowledgeGraphSvg',

  init() {
    this.renderGraph();
    this.bindControls();
  },

  renderGraph() {
    const container = document.getElementById(this.containerId);
    if (!container || typeof d3 === 'undefined') return;

    container.innerHTML = '';
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 650;

    const data = JSON.parse(JSON.stringify(SIRAT_DATA.knowledgeGraph));

    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height]);

    this.svg = svg;

    // Zoom container
    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    this.zoom = zoom;

    // Simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(110))
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d.size || 20) + 12));

    this.simulation = simulation;

    // Colors by group
    const colorMap = {
      concept: '#16A36A',
      quran: '#2BC982',
      hadith: '#C8A951',
      dua: '#4E9BF5'
    };

    // Draw Links
    const link = g.append('g')
      .attr('stroke', 'var(--border-default)')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1.5);

    // Link Labels (subtle)
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(data.links)
      .join('text')
      .text(d => d.relationship)
      .attr('font-size', '9px')
      .attr('fill', 'var(--text-muted)')
      .attr('text-anchor', 'middle');

    // Draw Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on('click', (event, d) => {
        event.stopPropagation();
        KnowledgeGraphModule.showNodeDetail(d);
      });

    // Node Circle
    node.append('circle')
      .attr('r', d => d.size ? d.size / 1.8 : 12)
      .attr('fill', d => colorMap[d.group] || '#16A36A')
      .attr('stroke', 'var(--bg-obsidian)')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .style('transition', 'transform 150ms ease')
      .on('mouseenter', function() {
        d3.select(this).attr('stroke', '#FFFFFF').attr('stroke-width', 3);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('stroke', 'var(--bg-obsidian)').attr('stroke-width', 2);
      });

    // Node Label
    node.append('text')
      .text(d => d.id)
      .attr('x', 0)
      .attr('y', d => (d.size ? d.size / 1.8 : 12) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none');

    // Ticking
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  },

  showNodeDetail(node) {
    const drawer = document.getElementById('graphDetailDrawer');
    if (!drawer) return;

    drawer.classList.add('open');
    drawer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: var(--space-3);">
        <span class="badge badge-emerald">${node.group.toUpperCase()}</span>
        <button class="btn btn-ghost btn-sm" onclick="document.getElementById('graphDetailDrawer').classList.remove('open')">✕</button>
      </div>

      <div>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-top: var(--space-2);">${node.label}</h3>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-2); line-height: 1.6;">
          Connected conceptually to primary Quranic references, prophetic Hadith collections, and daily contemplative practices.
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4);">
        <button class="btn btn-primary btn-sm" onclick="AIChatModule.askQuery('Explain the comprehensive meaning and connections of ${node.id} in Islamic knowledge'); App.navigateTo('ask');">
          ✦ Ask SiratAI about ${node.id}
        </button>
        <button class="btn btn-secondary btn-sm" onclick="App.navigateTo('learn')">
          Explore Related Learning Pathway
        </button>
      </div>
    `;
  },

  bindControls() {
    const zoomIn = document.getElementById('graphZoomIn');
    const zoomOut = document.getElementById('graphZoomOut');
    const zoomReset = document.getElementById('graphZoomReset');

    if (zoomIn && this.svg && this.zoom) {
      zoomIn.addEventListener('click', () => {
        this.svg.transition().call(this.zoom.scaleBy, 1.3);
      });
    }

    if (zoomOut && this.svg && this.zoom) {
      zoomOut.addEventListener('click', () => {
        this.svg.transition().call(this.zoom.scaleBy, 0.7);
      });
    }

    if (zoomReset && this.svg && this.zoom) {
      zoomReset.addEventListener('click', () => {
        this.svg.transition().call(this.zoom.transform, d3.zoomIdentity);
      });
    }
  }
};
