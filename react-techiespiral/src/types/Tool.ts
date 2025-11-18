export interface Tool {
  Id: number;
  tool_name: string;
  slug?: string; // URL-friendly slug (e.g., "notion", "github")
  category: string;
  description?: string;
  long_description?: string;
  price_range: string;
  website_url: string;
  affiliate_link?: string;
  logo_url?: string;
  features?: string;
  pros_cons?: string;
  use_cases?: string;
  best_for?: string;
  // Scout Score (our custom rating system)
  scout_score?: number; // 0-100
  value_score?: number; // 0-5
  ease_score?: number; // 0-5
  features_score?: number; // 0-5
  // Additional metadata
  pricing_tiers?: string; // JSON string of pricing tiers
  alternatives?: string; // Comma-separated tool IDs
  created_at?: string;
  updated_at?: string;
  view_count?: number;
  click_count?: number;
}

// Helper function to generate slug from tool name
export const generateSlug = (toolName: string): string => {
  return toolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Tech Stack interface - curated collections of tools
export interface TechStack {
  id: number;
  stack_name: string;
  tagline: string;
  description: string;
  category: string;
  target_audience: string; // e.g., "Indie Hackers", "Solo Developers"
  tool_ids: number[]; // Array of tool IDs in this stack
  total_monthly_cost: string; // e.g., "$50-100/month"
  total_annual_cost?: string;
  logo_url?: string;
  badge?: string; // e.g., "Popular", "Budget-Friendly", "All-in-One"
  created_at?: string;
  view_count?: number;
}

// Pricing tier structure
export interface PricingTier {
  name: string;
  price: string;
  billing: string; // "monthly" | "annually" | "one-time"
  features: string[];
  recommended?: boolean;
}

// Featured comparison for SEO
export interface FeaturedComparison {
  id: string;
  tool1_id: number;
  tool2_id: number;
  tool1_slug: string;
  tool2_slug: string;
  title: string; // e.g., "Notion vs Asana: Which is Better in 2025?"
  meta_description: string;
  summary: string;
  winner?: string; // "tool1" | "tool2" | "tie"
  use_case_recommendations: string;
  faqs: ComparisonFAQ[];
  popular_searches?: string[]; // e.g., ["notion vs asana", "asana notion comparison"]
  created_at?: string;
  updated_at?: string;
}

export interface ComparisonFAQ {
  question: string;
  answer: string;
}

export interface ToolsResponse {
  list: Tool[];
  pageInfo?: {
    isLastPage: boolean;
  };
}