export interface Tool {
  Id: number;
  tool_name: string;
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

export interface ToolsResponse {
  list: Tool[];
  pageInfo?: {
    isLastPage: boolean;
  };
}