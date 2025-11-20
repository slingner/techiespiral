import { TechStack } from '../types/Tool';
import stacksData from '../data/stacks.json';

export const stacksApi = {
  async fetchAllStacks(): Promise<TechStack[]> {
    // Return data directly from local JSON file
    return Promise.resolve(stacksData as TechStack[]);
  },

  async fetchStackById(id: number): Promise<TechStack | null> {
    const stack = stacksData.find(stack => stack.id === id);
    return Promise.resolve(stack as TechStack || null);
  }
};
