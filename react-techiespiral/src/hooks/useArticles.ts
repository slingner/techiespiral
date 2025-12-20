import { useState, useEffect } from 'react';
import contentIndex from '../data/content-index.json';

export interface Article {
  slug: string;
  title: string;
  description: string;
  publishedDate: string;
  category: string;
  toolNames: string[];
  keywords: string;
  wordCount: number;
  content?: string;
  frontmatter?: Record<string, any>;
}

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Articles come from the auto-generated content-index.json
    setArticles(contentIndex.articles as Article[]);
    setLoading(false);
  }, []);

  return { articles, loading };
};

export const useArticle = (slug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);

        // Fetch markdown file
        const response = await fetch(`/content/comparisons/${slug}.md`);

        if (!response.ok) {
          throw new Error('Article not found');
        }

        const markdown = await response.text();

        // Parse frontmatter and content
        const { content, frontmatter } = parseMarkdown(markdown);

        // Get metadata from index
        const metadata = contentIndex.articles.find((a: any) => a.slug === slug);

        setArticle({
          ...metadata,
          content,
          frontmatter,
        } as Article);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  return { article, loading, error };
};

function parseMarkdown(markdown: string) {
  // Simple frontmatter parser
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { content: markdown, frontmatter: {} };
  }

  const [, frontmatterStr, content] = match;
  const frontmatter: Record<string, any> = {};

  frontmatterStr.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(': ');
    if (key && valueParts.length) {
      const value = valueParts.join(': ').replace(/^"|"$/g, '');
      try {
        frontmatter[key] = JSON.parse(value);
      } catch {
        frontmatter[key] = value;
      }
    }
  });

  return { content, frontmatter };
}
