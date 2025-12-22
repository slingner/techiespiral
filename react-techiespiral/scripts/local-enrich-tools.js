import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');

// Intelligent enrichment based on tool data patterns
function enrichTool(tool, allTools, categoryMap) {
  // Skip if already enriched
  if (tool.techiespiral_score) {
    return tool;
  }

  const category = tool.category;
  const priceRange = tool.price_range || '';
  const features = (tool.features || '').split(',').length;

  // Calculate value_score based on price
  let value_score = 3;
  if (priceRange.toLowerCase().includes('free') || priceRange.startsWith('$0')) {
    value_score = 5;
  } else if (priceRange.includes('$') && parseInt(priceRange.match(/\$(\d+)/)?.[1] || 999) < 20) {
    value_score = 4;
  } else if (priceRange.includes('$') && parseInt(priceRange.match(/\$(\d+)/)?.[1] || 999) < 50) {
    value_score = 3;
  } else if (priceRange.includes('$') && parseInt(priceRange.match(/\$(\d+)/)?.[1] || 999) < 100) {
    value_score = 2;
  } else {
    value_score = 1;
  }

  // Calculate ease_score based on description keywords
  const description = (tool.description + ' ' + tool.long_description).toLowerCase();
  let ease_score = 3;

  const easyIndicators = ['simple', 'easy', 'intuitive', 'quick', 'no-code', 'drag-and-drop', 'beginner'];
  const complexIndicators = ['enterprise', 'advanced', 'complex', 'technical', 'requires setup'];

  if (easyIndicators.some(word => description.includes(word))) {
    ease_score = 4;
  }
  if (complexIndicators.some(word => description.includes(word))) {
    ease_score = 2;
  }

  // Boost for well-known tools
  const popularTools = ['github', 'figma', 'notion', 'slack', 'stripe', 'vercel', 'netlify'];
  if (popularTools.some(name => tool.tool_name.toLowerCase().includes(name))) {
    ease_score = Math.min(5, ease_score + 1);
  }

  // Calculate features_score based on feature count and description
  let features_score = 3;
  if (features >= 6) {
    features_score = 5;
  } else if (features >= 4) {
    features_score = 4;
  } else if (features >= 2) {
    features_score = 3;
  } else {
    features_score = 2;
  }

  // Calculate techiespiral_score (composite)
  let techiespiral_score = 50;

  // Adjust based on value
  techiespiral_score += (value_score - 3) * 10;

  // Adjust based on ease
  techiespiral_score += (ease_score - 3) * 5;

  // Adjust based on features
  techiespiral_score += (features_score - 3) * 8;

  // Boost for popular categories
  const popularCategories = ['Developer Tools', 'Design Tools', 'Analytics', 'Hosting', 'Payment Processing'];
  if (popularCategories.includes(category)) {
    techiespiral_score += 10;
  }

  // Boost for well-known tools
  if (popularTools.some(name => tool.tool_name.toLowerCase().includes(name))) {
    techiespiral_score += 15;
  }

  // Clamp between 40 and 95 (realistic range)
  techiespiral_score = Math.max(40, Math.min(95, techiespiral_score));

  // Find alternatives in same category
  const sameCategory = categoryMap[category] || [];
  const alternatives = sameCategory
    .filter(t => t.Id !== tool.Id)
    .slice(0, 5)
    .map(t => t.Id)
    .join(',');

  return {
    ...tool,
    techiespiral_score,
    value_score,
    ease_score,
    features_score,
    alternatives,
    enriched_at: new Date().toISOString()
  };
}

async function enrichAllTools() {
  console.log('📊 Local Tool Enrichment Starting...\n');

  // Load tools
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  console.log(`Loaded ${tools.length} tools from tools.json`);

  // Group by category for alternatives
  const categoryMap = {};
  tools.forEach(tool => {
    if (!categoryMap[tool.category]) {
      categoryMap[tool.category] = [];
    }
    categoryMap[tool.category].push(tool);
  });

  // Count tools needing enrichment
  const needsEnrichment = tools.filter(t => !t.techiespiral_score).length;
  console.log(`Found ${needsEnrichment} tools without scores\n`);

  if (needsEnrichment === 0) {
    console.log('✅ All tools already enriched!');
    return;
  }

  console.log('🤖 Enriching tools locally...\n');

  // Enrich all tools
  const enrichedTools = tools.map((tool, index) => {
    const enriched = enrichTool(tool, tools, categoryMap);
    if (!tool.techiespiral_score && enriched.techiespiral_score) {
      console.log(`  [${index + 1}/${tools.length}] ${tool.tool_name} - TechieSpiral Score: ${enriched.techiespiral_score}/100`);
    }
    return enriched;
  });

  // Backup original
  const backupPath = TOOLS_PATH.replace('.json', `.backup.${Date.now()}.json`);
  writeFileSync(backupPath, JSON.stringify(tools, null, 2));
  console.log(`\n📦 Backup saved to: ${backupPath}`);

  // Write enriched data
  writeFileSync(TOOLS_PATH, JSON.stringify(enrichedTools, null, 2));
  console.log(`💾 Updated tools.json with enriched data`);

  // Calculate stats
  const newlyEnriched = enrichedTools.filter(t => t.techiespiral_score && !tools.find(old => old.Id === t.Id)?.techiespiral_score);
  const avgScores = {
    scout: Math.round(newlyEnriched.reduce((sum, t) => sum + t.techiespiral_score, 0) / newlyEnriched.length),
    value: (newlyEnriched.reduce((sum, t) => sum + t.value_score, 0) / newlyEnriched.length).toFixed(1),
    ease: (newlyEnriched.reduce((sum, t) => sum + t.ease_score, 0) / newlyEnriched.length).toFixed(1),
    features: (newlyEnriched.reduce((sum, t) => sum + t.features_score, 0) / newlyEnriched.length).toFixed(1),
  };

  console.log('\n📈 Enrichment Statistics:');
  console.log(`   Tools Enriched: ${newlyEnriched.length}`);
  console.log(`   Average TechieSpiral Score: ${avgScores.scout}/100`);
  console.log(`   Average Value Score: ${avgScores.value}/5`);
  console.log(`   Average Ease Score: ${avgScores.ease}/5`);
  console.log(`   Average Features Score: ${avgScores.features}/5`);
  console.log('\n✅ Enrichment complete!');
}

enrichAllTools().catch(console.error);
