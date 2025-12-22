import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ClaudeClient } from './lib/claude-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');
const QUEUE_PATH = join(__dirname, '../src/data/content-queue.json');

async function generateComparisonIdeas() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('💡 Generating Comparison Article Ideas...\n');

  // Load data
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'));

  // Find recently discovered tools (within last 60 days)
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recentTools = tools.filter(t => {
    if (!t.discovered_at) return false;
    return new Date(t.discovered_at) > sixtyDaysAgo;
  });

  if (recentTools.length === 0) {
    console.log('No recently discovered tools found');
    return;
  }

  console.log(`Found ${recentTools.length} recently discovered tools`);

  // Generate comparison ideas
  const claude = new ClaudeClient(apiKey);

  const prompt = `You are a content strategist for a tech tools website targeting indie hackers.

Generate 3-5 comparison article ideas that include these recently discovered tools:

RECENTLY DISCOVERED TOOLS:
${recentTools.map(t => `- ${t.tool_name} (${t.category}) - ${t.description}`).join('\n')}

EXISTING POPULAR TOOLS FOR CONTEXT:
${tools.filter(t => t.techiespiral_score > 80).slice(0, 20).map(t => `- ${t.tool_name} (${t.category})`).join('\n')}

GUIDELINES:
1. Compare new tools against established competitors
2. Focus on comparisons indie hackers would search for
3. Use SEO-friendly titles
4. Mix new tools with established tools
5. Target high-intent commercial keywords

For each idea, provide:
{
  "title": "SEO-friendly comparison title ending with 'for Indie Hackers' or '2025'",
  "keywords": "Comma-separated target keywords",
  "category": "Primary category",
  "toolNames": ["Tool A", "Tool B", "Tool C"],
  "priority": 2,
  "status": "pending"
}

Respond with ONLY valid JSON array:
`;

  try {
    const ideas = await claude.generateJSON(prompt, {
      maxTokens: 2000,
      temperature: 0.8
    });

    if (!Array.isArray(ideas) || ideas.length === 0) {
      console.log('No ideas generated');
      return;
    }

    console.log(`\n✅ Generated ${ideas.length} new comparison ideas:`);
    ideas.forEach((idea, i) => {
      console.log(`${i + 1}. ${idea.title}`);
    });

    // Add to queue (avoid duplicates)
    const existingTitles = queue.queue.map(q => q.title.toLowerCase());
    const newIdeas = ideas.filter(idea =>
      !existingTitles.includes(idea.title.toLowerCase())
    );

    if (newIdeas.length === 0) {
      console.log('\n⚠️  All ideas already in queue');
      return;
    }

    queue.queue.push(...newIdeas);
    queue.metadata.lastUpdated = new Date().toISOString();

    writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));
    console.log(`\n💾 Added ${newIdeas.length} new ideas to content queue`);
    console.log(`   Total queued: ${queue.queue.filter(q => q.status === 'pending').length}`);

  } catch (error) {
    console.error('Failed to generate ideas:', error);
    process.exit(1);
  }
}

generateComparisonIdeas();
