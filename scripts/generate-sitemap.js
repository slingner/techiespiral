import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the JSON data
const toolsData = JSON.parse(readFileSync(join(__dirname, '../src/data/tools.json'), 'utf-8'));
const stacksData = JSON.parse(readFileSync(join(__dirname, '../src/data/stacks.json'), 'utf-8'));

// Read blog content index
let contentIndex = { articles: [] };
const contentIndexPath = join(__dirname, '../src/data/content-index.json');
if (readFileSync(contentIndexPath, 'utf-8')) {
  try {
    contentIndex = JSON.parse(readFileSync(contentIndexPath, 'utf-8'));
  } catch (e) {
    // content-index.json may not exist yet
  }
}

const DOMAIN = 'https://techiespiral.com';

function generateSitemap() {
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' }, // homepage
    { url: '/stacks', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/quiz', changefreq: 'monthly', priority: '0.8' },
    { url: '/compare', changefreq: 'monthly', priority: '0.7' },
  ];

  // Tool pages
  const toolPages = toolsData.map(tool => ({
    url: `/tool/${tool.Id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  // Stack pages
  const stackPages = stacksData.map(stack => ({
    url: `/stack/${stack.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  // Blog article pages
  const blogPages = contentIndex.articles.map(article => ({
    url: `/blog/${article.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  // Combine all pages
  const allPages = [...staticPages, ...toolPages, ...stackPages, ...blogPages];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public folder
  const outputPath = join(__dirname, '../public/sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📍 Location: ${outputPath}`);
  console.log(`📊 Total URLs: ${allPages.length}`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - Tool pages: ${toolPages.length}`);
  console.log(`   - Stack pages: ${stackPages.length}`);
  console.log(`   - Blog articles: ${blogPages.length}`);
}

generateSitemap();
