import { Tool } from '../types/Tool';

export interface BudgetRange {
  value: string;
  label: string;
  description: string;
}

export const BUDGET_RANGES: BudgetRange[] = [
  {
    value: 'free',
    label: 'Free Only',
    description: 'Free or open source tools'
  },
  {
    value: 'budget',
    label: 'Budget-Friendly',
    description: 'Under $20/month'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: '$20-$50/month'
  },
  {
    value: 'flexible',
    label: 'Flexible Budget',
    description: 'Any price'
  }
];

/**
 * Categorizes a tool into budget ranges based on its price_range string
 * Returns an array of budget categories this tool matches
 */
export function getToolBudgetCategory(priceRange: string): string[] {
  const lower = priceRange.toLowerCase();
  const categories: string[] = [];

  // All tools match 'flexible' budget
  categories.push('flexible');

  // Check if tool is free
  if (lower.includes('free') || lower.includes('open source')) {
    categories.push('free');
    categories.push('budget'); // Free tools also match budget-friendly
    return categories;
  }

  // Try to extract monthly pricing
  // Matches patterns like: $10/month, $15/mo, $20 per month
  const monthlyMatches = lower.match(/\$(\d+(?:\.\d+)?)\s*(?:\/|per)?\s*(?:month|mo)/g);

  if (monthlyMatches && monthlyMatches.length > 0) {
    // Extract all monthly prices and find the lowest one (usually the starter tier)
    const prices = monthlyMatches.map(match => {
      const priceMatch = match.match(/\$(\d+(?:\.\d+)?)/);
      return priceMatch ? parseFloat(priceMatch[1]) : Infinity;
    });

    const lowestPrice = Math.min(...prices);

    if (lowestPrice < 20) {
      categories.push('budget');
    } else if (lowestPrice <= 50) {
      categories.push('moderate');
    }
  }

  // For transaction-based, usage-based, or complex pricing:
  // Only show in 'flexible' budget (already added above)
  // Examples: "2.9% + 30¢ per transaction", "$0.0001 - $0.12 per 1K tokens"

  return categories;
}

/**
 * Filters tools based on selected budget category
 */
export function filterToolsByBudget(tools: Tool[], budgetCategory: string | null): Tool[] {
  if (!budgetCategory) {
    return tools;
  }

  return tools.filter(tool => {
    const categories = getToolBudgetCategory(tool.price_range);
    return categories.includes(budgetCategory);
  });
}
