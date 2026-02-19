/**
 * Generates a print-ready HTML document and opens the browser print dialog.
 * The user can then "Save as PDF" from the print dialog.
 */

export function generateProfilePDF(data: {
  archetype: {
    name: string;
    emoji: string;
    title: string;
    traits: string[];
    strengths: string[];
    workStyle: string;
  };
  comprehensiveScores: Record<string, number>;
  sectorMatches: Array<{
    sector: string;
    fitScore: number;
    stars: number;
    topStrengths: string[];
    growthAreas: string[];
  }>;
  geographyMatches: Array<{
    region: string;
    flag: string;
    fit: string;
    fitScore: number;
    reason: string;
  }>;
  departmentMatches: Array<{
    department: string;
    emoji: string;
    fitScore: number;
    stars: number;
    rank: number;
    topReasons: string[];
  }>;
  experiencePath: string;
  completedAt: string;
}) {
  const {
    archetype, comprehensiveScores, sectorMatches,
    geographyMatches, departmentMatches, experiencePath, completedAt
  } = data;

  const layers = [
    {
      name: "Archetype Foundation",
      dimensions: [
        { key: 'autonomy', label: 'Autonomy' },
        { key: 'collaboration', label: 'Collaboration' },
        { key: 'precision', label: 'Precision' },
        { key: 'leadership', label: 'Leadership' },
        { key: 'adaptability', label: 'Adaptability' },
      ]
    },
    {
      name: "Cognitive Aptitude",
      dimensions: [
        { key: 'problemSolving', label: 'Problem Solving' },
        { key: 'attentionToDetail', label: 'Attention to Detail' },
        { key: 'learningSpeed', label: 'Learning Speed' },
        { key: 'patternRecognition', label: 'Pattern Recognition' },
        { key: 'concentration', label: 'Concentration' },
      ]
    },
    {
      name: "Personality (Big 5)",
      dimensions: [
        { key: 'extraversion', label: 'Extraversion' },
        { key: 'conscientiousness', label: 'Conscientiousness' },
        { key: 'openness', label: 'Openness' },
        { key: 'agreeableness', label: 'Agreeableness' },
        { key: 'emotionalStability', label: 'Emotional Stability' },
      ]
    },
    {
      name: "Emotional Intelligence",
      dimensions: [
        { key: 'readingOthers', label: 'Reading Others' },
        { key: 'empathy', label: 'Empathy' },
        { key: 'selfRegulation', label: 'Self-Regulation' },
        { key: 'socialAwareness', label: 'Social Awareness' },
      ]
    },
    {
      name: "Reliability & Standards",
      dimensions: [
        { key: 'integrity', label: 'Integrity' },
        { key: 'ruleFollowing', label: 'Rule-Following' },
        { key: 'safetyConsciousness', label: 'Safety Consciousness' },
        { key: 'dependability', label: 'Dependability' },
      ]
    },
  ];

  const activeLayers = layers.filter(layer =>
    layer.dimensions.some(d => (comprehensiveScores[d.key] || 0) > 0)
  );

  const bar = (score: number) => {
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#9ca3af';
    return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
      <div style="flex:1;height:14px;background:#1e293b;border-radius:7px;overflow:hidden;">
        <div style="width:${score}%;height:100%;background:${color};border-radius:7px;"></div>
      </div>
      <span style="font-size:13px;font-weight:600;min-width:32px;text-align:right;">${score}</span>
    </div>`;
  };

  const starsStr = (count: number) => '★'.repeat(count) + '☆'.repeat(5 - count);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>DNA Profile — ${archetype.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a; color: #e2e8f0; padding: 40px;
      max-width: 800px; margin: 0 auto;
    }
    @media print {
      body { background: white; color: #1e293b; padding: 20px; }
      .no-print { display: none; }
      .section { break-inside: avoid; }
      .bar-fill { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #334155; }
    .header h1 { font-size: 28px; margin-bottom: 4px; }
    .header .subtitle { font-size: 14px; color: #94a3b8; }
    .archetype { text-align: center; margin: 24px 0; padding: 24px; background: #1e293b; border-radius: 12px; }
    .archetype .emoji { font-size: 48px; }
    .archetype h2 { font-size: 24px; margin: 8px 0 4px; }
    .archetype .title { font-size: 16px; color: #94a3b8; }
    .archetype .traits { margin-top: 12px; font-size: 14px; }
    .section { margin: 24px 0; }
    .section h3 { font-size: 18px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
    .dimension { margin: 8px 0; }
    .dimension .label { font-size: 13px; color: #94a3b8; margin-bottom: 2px; }
    .match-card { padding: 12px; margin: 8px 0; background: #1e293b; border-radius: 8px; }
    .match-card .name { font-size: 15px; font-weight: 600; }
    .match-card .meta { font-size: 13px; color: #94a3b8; margin-top: 4px; }
    .match-card .reasons { font-size: 13px; margin-top: 6px; }
    .geography-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1e293b; }
    .geography-row .region { font-size: 14px; }
    .geography-row .badge { font-size: 12px; font-weight: 600; padding: 2px 8px; border-radius: 4px; }
    .badge-excellent { background: #166534; color: #bbf7d0; }
    .badge-good { background: #1e40af; color: #bfdbfe; }
    .badge-moderate { background: #92400e; color: #fde68a; }
    .badge-challenging { background: #991b1b; color: #fecaca; }
    .footer { text-align: center; margin-top: 32px; padding-top: 16px; border-top: 2px solid #334155; font-size: 12px; color: #64748b; }
    .strengths-list { list-style: none; padding: 0; }
    .strengths-list li { font-size: 13px; padding: 2px 0; }
    .strengths-list li::before { content: "✓ "; color: #22c55e; }
    .growth-list li::before { content: "△ "; color: #f59e0b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🧬 DNA Profile</h1>
    <div class="subtitle">Candidate DNA Assessment · Powered by Be Connect</div>
    <div class="subtitle">${experiencePath.charAt(0).toUpperCase() + experiencePath.slice(1)} Path · Completed ${new Date(completedAt).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
  </div>

  <div class="archetype">
    <div class="emoji">${archetype.emoji}</div>
    <h2>${archetype.name}</h2>
    <div class="title">${archetype.title}</div>
    <div class="traits">${archetype.traits.join(' · ')}</div>
  </div>

  ${activeLayers.map(layer => `
    <div class="section">
      <h3>${layer.name}</h3>
      ${layer.dimensions.map(d => `
        <div class="dimension">
          <div class="label">${d.label}</div>
          ${bar(comprehensiveScores[d.key] || 0)}
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="section">
    <h3>🏢 Sector Matches</h3>
    ${sectorMatches.slice(0, 4).map((s, i) => `
      <div class="match-card">
        <div class="name">${i + 1}. ${s.sector} — ${starsStr(s.stars)} (${s.fitScore}%)</div>
        ${s.topStrengths.length > 0 ? `
          <ul class="strengths-list reasons">
            ${s.topStrengths.map(r => `<li>${r}</li>`).join('')}
          </ul>
        ` : ''}
        ${s.growthAreas.length > 0 ? `
          <ul class="strengths-list growth-list reasons">
            ${s.growthAreas.map(r => `<li>${r}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h3>🏨 Department Alignment</h3>
    ${departmentMatches.slice(0, 5).map(d => `
      <div class="match-card">
        <div class="name">${d.rank}. ${d.emoji} ${d.department} — ${starsStr(d.stars)} (${d.fitScore}%)</div>
        <div class="reasons">${d.topReasons.join(', ')}</div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h3>🌍 Geography Fit</h3>
    ${geographyMatches.map(g => `
      <div class="geography-row">
        <span class="region">${g.flag} ${g.region}</span>
        <span class="badge badge-${g.fit}">${g.fit.toUpperCase()}</span>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>Generated by Be Connect DNA Assessment · be-connect-dna.lovable.app</p>
    <p>This profile is a snapshot of assessment responses and should be used alongside interviews and references.</p>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
