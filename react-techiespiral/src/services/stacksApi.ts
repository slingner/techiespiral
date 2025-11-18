import { TechStack } from '../types/Tool';

const API_BASE_URL = '/.netlify/functions';

// Mock stacks data for development
export const mockStacks: TechStack[] = [
  {
    id: 1,
    stack_name: "The Solo Dev Starter Stack",
    tagline: "Everything you need to launch your first SaaS",
    description: "A complete tech stack for solo developers building their first product. From code to deployment to analytics, this stack has you covered without overwhelming complexity.",
    category: "Complete Stack",
    target_audience: "Solo Developers & First-Time Founders",
    tool_ids: [1, 2, 3, 4, 5, 6], // These will map to actual tool IDs
    total_monthly_cost: "$0-50/month",
    total_annual_cost: "$200-500/year",
    badge: "Budget-Friendly",
    view_count: 0,
  },
  {
    id: 2,
    stack_name: "The AI Builder Stack",
    tagline: "Build AI-powered apps in 2025",
    description: "Modern tools for developers building AI features into their products. Includes APIs, vector databases, deployment platforms, and monitoring—everything to ship AI products fast.",
    category: "AI Development",
    target_audience: "AI Developers & ML Engineers",
    tool_ids: [7, 8, 9, 10, 11],
    total_monthly_cost: "$100-200/month",
    total_annual_cost: "$1000-2000/year",
    badge: "Popular",
    view_count: 0,
  },
  {
    id: 3,
    stack_name: "The $100 SaaS Stack",
    tagline: "Ship a profitable SaaS for under $100/month",
    description: "Proven stack used by successful indie hackers. Keep costs low while you validate your idea and grow to your first customers. Scale-friendly but optimized for the bootstrapped journey.",
    category: "SaaS Essentials",
    target_audience: "Bootstrapped Founders",
    tool_ids: [12, 13, 14, 15, 16, 17],
    total_monthly_cost: "$80-100/month",
    total_annual_cost: "$800-1000/year",
    badge: "Most Popular",
    view_count: 0,
  },
  {
    id: 4,
    stack_name: "The Content Creator's Toolkit",
    tagline: "Create, edit, and distribute content like a pro",
    description: "Everything a developer-turned-creator needs. Build your personal brand, share your journey, and grow your audience while building in public.",
    category: "Content & Marketing",
    target_audience: "Developer-Creators & Tech Influencers",
    tool_ids: [18, 19, 20, 21],
    total_monthly_cost: "$20-60/month",
    total_annual_cost: "$200-600/year",
    badge: "Creator-Friendly",
    view_count: 0,
  },
  {
    id: 5,
    stack_name: "The No-Code MVP Stack",
    tagline: "Validate your idea without writing code",
    description: "Perfect for non-technical founders or developers who want to test ideas fast. Build, launch, and validate in days instead of months.",
    category: "No-Code",
    target_audience: "Non-Technical Founders & Rapid Validators",
    tool_ids: [22, 23, 24, 25],
    total_monthly_cost: "$40-80/month",
    total_annual_cost: "$400-800/year",
    badge: "No-Code",
    view_count: 0,
  }
];

export const stacksApi = {
  async fetchAllStacks(): Promise<TechStack[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stacks`);

      if (!response.ok) {
        console.warn('Stacks API not available, using mock data');
        return mockStacks;
      }

      const data = await response.json();
      return data.list || [];
    } catch (error) {
      console.warn('Error fetching stacks, using mock data:', error);
      return mockStacks;
    }
  },

  async fetchStackById(id: number): Promise<TechStack | null> {
    try {
      const stacks = await this.fetchAllStacks();
      return stacks.find(stack => stack.id === id) || null;
    } catch (error) {
      console.error('Error fetching stack by ID:', error);
      throw error;
    }
  }
};
