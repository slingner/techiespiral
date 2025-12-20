# TechieSpiral Automated Content Generation System

This directory contains the automation scripts that power TechieSpiral's self-sustaining content pipeline using Claude API.

## Overview

The system consists of three main automation workflows:

1. **Weekly Content Generation** - Generates 2 comparison articles every Monday
2. **Monthly Tool Discovery** - Discovers 10-20 new trending tools on the 1st of each month
3. **Tool Enrichment** - Auto-populates scout scores and alternatives for tools

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (Cron Schedules)                        │
├─────────────────────────────────────────────────────────┤
│  Weekly: Generate 2 comparison articles                 │
│  Monthly: Discover new tools + Generate new ideas       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Claude API (claude-3-5-sonnet-20241022)                │
├─────────────────────────────────────────────────────────┤
│  - Tool enrichment (scores + alternatives)              │
│  - Comparison article generation (2000-3000 words)      │
│  - New tool discovery research                          │
│  - Comparison idea generation                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Content Storage                                         │
├─────────────────────────────────────────────────────────┤
│  - src/data/tools.json (enriched tool data)             │
│  - src/data/content-queue.json (article topics)         │
│  - content/comparisons/*.md (published articles)        │
│  - src/data/content-index.json (auto-generated index)   │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  React Blog Pages                                        │
├─────────────────────────────────────────────────────────┤
│  /blog - Article listing with filters                   │
│  /blog/:slug - Article detail with markdown rendering   │
└─────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Get Your Claude API Key

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

**Settings > Secrets and variables > Actions > New repository secret**

- **ANTHROPIC_API_KEY**: Your Claude API key from step 1
- **NETLIFY_BUILD_HOOK**: (Optional) Your Netlify build hook URL
  - Create in Netlify: Settings > Build & deploy > Build hooks
  - Example: `https://api.netlify.com/build_hooks/xxxxx`

### 3. Enable GitHub Actions

The workflows are already configured in `.github/workflows/`. They will run automatically:

- **generate-weekly-content.yml**: Every Monday at 9am UTC
- **discover-new-tools.yml**: 1st of every month at 8am UTC

You can also trigger them manually:
1. Go to Actions tab in GitHub
2. Select the workflow
3. Click "Run workflow"

### 4. Local Development Setup

```bash
# Copy the example env file
cp .env.example .env

# Add your API key to .env
# ANTHROPIC_API_KEY=sk-ant-...

# Install dependencies (if not already done)
npm install
```

## Scripts Reference

### Tool Enrichment

Auto-populates tool metadata with Claude-generated scores and alternatives.

```bash
# Enrich all tools
node scripts/enrich-tool-data.js

# Enrich only new tools (no existing scores)
node scripts/enrich-tool-data.js --new-only
```

**What it does:**
- Generates `scout_score` (0-100): Overall quality rating
- Generates `value_score` (0-5): Price/value ratio
- Generates `ease_score` (0-5): Ease of use
- Generates `features_score` (0-5): Feature completeness
- Identifies 3-5 genuine alternative tools
- Creates backup before modifying tools.json

**Cost:** ~$0.02-0.03 per tool (~$4-6 for all 200 tools)

### Weekly Content Generation

Generates 2 comparison articles from the queue.

```bash
# Generate 2 articles from queue
node scripts/generate-weekly-content.js

# Generate specific number of articles
node scripts/generate-weekly-content.js --count 1
```

**What it does:**
- Reads next pending items from content-queue.json
- Fetches tool data from tools.json
- Generates 2000-3000 word comparison article
- Validates content (word count, required sections)
- Saves markdown file to content/comparisons/
- Updates content-index.json
- Updates queue status to "generated"

**Cost:** ~$0.05-0.10 per article

### Monthly Tool Discovery

Discovers new trending tools for indie hackers.

```bash
# Discover 10-20 new tools
node scripts/discover-new-tools.js

# Discover specific number
node scripts/discover-new-tools.js --count 15
```

**What it does:**
- Uses Claude to research trending tools
- Sources: Product Hunt, Hacker News, GitHub, Reddit
- Validates and prevents duplicates
- Adds to tools.json with new IDs
- Creates backup before adding

**Cost:** ~$0.50-1.00 per month

### Comparison Idea Generation

Generates new comparison article topics based on recently discovered tools.

```bash
# Generate 3-5 new comparison ideas
node scripts/generate-comparison-ideas.js

# Generate specific number
node scripts/generate-comparison-ideas.js --count 10
```

**What it does:**
- Analyzes recently added tools
- Compares new tools vs established competitors
- Generates SEO-optimized comparison topics
- Adds to content-queue.json

## Content Queue Management

The content queue is stored in `src/data/content-queue.json` with 40 initial comparison topics.

### Queue Structure

```json
{
  "title": "Railway vs Render vs Fly.io for Indie Hackers",
  "keywords": "railway vs render, fly.io comparison, indie hacker hosting",
  "category": "Hosting",
  "toolNames": ["Railway", "Render", "Fly.io"],
  "priority": 1,
  "status": "pending"
}
```

### Status Values
- `pending` - Not yet generated
- `generated` - Article created and published

### Adding Custom Topics

You can manually add topics to the queue:

```bash
# Edit the queue file
code src/data/content-queue.json

# Add new entry to the "queue" array
{
  "title": "Your Custom Comparison Title",
  "keywords": "target keywords for seo",
  "category": "Category",
  "toolNames": ["Tool1", "Tool2", "Tool3"],
  "priority": 1,
  "status": "pending"
}
```

## Article Format

All generated articles follow this structure:

1. **Introduction** (200 words)
2. **Quick Comparison Table** (features, pricing, best for)
3. **Detailed Tool Reviews** (500-700 words each)
   - Overview
   - Key Features
   - Pricing Breakdown
   - Pros (5-7 bullets)
   - Cons (3-5 bullets)
   - Best Use Cases
4. **Head-to-Head Comparison** (400 words)
5. **FAQ Section** (5-7 questions)
6. **Final Recommendation** (150 words)

**Total:** 2000-3000 words per article

**Tone:** Journalistic + Casual blend - Professional but approachable, like helping a friend make a smart decision.

## Cost Breakdown

### One-Time Costs
- **Tool Enrichment** (200 tools): ~$4-6

### Recurring Costs
- **Weekly Content** (2 articles): ~$0.10-0.20/week
- **Monthly Discovery** (10-20 tools): ~$0.50-1.00/month

### Annual Total
- **First Year**: ~$21-37 (including one-time enrichment)
- **Subsequent Years**: ~$15-30/year

**ROI vs. Freelancer**: 500x-800x ($40-80 per article vs. $0.08-0.15)

## Monitoring & Maintenance

### Check Generated Content

```bash
# View recently generated articles
ls -lt content/comparisons/ | head -10

# Check content index
cat src/data/content-index.json | jq '.articles | length'

# Check queue status
cat src/data/content-queue.json | jq '.queue[] | select(.status=="pending") | .title'
```

### View GitHub Action Logs

1. Go to Actions tab in your GitHub repo
2. Click on the workflow run
3. Expand the job steps to see detailed logs

### API Usage Tracking

Monitor your Claude API usage at https://console.anthropic.com/

- Check monthly spend
- View request counts
- Set spending limits

### Content Quality Checks

The scripts automatically validate:
- ✅ Word count (2000-3000 words)
- ✅ Required sections (Comparison Table, Pros, Cons, FAQ)
- ✅ Proper frontmatter format
- ✅ Valid markdown syntax

Failed validations are logged and the article is not saved.

## Troubleshooting

### "API key not found" Error

```bash
# Make sure .env file exists
ls -la .env

# Check if API key is set
cat .env | grep ANTHROPIC_API_KEY

# For GitHub Actions, verify secret is set
# Settings > Secrets and variables > Actions
```

### "No pending articles in queue" Error

```bash
# Check queue status
cat src/data/content-queue.json | jq '.queue[] | .status'

# Reset article status to pending
# Edit src/data/content-queue.json and change status back to "pending"
```

### Content Not Appearing on Site

```bash
# Regenerate content index
node scripts/generate-weekly-content.js

# Regenerate sitemap
node scripts/generate-sitemap.js

# Rebuild site
npm run build
```

### Rate Limit Errors

The scripts include built-in rate limiting (1 second delay between requests). If you still hit rate limits:

```bash
# Reduce batch size
node scripts/enrich-tool-data.js --batch-size 3

# Or run with more delay (edit scripts/lib/claude-client.js)
# Increase delay from 1000ms to 2000ms
```

## File Structure

```
react-techiespiral/
├── .github/
│   └── workflows/
│       ├── generate-weekly-content.yml   # Weekly automation
│       └── discover-new-tools.yml        # Monthly automation
├── content/
│   └── comparisons/                      # Generated markdown articles
│       ├── railway-vs-render-flyio.md
│       └── ...
├── scripts/
│   ├── lib/
│   │   ├── claude-client.js              # API wrapper
│   │   ├── tool-enricher.js              # Scoring logic
│   │   ├── tool-discoverer.js            # Discovery logic
│   │   └── content-formatter.js          # Markdown formatter
│   ├── templates/
│   │   ├── comparison-prompt.txt         # Article generation prompt
│   │   ├── enrichment-prompt.txt         # Scoring prompt
│   │   └── discovery-prompt.txt          # Discovery prompt
│   ├── enrich-tool-data.js               # Tool enrichment script
│   ├── generate-weekly-content.js        # Content generation script
│   ├── discover-new-tools.js             # Tool discovery script
│   ├── generate-comparison-ideas.js      # Idea generation script
│   └── generate-sitemap.js               # Sitemap generation
├── src/
│   ├── data/
│   │   ├── tools.json                    # Main tool database
│   │   ├── content-queue.json            # Article queue
│   │   └── content-index.json            # Auto-generated index
│   ├── pages/
│   │   ├── BlogPage.tsx                  # Blog listing
│   │   └── ArticlePage.tsx               # Article detail
│   └── hooks/
│       └── useArticles.ts                # Article data hooks
└── .env.example                          # Environment template
```

## Success Metrics

### Content Generation
- ✅ 2 articles per week automatically
- ✅ 40 initial articles in 20 weeks (~5 months)
- ✅ Self-sustaining pipeline (never runs out of content)

### Quality
- 🎯 95%+ articles pass validation without editing
- 🎯 2000-3000 word comprehensive comparisons
- 🎯 Consistent journalistic + casual tone

### SEO Performance
- 🎯 Articles indexed within 7 days
- 🎯 Target keywords ranking in top 50 within 60 days
- 🎯 Comparison pages driving 20%+ organic traffic by month 6

### Cost Efficiency
- 💰 ~$0.08-0.15 per 2500-word article
- 💰 500x-800x ROI vs. freelance writers
- 💰 <$3/month for unlimited content

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GitHub Action logs
3. Check Claude API console for usage/errors
4. Review the plan file: `.claude/plans/stateful-floating-plum.md`

## License

This automation system is part of the TechieSpiral project.
