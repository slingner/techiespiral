# TechieSpiral 🚀

**Tech Stack Advisor for Indie Hackers**

TechieSpiral is a comprehensive tech tools discovery platform that helps indie hackers, developers, and startup founders find, compare, and choose the right tools for their projects. Featuring curated tech stacks, detailed tool comparisons, and Scout Scores to help you make informed decisions.

## 🌟 Features

- **Tool Discovery**: Browse and search through 100+ developer tools
- **Tech Stacks**: Curated tech stack recommendations for different use cases
- **Tool Comparisons**: SEO-optimized, comprehensive comparison articles (GitHub vs GitLab, Notion vs Obsidian, etc.)
- **Scout Score System**: Rating system evaluating tools on value, ease of use, and features (0-100 scale)
- **Smart Compare Tool**: Searchable side-by-side tool comparison with autocomplete
- **Alternatives**: Find similar tools and alternatives
- **Newsletter**: Stay updated with new tools and stacks

## 🛠 Tech Stack

### Frontend
- **React 19.1.1** - UI framework
- **TypeScript** - Type safety
- **Vite 7.1.2** - Build tool & dev server
- **Chakra UI 2.10.9** - Component library
- **React Router DOM 7.8.0** - Client-side routing

### Backend
- **Netlify Functions** - Serverless API endpoints
- **NocoDB** - Headless database/API layer

### Deployment
- **Netlify** - Hosting & continuous deployment

## 🏗 Architecture & Deployment

### How Deployment Works

The site is deployed on **Netlify** with automatic deployments:

1. **Push to Git** → Netlify detects changes
2. **Build Process** → Runs `npm install && npm run build` in the `react-techiespiral` directory
3. **Deploy** → Publishes the `dist` folder to Netlify CDN
4. **Netlify Functions** → Serverless functions are deployed from `netlify/functions/`

### Configuration

The deployment is configured in `/netlify.toml`:

```toml
[build]
  base = "react-techiespiral"
  command = "npm install && npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

### Netlify Functions

Serverless functions handle backend API calls to NocoDB:

- **Location**: `react-techiespiral/netlify/functions/tools.js`
- **Purpose**: Fetch tools data from NocoDB API
- **Features**: CORS handling, pagination, error handling
- **Triggers**: Called via `/api/tools` endpoint

### Environment Variables

Set these in your **Netlify Dashboard** → Site Settings → Environment Variables:

```bash
NOCODB_API_URL=https://app.nocodb.com
NOCODB_PROJECT_ID=p_xxxxx
NOCODB_API_TOKEN=your_token_here
```

For local development, copy `.env` and add your NocoDB credentials (never commit secrets!).

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd techiespiral/react-techiespiral
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env .env.local
   # Edit .env.local with your NocoDB credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
react-techiespiral/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Layout.tsx       # Main layout with navigation
│   │   ├── ToolCard.tsx     # Tool display card
│   │   ├── SearchableSelect.tsx  # Autocomplete search dropdown
│   │   ├── ComparisonSEO.tsx     # SEO meta tags & JSON-LD
│   │   └── Breadcrumbs.tsx       # Navigation breadcrumbs
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── ToolDetailPage.tsx    # Individual tool details
│   │   ├── StacksPage.tsx        # Tech stacks directory
│   │   ├── StackDetailPage.tsx   # Stack details
│   │   ├── ComparePage.tsx       # Interactive comparison tool
│   │   ├── ComparisonsListPage.tsx    # Browse comparisons
│   │   └── ComparisonDetailPage.tsx   # Comparison article
│   ├── context/             # React Context for state
│   │   ├── ToolsContext.tsx      # Tools data provider
│   │   └── StacksContext.tsx     # Stacks data provider
│   ├── services/            # API & data services
│   │   ├── api.ts           # NocoDB API client
│   │   ├── stacksApi.ts     # Tech stacks data
│   │   └── comparisonsApi.ts     # Comparison articles (20+ comparisons)
│   ├── types/               # TypeScript interfaces
│   │   └── Tool.ts          # Tool, Stack, Comparison types
│   ├── App.tsx              # Main app component & routes
│   └── main.tsx             # Entry point
├── netlify/
│   └── functions/
│       └── tools.js         # Serverless function for NocoDB
├── netlify.toml             # Netlify configuration
├── package.json             # Dependencies & scripts
├── vite.config.ts           # Vite configuration
└── tsconfig.json            # TypeScript configuration
```

## 📊 Data Models

### Tool
```typescript
interface Tool {
  id: number;
  tool_name: string;
  slug: string;              // URL-friendly name
  description: string;
  category: string;
  website_url: string;
  logo_url: string;
  scout_score?: number;      // 0-100 rating
  value_score?: number;      // 0-5
  ease_score?: number;       // 0-5
  features_score?: number;   // 0-5
  pricing_tiers?: string;
  alternatives?: string;
}
```

### FeaturedComparison
```typescript
interface FeaturedComparison {
  id: string;
  tool1_id: number;
  tool2_id: number;
  tool1_slug: string;
  tool2_slug: string;
  title: string;             // SEO-optimized title
  meta_description: string;  // Meta description
  summary: string;           // 600+ word comparison
  winner?: string;           // 'tool1' | 'tool2' | 'tie'
  use_case_recommendations: string;
  faqs: ComparisonFAQ[];     // 4+ FAQs for rich snippets
  popular_searches?: string[];
}
```

## 🔍 SEO Optimization

### Structured Data (JSON-LD)
- **FAQPage schema** for comparison FAQs → Rich snippets in Google
- **Article schema** for comparison articles
- **BreadcrumbList schema** for navigation

### Meta Tags
- Dynamic `title` and `meta description` per page
- Open Graph tags for social sharing
- Canonical URLs for comparison pages

### URLs
- Clean, descriptive URLs: `/comparisons/github-vs-gitlab`
- Tool pages: `/tool/:id`
- Tech stacks: `/stacks`, `/stack/:id`

## 🚢 Deployment Checklist

When deploying updates:

1. ✅ Make changes in a feature branch
2. ✅ Test locally with `npm run dev`
3. ✅ Build and verify: `npm run build && npm run preview`
4. ✅ Commit and push to GitHub
5. ✅ Netlify auto-deploys (or manually trigger in Netlify dashboard)
6. ✅ Verify deployment at your production URL

### Manual Deployment Trigger

Via Netlify CLI (if installed):
```bash
netlify deploy --prod
```

Or use the Netlify dashboard: **Deploys** → **Trigger deploy** → **Deploy site**

## 🔐 Security Notes

- ⚠️ **Never commit** `.env` files with real credentials
- ✅ Use Netlify environment variables for production secrets
- ✅ NocoDB API token is server-side only (Netlify Functions)
- ✅ CORS is configured in Netlify Functions

## 📈 Performance

- **Build size**: ~653 KB (minified + gzipped: ~208 KB)
- **Note**: Consider code-splitting for chunks >500 KB
- **Optimization**: Using React.memo and useMemo for performance

## 🐛 Troubleshooting

### Build fails on Netlify
- Check environment variables are set in Netlify dashboard
- Verify Node version (set in `package.json` engines or Netlify config)
- Review build logs in Netlify dashboard

### Functions not working
- Verify environment variables: `NOCODB_API_URL`, `NOCODB_PROJECT_ID`, `NOCODB_API_TOKEN`
- Check function logs in Netlify dashboard → Functions
- Test locally with Netlify CLI: `netlify dev`

### Routing issues (404s)
- Verify `netlify.toml` has the redirect rule for React Router
- Check that `publish = "dist"` points to correct build output

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines if applicable]

---

Built with ❤️ for indie hackers
