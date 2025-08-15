import { Tool, ToolsResponse } from '../types/Tool';

const API_BASE_URL = '/.netlify/functions';

export const toolsApi = {
  async fetchAllTools(): Promise<Tool[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tools`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tools: ${response.status}`);
      }
      
      const data: ToolsResponse = await response.json();
      return data.list || [];
    } catch (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }
  },

  async fetchToolById(id: number): Promise<Tool | null> {
    try {
      const tools = await this.fetchAllTools();
      return tools.find(tool => tool.Id === id) || null;
    } catch (error) {
      console.error('Error fetching tool by ID:', error);
      throw error;
    }
  }
};