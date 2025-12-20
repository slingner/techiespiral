import { ClaudeClient } from './claude-client.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ToolDiscoverer {
  constructor(apiKey) {
    this.claude = new ClaudeClient(apiKey);
    this.discoveryPrompt = this.loadDiscoveryPrompt();
  }

  loadDiscoveryPrompt() {
    const promptPath = join(__dirname, '../templates/discovery-prompt.txt');
    return readFileSync(promptPath, 'utf-8');
  }

  async discoverNewTools(existingTools) {
    const existingNames = existingTools.map(t => t.tool_name).join(', ');

    const prompt = this.discoveryPrompt.replace(
      '{existing_tool_names}',
      existingNames
    );

    console.log('🔍 Researching new tools with Claude...');

    try {
      const newTools = await this.claude.generateJSON(prompt, {
        maxTokens: 4096,
        temperature: 0.8 // Higher temperature for more creativity
      });

      if (!Array.isArray(newTools)) {
        throw new Error('Expected array of tools');
      }

      console.log(`Found ${newTools.length} potential new tools`);

      // Validate and assign IDs
      const maxId = Math.max(...existingTools.map(t => t.Id), 0);
      const validatedTools = newTools
        .map((tool, index) => this.validateAndFormatTool(tool, maxId + index + 1))
        .filter(t => t !== null);

      return validatedTools;
    } catch (error) {
      console.error('Tool discovery failed:', error);
      throw error;
    }
  }

  validateAndFormatTool(tool, id) {
    const required = ['tool_name', 'category', 'description', 'price_range', 'website_url'];
    const missing = required.filter(field => !tool[field]);

    if (missing.length > 0) {
      console.log(`⚠️  Skipping tool (missing fields: ${missing.join(', ')})`);
      return null;
    }

    return {
      Id: id,
      tool_name: tool.tool_name,
      category: tool.category,
      description: tool.description,
      long_description: tool.long_description || tool.description,
      price_range: tool.price_range,
      website_url: tool.website_url,
      affiliate_link: tool.website_url, // Default to website
      logo_url: '', // To be added manually or via API later
      features: tool.features || '',
      pros_cons: tool.pros_cons || '',
      use_cases: tool.use_cases || '',
      best_for: tool.best_for || 'Developers',
      startup_stages: tool.startup_stages || ['mvp', 'launched'],
      alternatives: '', // Will be populated by enrichment
      scout_score: null,
      value_score: null,
      ease_score: null,
      features_score: null,
      discovered_at: new Date().toISOString(),
      why_trending: tool.why_trending || ''
    };
  }
}
