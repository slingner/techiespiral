import { ClaudeClient } from './claude-client.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ToolEnricher {
  constructor(apiKey) {
    this.claude = new ClaudeClient(apiKey);
    this.enrichmentPrompt = this.loadEnrichmentPrompt();
  }

  loadEnrichmentPrompt() {
    const promptPath = join(__dirname, '../templates/enrichment-prompt.txt');
    return readFileSync(promptPath, 'utf-8');
  }

  async enrichTool(tool, allTools) {
    const prompt = this.buildEnrichmentPrompt(tool, allTools);

    try {
      const result = await this.claude.generateJSON(prompt, {
        temperature: 0.5, // Lower temperature for more consistent scoring
        maxTokens: 1000
      });

      return {
        ...tool,
        scout_score: result.scout_score,
        value_score: result.value_score,
        ease_score: result.ease_score,
        features_score: result.features_score,
        alternatives: result.alternatives.join(','),
        enriched_at: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Failed to enrich tool ${tool.tool_name}:`, error.message);
      return null;
    }
  }

  buildEnrichmentPrompt(tool, allTools) {
    // Get tools in same category for context
    const sameCategory = allTools
      .filter(t => t.category === tool.category && t.Id !== tool.Id)
      .slice(0, 10);

    const categoryToolsList = sameCategory
      .map(t => `- ID ${t.Id}: ${t.tool_name} (${t.price_range})`)
      .join('\n');

    return this.enrichmentPrompt
      .replace('{tool_name}', tool.tool_name)
      .replace('{category}', tool.category)
      .replace('{description}', tool.description || 'No description available')
      .replace('{long_description}', tool.long_description || tool.description || 'No detailed description')
      .replace('{price_range}', tool.price_range)
      .replace('{features}', tool.features || 'Features not listed')
      .replace('{best_for}', tool.best_for || 'General use')
      .replace('{category_tools_list}', categoryToolsList || 'No similar tools found');
  }

  async enrichBatch(tools, allTools, options = {}) {
    const { maxConcurrent = 3, delayMs = 1000 } = options;
    const results = [];

    console.log(`Enriching ${tools.length} tools...`);

    for (let i = 0; i < tools.length; i += maxConcurrent) {
      const batch = tools.slice(i, i + maxConcurrent);
      const batchResults = await Promise.all(
        batch.map(tool => this.enrichTool(tool, allTools))
      );

      results.push(...batchResults.filter(r => r !== null));

      console.log(`Progress: ${Math.min(i + maxConcurrent, tools.length)}/${tools.length}`);

      // Rate limiting
      if (i + maxConcurrent < tools.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    return results;
  }
}
