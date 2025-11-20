import { Tool } from '../types/Tool';
import toolsData from '../data/tools.json';

export const toolsApi = {
  async fetchAllTools(): Promise<Tool[]> {
    // Return data directly from local JSON file
    return Promise.resolve(toolsData as Tool[]);
  },

  async fetchToolById(id: number): Promise<Tool | null> {
    const tool = toolsData.find(tool => tool.Id === id);
    return Promise.resolve(tool as Tool || null);
  }
};