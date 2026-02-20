import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ClaudeClient } from './lib/claude-client.js';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOOLS_PATH = join(__dirname, '../src/data/tools.json');
const PROMPT_PATH = join(__dirname, './templates/newsletter-prompt.txt');
const OUTPUT_PATH = join(__dirname, '../newsletter-output');

async function generateNewsletter() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('📧 Newsletter Generation Starting...\n');

  // Load data
  const tools = JSON.parse(readFileSync(TOOLS_PATH, 'utf-8'));
  const promptTemplate = readFileSync(PROMPT_PATH, 'utf-8');

  // Get new tools (added in last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newTools = tools
    .filter(t => t.created_at && new Date(t.created_at) > oneWeekAgo)
    .slice(0, 5)
    .map(t => ({
      name: t.tool_name,
      description: t.description,
      price: t.price_range,
      category: t.category,
      best_for: t.best_for
    }));

  // Get featured tools
  const featuredTools = tools
    .filter(t => t.featured)
    .slice(0, 3)
    .map(t => ({
      name: t.tool_name,
      description: t.description,
      price: t.price_range,
      tier: t.sponsored_tier
    }));

  // Get top rated tools as "popular"
  const popularTools = tools
    .filter(t => t.techiespiral_score)
    .sort((a, b) => (b.techiespiral_score || 0) - (a.techiespiral_score || 0))
    .slice(0, 3)
    .map(t => ({
      name: t.tool_name,
      category: t.category,
      score: t.techiespiral_score
    }));

  // Build stats
  const stats = {
    totalTools: tools.length,
    newThisMonth: tools.filter(t => {
      if (!t.created_at) return false;
      const created = new Date(t.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length,
    categories: [...new Set(tools.map(t => t.category))].length
  };

  // Format data for prompt
  const newToolsFormatted = newTools.length > 0
    ? newTools.map(t => `- ${t.name}: ${t.description} | ${t.price} | ${t.best_for}`).join('\n')
    : 'No new tools this week (use existing popular tools instead)';

  const featuredToolsFormatted = featuredTools.length > 0
    ? featuredTools.map(t => `- ${t.name} (${t.tier || 'featured'}): ${t.description} | ${t.price}`).join('\n')
    : 'No featured tools this week';

  const popularComparisons = `- Hosting: Railway vs Render vs Fly.io (trending)
- Payments: Stripe vs Lemon Squeezy (high engagement)
- AI Tools: Cursor vs GitHub Copilot (most searched)`;

  const statsFormatted = `- ${stats.totalTools} total tools
- ${stats.newThisMonth} new tools this month
- ${stats.categories} categories
- Developer Tools is the most searched category`;

  const prompt = promptTemplate
    .replace('{new_tools}', newToolsFormatted)
    .replace('{popular_comparisons}', popularComparisons)
    .replace('{featured_tools}', featuredToolsFormatted)
    .replace('{stats}', statsFormatted);

  console.log('🤖 Generating newsletter content with Claude...\n');

  const claude = new ClaudeClient(apiKey);
  const newsletterMarkdown = await claude.generateContent(prompt, {
    maxTokens: 2048,
    temperature: 0.8
  });

  if (!newsletterMarkdown || newsletterMarkdown.trim().length < 100) {
    throw new Error(`Generated newsletter content is too short or empty (got ${newsletterMarkdown?.length ?? 0} chars)`);
  }

  console.log('✅ Newsletter content generated!\n');

  // Generate HTML version using marked
  const newsletterHtml = marked.parse(newsletterMarkdown);

  // Wrap in newsletter template
  const htmlTemplate = createHtmlTemplate(newsletterHtml);

  // Generate subject line
  const subjectPrompt = `Based on this newsletter content, write a compelling subject line (max 60 characters) that will get indie hackers to open it. Be specific and intriguing, not generic.

Newsletter content:
${newsletterMarkdown}

Return ONLY the subject line, nothing else.`;

  console.log('🤖 Generating subject line...\n');
  const subject = await claude.generateContent(subjectPrompt, {
    maxTokens: 100,
    temperature: 0.9
  });

  const subjectLine = subject.trim().replace(/^["']|["']$/g, '');

  if (!subjectLine || subjectLine.length < 5) {
    throw new Error(`Generated subject line is too short or empty (got: "${subjectLine}")`);
  }

  console.log(`📧 Subject: ${subjectLine}\n`);

  // Save output
  const timestamp = new Date().toISOString().split('T')[0];
  const outputDir = OUTPUT_PATH;

  // Create output directory if it doesn't exist
  try {
    await import('fs').then(fs => {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
    });
  } catch (e) {
    // Directory might already exist
  }

  const output = {
    subject: subjectLine,
    markdown: newsletterMarkdown,
    html: htmlTemplate,
    generatedAt: new Date().toISOString(),
    stats: {
      newTools: newTools.length,
      featuredTools: featuredTools.length,
      totalTools: stats.totalTools
    }
  };

  writeFileSync(
    join(outputDir, `newsletter-${timestamp}.json`),
    JSON.stringify(output, null, 2)
  );

  writeFileSync(
    join(outputDir, `newsletter-${timestamp}.html`),
    htmlTemplate
  );

  writeFileSync(
    join(outputDir, `newsletter-${timestamp}.md`),
    newsletterMarkdown
  );

  console.log('✅ Newsletter saved to newsletter-output/\n');
  console.log(`Files created:`);
  console.log(`  - newsletter-${timestamp}.json (full output)`);
  console.log(`  - newsletter-${timestamp}.html (ready for Listmonk)`);
  console.log(`  - newsletter-${timestamp}.md (markdown source)`);
  console.log('\n📊 Stats:');
  console.log(`  - New tools featured: ${newTools.length}`);
  console.log(`  - Featured tools: ${featuredTools.length}`);
  console.log(`  - Total tools in database: ${stats.totalTools}`);

  return output;
}

function createHtmlTemplate(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechieSpiral Newsletter</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #000;
      font-size: 28px;
      margin-bottom: 24px;
      border-bottom: 3px solid #FFD700;
      padding-bottom: 12px;
    }
    h2 {
      color: #000;
      font-size: 20px;
      margin-top: 32px;
      margin-bottom: 16px;
    }
    p {
      margin-bottom: 16px;
      color: #555;
    }
    ul {
      margin-bottom: 20px;
      padding-left: 20px;
    }
    li {
      margin-bottom: 12px;
      color: #555;
    }
    strong {
      color: #000;
    }
    a {
      color: #6B46C1;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #888;
      text-align: center;
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #6B46C1;
      margin-bottom: 8px;
    }
    .tagline {
      color: #888;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">TechieSpiral</div>
      <div class="tagline">Tech Stack Advisor for Indie Hackers</div>
    </div>

    ${content}

    <div class="footer">
      <p>
        <a href="https://techiespiral.com">Visit TechieSpiral</a> |
        <a href="https://techiespiral.com/sponsorship">Sponsor Us</a> |
        <a href="{{ UnsubscribeURL }}">Unsubscribe</a>
      </p>
      <p style="font-size: 12px; color: #aaa;">
        You're receiving this because you subscribed to TechieSpiral updates.
      </p>
    </div>
  </div>
</body>
</html>`;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateNewsletter().catch(error => {
    console.error('❌ Error generating newsletter:', error);
    process.exit(1);
  });
}

export { generateNewsletter };
