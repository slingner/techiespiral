import { FeaturedComparison } from '../types/Tool';

// Mock featured comparisons for SEO (will be in database later)
export const mockFeaturedComparisons: FeaturedComparison[] = [
  {
    id: 'github-vs-gitlab',
    tool1_id: 1, // These should match actual tool IDs
    tool2_id: 2,
    tool1_slug: 'github',
    tool2_slug: 'gitlab',
    title: 'GitHub vs GitLab: Which Git Platform is Better for Indie Hackers in 2025?',
    meta_description: 'Comprehensive comparison of GitHub vs GitLab for indie developers. Compare features, pricing, CI/CD, and find out which platform is best for your startup.',
    summary: 'GitHub and GitLab are both powerful Git platforms, but they serve different needs. GitHub excels in community and third-party integrations, while GitLab offers a complete DevOps platform. For indie hackers, GitHub is often the better choice for open-source projects and collaboration, while GitLab shines for teams wanting an all-in-one solution.',
    winner: 'tie',
    use_case_recommendations: 'Choose **GitHub** if you want: Maximum community visibility, best third-party integrations, simpler interface, free private repos. Choose **GitLab** if you want: Built-in CI/CD, self-hosting options, complete DevOps platform, advanced project management.',
    faqs: [
      {
        question: 'Is GitHub or GitLab better for indie hackers?',
        answer: 'GitHub is typically better for indie hackers due to its larger community, better discoverability for open-source projects, and simpler learning curve. However, GitLab offers more features in its free tier, including built-in CI/CD.'
      },
      {
        question: 'Which is cheaper: GitHub or GitLab?',
        answer: 'Both offer free tiers with unlimited private repositories. GitHub Pro costs $4/month while GitLab Premium costs $29/user/month. For solo developers, GitHub is more affordable.'
      },
      {
        question: 'Can I migrate from GitHub to GitLab?',
        answer: 'Yes, GitLab offers built-in GitHub import tools that can migrate repositories, issues, pull requests, and wikis. The process is straightforward and well-documented.'
      },
      {
        question: 'Which has better CI/CD: GitHub Actions or GitLab CI?',
        answer: 'GitLab CI/CD is more mature and feature-rich, but GitHub Actions has a massive marketplace ecosystem. For simple workflows, GitHub Actions is easier. For complex pipelines, GitLab CI offers more control.'
      }
    ],
    popular_searches: ['github vs gitlab', 'gitlab vs github 2025', 'github gitlab comparison'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'notion-vs-obsidian',
    tool1_id: 3,
    tool2_id: 4,
    tool1_slug: 'notion',
    tool2_slug: 'obsidian',
    title: 'Notion vs Obsidian: Best Note-Taking App for Developers in 2025',
    meta_description: 'Notion vs Obsidian comparison for developers. Compare features, pricing, markdown support, and offline capabilities to choose the right knowledge base tool.',
    summary: 'Notion and Obsidian represent two different philosophies: Notion is a collaborative all-in-one workspace, while Obsidian is a local-first markdown knowledge base. Notion excels at team collaboration and databases, while Obsidian is perfect for personal knowledge management and offers true markdown files.',
    winner: 'tie',
    use_case_recommendations: 'Choose **Notion** if you want: Team collaboration, databases and spreadsheets, all-in-one workspace, templates marketplace. Choose **Obsidian** if you want: Local markdown files, privacy and ownership, bidirectional linking, extensive plugin ecosystem.',
    faqs: [
      {
        question: 'Is Notion or Obsidian better for developers?',
        answer: 'Obsidian is generally preferred by developers who value local markdown files, git integration, and complete data ownership. Notion is better if you need to collaborate with non-technical team members or want built-in databases.'
      },
      {
        question: 'Can Obsidian do everything Notion does?',
        answer: 'No, Obsidian lacks built-in databases, real-time collaboration, and web clipper. However, Obsidian excels at knowledge management with features like graph view and bidirectional linking that Notion doesn\'t match.'
      },
      {
        question: 'Which is better for offline use: Notion or Obsidian?',
        answer: 'Obsidian is significantly better for offline use as it stores all files locally. Notion requires internet connection for most features, though it has limited offline support.'
      },
      {
        question: 'Can I use Notion and Obsidian together?',
        answer: 'Yes! Many developers use Notion for team wikis and project management, while using Obsidian for personal notes and knowledge base. You can export from Notion to markdown for Obsidian.'
      }
    ],
    popular_searches: ['notion vs obsidian', 'obsidian notion comparison', 'best note app for developers'],
  },
  {
    id: 'vercel-vs-netlify',
    tool1_id: 5,
    tool2_id: 6,
    tool1_slug: 'vercel',
    tool2_slug: 'netlify',
    title: 'Vercel vs Netlify: Best Hosting Platform for Indie Hackers in 2025',
    meta_description: 'Vercel vs Netlify hosting comparison. Compare deployment speed, pricing, features, and performance to choose the best platform for your SaaS or web app.',
    summary: 'Vercel and Netlify are both excellent hosting platforms for modern web apps. Vercel (created by Next.js creators) offers the best Next.js experience and Edge Functions, while Netlify provides broader framework support and generous free tier. Both offer instant deployments and great DX.',
    winner: 'tie',
    use_case_recommendations: 'Choose **Vercel** if you want: Next.js optimization, Edge Functions, best-in-class serverless, global CDN. Choose **Netlify** if you want: Framework flexibility, build plugins, form handling, generous free tier.',
    faqs: [
      {
        question: 'Is Vercel or Netlify cheaper for indie hackers?',
        answer: 'Netlify offers a more generous free tier (300 build minutes/month vs Vercel\'s 100). For paid plans, Netlify starts at $19/month while Vercel Pro is $20/month. For hobbyists, Netlify is often cheaper.'
      },
      {
        question: 'Which is faster: Vercel or Netlify?',
        answer: 'Both offer excellent performance. Vercel has a slight edge for Next.js apps due to optimization. For other frameworks, performance is comparable. Both use global CDNs and edge networks.'
      },
      {
        question: 'Can I use Vercel without Next.js?',
        answer: 'Yes! Vercel supports React, Vue, Svelte, Angular, and static sites. However, you get the best experience with Next.js since Vercel created and maintains it.'
      },
      {
        question: 'Does Netlify support serverless functions?',
        answer: 'Yes, Netlify Functions (powered by AWS Lambda) are included in all plans. They\'re easy to deploy and integrate well with your frontend.'
      }
    ],
    popular_searches: ['vercel vs netlify', 'netlify vercel comparison', 'best hosting for nextjs'],
  },
  {
    id: 'stripe-vs-paddle',
    tool1_id: 7,
    tool2_id: 8,
    tool1_slug: 'stripe',
    tool2_slug: 'paddle',
    title: 'Stripe vs Paddle: Best Payment Platform for SaaS Founders in 2025',
    meta_description: 'Stripe vs Paddle comparison for SaaS businesses. Compare fees, tax handling, international support, and ease of use to choose the right payment processor.',
    summary: 'Stripe and Paddle solve different problems: Stripe is a flexible payment processor requiring you to handle taxes and compliance, while Paddle is a Merchant of Record (MoR) handling all tax compliance for you. For indie hackers, Paddle simplifies international sales but costs more, while Stripe offers maximum flexibility.',
    winner: 'tie',
    use_case_recommendations: 'Choose **Stripe** if you want: Lower fees (2.9% + 30¢), maximum flexibility, extensive API, cryptocurrency support. Choose **Paddle** if you want: Automatic tax compliance, simpler setup, Merchant of Record benefits, focus on your product not billing.',
    faqs: [
      {
        question: 'Is Paddle more expensive than Stripe?',
        answer: 'Yes, Paddle charges 5% + 50¢ vs Stripe\'s 2.9% + 30¢. However, Paddle handles all tax compliance, VAT, and acts as Merchant of Record, which can save significant development time and accountant fees.'
      },
      {
        question: 'Which is easier for indie hackers: Stripe or Paddle?',
        answer: 'Paddle is easier for international sales as it handles all tax compliance automatically. Stripe requires you to handle taxes, invoicing, and compliance, but offers more control and lower fees.'
      },
      {
        question: 'Can I switch from Stripe to Paddle later?',
        answer: 'Yes, but migration requires planning. You\'ll need to migrate customers and handle the transition carefully. Many SaaS founders start with Paddle for simplicity, then consider Stripe when they have resources for a finance team.'
      },
      {
        question: 'Does Stripe handle international taxes?',
        answer: 'Stripe Tax (additional service) can calculate and collect taxes, but you\'re still responsible for remitting them. Paddle acts as Merchant of Record and handles everything, which is simpler for global sales.'
      }
    ],
    popular_searches: ['stripe vs paddle', 'paddle stripe comparison', 'best payment for saas'],
  },
  {
    id: 'supabase-vs-firebase',
    tool1_id: 9,
    tool2_id: 10,
    tool1_slug: 'supabase',
    tool2_slug: 'firebase',
    title: 'Supabase vs Firebase: Best Backend for Indie Developers in 2025',
    meta_description: 'Supabase vs Firebase comparison for indie hackers. Compare database, auth, storage, pricing, and real-time features to choose the best backend-as-a-service.',
    summary: 'Supabase and Firebase are both excellent BaaS platforms. Firebase (by Google) is mature with great mobile SDKs and Firestore, while Supabase is open-source with PostgreSQL and SQL access. For indie hackers who know SQL, Supabase offers more flexibility. Firebase is better for mobile-first apps.',
    winner: 'tie',
    use_case_recommendations: 'Choose **Firebase** if you want: Mobile-first development, NoSQL database, mature ecosystem, Google Cloud integration. Choose **Supabase** if you want: PostgreSQL with SQL, open-source, self-hosting option, generous free tier.',
    faqs: [
      {
        question: 'Is Supabase better than Firebase?',
        answer: 'For developers who prefer SQL and want open-source software, yes. Supabase uses PostgreSQL which is powerful and familiar. Firebase uses NoSQL (Firestore) which is simpler but less flexible. Both are excellent choices.'
      },
      {
        question: 'Which is cheaper: Supabase or Firebase?',
        answer: 'Supabase has a more generous free tier (500MB database, 1GB file storage) vs Firebase (1GB storage total). For paid plans, pricing depends on usage. Supabase is often cheaper for database-heavy apps.'
      },
      {
        question: 'Can I migrate from Firebase to Supabase?',
        answer: 'Yes, but it requires work since Firebase uses NoSQL and Supabase uses SQL. You\'ll need to redesign your data model. Several tools and guides exist to help with migration.'
      },
      {
        question: 'Does Supabase have real-time like Firebase?',
        answer: 'Yes! Supabase offers real-time subscriptions to database changes, similar to Firebase. It uses PostgreSQL\'s built-in pub/sub functionality for real-time updates.'
      }
    ],
    popular_searches: ['supabase vs firebase', 'firebase supabase comparison', 'best backend for indie hackers'],
  }
];

const API_BASE_URL = '/.netlify/functions';

export const comparisonsApi = {
  async fetchAllComparisons(): Promise<FeaturedComparison[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/comparisons`);

      if (!response.ok) {
        console.warn('Comparisons API not available, using mock data');
        return mockFeaturedComparisons;
      }

      const data = await response.json();
      return data.list || [];
    } catch (error) {
      console.warn('Error fetching comparisons, using mock data:', error);
      return mockFeaturedComparisons;
    }
  },

  async fetchComparisonBySlug(slug: string): Promise<FeaturedComparison | null> {
    try {
      const comparisons = await this.fetchAllComparisons();
      return comparisons.find(c => c.id === slug) || null;
    } catch (error) {
      console.error('Error fetching comparison by slug:', error);
      throw error;
    }
  },

  async fetchComparisonByTools(slug1: string, slug2: string): Promise<FeaturedComparison | null> {
    try {
      const comparisons = await this.fetchAllComparisons();
      return comparisons.find(c =>
        (c.tool1_slug === slug1 && c.tool2_slug === slug2) ||
        (c.tool1_slug === slug2 && c.tool2_slug === slug1)
      ) || null;
    } catch (error) {
      console.error('Error fetching comparison by tools:', error);
      throw error;
    }
  }
};
