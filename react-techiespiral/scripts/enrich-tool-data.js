import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ToolEnricher } from './lib/tool-enricher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');

async function enrichTools() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  // Read command line arguments
  const args = process.argv.slice(2);
  const newOnly = args.includes('--new-only');

  console.log('📊 Tool Enrichment Script Starting...\n');

  // Load tools
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  console.log(`Loaded ${tools.length} tools from tools.json`);

  // Filter tools to enrich
  let toolsToEnrich;
  if (newOnly) {
    toolsToEnrich = tools.filter(t => !t.techiespiral_score && !t.enriched_at);
    console.log(`Found ${toolsToEnrich.length} new tools without scores`);
  } else {
    toolsToEnrich = tools.filter(t => !t.techiespiral_score);
    console.log(`Found ${toolsToEnrich.length} tools without scores`);
  }

  if (toolsToEnrich.length === 0) {
    console.log('✅ No tools need enrichment!');
    return;
  }

  // Confirm before proceeding with batch
  if (toolsToEnrich.length > 10) {
    console.log(`\n⚠️  About to enrich ${toolsToEnrich.length} tools`);
    console.log(`Estimated cost: $${(toolsToEnrich.length * 0.03).toFixed(2)}`);
    console.log(`Estimated time: ${Math.ceil(toolsToEnrich.length / 3)} minutes\n`);
  }

  // Create enricher and process
  const enricher = new ToolEnricher(apiKey);

  try {
    console.log('\n🤖 Starting enrichment with Claude...\n');

    const enrichedTools = await enricher.enrichBatch(toolsToEnrich, tools, {
      maxConcurrent: 3,
      delayMs: 1000
    });

    console.log(`\n✅ Successfully enriched ${enrichedTools.length} tools`);

    // Update tools array
    const toolsMap = new Map(tools.map(t => [t.Id, t]));
    enrichedTools.forEach(et => {
      toolsMap.set(et.Id, et);
    });
    const updatedTools = Array.from(toolsMap.values());

    // Backup original file
    const backupPath = TOOLS_PATH.replace('.json', `.backup.${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(tools, null, 2));
    console.log(`📦 Backup saved to: ${backupPath}`);

    // Write updated tools
    writeFileSync(TOOLS_PATH, JSON.stringify(updatedTools, null, 2));
    console.log(`💾 Updated tools.json with enriched data`);

    // Stats
    const avgScores = {
      scout: Math.round(enrichedTools.reduce((sum, t) => sum + t.techiespiral_score, 0) / enrichedTools.length),
      value: (enrichedTools.reduce((sum, t) => sum + t.value_score, 0) / enrichedTools.length).toFixed(1),
      ease: (enrichedTools.reduce((sum, t) => sum + t.ease_score, 0) / enrichedTools.length).toFixed(1),
      features: (enrichedTools.reduce((sum, t) => sum + t.features_score, 0) / enrichedTools.length).toFixed(1),
    };

    console.log('\n📈 Enrichment Statistics:');
    console.log(`   Average TechieSpiral Score: ${avgScores.scout}/100`);
    console.log(`   Average Value Score: ${avgScores.value}/5`);
    console.log(`   Average Ease Score: ${avgScores.ease}/5`);
    console.log(`   Average Features Score: ${avgScores.features}/5`);

  } catch (error) {
    console.error('\n❌ Enrichment failed:', error);
    process.exit(1);
  }
}

enrichTools();
