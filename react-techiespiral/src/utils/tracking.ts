// Tracking utility for sponsored tools
export interface ToolClickEvent {
  toolId: number;
  toolName: string;
  featured?: boolean;
  sponsoredTier?: string;
  timestamp: string;
  clickType: 'visit_site' | 'learn_more';
}

export const trackToolClick = (event: Omit<ToolClickEvent, 'timestamp'>): void => {
  const trackingEvent: ToolClickEvent = {
    ...event,
    timestamp: new Date().toISOString()
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Tool Click Tracked:', trackingEvent);
  }

  // Store in localStorage for basic tracking
  const existingData = localStorage.getItem('techiespiral_clicks');
  const clicks: ToolClickEvent[] = existingData ? JSON.parse(existingData) : [];
  clicks.push(trackingEvent);

  // Keep only last 1000 clicks
  const recentClicks = clicks.slice(-1000);
  localStorage.setItem('techiespiral_clicks', JSON.stringify(recentClicks));

  // Send to analytics endpoint (implement this when ready)
  if (event.featured || event.sponsoredTier) {
    sendToAnalytics(trackingEvent);
  }
};

const sendToAnalytics = async (event: ToolClickEvent): Promise<void> => {
  try {
    // TODO: Replace with your actual analytics endpoint
    // Example: await fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });

    // For now, just log to console
    console.log('Would send to analytics:', event);
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Get click statistics (useful for sponsor reporting)
export const getClickStats = (): {
  totalClicks: number;
  sponsoredClicks: number;
  featuredClicks: number;
  clicksByTool: Record<number, number>;
} => {
  const existingData = localStorage.getItem('techiespiral_clicks');
  const clicks: ToolClickEvent[] = existingData ? JSON.parse(existingData) : [];

  const stats = {
    totalClicks: clicks.length,
    sponsoredClicks: clicks.filter(c => c.sponsoredTier).length,
    featuredClicks: clicks.filter(c => c.featured).length,
    clicksByTool: clicks.reduce((acc, click) => {
      acc[click.toolId] = (acc[click.toolId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>)
  };

  return stats;
};

// Track tool impressions (views)
export const trackToolImpression = (toolId: number, featured?: boolean, sponsoredTier?: string): void => {
  const impressionEvent = {
    toolId,
    featured,
    sponsoredTier,
    timestamp: new Date().toISOString(),
    type: 'impression' as const
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('Tool Impression:', impressionEvent);
  }

  // Store impressions separately
  const existingData = localStorage.getItem('techiespiral_impressions');
  const impressions = existingData ? JSON.parse(existingData) : [];
  impressions.push(impressionEvent);

  // Keep only last 5000 impressions
  const recentImpressions = impressions.slice(-5000);
  localStorage.setItem('techiespiral_impressions', JSON.stringify(recentImpressions));
};
