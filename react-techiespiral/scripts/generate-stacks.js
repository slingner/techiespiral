import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ClaudeClient } from './lib/claude-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');
const STACKS_PATH = join(__dirname, '../src/data/stacks.json');
const QUEUE_PATH = join(__dirname, '../src/data/stack-queue.json');
const PROMPT_PATH = join(__dirname, './templates/stack-prompt.txt');

async function generateStacks() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🎯 Stack Generation Starting...\n');

  // Load data
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  const stacks = JSON.parse(readFileSync(STACKS_PATH, 'utf-8'));
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'));
  const promptTemplate = readFileSync(PROMPT_PATH, 'utf-8');

  // Get next 2 pending stacks from queue
  const pendingStacks = queue.queue.filter(s => s.status === 'pending');

  if (pendingStacks.length === 0) {
    console.log('✅ No pending stacks in queue!');
    return;
  }

  const stacksToGenerate = pendingStacks.slice(0, 2);
  console.log(`Found ${stacksToGenerate.length} stacks to generate:\n`);
  stacksToGenerate.forEach((s, i) => {
    console.log(`${i + 1}. ${s.stack_name}`);
  });
  console.log('');

  const claude = new ClaudeClient(apiKey);
  const generatedStacks = [];

  for (const queueItem of stacksToGenerate) {
    try {
      console.log(`\n🤖 Generating: ${queueItem.stack_name}...`);

      // Build prompt with all tools data
      const toolsDataFormatted = tools.map((tool, index) => `
ID: ${tool.Id}
Name: ${tool.tool_name}
Category: ${tool.category}
Price: ${tool.price_range}
Description: ${tool.description}
TechieSpiral Score: ${tool.techiespiral_score || 'Not rated'}/100
Best For: ${tool.best_for || 'General use'}
`).join('\n---\n');

      const prompt = promptTemplate
        .replace('{stack_name}', queueItem.stack_name)
        .replace('{tagline}', queueItem.tagline)
        .replace('{target_audience}', queueItem.target_audience)
        .replace('{focus}', queueItem.focus)
        .replace('{estimated_cost}', queueItem.estimated_cost)
        .replace('{badge}', queueItem.badge)
        .replace('{tools_data}', toolsDataFormatted);

      // Generate stack
      const response = await claude.generateContent(prompt, {
        maxTokens: 2048,
        temperature: 0.7
      });

      // Parse JSON response
      let stackData;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/```\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : response;
        stackData = JSON.parse(jsonString.trim());
      } catch (parseError) {
        console.log(`⚠️  Failed to parse JSON for ${queueItem.stack_name}, skipping...`);
        console.log('Response:', response.substring(0, 200));
        continue;
      }

      // Validate stack data
      if (!stackData.tool_ids || stackData.tool_ids.length < 5) {
        console.log(`⚠️  Invalid stack data for ${queueItem.stack_name}, skipping...`);
        continue;
      }

      // Assign new ID
      const newId = stacks.length > 0 ? Math.max(...stacks.map(s => s.id)) + 1 : 1;
      stackData.id = newId;
      stackData.view_count = 0;
      stackData.status = 'published';

      console.log(`   ✅ Generated stack with ${stackData.tool_ids.length} tools`);
      console.log(`   💰 Estimated cost: ${stackData.total_monthly_cost}`);

      // Add to stacks array
      stacks.push(stackData);
      generatedStacks.push(stackData);

      // Mark as generated in queue
      const queueIndex = queue.queue.findIndex(s => s.stack_name === queueItem.stack_name);
      queue.queue[queueIndex].status = 'generated';
      queue.queue[queueIndex].generatedDate = new Date().toISOString().split('T')[0];

      // Move to generated list
      queue.generated.push(queue.queue[queueIndex]);

      // Small delay between generations
      if (stacksToGenerate.indexOf(queueItem) < stacksToGenerate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Failed to generate ${queueItem.stack_name}:`, error.message);
    }
  }

  // Update queue metadata
  queue.metadata.lastUpdated = new Date().toISOString();
  queue.metadata.totalGenerated = queue.generated.length;

  // Save updates
  writeFileSync(STACKS_PATH, JSON.stringify(stacks, null, 2));
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));

  console.log(`\n✅ Stack generation complete!`);
  console.log(`   Stacks generated: ${generatedStacks.length}`);
  console.log(`   Total stacks: ${stacks.length}`);
  console.log(`   Remaining in queue: ${queue.queue.filter(s => s.status === 'pending').length}`);
}

generateStacks();
