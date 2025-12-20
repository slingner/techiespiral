import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ClaudeClient } from './lib/claude-client.js';
import { ContentFormatter } from './lib/content-formatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');
const QUEUE_PATH = join(__dirname, '../src/data/content-queue.json');
const INDEX_PATH = join(__dirname, '../src/data/content-index.json');
const CONTENT_DIR = join(__dirname, '../content/comparisons');
const PROMPT_PATH = join(__dirname, './templates/comparison-prompt.txt');

async function generateWeeklyContent() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('📝 Weekly Content Generation Starting...\n');

  // Load data
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  const queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf-8'));
  const index = existsSync(INDEX_PATH)
    ? JSON.parse(readFileSync(INDEX_PATH, 'utf-8'))
    : { articles: [], metadata: { lastUpdated: null, totalArticles: 0 } };
  const promptTemplate = readFileSync(PROMPT_PATH, 'utf-8');

  // Get next 2 pending articles from queue
  const pendingArticles = queue.queue.filter(a => a.status === 'pending');

  if (pendingArticles.length === 0) {
    console.log('✅ No pending articles in queue!');
    return;
  }

  const articlesToGenerate = pendingArticles.slice(0, 2);
  console.log(`Found ${articlesToGenerate.length} articles to generate:\n`);
  articlesToGenerate.forEach((a, i) => {
    console.log(`${i + 1}. ${a.title}`);
  });
  console.log('');

  const claude = new ClaudeClient(apiKey);
  const generatedArticles = [];

  for (const queueItem of articlesToGenerate) {
    try {
      console.log(`\n🤖 Generating: ${queueItem.title}...`);

      // Find tool data
      const toolData = findToolsByNames(tools, queueItem.toolNames);

      if (toolData.length === 0) {
        console.log(`⚠️  Warning: No tools found for ${queueItem.title}, skipping...`);
        continue;
      }

      // Build prompt
      const prompt = buildComparisonPrompt(promptTemplate, queueItem, toolData);

      // Generate content
      const content = await claude.generateContent(prompt, {
        maxTokens: 4096,
        temperature: 0.7
      });

      // Validate
      const validation = ContentFormatter.validateArticle({
        title: queueItem.title,
        content
      });

      if (!validation.valid) {
        console.log(`⚠️  Validation warnings for ${queueItem.title}:`);
        validation.errors.forEach(err => console.log(`   - ${err}`));
      }

      console.log(`   Word count: ${validation.wordCount}`);

      // Format and save
      const slug = ContentFormatter.createSlug(queueItem.title);
      const publishedDate = new Date().toISOString().split('T')[0];

      const description = ContentFormatter.extractDescription(content);

      const frontmatter = ContentFormatter.formatFrontmatter({
        title: queueItem.title,
        description,
        keywords: queueItem.keywords,
        publishedDate,
        category: queueItem.category,
        toolNames: queueItem.toolNames,
        featured: queueItem.priority === 1
      });

      const markdown = ContentFormatter.createMarkdownArticle(
        frontmatter,
        ContentFormatter.sanitizeMarkdown(content)
      );

      // Save file
      const filePath = join(CONTENT_DIR, `${slug}.md`);
      writeFileSync(filePath, markdown);
      console.log(`   ✅ Saved to: ${slug}.md`);

      // Update tracking
      generatedArticles.push({
        slug,
        title: queueItem.title,
        description,
        publishedDate,
        category: queueItem.category,
        toolNames: queueItem.toolNames,
        keywords: queueItem.keywords,
        wordCount: validation.wordCount
      });

      // Mark as generated in queue
      const queueIndex = queue.queue.findIndex(a => a.title === queueItem.title);
      queue.queue[queueIndex].status = 'generated';
      queue.queue[queueIndex].generatedDate = publishedDate;

      // Move to generated list
      queue.generated.push(queue.queue[queueIndex]);

      // Small delay between generations
      if (articlesToGenerate.indexOf(queueItem) < articlesToGenerate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.error(`❌ Failed to generate ${queueItem.title}:`, error.message);
    }
  }

  // Update index
  index.articles.push(...generatedArticles);
  index.articles.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  index.metadata.lastUpdated = new Date().toISOString();
  index.metadata.totalArticles = index.articles.length;

  // Update queue metadata
  queue.metadata.lastUpdated = new Date().toISOString();
  queue.metadata.totalGenerated = queue.generated.length;

  // Save updates
  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2));

  console.log(`\n✅ Generation complete!`);
  console.log(`   Articles generated: ${generatedArticles.length}`);
  console.log(`   Total articles: ${index.metadata.totalArticles}`);
  console.log(`   Remaining in queue: ${queue.queue.filter(a => a.status === 'pending').length}`);
}

function findToolsByNames(tools, toolNames) {
  if (!toolNames || toolNames.length === 0 || toolNames[0] === 'Various') {
    return [];
  }

  return toolNames
    .map(name => {
      const tool = tools.find(t =>
        t.tool_name.toLowerCase() === name.toLowerCase() ||
        t.tool_name.toLowerCase().includes(name.toLowerCase())
      );
      return tool;
    })
    .filter(t => t !== undefined);
}

function buildComparisonPrompt(template, queueItem, toolData) {
  const toolDataFormatted = toolData.map((tool, index) => `
TOOL ${index + 1}: ${tool.tool_name}
Category: ${tool.category}
Price: ${tool.price_range}
Description: ${tool.description}
Long Description: ${tool.long_description || tool.description}
Features: ${tool.features || 'Not specified'}
Pros & Cons: ${tool.pros_cons || 'Not specified'}
Use Cases: ${tool.use_cases || 'Not specified'}
Best For: ${tool.best_for || 'General use'}
Scout Score: ${tool.scout_score || 'Not rated'}/100
Value Score: ${tool.value_score || 'Not rated'}/5
Ease Score: ${tool.ease_score || 'Not rated'}/5
Features Score: ${tool.features_score || 'Not rated'}/5
Website: ${tool.website_url}
`).join('\n---\n');

  return template
    .replace('{title}', queueItem.title)
    .replace('{keywords}', queueItem.keywords)
    .replace('{category}', queueItem.category)
    .replace('{tool_data}', toolDataFormatted)
    .replace('{tool_1_name}', toolData[0]?.tool_name || 'Tool 1')
    .replace('{tool_2_name}', toolData[1]?.tool_name || 'Tool 2')
    .replace('{tool_3_name}', toolData[2]?.tool_name || 'Tool 3');
}

generateWeeklyContent();
