# Database Migration Guide

## Add Startup Stages Feature

To enable the startup stage filtering feature, you need to add a new column to your NocoDB Tools table.

### Step 1: Add the Column in NocoDB

1. Open your NocoDB instance
2. Navigate to the `Tools` table
3. Add a new column with these settings:
   - **Column Name**: `startup_stages`
   - **Column Type**: MultiSelect (or JSON)
   - **Options** (if using MultiSelect):
     - `validating` - Validating Idea
     - `mvp` - Building MVP
     - `launched` - First Customers
     - `scaling` - Scaling

### Step 2: Populate Existing Tools (Optional)

You can manually tag existing tools with appropriate stages:

**Recommended Mapping:**
- **Validating stage**: Figma, Notion, Google Forms, Typeform, landing page builders
- **MVP stage**: GitHub, Vercel, Railway, Firebase, Supabase, Figma, Notion
- **Launched stage**: GitHub, Stripe, PostHog, Mixpanel, customer support tools, Slack
- **Scaling stage**: DataDog, PagerDuty, Kubernetes, advanced monitoring, Slack

### Step 3: Verify

The frontend already handles tools without `startup_stages` gracefully:
- Tools WITHOUT the field = shown for ALL stages
- Tools WITH the field = only shown for specified stages

This means the feature works immediately, and you can gradually add stage data to tools over time.

### Optional: Bulk Update via API

If you have many tools, you can use the NocoDB API to bulk update:

```javascript
// Example: Mark all Developer Tools as suitable for MVP, Launched, Scaling
const updateTools = async () => {
  const tools = await fetch(`${NOCODB_URL}/api/v1/db/data/noco/${PROJECT_ID}/Tools`);
  const devTools = tools.list.filter(t => t.category === 'Developer Tools');

  for (const tool of devTools) {
    await fetch(`${NOCODB_URL}/api/v1/db/data/noco/${PROJECT_ID}/Tools/${tool.Id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        startup_stages: ['mvp', 'launched', 'scaling']
      })
    });
  }
};
```

## Testing

After adding the column:
1. Load your site
2. Click a startup stage filter button
3. Tools with matching stages should be highlighted
4. Tools without stages will still appear (backwards compatible)
