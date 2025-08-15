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
}

export interface ToolsResponse {
  list: Tool[];
  pageInfo?: {
    isLastPage: boolean;
  };
}