import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ToolDiscoverer } from './lib/tool-discoverer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');

async function discoverNewTools() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🔍 Tool Discovery Script Starting...\n');

  // Load existing tools
  const existingTools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  console.log(`Loaded ${existingTools.length} existing tools`);

  // Discover new tools
  const discoverer = new ToolDiscoverer(apiKey);

  try {
    const newTools = await discoverer.discoverNewTools(existingTools);

    if (newTools.length === 0) {
      console.log('\n⚠️  No new tools discovered');
      return;
    }

    console.log(`\n✅ Discovered ${newTools.length} new tools:`);
    newTools.forEach((tool, i) => {
      console.log(`${i + 1}. ${tool.tool_name} (${tool.category}) - ${tool.price_range}`);
    });

    // Backup original file
    const backupPath = TOOLS_PATH.replace('.json', `.backup.${Date.now()}.json`);
    writeFileSync(backupPath, JSON.stringify(existingTools, null, 2));
    console.log(`\n📦 Backup saved to: ${backupPath}`);

    // Merge and save
    const updatedTools = [...existingTools, ...newTools];
    writeFileSync(TOOLS_PATH, JSON.stringify(updatedTools, null, 2));
    console.log(`💾 Added ${newTools.length} new tools to tools.json`);
    console.log(`   Total tools: ${updatedTools.length}`);

    // Log by category
    const byCategory = {};
    newTools.forEach(tool => {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1;
    });

    console.log('\n📊 New tools by category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

  } catch (error) {
    console.error('\n❌ Discovery failed:', error);
    process.exit(1);
  }
}

discoverNewTools();
